import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Video, GripHorizontal, Play, Move, Edit, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Hotspot {
  id: number;
  x: number;
  y: number;
  type: 'start' | 'turn' | 'finish';
  title: string;
  media: string;
  isVideo: boolean;
  preview: string;
}

export function Home() {
  const { t } = useLanguage();
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const hotspotRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const [isEditMode, setIsEditMode] = useState(false);
  
  // 初始热点数据
  const initialHotspots = [
    {
      id: 1,
      x: 85,
      y: 85,
      type: 'start' as const,
      title: t('home.hotspotStart'),
      media: 'https://www.youtube.com/embed/2_peQumM5Cg',
      isVideo: true,
      preview: 'https://img.youtube.com/vi/2_peQumM5Cg/maxresdefault.jpg'
    },
    {
      id: 2,
      x: 35,
      y: 35,
      type: 'turn' as const,
      title: t('home.hotspotHairpin'),
      media: 'https://www.youtube.com/embed/2_peQumM5Cg',
      isVideo: true,
      preview: 'https://img.youtube.com/vi/2_peQumM5Cg/maxresdefault.jpg'
    },
    {
      id: 3,
      x: 75,
      y: 20,
      type: 'turn' as const,
      title: t('home.hotspotS'),
      media: 'https://www.youtube.com/embed/2_peQumM5Cg',
      isVideo: true,
      preview: 'https://img.youtube.com/vi/2_peQumM5Cg/maxresdefault.jpg'
    },
    {
      id: 4,
      x: 20,
      y: 65,
      type: 'finish' as const,
      title: t('home.hotspotFinish'),
      media: 'https://www.youtube.com/embed/2_peQumM5Cg',
      isVideo: true,
      preview: 'https://img.youtube.com/vi/2_peQumM5Cg/maxresdefault.jpg'
    }
  ];
  
  const [hotspots, setHotspots] = useState<Hotspot[]>(initialHotspots);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedHotspot, setDraggedHotspot] = useState<Hotspot | null>(null);

  // 从本地存储加载热点位置
  useEffect(() => {
    try {
      const savedHotspots = localStorage.getItem('trackMapHotspots');
      if (savedHotspots) {
        const savedPositions = JSON.parse(savedHotspots);
        
        // 合并保存的位置与初始热点数据
        const updatedHotspots = initialHotspots.map(hotspot => {
          const savedPosition = savedPositions.find((pos: {id: number}) => pos.id === hotspot.id);
          if (savedPosition) {
            return {
              ...hotspot,
              x: savedPosition.x,
              y: savedPosition.y
            };
          }
          return hotspot;
        });
        
        setHotspots(updatedHotspots);
      }
    } catch (error) {
      console.error('Failed to load hotspot positions from localStorage:', error);
    }
  }, [t]);
  
  // 保存热点位置到本地存储
  const saveHotspotsToLocalStorage = useCallback((spots: Hotspot[]) => {
    try {
      // 只保存ID和位置信息
      const positionsToSave = spots.map(({ id, x, y }) => ({ id, x, y }));
      localStorage.setItem('trackMapHotspots', JSON.stringify(positionsToSave));
    } catch (error) {
      console.error('Failed to save hotspot positions to localStorage:', error);
    }
  }, []);

  // 计算预览弹窗位置的函数
  const getPopupPosition = useCallback((hotspotId: number) => {
    if (!mapContainerRef.current) return { top: '120%', left: '50%' };
    
    const hotspotElement = hotspotRefs.current.get(hotspotId);
    if (!hotspotElement) return { top: '120%', left: '50%' };
    
    const mapRect = mapContainerRef.current.getBoundingClientRect();
    const hotspotRect = hotspotElement.getBoundingClientRect();
    
    // 计算热点在地图中的相对位置
    const hotspotY = hotspotRect.top - mapRect.top;
    const mapHeight = mapRect.height;
    
    // 检查热点是否在地图底部附近（如最后25%的区域）
    const isNearBottom = hotspotY > mapHeight * 0.75;
    
    // 如果热点靠近底部，弹窗显示在上方，否则显示在下方
    return {
      top: isNearBottom ? 'auto' : '120%',
      bottom: isNearBottom ? '120%' : 'auto',
      left: '50%'
    };
  }, []);
  
  // 设置热点引用的函数
  const setHotspotRef = useCallback((element: HTMLButtonElement | null, id: number) => {
    if (element) {
      hotspotRefs.current.set(id, element);
    } else {
      hotspotRefs.current.delete(id);
    }
  }, []);

  const handleDragStart = (e: React.MouseEvent, hotspot: Hotspot) => {
    if (!isEditMode) return;
    e.preventDefault();
    setIsDragging(true);
    setDraggedHotspot(hotspot);
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging || !draggedHotspot) return;

    const trackMap = e.currentTarget as HTMLElement;
    const rect = trackMap.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Update hotspot position
    const updatedHotspots = hotspots.map(h => 
      h.id === draggedHotspot.id 
        ? { ...h, x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) }
        : h
    );
    setHotspots(updatedHotspots);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    // 拖拽结束时，保存热点位置到本地存储
    saveHotspotsToLocalStorage(hotspots);
    setDraggedHotspot(null);
  };

  React.useEffect(() => {
    if (isDragging) {
      const handleMouseUp = () => handleDragEnd();
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (isDragging) return;
    
    if (isEditMode) {
      // 在编辑模式下，点击可选择热点（用于将来可能的操作）
      console.log('Selected hotspot in edit mode:', hotspot.id);
    } else {
      // 在非编辑模式下，点击显示视频模态框
      setSelectedHotspot(hotspot);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    // 退出编辑模式时保存位置
    if (isEditMode) {
      saveHotspotsToLocalStorage(hotspots);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Track Map Container */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-6 md:mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{t('home.title')}</h1>
            
            {/* 编辑模式切换按钮 */}
            <button
              onClick={toggleEditMode}
              className={`flex items-center justify-center p-2 rounded-full transition-colors ${
                isEditMode 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title={isEditMode ? t('home.finishEditing') : t('home.startEditing')}
            >
              {isEditMode ? (
                <Check className="w-5 h-5" />
              ) : (
                <Edit className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
            {isEditMode 
              ? t('home.editModeDescription') || '拖拽热点以调整位置'
              : t('home.description')
            }
          </p>
          <div className="flex flex-col md:flex-row md:items-center justify-between text-xs md:text-sm text-gray-500 space-y-2 md:space-y-0">
            <span>{t('home.trackLength')}</span>
            <span>{t('home.bestLapTime')}</span>
          </div>
        </div>

        <div 
          ref={mapContainerRef}
          className={`relative max-w-3xl mx-auto bg-white rounded-lg md:rounded-xl shadow-lg md:shadow-xl overflow-hidden border-2 md:border-4 ${
            isEditMode ? 'border-blue-200' : 'border-gray-100'
          }`}
          onMouseMove={handleDrag}
        >
          <img
            src="https://www.k1speed.com/wp-content/uploads/2018/08/track-carlsbad.jpg"
            alt="Race Track Map"
            className="w-full h-auto select-none"
          />
          
          {/* Hotspots */}
          {hotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              ref={(el) => setHotspotRef(el, hotspot.id)}
              onClick={() => handleHotspotClick(hotspot)}
              onMouseDown={(e) => handleDragStart(e, hotspot)}
              onMouseEnter={() => !selectedHotspot && setHoveredHotspot(hotspot)}
              onMouseLeave={() => setHoveredHotspot(null)}
              className={`absolute w-6 md:w-8 h-6 md:h-8 transform -translate-x-1/2 -translate-y-1/2 rounded-full 
                ${hotspot.type === 'start' ? 'bg-green-500/90' : 
                  hotspot.type === 'finish' ? 'bg-red-500/90' : 'bg-orange-500/90'} 
                text-white flex items-center justify-center hover:scale-110 transition-transform
                shadow-lg hover:shadow-xl backdrop-blur-sm border ${isEditMode ? 'border-white/70' : 'border-white/40'}`}
              style={{ 
                left: `${hotspot.x}%`, 
                top: `${hotspot.y}%`, 
                cursor: isEditMode ? 'move' : 'pointer' 
              }}
            >
              <div className="relative w-10 md:w-14 h-10 md:h-14 -m-2 md:-m-3">
                <img 
                  src={hotspot.preview} 
                  alt=""
                  className={`w-full h-full rounded-full object-cover opacity-90 hover:opacity-100 transition-opacity ring-2 ${
                    isEditMode ? 'ring-white/80' : 'ring-white/60'
                  }`}
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm rounded-full p-1 md:p-1.5">
                  {isEditMode ? (
                    <Move className="w-3 md:w-3.5 h-3 md:h-3.5 text-white" />
                  ) : (
                    <Video className="w-3 md:w-3.5 h-3 md:h-3.5 text-white" />
                  )}
                </div>
                
                {/* 自定义拖拽指示器 */}
                {isDragging && draggedHotspot?.id === hotspot.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-sm">
                    <Move className="w-5 h-5 text-white/90" />
                  </div>
                )}
              </div>
              
              {/* Preview Popup - 只在非编辑模式下显示 */}
              {hoveredHotspot?.id === hotspot.id && !isDragging && !isEditMode && (
                <div 
                  className="absolute z-[9999] w-32 md:w-40 rounded-lg shadow-xl overflow-hidden transform -translate-x-1/2 scale-100 hover:scale-110 transition-transform"
                  style={getPopupPosition(hotspot.id)}
                >
                  <div className="relative">
                    <img 
                      src={hotspot.preview}
                      alt=""
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2.5">
                      <div className="flex items-center text-white text-xs">
                        <Play className="w-3.5 h-3.5 mr-1.5" />
                        <span className="font-medium truncate">{hotspot.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </button>
          ))}
          
          {/* 编辑模式提示 */}
          {isEditMode && (
            <div className="absolute bottom-3 right-3 bg-blue-500/80 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm shadow-lg">
              <div className="flex items-center">
                <Move className="w-3.5 h-3.5 mr-1.5" />
                {t('home.dragToMove') || '拖拽调整位置'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedHotspot && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedHotspot(null)}
              className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors z-10"
            >
              <X className="w-5 h-5 text-black" />
            </button>
            
            <div className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-4">{selectedHotspot.title}</h3>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                {selectedHotspot.isVideo ? (
                  <iframe
                    src={selectedHotspot.media}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full object-contain bg-black rounded-xl"
                  />
                ) : (
                  <img
                    src={selectedHotspot.media}
                    alt={selectedHotspot.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}