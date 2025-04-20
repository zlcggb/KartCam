import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Settings, BarChart2, Search, ChevronLeft,
  Eye, UserCog, Power, PowerOff, User, LineChart,
  Play, Database, ArrowUp, ArrowDown, Menu, X
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useLanguage } from '../contexts/LanguageContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function Admin() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'users' | 'config' | 'analytics'>('users');
  const [showSidebar, setShowSidebar] = useState(false);

  // Mock data for charts
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Users',
        data: [800, 950, 1100, 1234, 1350, 1500],
        fill: true,
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderColor: 'rgb(249, 115, 22)',
        tension: 0.4,
      }
    ]
  };

  const storageData = {
    labels: ['Videos', 'Highlights', 'Grid Images', 'Other'],
    datasets: [
      {
        label: 'Storage Usage (GB)',
        data: [1200, 500, 300, 100],
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(249, 115, 22, 0.4)',
          'rgba(249, 115, 22, 0.2)',
        ],
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Mock data - in real app, this would come from your API
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'active' },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'user', status: 'disabled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/profile')}
                className="mr-3 text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">{t('admin.title')}</h1>
            </div>
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Sidebar */}
          <div className={`
            fixed md:relative inset-0 z-20 md:z-0 
            ${showSidebar ? 'block' : 'hidden md:block'}
            w-full md:w-64 md:flex-shrink-0
          `}>
            {/* Mobile overlay */}
            {showSidebar && (
              <div 
                className="absolute inset-0 bg-black/50 md:hidden"
                onClick={() => setShowSidebar(false)}
              />
            )}
            
            {/* Sidebar content */}
            <div className="relative h-full w-64 ml-auto md:ml-0 bg-white md:rounded-lg md:shadow">
              <div className="md:hidden flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">{t('admin.title')}</h2>
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            <div className="bg-white rounded-lg shadow">
              <button
                onClick={() => {
                  setActiveTab('users');
                  setShowSidebar(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 ${
                  activeTab === 'users' ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>{t('admin.userManagement')}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('config');
                  setShowSidebar(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 ${
                  activeTab === 'config' ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>{t('admin.systemConfig')}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setShowSidebar(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 ${
                  activeTab === 'analytics' ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart2 className="w-5 h-5" />
                <span>{t('admin.analytics')}</span>
              </button>
            </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow w-full">
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow">
                {/* Search Bar */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={t('admin.search')}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.name')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.email')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.role')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.status')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select 
                              value={user.role}
                              className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-5 h-5" />
                              </button>
                              <button className="text-orange-600 hover:text-orange-800">
                                <UserCog className="w-5 h-5" />
                              </button>
                              <button className={user.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}>
                                {user.status === 'active' ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">{t('admin.systemConfigTitle')}</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-4">{t('admin.aiSettings')}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            {t('admin.modelSelection')}
                          </label>
                          <select className="w-full border rounded-lg px-3 py-2 bg-white">
                            <option>{t('admin.standardModel')}</option>
                            <option>{t('admin.highPerformance')}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            {t('admin.processingQuality')}
                          </label>
                          <select className="w-full border rounded-lg px-3 py-2 bg-white">
                            <option>{t('admin.balanced')}</option>
                            <option>{t('admin.highQuality')}</option>
                            <option>{t('admin.fastProcessing')}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-4">{t('admin.storageSettings')}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            {t('admin.retentionPeriod')}
                          </label>
                          <select className="w-full border rounded-lg px-3 py-2 bg-white">
                            <option>{t('admin.days30')}</option>
                            <option>{t('admin.days60')}</option>
                            <option>{t('admin.days90')}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            {t('admin.maxVideoSize')}
                          </label>
                          <input 
                            type="number" 
                            className="w-full border rounded-lg px-3 py-2 bg-white"
                            placeholder={t('admin.sizeInMb')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                      {t('admin.saveChanges')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">{t('admin.analyticsTitle')}</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{t('admin.totalUsers')}</h3>
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-orange-500" />
                          <ArrowUp className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold">1,234</p>
                      <p className="text-sm text-green-600">{t('admin.monthIncrease').replace('{number}', '12')}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{t('admin.activeVideos')}</h3>
                        <div className="flex items-center space-x-2">
                          <Play className="w-5 h-5 text-orange-500" />
                          <ArrowUp className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold">5,678</p>
                      <p className="text-sm text-green-600">{t('admin.monthIncrease').replace('{number}', '8')}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{t('admin.storageUsed')}</h3>
                        <div className="flex items-center space-x-2">
                          <Database className="w-5 h-5 text-orange-500" />
                          <ArrowDown className="w-4 h-4 text-orange-500" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold">2.1 TB</p>
                      <p className="text-sm text-orange-600">{t('admin.storageQuota').replace('{percent}', '75')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">{t('admin.userGrowth')}</h3>
                        <LineChart className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="h-48 w-full">
                        <Line data={userGrowthData} options={chartOptions} />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">{t('admin.storageUsage')}</h3>
                        <BarChart2 className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="h-48 w-full">
                        <Bar data={storageData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                  <div className="h-16 md:hidden"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}