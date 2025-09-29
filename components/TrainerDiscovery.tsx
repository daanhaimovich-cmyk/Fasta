

import React, { useState, useEffect, type FC } from 'react';
import { Specialty } from '../types';
import type { Trainer, Filters } from '../types';
import FilterSidebar from './FilterSidebar';
import TrainerCard from './TrainerCard';
import TrainerMap from './TrainerMap';
import { GridViewIcon, MapViewIcon, FilterIcon, XIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface TrainerDiscoveryProps {
    trainers: Trainer[];
    onMessageTrainer: (trainer: Trainer) => void;
    onViewProfile: (trainer: Trainer) => void;
}

type ViewMode = 'grid' | 'map';

const TrainerDiscovery: FC<TrainerDiscoveryProps> = ({ 
    trainers, 
    onMessageTrainer, 
    onViewProfile,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>(trainers);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    specialties: [],
    minRating: 0,
    priceRange: [80, 500],
    location: '',
    onlineOnly: false,
  });
  const { t } = useTranslation();


  useEffect(() => {
    const results = trainers.filter(trainer => {
      const avgRating = trainer.reviews.length > 0 ? trainer.reviews.reduce((acc, r) => acc + r.rating, 0) / trainer.reviews.length : 0;

      const specialtyMatch = filters.specialties.length === 0 || filters.specialties.some(spec => trainer.specialties.includes(spec));
      const ratingMatch = avgRating >= filters.minRating;
      const priceMatch = trainer.hourlyRate <= filters.priceRange[1];
      const locationMatch = filters.location === '' || trainer.location.toLowerCase().includes(filters.location.toLowerCase());
      const onlineMatch = !filters.onlineOnly || trainer.isOnline;

      return specialtyMatch && ratingMatch && priceMatch && locationMatch && onlineMatch;
    });
    setFilteredTrainers(results);
  }, [filters, trainers]);
  
  const getTrainersFoundText = () => {
    const count = filteredTrainers.length;
    if (count === 0) return t("discovery_trainersFound_zero");
    if (count === 1) return t("discovery_trainersFound_one");
    return t("discovery_trainersFound_other", { count });
  }


  return (
    <div className="relative">
      {/* Sidebar for Mobile (Overlay) */}
      {isFilterSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 animate-fade-in-down lg:hidden" onClick={() => setIsFilterSidebarOpen(false)}>
              <div className="absolute top-0 start-0 bottom-0 w-4/5 max-w-sm bg-slate-900 p-6 overflow-y-auto shadow-2xl border-e border-slate-700" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{t('discovery_filters')}</h2>
                    <button onClick={() => setIsFilterSidebarOpen(false)} className="text-slate-400 hover:text-white" title={t('common_close')}>
                       <XIcon />
                    </button>
                  </div>
                 <FilterSidebar 
                    filters={filters} 
                    setFilters={setFilters} 
                    availableSpecialties={Object.values(Specialty)} 
                  />
              </div>
          </div>
      )}

      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4">{t('discovery_filters')}</h2>
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              availableSpecialties={Object.values(Specialty)} 
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsFilterSidebarOpen(true)} title={t('discovery_filters')} className="lg:hidden flex items-center gap-2 border border-slate-700 px-4 py-2 rounded-lg font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <FilterIcon /> 
                    <span className="hidden sm:inline">{t('discovery_filters')}</span>
                </button>
                 <h2 className="text-xl md:text-2xl font-bold text-white">
                  {getTrainersFoundText()}
                </h2>
            </div>
            <div className="flex items-center space-x-1 border border-slate-700 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                aria-label={t('discovery_gridView')}
                title={t('discovery_gridView')}
              >
                <GridViewIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                aria-label={t('discovery_mapView')}
                title={t('discovery_mapView')}
              >
                <MapViewIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTrainers.map(trainer => (
                <TrainerCard key={trainer.id} trainer={trainer} onMessageTrainer={onMessageTrainer} onViewProfile={onViewProfile}/>
              ))}
            </div>
          ) : (
            <TrainerMap trainers={filteredTrainers} />
          )}

        </div>
      </div>
    </div>
  );
};

export default TrainerDiscovery;