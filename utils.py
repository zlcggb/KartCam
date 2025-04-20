import os
import subprocess
import cv2
import numpy as np


# 计算运动差异并提取高光片段
def get_motion_values(video_path):
    
    # 打开视频文件
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []

    # 获取视频帧率
    fps = cap.get(cv2.CAP_PROP_FPS)
    ret, prev_frame = cap.read()
    if not ret:
        return []

    # 转换第一帧为灰度图
    prev_frame = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)

    motion_values = []  # 存储每帧的运动值
    frame_num = 1

    while True:
        # 读取当前帧
        ret, curr_frame = cap.read()
        if not ret:
            break

        # 转换当前帧为灰度图
        curr_frame_gray = cv2.cvtColor(curr_frame, cv2.COLOR_BGR2GRAY)
        # 计算当前帧与前一帧的差异
        frame_diff = cv2.absdiff(curr_frame_gray, prev_frame)
        # 计算运动值（像素差异的总和）
        motion = np.sum(frame_diff)
        motion_values.append(motion)

        # 更新前一帧
        prev_frame = curr_frame_gray
        frame_num += 1

    # 释放视频资源
    cap.release()
    return motion_values


# 保存高光片段 精彩片段
def save_highlight_clips(video_path, motion_values, fps=30, highlight_duration=1, top_n=4, HIGHLIGHT_VIDEO_DIR='./demo/highlight_videos/'):
    """
    Extracts and saves highlight clips from a video based on motion values.
    Args:
        video_path (str): Path to the input video file.
        motion_values (list or np.ndarray): A list or array of motion values for each frame in the video.
        fps (int, optional): Frames per second of the video. Defaults to 30.
        highlight_duration (int, optional): Duration (in seconds) of each highlight clip. Defaults to 1.
        top_n (int, optional): Number of top motion highlights to extract. Defaults to 4.
        HIGHLIGHT_VIDEO_DIR (str, optional): Directory where the highlight clips will be saved. Defaults to './demo/highlight_videos/'.
    Returns:
        list: An empty list if the video cannot be opened or if no highlights are extracted.
    """
    
    # 打开视频文件
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []

    # 获取运动值最高的帧索引
    peak_indices = np.argsort(motion_values)[::-1]
    peak_indices = peak_indices[:top_n]

    for i, peak_index in enumerate(peak_indices):
        # 计算高光片段的起始和结束帧
        highlight_time_seconds = peak_index / fps
        start_frame = max(int((peak_index - fps * highlight_duration)), 0)
        end_frame = min(int((peak_index + fps * highlight_duration)), int(cap.get(cv2.CAP_PROP_FRAME_COUNT)))

        # 转换为时间格式
        start_sec = start_frame / fps
        duration_sec = (end_frame - start_frame) / fps

        # 使用 ffmpeg 提取高光片段
        command = [
            './ffmpeg', '-y',
            '-ss', str(start_sec),
            '-i', video_path,
            '-t', str(duration_sec),
            '-c', 'copy',
            os.path.join(HIGHLIGHT_VIDEO_DIR, f'highlight_{i+1}.mp4')
        ]
        subprocess.run(command, check=True)

    # 释放视频资源
    cap.release()
    
    

# 九宫格图片
def extract_highlight_frames(video_path, motion_values, top_n=9, additional_frame_time_ms=2000, HIGHLIGHT_IMAGE_DIR='./demo/highlight_images/'):
    
    # 检查并创建高光图片目录
    if not os.path.exists(HIGHLIGHT_IMAGE_DIR):
        os.makedirs(HIGHLIGHT_IMAGE_DIR)
    
    # 获取运动值最高的帧索引
    peak_indices = np.argsort(motion_values)[::-1][:top_n]

    # 打开视频文件
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "无法打开视频文件"}
    
    # 获取视频总帧数
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    frames = []
    for i, frame_index in enumerate(peak_indices):
        # 设置视频到指定帧
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
        ret, frame = cap.read()
        if not ret:
            continue

        # 保存帧为图片
        frame_path = os.path.join(HIGHLIGHT_IMAGE_DIR, f"highlight_frame_{i+1}.jpg")
        cv2.imwrite(frame_path, frame)
        frames.append(frame_path)

    # 如果未获取足够的高光帧，添加均匀分布的帧
    if len(frames) < top_n:
        needed_frames = top_n - len(frames)
        # 计算均匀间隔
        interval = total_frames // (needed_frames + 1)
        
        for i in range(needed_frames):
            # 选择均匀分布的帧
            frame_pos = (i + 1) * interval
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_pos)
            ret, frame = cap.read()
            if ret:
                frame_path = os.path.join(HIGHLIGHT_IMAGE_DIR, f"highlight_frame_{len(frames)+1}.jpg")
                cv2.imwrite(frame_path, frame)
                frames.append(frame_path)

    # 释放视频资源
    cap.release()
    return frames