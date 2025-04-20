import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Bell, HelpCircle, LogOut, Settings, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isAdmin] = useState(true); // In real app, this would come from auth context

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">John Doe</h1>
              <p className="text-gray-600">john.doe@example.com</p>
            </div>
          </div>
          <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
            {t('profile.editProfile')}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y">
            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 text-left">
              <User className="w-5 h-5 text-gray-500" />
              <div className="flex-grow">
                <h3 className="font-medium">{t('profile.accountSettings')}</h3>
                <p className="text-sm text-gray-500">{t('profile.accountSettingsDesc')}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 text-left">
              <Shield className="w-5 h-5 text-gray-500" />
              <div className="flex-grow">
                <h3 className="font-medium">{t('profile.security')}</h3>
                <p className="text-sm text-gray-500">{t('profile.securityDesc')}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 text-left">
              <Bell className="w-5 h-5 text-gray-500" />
              <div className="flex-grow">
                <h3 className="font-medium">{t('profile.notifications')}</h3>
                <p className="text-sm text-gray-500">{t('profile.notificationsDesc')}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 text-left">
              <HelpCircle className="w-5 h-5 text-gray-500" />
              <div className="flex-grow">
                <h3 className="font-medium">{t('profile.help')}</h3>
                <p className="text-sm text-gray-500">{t('profile.helpDesc')}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            {isAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 text-left text-orange-500"
              >
                <Settings className="w-5 h-5" />
                <div className="flex-grow">
                  <h3 className="font-medium">{t('profile.adminPanel')}</h3>
                  <p className="text-sm">{t('profile.adminPanelDesc')}</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 text-left text-red-500">
              <LogOut className="w-5 h-5" />
              <div className="flex-grow">
                <h3 className="font-medium">{t('profile.logout')}</h3>
                <p className="text-sm">{t('profile.logoutDesc')}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}