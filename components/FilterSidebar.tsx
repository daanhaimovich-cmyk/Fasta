



import React, { useState, type FC } from 'react';
import type { Filters, Specialty } from '../types';
import { StarIcon, ChevronUpIcon, ChevronDownIcon, LocationMarkerIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  availableSpecialties: Specialty[];
}

const FilterSection: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();

  return (
    <div className="border-b border-slate-700 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center text-start"
        title={isOpen ? t('common_collapse') : t('common_expand')}
      >
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

const FilterSidebar: FC<FilterSidebarProps> = ({ filters, setFilters, availableSpecialties }) => {
  const { t } = useTranslation();

  const handleSpecialtyChange = (specialty: Specialty) => {
    setFilters(prev => {
      const newSpecialties = prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty];
      return { ...prev, specialties: newSpecialties };
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], value] }));
  };
  
  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({...prev, minRating: rating}));
  }

  return (
    <div>
      <FilterSection title={t('filters_specialty')}>
        <div className="space-y-2">
          {availableSpecialties.map(spec => (
            <label key={spec} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.specialties.includes(spec)}
                onChange={() => handleSpecialtyChange(spec)}
                className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800"
              />
              <span className="text-slate-300">{t(`specialty_${spec}`)}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t('filters_rating')}>
         <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => handleRatingChange(star)} className="focus:outline-none" title={t('filters_rateAtLeast', { count: star })}>
              <StarIcon filled={star <= filters.minRating} className="w-6 h-6"/>
            </button>
          ))}
        </div>
      </FilterSection>
      
      <FilterSection title={t('filters_maxHourlyRate')}>
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min="80"
            max="500"
            step="10"
            value={filters.priceRange[1]}
            onChange={handlePriceChange}
            className="w-full cursor-pointer custom-slider"
          />
          <div className="flex justify-between text-sm text-slate-400">
            <span>₪80</span>
            <span className="font-bold text-emerald-400">₪{filters.priceRange[1]}</span>
            <span>₪500</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title={t('filters_location')}>
         <div className="relative">
             <input
                type="text"
                placeholder={t('filters_locationPlaceholder')}
                value={filters.location}
                onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 ps-10 pe-4 text-white placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
             />
         </div>
      </FilterSection>
      
       <div className="pt-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-lg font-semibold text-slate-100">{t('filters_onlineOnly')}</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={filters.onlineOnly}
              onChange={(e) => setFilters(prev => ({...prev, onlineOnly: e.target.checked}))}
            />
            <div className="block bg-slate-700 w-14 h-8 rounded-full"></div>
            <div className="dot absolute start-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-6 peer-checked:bg-emerald-400"></div>
          </div>
        </label>
      </div>

    </div>
  );
};

export default FilterSidebar;