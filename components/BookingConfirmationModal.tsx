

import React from 'react';
import type { Trainer, Booking } from '../types';
import { XIcon, CheckCircleIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface BookingConfirmationModalProps {
  trainer: Trainer;
  booking: Booking;
  onClose: () => void;
  onMessageTrainer: () => void;
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ trainer, booking, onClose, onMessageTrainer }) => {
  const { t, language } = useTranslation();
  const locale = language === 'he' ? 'he-IL' : 'en-US';

  const formattedDate = new Date(booking.date).toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // Treat date as UTC to avoid timezone shifts
  });

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-down"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-confirmation-title"
    >
      <div 
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto text-slate-200 border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-10 h-10 text-emerald-400" />
                </div>
            </div>

            <h2 id="booking-confirmation-title" className="text-2xl font-bold text-white">{t('confirmationModal_title')}</h2>
            <p className="text-slate-400 mt-2">{t('confirmationModal_subtitle', { name: trainer.name })}</p>

            <div className="text-start bg-slate-900/50 p-4 rounded-lg mt-6 border border-slate-700 space-y-3">
                <div className="flex items-center gap-4">
                    <img src={trainer.photoUrl} alt={trainer.name} className="w-12 h-12 rounded-full object-cover"/>
                    <div>
                        <p className="font-semibold text-white">{trainer.name}</p>
                        <p className="text-sm text-slate-400">{trainer.specialties.slice(0, 2).map(s => t(`specialty_${s}`)).join(', ')}</p>
                    </div>
                </div>
                <div className="border-t border-slate-700 my-2"></div>
                <div>
                    <p className="text-sm font-medium text-slate-400">{t('confirmationModal_details_date')}</p>
                    <p className="font-semibold text-white">{formattedDate}</p>
                </div>
                 <div>
                    <p className="text-sm font-medium text-slate-400">{t('confirmationModal_details_time')}</p>
                    <p className="font-semibold text-white">{booking.time}</p>
                </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                 <button
                    onClick={onMessageTrainer}
                    className="w-full px-6 py-2.5 text-sm font-semibold bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
                 >
                    {t('confirmationModal_button_chat')}
                </button>
                <button
                    onClick={onClose}
                    className="w-full px-6 py-2.5 text-sm font-semibold bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
                >
                    {t('confirmationModal_button_done')}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;