import React from 'react';
import { Play, Share2, Star, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Highlights() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('highlights.title')}</h1>
        <div className="flex items-center space-x-4">
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2">
            <option>{t('videoList.sort.latest')}</option>
            <option>{t('videoList.sort.oldest')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative">
              <img
                src="https://blog-static.kkday.com/zh-hk/blog/wp-content/uploads/jpg-3-84-jpeg.webp"
                alt={`Highlight ${i}`}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors">
                    <Play className="w-8 h-8 text-orange-500" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-sm font-medium">{t('highlights.watchHighlight')}</span>
                  <button className="bg-white/20 rounded-full p-2 hover:bg-white/30">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-2 py-1 rounded-full">
                1:30
              </div>
              {i % 3 === 0 && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Trophy className="w-3 h-3 mr-1" />
                  {t('highlights.bestMoment')}
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors">
                {t('highlights.raceHighlight').replace('{number}', String(i))}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{t('highlights.rating').replace('{rating}', `${4 + (i % 2)}.${8 + (i % 2)}`)}</span>
                </div>
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                  {i % 2 === 0 ? t('highlights.aiEnhanced') : t('highlights.original')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}