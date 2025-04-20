import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { VideoHighlightExtractor } from '../components/VideoHighlightExtractor';

export function VideoExtractor() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('videoExtractor.title') || '视频高光提取工具'}</h1>
          <p className="text-gray-600">
            {t('videoExtractor.description') || '上传视频，我们将自动提取精彩瞬间和关键画面，生成精彩视频片段和九宫格图片'}
          </p>
        </div>
        
        <VideoHighlightExtractor />
        
        <div className="mt-12 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">{t('videoExtractor.howItWorks') || '工作原理'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-3 text-xl font-bold">1</div>
              <h3 className="font-medium mb-1">{t('videoExtractor.step1Title') || '上传视频'}</h3>
              <p className="text-sm text-gray-600">
                {t('videoExtractor.step1Desc') || '选择并上传您想要提取高光的视频文件'}
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-3 text-xl font-bold">2</div>
              <h3 className="font-medium mb-1">{t('videoExtractor.step2Title') || '智能分析'}</h3>
              <p className="text-sm text-gray-600">
                {t('videoExtractor.step2Desc') || '我们的系统自动检测视频中的高动作和关键时刻'}
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-3 text-xl font-bold">3</div>
              <h3 className="font-medium mb-1">{t('videoExtractor.step3Title') || '生成结果'}</h3>
              <p className="text-sm text-gray-600">
                {t('videoExtractor.step3Desc') || '获取精彩视频片段和九宫格图片，可以立即观看和下载'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 