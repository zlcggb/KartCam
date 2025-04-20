import React from 'react';
import { Menu, User, Video, Grid3X3, Share2, LogOut, Play, Home, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2" onClick={() => navigate('/')}>
              <Video className="w-8 h-8 text-orange-500" />
              <span className="text-xl font-bold">{t('nav.appName')}</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <button onClick={() => navigate('/')} className="text-gray-600 hover:text-orange-500">
                {t('nav.home')}
              </button>
              <button onClick={() => navigate('/videos')} className="text-gray-600 hover:text-orange-500">
                {t('nav.myVideos')}
              </button>
              <button onClick={() => navigate('/highlights')} className="text-gray-600 hover:text-orange-500">
                {t('nav.highlights')}
              </button>
              <button onClick={() => navigate('/grid')} className="text-gray-600 hover:text-orange-500">
                {t('nav.gridGallery')}
              </button>
              <button onClick={() => navigate('/shares')} className="text-gray-600 hover:text-orange-500">
                {t('nav.shares')}
              </button>
              <button 
                onClick={() => navigate('/extractor')} 
                className="bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 rounded-full px-3 py-1 flex items-center transition-colors"
              >
                <Scissors className="w-4 h-4 mr-1" />
                {t('nav.videoExtractor')}
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-6">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm"
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-500"
            >
              <User className="w-5 h-5" />
              <span>{t('nav.profile')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-2">
            <Video className="w-6 h-6 text-orange-500" />
            <span className="text-lg font-bold">{t('nav.appName')}</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open menu"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 text-gray-600"
              stroke="currentColor" 
              strokeWidth="2"
              fill="none"
            >
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <Video className="w-6 h-6 text-orange-500" />
                  <span className="text-lg font-bold">{t('nav.appName')}</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-6 h-6 text-gray-600"
                    stroke="currentColor" 
                    strokeWidth="2"
                    fill="none"
                  >
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <nav className="space-y-4">
                <button onClick={() => { navigate('/'); setIsMenuOpen(false); }}
                  className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 rounded">
                  <Home className="w-5 h-5" />
                  <span>{t('nav.home')}</span>
                </button>
                <button onClick={() => { navigate('/videos'); setIsMenuOpen(false); }}
                  className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 rounded">
                  <Video className="w-5 h-5" />
                  <span>{t('nav.myVideos')}</span>
                </button>
                <button onClick={() => { navigate('/highlights'); setIsMenuOpen(false); }}
                  className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 rounded">
                  <Play className="w-5 h-5" />
                  <span>{t('nav.highlights')}</span>
                </button>
                <button onClick={() => { navigate('/grid'); setIsMenuOpen(false); }}
                  className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 rounded">
                  <Grid3X3 className="w-5 h-5" />
                  <span>{t('nav.gridGallery')}</span>
                </button>
                <button onClick={() => { navigate('/shares'); setIsMenuOpen(false); }}
                  className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 rounded">
                  <Share2 className="w-5 h-5" />
                  <span>{t('nav.shares')}</span>
                </button>
                <button 
                  onClick={() => { navigate('/extractor'); setIsMenuOpen(false); }}
                  className="flex items-center space-x-3 w-full p-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded mb-2 mt-1"
                >
                  <Scissors className="w-5 h-5" />
                  <span>{t('nav.videoExtractor')}</span>
                </button>
                <div className="border-t my-4"></div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 mb-2"
                >
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
                <button onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                  className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 rounded">
                  <User className="w-5 h-5" />
                  <span>{t('nav.profile')}</span>
                </button>
                <button className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 rounded text-red-500">
                  <LogOut className="w-5 h-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}