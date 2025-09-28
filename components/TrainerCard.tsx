

import React, { type FC } from 'react';
import type { Trainer } from '../types';
import { StarIcon, LocationMarkerIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface TrainerCardProps {
  trainer: Trainer;
  onMessageTrainer: (trainer: Trainer) => void;
  onViewProfile: (trainer: Trainer) => void;
}

const TrainerCard: FC<TrainerCardProps> = ({ trainer, onMessageTrainer, onViewProfile }) => {
  const { t } = useTranslation();
  const avgRating = trainer.reviews.length > 0
    ? trainer.reviews.reduce((acc, review) => acc + review.rating, 0) / trainer.reviews.length
    : 0;
  const reviewCount = trainer.reviews.length;

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-emerald-500/20 hover:ring-2 hover:ring-slate-700 transition-all duration-300 flex flex-col">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={trainer.photoUrl} alt={trainer.name} />
        {trainer.isOnline && (
          <span className="absolute top-3 end-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            {t('trainerCard_online')}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white tracking-tight">{trainer.name}</h3>
            <div className="flex items-center bg-slate-700/50 px-2 py-1 rounded-md">
                <StarIcon filled className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-white ms-1">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-slate-400 ms-1">({reviewCount})</span>
            </div>
        </div>
        
        <div className="flex items-center text-slate-400 mt-1 space-x-4 text-sm">
           <div className="flex items-center">
             <LocationMarkerIcon className="me-1" />
             <span>{trainer.location}</span>
           </div>
           <div className="flex items-center">
             <span className="font-semibold text-slate-200">₪{trainer.hourlyRate}</span>
             <span className="ms-1">{t('trainerCard_perHour')}</span>
           </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {trainer.specialties.slice(0, 3).map(spec => (
            <span key={spec} className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-300 rounded-full">
              {t(`specialty_${spec}`)}
            </span>
          ))}
        </div>

        <p className="text-slate-400 text-sm mt-4 flex-grow">
          {trainer.bio.length > 100 ? `${trainer.bio.substring(0, 100)}...` : trainer.bio}
        </p>

        <div className="mt-6 flex items-center gap-4">
            <button 
              onClick={() => onViewProfile(trainer)}
              className="w-full bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-200">
              {t('trainerCard_viewProfile')}
            </button>
            <button
                className="w-full bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20"
                onClick={() => onMessageTrainer(trainer)}
            >
              {t('trainerCard_messageTrainer')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;