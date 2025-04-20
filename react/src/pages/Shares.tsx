import React from 'react';
import { Copy, Trash2, Clock, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Shares() {
  const { t } = useLanguage();

  const isMobile = window.innerWidth < 768;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0 justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('shares.title')}</h1>
        <div className="w-full md:w-auto">
          <select className="w-full md:w-auto bg-white border border-gray-200 rounded-lg px-4 py-2">
            <option>{t('shares.allTypes')}</option>
            <option>{t('shares.videos')}</option>
            <option>{t('shares.highlights')}</option>
            <option>{t('shares.grids')}</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => {
          const timeAgo = t('shares.sharedAgo').replace('{time}', '2 days');
          const views = t('shares.views').replace('{count}', '24');
          
          return (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="md:hidden w-full aspect-video bg-gray-100">
                <img
                  src="https://blog-static.kkday.com/zh-hk/blog/wp-content/uploads/jpg-3-84-jpeg.webp"
                  alt={`Share ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center p-4">
                <div className="hidden md:block w-48 aspect-video bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img
                    src="https://blog-static.kkday.com/zh-hk/blog/wp-content/uploads/jpg-3-84-jpeg.webp"
                    alt={`Share ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:ml-4 flex-grow">
                  <h3 className="font-semibold mb-2">{t('shares.amazingRace')}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {timeAgo}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {views}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex justify-end items-center gap-2">
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                    <Copy className="w-4 h-4" />
                    <span>{t('shares.copyLink')}</span>
                  </button>
                  <button className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}