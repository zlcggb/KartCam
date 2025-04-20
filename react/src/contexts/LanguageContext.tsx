import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.appName': 'KartCam',
    'nav.home': 'Home',
    'nav.myVideos': 'My Videos',
    'nav.highlights': 'Highlights',
    'nav.gridGallery': 'Grid Gallery',
    'nav.shares': 'Shares',
    'nav.videoExtractor': 'Video Extractor',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',

    // Home
    'home.title': 'Track Overview',
    'home.description': 'Experience every thrilling moment of your race with our interactive track map. Click on the hotspots to relive your best racing moments.',
    'home.hotspotStart': 'Starting Line Sprint',
    'home.hotspotHairpin': 'Hairpin Overtake',
    'home.hotspotS': 'S-Curve Drift',
    'home.hotspotFinish': 'Finish Line Rush',
    'home.trackLength': 'Track Length: 1.2km',
    'home.bestLapTime': 'Best Lap Time: 1:23.456',

    // Profile
    'profile.editProfile': 'Edit Profile',
    'profile.accountSettings': 'Account Settings',
    'profile.accountSettingsDesc': 'Manage your account details',
    'profile.security': 'Security',
    'profile.securityDesc': 'Password and authentication',
    'profile.notifications': 'Notifications',
    'profile.notificationsDesc': 'Manage notification preferences',
    'profile.help': 'Help & Support',
    'profile.helpDesc': 'Get help or contact support',
    'profile.adminPanel': 'Admin Panel',
    'profile.adminPanelDesc': 'Manage system settings',
    'profile.logout': 'Logout',
    'profile.logoutDesc': 'Sign out of your account',

    // Admin Panel
    'admin.title': 'Admin Panel',
    'admin.userManagement': 'User Management',
    'admin.systemConfig': 'System Configuration',
    'admin.analytics': 'Analytics',
    'admin.search': 'Search users...',
    'admin.userId': 'User ID',
    'admin.name': 'Name',
    'admin.email': 'Email',
    'admin.role': 'Role',
    'admin.status': 'Status',
    'admin.actions': 'Actions',
    'admin.viewVideos': 'View Videos',
    'admin.changeRole': 'Change Role',
    'admin.enable': 'Enable',
    'admin.disable': 'Disable',

    // Video List
    'videoList.title': 'My Racing Videos',
    'videoList.sort.latest': 'Latest First',
    'videoList.sort.oldest': 'Oldest First',
    'videoList.watchNow': 'Watch Now',
    'videoList.bestLap': 'Best Lap',
    'videoList.raceSession': 'Exciting Race Session #{number}',
    'videoList.date': 'April {date}, 2025',
    'videoList.aiReady': 'AI Ready',
    'videoList.processing': 'Processing',

    // Video Detail
    'videoDetail.aiMagic': 'AI Magic',
    'videoDetail.edit': 'Edit',
    'videoDetail.effects': 'Effects',
    'videoDetail.grid': 'Grid',
    'videoDetail.generateHighlights': 'Generate Highlights',
    'videoDetail.processing': 'Processing...',
    'videoDetail.saveChanges': 'Save Changes',
    'videoDetail.timelineEditor': 'Timeline Editor',
    'videoDetail.effectsAndStickers': 'Effects & Stickers',
    'videoDetail.gridGallery': 'Grid Gallery',
    'videoDetail.generateGrid': 'Generate Grid',
    'videoDetail.clickToChange': 'Click any frame to change',

    // Highlights
    'highlights.title': 'Highlights',
    'highlights.watchHighlight': 'Watch Highlight',
    'highlights.bestMoment': 'Best Moment',
    'highlights.raceHighlight': 'Race Highlight Reel #{number}',
    'highlights.rating': '{rating}',
    'highlights.aiEnhanced': 'AI Enhanced',
    'highlights.original': 'Original',

    // Grid Gallery
    'gridGallery.title': 'Grid Gallery',
    'gridGallery.featured': 'Featured',
    'gridGallery.raceHighlight': 'Race Highlights #{number}',
    'gridGallery.date': 'April {date}, 2025',
    'gridGallery.likes': '{count}',
    'gridGallery.aiGenerated': 'AI Generated',
    'gridGallery.custom': 'Custom',

    // Shares
    'shares.title': 'Shared Content',
    'shares.allTypes': 'All Types',
    'shares.videos': 'Videos',
    'shares.highlights': 'Highlights',
    'shares.grids': 'Grids',
    'shares.copyLink': 'Copy Link',
    'shares.sharedAgo': 'Shared {time} ago',
    'shares.views': '{count} views',
    'shares.amazingRace': 'Amazing Race Video',

    // Admin
    'admin.systemConfigTitle': 'System Configuration',
    'admin.aiSettings': 'AI Processing Settings',
    'admin.modelSelection': 'Model Selection',
    'admin.standardModel': 'Standard Model',
    'admin.highPerformance': 'High Performance Model',
    'admin.processingQuality': 'Processing Quality',
    'admin.balanced': 'Balanced',
    'admin.highQuality': 'High Quality',
    'admin.fastProcessing': 'Fast Processing',
    'admin.storageSettings': 'Storage Settings',
    'admin.retentionPeriod': 'Video Retention Period',
    'admin.days30': '30 days',
    'admin.days60': '60 days',
    'admin.days90': '90 days',
    'admin.maxVideoSize': 'Maximum Video Size',
    'admin.sizeInMb': 'Size in MB',
    'admin.saveChanges': 'Save Changes',
    'admin.analyticsTitle': 'Analytics Dashboard',
    'admin.totalUsers': 'Total Users',
    'admin.activeVideos': 'Active Videos',
    'admin.storageUsed': 'Storage Used',
    'admin.monthIncrease': '+{number}% this month',
    'admin.storageQuota': '{percent}% of quota',
    'admin.userGrowth': 'User Growth',
    'admin.storageUsage': 'Storage Usage',

    // Login
    'login.title': 'Sign in to your account',
    'login.emailLabel': 'Email address',
    'login.passwordLabel': 'Password',
    'login.rememberMe': 'Remember me',
    'login.forgotPassword': 'Forgot your password?',
    'login.signIn': 'Sign in',
    'login.noAccount': "Don't have an account?",
    'login.createAccount': 'Create new account',

    // Video Highlight Extractor
    'videoHighlight.title': 'Video Highlight Extractor',
    'videoHighlight.description': 'Upload a video to automatically extract highlight clips and frames',
    'videoHighlight.uploadPrompt': 'Click or drag to upload a video',
    'videoHighlight.supportedFormats': 'Supports MP4, MOV, AVI formats',
    'videoHighlight.extract': 'Extract Highlights',
    'videoHighlight.clipCount': 'Number of highlight clips',
    'videoHighlight.uploading': 'Uploading...',
    'videoHighlight.processing': 'Processing...',
    'videoHighlight.results': 'Highlight Results',
    'videoHighlight.clipTitle': 'Highlight Clip',
    'videoHighlight.frames': 'Highlight Frames',
    'videoHighlight.noFileError': 'Please select a video file',
    'videoHighlight.uploadError': 'Failed to upload video',
    'videoHighlight.extractError': 'Failed to extract highlights',
    'videoHighlight.download': 'Download',
    'videoHighlight.downloadAll': 'Download All',
    'videoHighlight.processingMessage': 'Extracting {count} highlight clips and 9 highlight frames, please wait...',
    'videoHighlight.advancedOptions': 'Advanced Options',
    'videoHighlight.clipDuration': 'Clip Duration (seconds)',
    'videoHighlight.rotate': 'Rotate Image',
    'videoHighlight.close': 'Close',
    'videoHighlight.selectImage': 'Select Image',
    'videoHighlight.deselect': 'Deselect',
    'videoHighlight.selectForGrid': 'Click to select images for grid',
    'videoHighlight.selectedCount': 'Selected {count}/9',
    'videoHighlight.createGrid': 'Create Grid',
    'videoHighlight.gridCreationMessage': 'Grid creation feature coming soon!',
    'videoHighlight.selectNineImages': 'Please select 9 images to create a grid',
    'videoHighlight.crop': 'Crop Image',
    'videoHighlight.applyCrop': 'Apply Crop',
    'videoHighlight.cancelCrop': 'Cancel Crop',
    'videoHighlight.cropInstructions': 'Click and drag to select crop area',
    'videoHighlight.cropApplied': 'Crop applied!',

    'videoExtractor.title': 'Video Highlight Extractor',
    'videoExtractor.description': 'Upload your video to automatically extract exciting moments and key frames, generating highlight videos and grid images',
    'videoExtractor.howItWorks': 'How It Works',
    'videoExtractor.step1Title': 'Upload Video',
    'videoExtractor.step1Desc': 'Select and upload the video you want to extract highlights from',
    'videoExtractor.step2Title': 'Smart Analysis',
    'videoExtractor.step2Desc': 'Our system automatically detects high action and key moments in your video',
    'videoExtractor.step3Title': 'Get Results',
    'videoExtractor.step3Desc': 'Get highlight videos and grid images that you can watch and download immediately',
  },
  zh: {
    // 导航
    'nav.appName': '卡丁相机',
    'nav.home': '首页',
    'nav.myVideos': '我的视频',
    'nav.highlights': '精彩片段',
    'nav.gridGallery': '九宫格相册',
    'nav.shares': '分享内容',
    'nav.videoExtractor': '视频提取工具',
    'nav.profile': '个人资料',
    'nav.logout': '退出登录',

    // 首页
    'home.title': '赛道概览',
    'home.description': '通过互动赛道地图，体验您的每一个精彩赛车时刻。点击标记点重温您的最佳表现。',
    'home.hotspotStart': '起点冲刺',
    'home.hotspotHairpin': '发夹弯超车',
    'home.hotspotS': 'S弯道漂移',
    'home.hotspotFinish': '终点冲线',
    'home.trackLength': '赛道长度：1.2公里',
    'home.bestLapTime': '最佳圈速：1:23.456',

    // 个人中心
    'profile.editProfile': '编辑资料',
    'profile.accountSettings': '账号设置',
    'profile.accountSettingsDesc': '管理您的账号信息',
    'profile.security': '安全设置',
    'profile.securityDesc': '密码与认证',
    'profile.notifications': '通知设置',
    'profile.notificationsDesc': '管理通知偏好',
    'profile.help': '帮助与反馈',
    'profile.helpDesc': '获取帮助或联系支持',
    'profile.adminPanel': '管理员面板',
    'profile.adminPanelDesc': '管理系统设置',
    'profile.logout': '退出登录',
    'profile.logoutDesc': '退出您的账号',

    // 管理员面板
    'admin.title': '管理员面板',
    'admin.userManagement': '用户管理',
    'admin.systemConfig': '系统配置',
    'admin.analytics': '数据统计',
    'admin.search': '搜索用户...',
    'admin.userId': '用户ID',
    'admin.name': '用户名',
    'admin.email': '邮箱',
    'admin.role': '角色',
    'admin.status': '状态',
    'admin.actions': '操作',
    'admin.viewVideos': '查看视频',
    'admin.changeRole': '更改角色',
    'admin.enable': '启用',
    'admin.disable': '禁用',

    // 视频列表
    'videoList.title': '我的赛车视频',
    'videoList.sort.latest': '最新优先',
    'videoList.sort.oldest': '最早优先',
    'videoList.watchNow': '立即观看',
    'videoList.bestLap': '最佳圈速',
    'videoList.raceSession': '精彩赛事 #{number}',
    'videoList.date': '2025年4月{date}日',
    'videoList.aiReady': 'AI就绪',
    'videoList.processing': '处理中',

    // 视频详情
    'videoDetail.aiMagic': 'AI魔法',
    'videoDetail.edit': '编辑',
    'videoDetail.effects': '特效',
    'videoDetail.grid': '九宫格',
    'videoDetail.generateHighlights': '生成精彩片段',
    'videoDetail.processing': '处理中...',
    'videoDetail.saveChanges': '保存更改',
    'videoDetail.timelineEditor': '时间轴编辑器',
    'videoDetail.effectsAndStickers': '特效和贴纸',
    'videoDetail.gridGallery': '九宫格相册',
    'videoDetail.generateGrid': '生成九宫格',
    'videoDetail.clickToChange': '点击任意帧更改',

    // 精彩片段
    'highlights.title': '精彩片段',
    'highlights.watchHighlight': '观看精彩片段',
    'highlights.bestMoment': '最佳时刻',
    'highlights.raceHighlight': '赛事精彩回放 #{number}',
    'highlights.rating': '{rating}',
    'highlights.aiEnhanced': 'AI增强',
    'highlights.original': '原始版本',

    // 九宫格相册
    'gridGallery.title': '九宫格相册',
    'gridGallery.featured': '精选',
    'gridGallery.raceHighlight': '赛事精彩集锦 #{number}',
    'gridGallery.date': '2025年4月{date}日',
    'gridGallery.likes': '{count}',
    'gridGallery.aiGenerated': 'AI生成',
    'gridGallery.custom': '自定义',

    // 分享
    'shares.title': '分享内容',
    'shares.allTypes': '所有类型',
    'shares.videos': '视频',
    'shares.highlights': '精彩片段',
    'shares.grids': '九宫格',
    'shares.copyLink': '复制链接',
    'shares.sharedAgo': '{time}前分享',
    'shares.views': '{count}次观看',
    'shares.amazingRace': '精彩赛事视频',

    // Admin
    'admin.systemConfigTitle': '系统配置',
    'admin.aiSettings': 'AI处理设置',
    'admin.modelSelection': '模型选择',
    'admin.standardModel': '标准模型',
    'admin.highPerformance': '高性能模型',
    'admin.processingQuality': '处理质量',
    'admin.balanced': '平衡',
    'admin.highQuality': '高质量',
    'admin.fastProcessing': '快速处理',
    'admin.storageSettings': '存储设置',
    'admin.retentionPeriod': '视频保留期',
    'admin.days30': '30天',
    'admin.days60': '60天',
    'admin.days90': '90天',
    'admin.maxVideoSize': '最大视频大小',
    'admin.sizeInMb': '大小（MB）',
    'admin.saveChanges': '保存更改',
    'admin.analyticsTitle': '数据分析面板',
    'admin.totalUsers': '总用户数',
    'admin.activeVideos': '活跃视频',
    'admin.storageUsed': '已用存储',
    'admin.monthIncrease': '本月增长{number}%',
    'admin.storageQuota': '配额使用率{percent}%',
    'admin.userGrowth': '用户增长',
    'admin.storageUsage': '存储使用情况',

    // 登录
    'login.title': '登录您的账户',
    'login.emailLabel': '邮箱地址',
    'login.passwordLabel': '密码',
    'login.rememberMe': '记住我',
    'login.forgotPassword': '忘记密码？',
    'login.signIn': '登录',
    'login.noAccount': '还没有账户？',
    'login.createAccount': '创建新账户',

    // Video Highlight Extractor
    'videoHighlight.title': '视频高光提取器',
    'videoHighlight.description': '上传视频，自动提取精彩高光片段和画面',
    'videoHighlight.uploadPrompt': '点击或拖放上传视频',
    'videoHighlight.supportedFormats': '支持 MP4、MOV、AVI 等格式',
    'videoHighlight.extract': '提取高光片段',
    'videoHighlight.clipCount': '高光片段数量',
    'videoHighlight.uploading': '上传中...',
    'videoHighlight.processing': '处理中...',
    'videoHighlight.results': '高光片段',
    'videoHighlight.clipTitle': '高光片段',
    'videoHighlight.frames': '高光帧',
    'videoHighlight.noFileError': '请选择一个视频文件',
    'videoHighlight.uploadError': '视频上传失败',
    'videoHighlight.extractError': '高光提取失败',
    'videoHighlight.download': '下载',
    'videoHighlight.downloadAll': '下载全部',
    'videoHighlight.processingMessage': '正在提取 {count} 个高光视频片段和 9 张高光图片，请稍候...',
    'videoHighlight.advancedOptions': '高级选项',
    'videoHighlight.clipDuration': '片段时长 (秒)',
    'videoHighlight.rotate': '旋转图片',
    'videoHighlight.close': '关闭',
    'videoHighlight.selectImage': '选择图片',
    'videoHighlight.deselect': '取消选择',
    'videoHighlight.selectForGrid': '点击选择图片创建九宫格',
    'videoHighlight.selectedCount': '已选择 {count}/9',
    'videoHighlight.createGrid': '创建九宫格',
    'videoHighlight.gridCreationMessage': '九宫格图片创建功能即将推出！',
    'videoHighlight.selectNineImages': '请选择9张图片以创建九宫格',
    'videoHighlight.crop': '裁剪图片',
    'videoHighlight.applyCrop': '应用裁剪',
    'videoHighlight.cancelCrop': '取消裁剪',
    'videoHighlight.cropInstructions': '点击并拖动选择裁剪区域',
    'videoHighlight.cropApplied': '裁剪已应用！',

    'videoExtractor.title': '视频高光提取工具',
    'videoExtractor.description': '上传视频，我们将自动提取精彩瞬间和关键画面，生成精彩视频片段和九宫格图片',
    'videoExtractor.howItWorks': '工作原理',
    'videoExtractor.step1Title': '上传视频',
    'videoExtractor.step1Desc': '选择并上传您想要提取高光的视频文件',
    'videoExtractor.step2Title': '智能分析',
    'videoExtractor.step2Desc': '我们的系统自动检测视频中的高动作和关键时刻',
    'videoExtractor.step3Title': '生成结果',
    'videoExtractor.step3Desc': '获取精彩视频片段和九宫格图片，可以立即观看和下载'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}