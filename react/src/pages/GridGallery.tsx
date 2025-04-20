import React from 'react';
import { Share2, Download, Star, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function GridGallery() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('gridGallery.title')}</h1>
        <div className="flex items-center space-x-4">
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2">
            <option>{t('videoList.sort.latest')}</option>
            <option>{t('videoList.sort.oldest')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative group">
              <div className="grid grid-cols-3 gap-1 p-1 bg-gradient-to-br from-orange-50 to-gray-50">
                {[...Array(9)].map((_, j) => (
                  <img
                    key={j}
                    src="https://blog-static.kkday.com/zh-hk/blog/wp-content/uploads/jpg-3-84-jpeg.webp"
                    alt={`Grid ${i}-${j}`}
                    className="aspect-square object-cover rounded-lg transform transition-transform group-hover:scale-105"
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <div className="flex space-x-3">
                  <button className="bg-white/90 rounded-full p-3 hover:bg-white transition-colors">
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="bg-white/90 rounded-full p-3 hover:bg-white transition-colors">
                    <Download className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
              {i % 3 === 0 && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {t('gridGallery.featured')}
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold group-hover:text-orange-500 transition-colors">
                  {t('gridGallery.raceHighlight').replace('{number}', String(i))}
                </h3>
                <div className="flex items-center text-gray-400">
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-sm">{t('gridGallery.likes').replace('{count}', String((i + 1) * 12))}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{t('gridGallery.date').replace('{date}', String(i + 7))}</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                  {i % 2 === 0 ? t('gridGallery.aiGenerated') : t('gridGallery.custom')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}