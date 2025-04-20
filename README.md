# 视频高光提取 API 文档
git config --global user.name "zlcggb"
git config --global user.email kundricklesley@gmail.com
## 项目概述

该项目是一个基于FastAPI开发的视频高光提取服务，能够自动分析视频并提取精彩片段和关键帧。系统会返回指定数量的高光视频片段和九宫格图片，可用于社交媒体分享、体育赛事回放等场景。

## 部署信息

API已成功部署到服务器，可通过以下地址访问：

- API地址：`https://fastapi.unilumin-gtm.xyz`
- API前端界面：`https://kartcam.netlify.app/`

## API调用方式

### 1. 上传视频

```
POST /api/upload-video
```

**请求参数**：
- `file`: 视频文件（multipart/form-data）

**响应示例**：
```json
{
  "video_id": "5e8f5b70-6c27-4250-8696-3274ee9a7361",
  "file_path": "./temp/videos/5e8f5b70-6c27-4250-8696-3274ee9a7361.mp4",
  "frame_count": 549,
  "frame_width": 1280,
  "frame_height": 720,
  "fps": 30.0,
  "duration": "0 minutes 18 seconds"
}
```

### 2. 提取高光片段

```
POST /api/extract-highlights/{video_id}
```

**请求参数**：
- `video_id`: 视频ID（路径参数）
- `top_n`: 高光片段数量（表单参数，默认值：4）
- `highlight_duration`: 每个高光片段的时长（秒）（表单参数，默认值：2.0）

**响应示例**：
```json
{
  "video_id": "5e8f5b70-6c27-4250-8696-3274ee9a7361",
  "highlight_videos": [
    "/media/highlight_videos/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_1.mp4",
    "/media/highlight_videos/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_2.mp4",
    "/media/highlight_videos/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_3.mp4",
    "/media/highlight_videos/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_4.mp4"
  ],
  "highlight_images": [
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_1.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_2.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_3.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_4.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_5.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_6.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_7.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_8.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_9.jpg"
  ]
}
```

### 3. 获取所有高光帧图像

```
GET /api/highlight-frames/{video_id}
```

**请求参数**：
- `video_id`: 视频ID（路径参数）

**响应示例**：
```json
{
  "frames": [
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_1.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_2.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_3.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_4.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_5.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_6.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_7.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_8.jpg",
    "/media/highlight_images/5e8f5b70-6c27-4250-8696-3274ee9a7361/highlight_frame_9.jpg"
  ]
}
```

### 4. 获取特定高光视频片段

```
GET /api/highlight/{video_id}/{clip_id}
```

**请求参数**：
- `video_id`: 视频ID（路径参数）
- `clip_id`: 片段ID（路径参数）

### 5. 获取特定高光帧图像

```
GET /api/highlight-frame/{video_id}/{frame_id}
```

**请求参数**：
- `video_id`: 视频ID（路径参数）
- `frame_id`: 帧ID（路径参数）

### 6. 删除视频及相关资源

```
DELETE /api/video/{video_id}
```

**请求参数**：
- `video_id`: 视频ID（路径参数）

## 前端集成

在前端React项目中，使用以下API_URL进行连接：

```typescript
const API_URL = 'https://fastapi.unilumin-gtm.xyz'; // FastAPI 服务器地址
```

## 修改记录

1. **后端 API 优化**:
   - 将默认高光片段数量从3个增加到4个
   - 强制提取9张高光帧，确保生成完整的九宫格图片
   - 优化高光检测算法，提高关键时刻的识别准确率
   - 添加CORS设置，允许跨域请求
   - 增加静态文件路由，支持媒体文件的直接访问

2. **服务器部署**:
   - 配置Nginx服务器，设置反向代理
   - 配置SSL证书，启用HTTPS安全访问
   - 配置域名 `fastapi.unilumin-gtm.xyz` 解析至服务器
   - 设置启动脚本，确保服务持久运行

3. **性能优化**:
   - 增加异步处理能力，提高并发请求处理性能
   - 优化视频片段截取速度，减少等待时间
   - 添加错误处理和日志记录，便于问题排查

## 依赖项

- Python 3.10+
- FastAPI
- OpenCV
- FFmpeg
- numpy

## 注意事项

1. 服务器需要安装FFmpeg才能进行视频处理
2. 上传的视频格式支持MP4、MOV、AVI等常见格式
3. 视频文件大小建议不超过100MB，以确保处理速度
4. API响应时间取决于视频长度和复杂度，请耐心等待结果 