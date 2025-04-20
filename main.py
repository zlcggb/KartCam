from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import uuid
import subprocess
import cv2
import numpy as np
import shutil
from typing import List
from utils import get_motion_values, save_highlight_clips, extract_highlight_frames

# 创建 FastAPI 实例
app = FastAPI()

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源，实际生产环境中应限制为特定域名
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有HTTP头
)

# 创建临时目录用于存储上传的视频文件和生成的高光片段
TEMP_DIR = "./temp/"
VIDEOS_DIR = os.path.join(TEMP_DIR, "videos/")
HIGHLIGHT_VIDEO_DIR = os.path.join(TEMP_DIR, "highlight_videos/")
HIGHLIGHT_IMAGE_DIR = os.path.join(TEMP_DIR, "highlight_images/")

# 确保目录存在
os.makedirs(VIDEOS_DIR, exist_ok=True)
os.makedirs(HIGHLIGHT_VIDEO_DIR, exist_ok=True)
os.makedirs(HIGHLIGHT_IMAGE_DIR, exist_ok=True)

# 用于提供静态文件
app.mount("/media", StaticFiles(directory=TEMP_DIR), name="media")

# 用于存储每个上传的视频的信息
class VideoInfo(BaseModel):
    video_id: str
    file_path: str
    frame_count: int
    frame_width: int
    frame_height: int
    fps: float
    duration: str
    
# 高光结果模型
class HighlightResult(BaseModel):
    video_id: str
    highlight_videos: List[str]
    highlight_images: List[str]

# 存储已上传的视频信息
videos_store = {}

# 上传视频接口
@app.post("/api/upload-video")
async def upload_video(file: UploadFile = File(...)):
    # 生成唯一ID
    video_id = str(uuid.uuid4())
    
    # 创建唯一的文件名
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{video_id}{file_extension}"
    file_path = os.path.join(VIDEOS_DIR, file_name)
    
    # 保存上传的文件
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 获取视频信息
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        return JSONResponse(
            status_code=400,
            content={"error": "无法打开视频文件"}
        )
    
    # 计算视频时长
    duration_seconds = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) / cap.get(cv2.CAP_PROP_FPS)
    minutes = int(duration_seconds // 60)
    seconds = int(duration_seconds % 60)
    
    # 构造视频信息
    video_info = {
        "video_id": video_id,
        "file_path": file_path,
        "frame_count": int(cap.get(cv2.CAP_PROP_FRAME_COUNT)),
        "frame_width": int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
        "frame_height": int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
        "fps": cap.get(cv2.CAP_PROP_FPS),
        "duration": f"{minutes} minutes {seconds} seconds"
    }
    
    # 释放视频资源
    cap.release()
    
    # 保存视频信息到存储
    videos_store[video_id] = video_info
    
    return video_info

# 获取视频信息
@app.get("/api/video-info/{video_id}")
def get_video_info(video_id: str):
    if video_id not in videos_store:
        return JSONResponse(
            status_code=404,
            content={"error": "视频不存在"}
        )
    
    return videos_store[video_id]

# 提取高光片段
@app.post("/api/extract-highlights/{video_id}")
def extract_highlights(video_id: str, top_n: int = Form(4), highlight_duration: float = Form(2.0)):
    if video_id not in videos_store:
        return JSONResponse(
            status_code=404,
            content={"error": "视频不存在"}
        )
    
    video_info = videos_store[video_id]
    video_path = video_info["file_path"]
    
    # 为该视频创建专用目录
    video_highlight_dir = os.path.join(HIGHLIGHT_VIDEO_DIR, video_id)
    video_image_dir = os.path.join(HIGHLIGHT_IMAGE_DIR, video_id)
    os.makedirs(video_highlight_dir, exist_ok=True)
    os.makedirs(video_image_dir, exist_ok=True)
    
    # 计算运动值
    motion_values = get_motion_values(video_path)
    
    # 保存高光片段
    save_highlight_clips(
        video_path, 
        motion_values, 
        fps=video_info["fps"],
        highlight_duration=highlight_duration,
        top_n=top_n, 
        HIGHLIGHT_VIDEO_DIR=video_highlight_dir
    )
    
    # 提取高光帧
    frames = extract_highlight_frames(
        video_path, 
        motion_values, 
        top_n=9,  # 固定为9张图片
        HIGHLIGHT_IMAGE_DIR=video_image_dir
    )
    
    # 构建结果对象
    # 将本地路径转换为URL路径
    highlight_videos = [f"/media/highlight_videos/{video_id}/highlight_{i+1}.mp4" for i in range(top_n)]
    highlight_images = [f"/media/highlight_images/{video_id}/{os.path.basename(frame)}" for frame in frames]
    
    result = {
        "video_id": video_id,
        "highlight_videos": highlight_videos,
        "highlight_images": highlight_images
    }
    
    return result

# 获取高光片段视频
@app.get("/api/highlight/{video_id}/{clip_id}")
def get_highlight_clip(video_id: str, clip_id: int):
    # 构造高光片段文件路径
    clip_file = f"highlight_{clip_id}.mp4"
    clip_path = os.path.join(HIGHLIGHT_VIDEO_DIR, video_id, clip_file)

    # 检查文件是否存在
    if not os.path.exists(clip_path):
        return JSONResponse(
            status_code=404,
            content={"error": "高光片段不存在"}
        )

    # 返回高光片段文件
    return FileResponse(clip_path)

# 获取高光帧图像
@app.get("/api/highlight-frame/{video_id}/{frame_id}")
def get_highlight_frame(video_id: str, frame_id: int):
    # 构造高光帧文件路径
    frame_file = f"highlight_frame_{frame_id}.jpg"
    frame_path = os.path.join(HIGHLIGHT_IMAGE_DIR, video_id, frame_file)

    # 检查文件是否存在
    if not os.path.exists(frame_path):
        return JSONResponse(
            status_code=404,
            content={"error": "高光帧不存在"}
        )

    # 返回高光帧文件
    return FileResponse(frame_path)

# 获取所有高光帧图像
@app.get("/api/highlight-frames/{video_id}")
def get_all_highlight_frames(video_id: str):
    if video_id not in videos_store:
        return JSONResponse(
            status_code=404,
            content={"error": "视频不存在"}
        )
    
    # 高光帧目录
    frames_dir = os.path.join(HIGHLIGHT_IMAGE_DIR, video_id)
    
    # 检查目录是否存在
    if not os.path.exists(frames_dir):
        return {"frames": []}
    
    # 获取所有图片文件
    frames = []
    for file in os.listdir(frames_dir):
        if file.endswith(".jpg"):
            frames.append(f"/media/highlight_images/{video_id}/{file}")
    
    return {"frames": frames}

# 清理视频和相关资源
@app.delete("/api/video/{video_id}")
def delete_video(video_id: str):
    if video_id not in videos_store:
        return JSONResponse(
            status_code=404,
            content={"error": "视频不存在"}
        )
    
    video_info = videos_store[video_id]
    
    # 删除视频文件
    if os.path.exists(video_info["file_path"]):
        os.remove(video_info["file_path"])
    
    # 删除高光片段目录
    video_highlight_dir = os.path.join(HIGHLIGHT_VIDEO_DIR, video_id)
    if os.path.exists(video_highlight_dir):
        shutil.rmtree(video_highlight_dir)
    
    # 删除高光帧目录
    video_image_dir = os.path.join(HIGHLIGHT_IMAGE_DIR, video_id)
    if os.path.exists(video_image_dir):
        shutil.rmtree(video_image_dir)
    
    # 从存储中删除视频信息
    del videos_store[video_id]
    
    return {"message": "视频及相关资源已删除"}

# 提供HTML前端页面
@app.get("/")
async def get_upload_page():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>视频高光提取</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            .container {
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 5px;
            }
            .form-group {
                margin-bottom: 15px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            input, button {
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            button {
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
            }
            button:hover {
                background-color: #45a049;
            }
            .result {
                margin-top: 20px;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                display: none;
            }
            .gallery {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-gap: 10px;
                margin-top: 15px;
            }
            .gallery img {
                width: 100%;
                border-radius: 5px;
            }
            .video-container {
                margin: 10px 0;
            }
            video {
                width: 100%;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <h1>视频高光提取</h1>
        <div class="container">
            <div class="form-group">
                <label for="video">选择视频文件:</label>
                <input type="file" id="video" accept="video/*">
            </div>
            <div class="form-group">
                <label for="topN">高光片段数量:</label>
                <input type="number" id="topN" value="4" min="1" max="10">
            </div>
            <div class="form-group">
                <label for="duration">高光片段时长(秒):</label>
                <input type="number" id="duration" value="2.0" min="0.5" max="10" step="0.5">
            </div>
            <button id="upload">上传并提取高光</button>
        </div>
        
        <div id="result" class="result">
            <h2>处理结果</h2>
            <div id="loading">处理中...</div>
            <div id="videos"></div>
            <h3>高光帧图像:</h3>
            <div id="images" class="gallery"></div>
        </div>
        
        <script>
            document.getElementById('upload').addEventListener('click', async () => {
                const fileInput = document.getElementById('video');
                const topN = document.getElementById('topN').value;
                const duration = document.getElementById('duration').value;
                const resultDiv = document.getElementById('result');
                const loadingDiv = document.getElementById('loading');
                const videosDiv = document.getElementById('videos');
                const imagesDiv = document.getElementById('images');
                
                if (!fileInput.files.length) {
                    alert('请选择视频文件');
                    return;
                }
                
                // 显示结果区域和加载中提示
                resultDiv.style.display = 'block';
                videosDiv.innerHTML = '';
                imagesDiv.innerHTML = '';
                
                // 创建FormData对象
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                
                try {
                    // 上传视频
                    const uploadResponse = await fetch('/api/upload-video', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (!uploadResponse.ok) {
                        throw new Error('视频上传失败');
                    }
                    
                    const uploadData = await uploadResponse.json();
                    const videoId = uploadData.video_id;
                    
                    // 提示处理数量
                    loadingDiv.textContent = `正在提取 ${topN} 个高光视频片段和 9 张高光图片，请稍候...`;
                    
                    // 提取高光片段
                    const extractFormData = new FormData();
                    extractFormData.append('top_n', topN);
                    extractFormData.append('highlight_duration', duration);
                    
                    const extractResponse = await fetch(`/api/extract-highlights/${videoId}`, {
                        method: 'POST',
                        body: extractFormData
                    });
                    
                    if (!extractResponse.ok) {
                        throw new Error('高光提取失败');
                    }
                    
                    const extractData = await extractResponse.json();
                    
                    // 隐藏加载提示
                    loadingDiv.style.display = 'none';
                    
                    // 显示高光视频
                    extractData.highlight_videos.forEach((videoUrl, index) => {
                        const videoContainer = document.createElement('div');
                        videoContainer.className = 'video-container';
                        
                        const videoTitle = document.createElement('h3');
                        videoTitle.textContent = `高光片段 ${index + 1}`;
                        
                        const video = document.createElement('video');
                        video.controls = true;
                        video.src = videoUrl;
                        
                        videoContainer.appendChild(videoTitle);
                        videoContainer.appendChild(video);
                        videosDiv.appendChild(videoContainer);
                    });
                    
                    // 显示高光帧图像
                    if (extractData.highlight_images.length < 9) {
                        console.warn(`警告：仅获取到 ${extractData.highlight_images.length} 张图片，少于预期的9张`);
                    }
                    
                    // 确保显示9张图片
                    const imageCount = Math.min(9, extractData.highlight_images.length);
                    for (let i = 0; i < imageCount; i++) {
                        const img = document.createElement('img');
                        img.src = extractData.highlight_images[i];
                        imagesDiv.appendChild(img);
                    }
                    
                } catch (error) {
                    loadingDiv.textContent = `错误: ${error.message}`;
                    console.error(error);
                }
            });
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)

