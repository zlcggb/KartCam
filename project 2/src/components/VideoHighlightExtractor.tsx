import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Video, Film, Image as ImageIcon, Loader2, Check, AlertCircle, Download, ChevronDown, ChevronUp, X, RotateCw, GridIcon, Crop } from 'lucide-react';
import Cropper, { Point, Area } from 'react-easy-crop'; // 引入 react-easy-crop
import { useLanguage } from '../contexts/LanguageContext';

// const API_URL = 'https://fastapi.unilumin-gtm.xyz'; // FastAPI 服务器地址
const API_URL = 'http://localhost:8000'; // FastAPI 服务器地址

// Helper function to safely parse JSON from localStorage
const safeJsonParse = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
};

interface HighlightResult {
  video_id: string;
  highlight_videos: string[];
  highlight_images: string[];
}

// 更新裁剪历史记录结构以包含 zoom
interface SavedCrop {
  cropArea: Area; // 存储相对百分比区域 { x, y, width, height }
  zoom: number;
}

// 添加一个计算裁剪区域样式的辅助函数
const calculateCropPreviewStyle = (cropArea: Area, rotation: number) => {
  if (!cropArea) {
    return {
      transform: rotation ? `rotate(${rotation}deg)` : 'none'
    };
  }

  // 更精确的方法：直接裁剪区域相对变换
  
  // 1. 缩放比例: 确保裁剪区域正好填满容器
  // 使用裁剪区域的最小边作为缩放参考，确保填满容器
  const scale = 1 / Math.min(cropArea.width, cropArea.height);
  
  // 2. 计算裁剪区域在原图中的中心点
  const cropCenterX = cropArea.x + cropArea.width / 2;
  const cropCenterY = cropArea.y + cropArea.height / 2;
  
  // 3. 平移: 将裁剪区域的中心点移动到容器中心（0.5, 0.5是相对坐标下的容器中心）
  const translateX = (0.5 - cropCenterX) * 100;
  const translateY = (0.5 - cropCenterY) * 100;
  
  // 4. 组合变换: 顺序非常重要 - 先缩放，再平移，最后旋转
  const transform = `scale(${scale}) translate(${translateX.toFixed(2)}%, ${translateY.toFixed(2)}%) ${rotation ? `rotate(${rotation}deg)` : ''}`;
  
  return {
    transformOrigin: 'center',
    transform,
    // 对于裁剪后的图片，使用 'fill' 确保整个容器被填充
    objectFit: 'fill' as const, 
    objectPosition: 'center'
  };
};

// 添加函数用于创建九宫格画布
const createGridCanvas = async (
  images: HTMLImageElement[], 
  gridSize: number = 3,
  cellSize: number = 600 // 增加单元格尺寸以提高输出质量
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      // 创建画布
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('无法创建Canvas上下文');
      }
      
      // 设置画布大小
      const gap = Math.floor(cellSize * 0.02); // 间隙设为单元格大小的2%
      const padding = Math.floor(cellSize * 0.04); // 边距设为单元格大小的4%
      canvas.width = gridSize * cellSize + (gridSize - 1) * gap + padding * 2;
      canvas.height = gridSize * cellSize + (gridSize - 1) * gap + padding * 2;
      
      // 绘制边框
      ctx.strokeStyle = '#e5e7eb'; // 浅灰色边框
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      
      // 创建渐变背景
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#fff7ed'); // 浅橙色渐变起点 (orange-50)
      gradient.addColorStop(1, '#f9fafb'); // 浅灰色渐变终点 (gray-50)
      ctx.fillStyle = gradient;
      ctx.fillRect(padding/2, padding/2, canvas.width - padding, canvas.height - padding);
      
      // 绘制每个图片
      let loadedCount = 0;
      
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const index = i * gridSize + j;
          if (index < images.length) {
            const img = images[index];
            
            // 计算图片在画布上的位置
            const x = padding + j * (cellSize + gap);
            const y = padding + i * (cellSize + gap);
            
            // 绘制图片
            ctx.save();
            
            // 创建圆角矩形路径
            const radius = 8; // 圆角半径
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + cellSize - radius, y);
            ctx.quadraticCurveTo(x + cellSize, y, x + cellSize, y + radius);
            ctx.lineTo(x + cellSize, y + cellSize - radius);
            ctx.quadraticCurveTo(x + cellSize, y + cellSize, x + cellSize - radius, y + cellSize);
            ctx.lineTo(x + radius, y + cellSize);
            ctx.quadraticCurveTo(x, y + cellSize, x, y + cellSize - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            
            // 裁剪为圆角矩形区域
            ctx.clip();
            
            // 直接绘制图片，保持原始比例
            ctx.drawImage(img, x, y, cellSize, cellSize);
            
            // 添加轻微的阴影效果
            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;
            
            ctx.restore();
            
            loadedCount++;
            if (loadedCount === images.length) {
              // 所有图片加载完成，转换为Blob
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Canvas 转换为 Blob 失败'));
                }
              }, 'image/jpeg', 0.95); // 提高图片质量
            }
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

// 加载图片函数
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // 允许跨域加载图片
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`图片加载失败: ${src}`));
    img.src = src;
  });
};

export function VideoHighlightExtractor() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<HighlightResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoCount, setVideoCount] = useState(4);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [highlightDuration, setHighlightDuration] = useState(2.0);
  
  // --- 图片编辑状态 ---
  const [previewImage, setPreviewImage] = useState<string | null>(null); 
  const [imageRotations, setImageRotations] = useState<{[key: string]: number}>(() => 
    safeJsonParse<{[key: string]: number}>('imageRotations', {})
  );

  // --- react-easy-crop 状态 ---
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 单独管理预览中的旋转状态
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [initialCropAreaPixels, setInitialCropAreaPixels] = useState<Area | null>(null);
  const [naturalSize, setNaturalSize] = useState<{width: number, height: number} | null>(null);
  const [cropSize, setCropSize] = useState<{width: number, height: number} | null>(null);

  // 裁剪历史记录 (现在包含 zoom 和相对百分比区域)
  const [cropHistory, setCropHistory] = useState<{[key: string]: SavedCrop}>(() => 
    safeJsonParse<{[key: string]: SavedCrop}>('cropHistory', {})
  );
  
  // --- 持久化状态到 localStorage ---
  useEffect(() => {
    localStorage.setItem('imageRotations', JSON.stringify(imageRotations));
  }, [imageRotations]);

  useEffect(() => {
    localStorage.setItem('cropHistory', JSON.stringify(cropHistory));
  }, [cropHistory]);
  // --------------------------------------
  
  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setResult(null);
    // 注意：不在这里清除 imageRotations 和 cropHistory，因为它们是持久化的
    // 如果需要为新视频重置，可以在上传成功后或其他逻辑点清除
  };
  
  // 选择文件按钮点击
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };
  
  // 下载单个文件
  const downloadFile = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `${API_URL}${url}`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // --- 图片编辑相关函数 ---
  // 图片预览处理 - 使用 react-easy-crop
  const openPreview = (imageUrl: string) => {
    const savedState = cropHistory[imageUrl];
    const initialRotation = imageRotations[imageUrl] || 0;
    setRotation(initialRotation); // 设置 Cropper 初始旋转
    if (savedState && naturalSize) { // 需要图片尺寸才能计算初始像素区域
      // 加载保存的 zoom
      setZoom(savedState.zoom);
      // 计算初始裁剪区域（像素）以传递给 Cropper
      // 注意：react-easy-crop 的 initialCroppedAreaPixels 需要像素值
      const initialPixels: Area = {
          x: savedState.cropArea.x * naturalSize.width,
          y: savedState.cropArea.y * naturalSize.height,
          width: savedState.cropArea.width * naturalSize.width,
          height: savedState.cropArea.height * naturalSize.height,
      };
      setInitialCropAreaPixels(initialPixels);
      // 设置初始 crop 点（视图中心）- Cropper 可能根据 initialCroppedAreaPixels 自动处理
      setCrop({ x: 0, y: 0 }); 
    } else {
      // 重置为默认值
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setInitialCropAreaPixels(null); // 没有初始裁剪区域
    }
    setPreviewImage(imageUrl);
    setCroppedAreaPixels(null); // 清除上次的最终裁剪结果
  };
  
  // 关闭预览
  const closePreview = () => {
    setPreviewImage(null);
    setNaturalSize(null); // 清除图片尺寸信息
    setInitialCropAreaPixels(null);
  };

  // 旋转图片 - 现在更新 Cropper 和持久化状态
  const handleRotate = () => {
    if (!previewImage) return;
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    // 同时更新持久化状态
    setImageRotations(prev => ({
      ...prev,
      [previewImage]: newRotation
    }));
  };
  
  // 获取图片旋转角度 (用于缩略图)
  const getThumbnailRotation = (imageUrl: string) => {
    return imageRotations[imageUrl] || 0;
  };
  
  // 修改createGridImage函数处理裁剪图像
  const createGridImage = async () => {
    if (!result || !result.highlight_images || result.highlight_images.length === 0) {
      alert(t('videoHighlight.noImagesError') || '没有可用的高光帧图片');
      return;
    }
    
    // 设置状态，显示加载中
    setIsProcessing(true);
    
    try {
      // 获取所有高光帧图片URL
      const imageUrls = result.highlight_images.slice(0, 9); // 最多取9张
      
      // 如果不足9张，给出提示但继续处理
      if (imageUrls.length < 9) {
        console.warn(`只有 ${imageUrls.length} 张图片可用，九宫格可能不会填满`);
      }
      
      // 加载所有图片
      const imagePromises = imageUrls.map(imageUrl => 
        loadImage(`${API_URL}${imageUrl}`)
      );
      
      const loadedImages = await Promise.all(imagePromises);
      
      // 应用裁剪和旋转到图片
      const processedImages = loadedImages.map(async (img, index) => {
        const imageUrl = imageUrls[index];
        const rotation = imageRotations[imageUrl] || 0;
        const savedCrop = cropHistory[imageUrl]?.cropArea;
        
        // 创建临时画布处理图片
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        if (!tempCtx) {
          return img;
        }

        // 设置画布大小为原始图片大小
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;

        // 如果有裁剪区域，应用裁剪
        if (savedCrop) {
          const cropX = savedCrop.x * img.width;
          const cropY = savedCrop.y * img.height;
          const cropWidth = savedCrop.width * img.width;
          const cropHeight = savedCrop.height * img.height;

          // 创建新的画布来存储裁剪后的图像
          const croppedCanvas = document.createElement('canvas');
          const croppedCtx = croppedCanvas.getContext('2d');
          
          if (!croppedCtx) {
            return img;
          }

          // 设置裁剪后画布的大小
          croppedCanvas.width = cropWidth;
          croppedCanvas.height = cropHeight;

          // 绘制裁剪区域
          croppedCtx.drawImage(
            img,
            cropX, cropY, cropWidth, cropHeight,  // 源图像区域
            0, 0, cropWidth, cropHeight           // 目标区域
          );

          // 如果需要旋转
          if (rotation !== 0) {
            // 创建旋转后的画布
            const rotatedCanvas = document.createElement('canvas');
            const rotatedCtx = rotatedCanvas.getContext('2d');
            
            if (!rotatedCtx) {
              return img;
            }

            // 根据旋转角度调整画布大小
            const angle = (rotation * Math.PI) / 180;
            const sin = Math.abs(Math.sin(angle));
            const cos = Math.abs(Math.cos(angle));
            rotatedCanvas.width = cropHeight * sin + cropWidth * cos;
            rotatedCanvas.height = cropHeight * cos + cropWidth * sin;

            // 移动到画布中心并旋转
            rotatedCtx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
            rotatedCtx.rotate(angle);
            rotatedCtx.drawImage(
              croppedCanvas,
              -cropWidth / 2,
              -cropHeight / 2
            );

            // 创建最终图像
            const finalImg = new Image();
            finalImg.src = rotatedCanvas.toDataURL('image/jpeg', 0.95);
            
            return new Promise<HTMLImageElement>(resolve => {
              finalImg.onload = () => resolve(finalImg);
            });
          }

          // 如果不需要旋转，直接使用裁剪后的图像
          const finalImg = new Image();
          finalImg.src = croppedCanvas.toDataURL('image/jpeg', 0.95);
          
          return new Promise<HTMLImageElement>(resolve => {
            finalImg.onload = () => resolve(finalImg);
          });
        }

        // 如果只需要旋转
        if (rotation !== 0) {
          tempCtx.translate(img.width / 2, img.height / 2);
          tempCtx.rotate((rotation * Math.PI) / 180);
          tempCtx.drawImage(img, -img.width / 2, -img.height / 2);

          const finalImg = new Image();
          finalImg.src = tempCanvas.toDataURL('image/jpeg', 0.95);
          
          return new Promise<HTMLImageElement>(resolve => {
            finalImg.onload = () => resolve(finalImg);
          });
        }
        
        // 如果没有裁剪或旋转，直接返回原图
        return img;
      });
      
      // 等待所有图片处理完成
      const finalImages = await Promise.all(processedImages);
      
      // 创建九宫格画布
      const gridBlob = await createGridCanvas(finalImages, 3, 300);
      
      // 创建下载链接
      const url = URL.createObjectURL(gridBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `grid_${new Date().getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 释放Blob URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('创建九宫格图片失败:', error);
      alert(t('videoHighlight.gridCreationError') || '创建九宫格图片失败，请重试！');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- react-easy-crop 回调函数 ---
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    // croppedArea 是百分比, croppedAreaPixels 是像素值
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onMediaLoaded = useCallback((mediaSize: {width: number, height: number}) => {
    setNaturalSize(mediaSize);
    
    // 计算裁剪框的初始大小和位置
    const minSide = Math.min(mediaSize.width, mediaSize.height); 
    const initialArea = {
      x: (mediaSize.width - minSide) / 2,
      y: (mediaSize.height - minSide) / 2,
      width: minSide,
      height: minSide
    };

    setCropSize({
      width: minSide,
      height: minSide
    });
    setInitialCropAreaPixels(initialArea);
    
    // 媒体加载后，如果有历史记录，设置初始裁剪区域
    if (previewImage) {
      const savedState = cropHistory[previewImage];
      if (savedState) {
        // 将保存的相对坐标转换为像素坐标
        const pixelArea: Area = {
          x: savedState.cropArea.x * mediaSize.width,
          y: savedState.cropArea.y * mediaSize.height,
          width: savedState.cropArea.width * mediaSize.width,
          height: savedState.cropArea.height * mediaSize.height
        };

        // 设置裁剪区域和缩放
        setInitialCropAreaPixels(pixelArea);
        setZoom(savedState.zoom);

        // 计算并设置裁剪区域中心点
        const centerX = (savedState.cropArea.x + savedState.cropArea.width / 2) * 100;
        const centerY = (savedState.cropArea.y + savedState.cropArea.height / 2) * 100;
        setCrop({ x: centerX, y: centerY });
      } else {
        // 如果没有历史记录，使用默认的居中裁剪区域
        setInitialCropAreaPixels(initialArea);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      }
    }
  }, [previewImage, cropHistory]);
  
  // 保存裁剪结果
  const saveCrop = () => {
    if (previewImage && croppedAreaPixels && naturalSize) {
      // 确保裁剪区域不超出图片边界
      const safeArea = {
        x: Math.max(0, Math.min(croppedAreaPixels.x, naturalSize.width - croppedAreaPixels.width)),
        y: Math.max(0, Math.min(croppedAreaPixels.y, naturalSize.height - croppedAreaPixels.height)),
        width: Math.min(croppedAreaPixels.width, naturalSize.width),
        height: Math.min(croppedAreaPixels.height, naturalSize.height)
      };

      // 将安全的裁剪区域转换为相对百分比
      const relativeCropArea: Area = {
        x: safeArea.x / naturalSize.width,
        y: safeArea.y / naturalSize.height,
        width: safeArea.width / naturalSize.width,
        height: safeArea.height / naturalSize.height
      };

      // 保存相对区域和当前 zoom 到历史记录
      const newSavedCrop: SavedCrop = {
        cropArea: relativeCropArea,
        zoom: zoom
      };

      setCropHistory(prev => ({
        ...prev,
        [previewImage]: newSavedCrop
      }));
      
      // 静默关闭预览窗口，不显示提示
      closePreview(); 
    } else {
      console.error("无法保存裁剪：缺少必要信息", { previewImage, croppedAreaPixels, naturalSize });
      // 也静默处理错误情况
    }
  };
  
  // 处理视频上传和高光提取
  const handleUpload = async () => {
    if (!file) {
      setError(t('videoHighlight.noFileError'));
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);
      
      // 创建表单数据
      const formData = new FormData();
      formData.append('file', file);
      formData.append('preserve_orientation', 'true'); // 添加保持原始方向参数
      
      // 上传视频
      const uploadResponse = await fetch(`${API_URL}/api/upload-video`, {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error(t('videoHighlight.uploadError'));
      }
      
      const uploadData = await uploadResponse.json();
      const videoId = uploadData.video_id;
      
      // 开始处理视频
      setIsUploading(false);
      setIsProcessing(true);
      
      // 提示处理数量
      const processingMessage = t('videoHighlight.processingMessage').replace('{count}', videoCount.toString());
      
      // 创建用于提取高光的表单数据
      const extractFormData = new FormData();
      extractFormData.append('top_n', videoCount.toString());
      extractFormData.append('highlight_duration', highlightDuration.toString());
      extractFormData.append('preserve_orientation', 'true'); // 添加保持原始方向参数
      
      // 提取高光片段
      const extractResponse = await fetch(`${API_URL}/api/extract-highlights/${videoId}`, {
        method: 'POST',
        body: extractFormData,
      });
      
      if (!extractResponse.ok) {
        throw new Error(t('videoHighlight.extractError'));
      }
      
      const result = await extractResponse.json();
      setResult(result);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Film className="w-5 h-5 mr-2" />
          {t('videoHighlight.title')}
        </h2>
        <p className="text-white/80 text-sm mt-1">
          {t('videoHighlight.description')}
        </p>
      </div>
      
      {/* 内容 */}
      <div className="p-6">
        {/* 文件选择区域 */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            hover:bg-gray-50 transition-colors
            ${file ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}
            ${isUploading || isProcessing ? 'pointer-events-none opacity-75' : ''}
          `}
          onClick={handleSelectClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="video/*"
            onChange={handleFileChange}
          />
          
          {file ? (
            <div className="flex flex-col items-center">
              <Check className="w-12 h-12 text-green-500 mb-2" />
              <span className="text-gray-700 font-medium">{file.name}</span>
              <span className="text-sm text-gray-500 mt-1">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-gray-700 font-medium">
                {t('videoHighlight.uploadPrompt')}
              </span>
              <span className="text-sm text-gray-500 mt-1">
                {t('videoHighlight.supportedFormats')}
              </span>
            </div>
          )}
        </div>
        
        {/* 视频片段数量选择 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('videoHighlight.clipCount')}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="8"
              value={videoCount}
              onChange={(e) => setVideoCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={isUploading || isProcessing}
            />
            <span className="text-sm font-medium w-5 text-center">{videoCount}</span>
          </div>
        </div>
        
        {/* 高级选项 */}
        <div className="mt-3">
          <button 
            type="button" 
            className="text-gray-600 text-sm flex items-center hover:text-orange-500"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
            {t('videoHighlight.advancedOptions')}
          </button>
          
          {showAdvanced && (
            <div className="mt-3 pl-2 border-l-2 border-gray-100">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('videoHighlight.clipDuration')}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={highlightDuration}
                    onChange={(e) => setHighlightDuration(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={isUploading || isProcessing}
                  />
                  <span className="text-sm font-medium w-8 text-center">{highlightDuration.toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 错误信息 */}
        {error && (
          <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {/* 上传按钮 */}
        <button
          onClick={handleUpload}
          disabled={!file || isUploading || isProcessing}
          className={`mt-6 w-full py-3 rounded-lg font-medium flex items-center justify-center
            ${!file || isUploading || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t('videoHighlight.uploading')}
            </>
          ) : isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t('videoHighlight.processing')}
            </>
          ) : (
            <>
              <Film className="w-5 h-5 mr-2" />
              {t('videoHighlight.extract')}
            </>
          )}
        </button>
      </div>
      
      {/* 结果展示 */}
      {result && (
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <Video className="w-5 h-5 mr-2 text-orange-500" />
            {t('videoHighlight.results')}
          </h3>
          
          {/* 视频列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {result.highlight_videos.map((videoUrl, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                <video 
                  src={`${API_URL}${videoUrl}`} 
                  controls 
                  className="w-full aspect-video object-cover"
                ></video>
                <div className="p-3 flex justify-between items-center">
                  <h4 className="font-medium text-gray-800">
                    {t('videoHighlight.clipTitle')} {index + 1}
                  </h4>
                  <button
                    onClick={() => downloadFile(videoUrl, `highlight_${index + 1}.mp4`)}
                    className="text-orange-500 hover:text-orange-600 p-1"
                    title={t('videoHighlight.download')}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* 高光帧图片标题和操作 */}
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center text-gray-800">
              <ImageIcon className="w-5 h-5 mr-2 text-orange-500" />
              {t('videoHighlight.frames')}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={createGridImage}
                className="text-sm text-white px-3 py-1 rounded flex items-center bg-orange-500 hover:bg-orange-600"
              >
                <GridIcon className="w-4 h-4 mr-1" />
                {t('videoHighlight.createGrid') || '生成九宫格'}
              </button>
              <button
                onClick={() => {
                  // 下载所有图片的操作
                  result.highlight_images.forEach((imageUrl, index) => {
                    setTimeout(() => {
                      downloadFile(imageUrl, `highlight_frame_${index + 1}.jpg`);
                    }, index * 300); // 延迟下载以避免浏览器阻止
                  });
                }}
                className="text-sm text-orange-500 hover:text-orange-600 flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                {t('videoHighlight.downloadAll')}
              </button>
            </div>
          </div>
          
          {/* 高光帧图片网格 */}
          <div className="grid grid-cols-3 gap-3">
            {result.highlight_images.map((imageUrl, index) => {
              const rotation = getThumbnailRotation(imageUrl);
              const savedCropData = cropHistory[imageUrl]?.cropArea;
              const hasCrop = !!savedCropData;
              
              return (
                <div 
                  key={index} 
                  className="relative group aspect-square"
                >
                  <div 
                    className="w-full h-full overflow-hidden rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => openPreview(imageUrl)}
                  >
                    <img
                      src={`${API_URL}${imageUrl}`}
                      alt={`高光帧 ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-90 transition-all duration-200"
                      style={calculateCropPreviewStyle(savedCropData, rotation)}
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(imageUrl, `highlight_frame_${index + 1}.jpg`);
                      }}
                      className="bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title={t('videoHighlight.download')}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* 显示已裁剪标记 */}
                  {hasCrop && (
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white p-1 rounded-full" title={t('videoHighlight.croppedTooltip') || '已裁剪'}>
                      <Crop className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* 图片预览模态框 - 使用 react-easy-crop */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4">
          {/* Cropper 容器 */}
          <div className="relative w-full h-[calc(100%-100px)] mb-6">
            <Cropper
              image={`${API_URL}${previewImage}`}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              restrictPosition={true}
              minZoom={1}
              maxZoom={3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onMediaLoaded={onMediaLoaded}
              initialCroppedAreaPixels={initialCropAreaPixels || undefined}
              cropSize={cropSize || undefined}
              objectFit="contain"
              showGrid={true}
            />
          </div>

          {/* 控制按钮区域 */}
          <div className="flex items-center justify-center gap-4">
             {/* 旋转按钮 */}
             <button 
                onClick={handleRotate} 
                className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-colors flex items-center gap-1"
                title={t('videoHighlight.rotate')}
              >
                <RotateCw className="w-5 h-5" />
                {/* <span>旋转</span> */} 
             </button>

             {/* 缩放滑块 (可选) */}
             <input
                type="range"
                value={zoom}
               min={1} // 最小缩放限制为1，防止出现空白
               max={3} // 最大缩放限制为3倍
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
             />

             {/* 保存和取消按钮 */}
             <button 
                onClick={saveCrop}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                disabled={!croppedAreaPixels} // 只有完成裁剪才能保存
              >
                {t('videoHighlight.applyCrop') || '应用裁剪'}
             </button>
             <button 
                onClick={closePreview} // 取消直接关闭模态框
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                {t('videoHighlight.cancelCrop') || '取消'}
             </button>
             {/* 关闭预览的大按钮可以移除或保留 */}
             {/* <button 
                onClick={closePreview}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                title={t('videoHighlight.close')}
              >
                <X className="w-6 h-6" />
              </button> */} 
          </div>
        </div>
      )}
    </div>
  );
} 