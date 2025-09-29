
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
    ? trainer.reviews.reduce((acc, r) => acc + r.rating, 0) / trainer.reviews.length
    : 0;

  return (
    <div data-design-id={`trainer-card-${trainer.id}`} className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50 flex flex-col group transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1">
      <div className="relative">
        <img data-design-id={`trainer-card-${trainer.id}-image`} src={trainer.photoUrl} alt={trainer.name} className="w-full h-56 object-cover" />
        <div className="absolute top-3 right-3 flex items-center bg-slate-900/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-sm">
          <StarIcon filled className="w-4 h-4 text-amber-400" />
          <span data-design-id={`trainer-card-${trainer.id}-rating`} className="text-white font-bold ml-1.5">{avgRating.toFixed(1)}</span>
          <span className="text-slate-400 ml-1.5">({trainer.reviews.length})</span>
        </div>
         {trainer.isOnline && (
            <div data-design-id={`trainer-card-${trainer.id}-online-badge`} className="absolute top-3 left-3 flex items-center bg-emerald-500/90 px-2.5 py-1 rounded-full text-xs font-bold text-white">
                {t('trainerCard_online')}
            </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 data-design-id={`trainer-card-${trainer.id}-name`} className="text-xl font-bold text-white truncate">{trainer.name}</h3>
            <div data-design-id={`trainer-card-${trainer.id}-location`} className="flex items-center text-slate-400 text-sm mt-1">
              <LocationMarkerIcon />
              <span className="ml-1.5">{trainer.location}</span>
            </div>
          </div>
          <div data-design-id={`trainer-card-${trainer.id}-price`} className="text-lg font-semibold text-emerald-400">
            ₪{trainer.hourlyRate}<span className="text-sm font-normal text-slate-400">{t('trainerCard_perHour')}</span>
          </div>
        </div>
        <div data-design-id={`trainer-card-${trainer.id}-specialties`} className="mt-3 flex flex-wrap gap-2">
          {trainer.specialties.slice(0, 3).map(spec => (
            <span key={spec} className="px-2.5 py-1 text-xs font-semibold bg-slate-700 text-slate-300 rounded-full">
              {t(`specialty_${spec}`)}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-5 space-y-3">
           <button 
              data-design-id={`trainer-card-${trainer.id}-view-profile-button`}
              onClick={() => onViewProfile(trainer)} 
              className="w-full text-center px-4 py-2 text-sm font-semibold bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors">
              {t('trainerCard_viewProfile')}
            </button>
            <button 
              data-design-id={`trainer-card-${trainer.id}-message-button`}
              onClick={() => onMessageTrainer(trainer)} 
              className="w-full text-center px-4 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20">
              {t('trainerCard_messageTrainer')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;
