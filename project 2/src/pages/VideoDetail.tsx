import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Play, Scissors, Sparkles, Grid3X3, Share2, Download,
  ChevronLeft, ChevronRight, Star, Sticker, Type,
  CheckCircle2, RefreshCcw, Save
} from 'lucide-react';

export function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('ai');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(120); // 2 minutes example
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Video Player Section */}
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="lg:w-2/3 h-[40vh] lg:h-screen bg-black relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <video 
            className="w-full h-full object-contain"
            controls
            poster="https://blog-static.kkday.com/zh-hk/blog/wp-content/uploads/jpg-3-84-jpeg.webp"
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          >
            <source src="#" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <button className="bg-white/20 rounded-full p-2 hover:bg-white/30">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="bg-white/20 rounded-full p-2 hover:bg-white/30">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Editing Panel */}
        <div className="lg:w-1/3 bg-gray-800 h-[60vh] lg:h-screen overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-700 px-4">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center px-6 py-4 ${
                activeTab === 'ai'
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t('videoDetail.aiMagic')}
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center px-6 py-4 ${
                activeTab === 'edit'
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Scissors className="w-5 h-5 mr-2" />
              {t('videoDetail.edit')}
            </button>
            <button
              onClick={() => setActiveTab('effects')}
              className={`flex items-center px-6 py-4 ${
                activeTab === 'effects'
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Star className="w-5 h-5 mr-2" />
              {t('videoDetail.effects')}
            </button>
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center px-6 py-4 ${
                activeTab === 'grid'
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-5 h-5 mr-2" />
              {t('videoDetail.grid')}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{t('videoDetail.aiMagic')}</h3>
                  <button 
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                    onClick={() => setIsProcessing(true)}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
                        {t('videoDetail.processing')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        {t('videoDetail.generateHighlights')}
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative group cursor-pointer bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src="https://blog-static.kkday.com/zh-hk/blog/wp-content/uploads/jpg-3-84-jpeg.webp"
                        alt={`Highlight ${i}`}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        0:{i}5
                      </div>
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'edit' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('videoDetail.timelineEditor')}</h3>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center">
                    <Save className="w-5 h-5 mr-2" />
                    {t('videoDetail.saveChanges')}
                  </button>
                </div>
                
                {/* Timeline */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="h-24 bg-gray-600 rounded relative">
                    {/* Playhead */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-orange-500"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                    
                    {/* Trim Handles */}
                    <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-orange-500 cursor-ew-resize" />
                    <div className="absolute right-1/4 top-0 bottom-0 w-1 bg-orange-500 cursor-ew-resize" />
                    
                    {/* Selected Region */}
                    <div className="absolute left-1/4 right-1/4 top-0 bottom-0 bg-orange-500/30" />
                  </div>
                  
                  {/* Timeline Controls */}
                  <div className="flex justify-between mt-4 text-sm">
                    <span>00:00</span>
                    <span>02:00</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'effects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('videoDetail.effectsAndStickers')}</h3>
                  <div className="flex space-x-2">
                    <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                      <Type className="w-5 h-5" />
                    </button>
                    <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                      <Sticker className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 cursor-pointer">
                      <Star className="w-6 h-6" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'grid' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('videoDetail.gridGallery')}</h3>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center">
                    <Grid3X3 className="w-5 h-5 mr-2" />
                    {t('videoDetail.generateGrid')}
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 bg-gray-700 p-2 rounded-lg">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-600 rounded overflow-hidden">
                      <img
                        src="https://blog-static.kkday.com/zh-hk/blog/wp-content/uploads/jpg-3-84-jpeg.webp"
                        alt={`Frame ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-gray-700 rounded-full px-4 py-2 text-sm">
                    {t('videoDetail.clickToChange')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}