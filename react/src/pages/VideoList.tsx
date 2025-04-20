import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function VideoList() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('videoList.title')}</h1>
        <div className="flex items-center space-x-4">
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2">
            <option>{t('videoList.sort.latest')}</option>
            <option>{t('videoList.sort.oldest')}</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            onClick={() => navigate(`/video/${i}`)}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          >
            <div className="relative">
              <img
                src="https://blog-static.kkday.com/zh-hk/blog/wp-content/uploads/jpg-3-84-jpeg.webp"
                alt={`Race ${i}`}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
                  <Play className="w-6 h-6" />
                  <span className="text-sm font-medium">Watch Now</span>
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-2 py-1 rounded-full">
                2:45
              </div>
              {i % 2 === 0 && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {t('videoList.bestLap')}
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors">
                {t('videoList.raceSession').replace('{number}', String(i))}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{t('videoList.date').replace('{date}', String(i + 7))}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                    {i % 2 === 0 ? t('videoList.aiReady') : t('videoList.processing')}
                  </span>
                  <span className="text-sm font-medium">{t('videoList.watchNow')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}