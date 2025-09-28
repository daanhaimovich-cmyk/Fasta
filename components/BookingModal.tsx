

import React, { useState, useMemo, type FC } from 'react';
import type { Trainer } from '../types';
import { XIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface BookingModalProps {
  trainer: Trainer;
  onClose: () => void;
  onConfirm: (bookingDetails: { date: string; time: string; message: string }) => void;
}

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
];

const BookingModal: FC<BookingModalProps> = ({ trainer, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  const today = new Date();
  const firstDayOfMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today.getFullYear(), today.getMonth()]);
  const daysInMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(), [today.getFullYear(), today.getMonth()]);

  const calendarDays = useMemo(() => {
    let startingDayOfWeek = firstDayOfMonth.getDay();
    const days = [];
    // Add padding for days before the 1st of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add the actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(today.getFullYear(), today.getMonth(), i));
    }
    return days;
  }, [firstDayOfMonth, daysInMonth, today]);

  const handleDateSelect = (day: Date) => {
    // Prevent selecting past dates
    if (day.setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) return;
    setSelectedDate(day);
  };

  const handleConfirmClick = () => {
    if (selectedDate && selectedTime) {
        onConfirm({
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            message: message
        });
    }
  };

  const weekDays = [
    t('day_sun'), t('day_mon'), t('day_tue'), t('day_wed'), t('day_thu'), t('day_fri'), t('day_sat')
  ];


  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div 
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-auto text-slate-200 border border-slate-700 max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-4">
                    <img src={trainer.photoUrl} alt={trainer.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"/>
                    <div>
                        <p className="text-slate-400 text-sm">{t('bookingModal_title')}</p>
                        <h2 id="booking-modal-title" className="text-2xl font-bold text-white">{trainer.name}</h2>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close modal">
                    <XIcon />
                </button>
            </div>

            {/* Calendar */}
            <div className="mt-6">
                <h3 className="font-semibold text-lg text-white mb-3">{t('bookingModal_selectDate')}</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {weekDays.map(day => (
                        <div key={day} className="font-medium text-slate-400">{day}</div>
                    ))}
                    {calendarDays.map((day, index) => {
                        if (!day) return <div key={index}></div>;

                        const isPast = day.setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
                        const isSelected = selectedDate && day && selectedDate.toDateString() === day.toDateString();
                        const isToday = day && day.toDateString() === today.toDateString();

                        return (
                            <div key={index} className="py-1 flex justify-center">
                                {day ? (
                                    <button
                                        onClick={() => handleDateSelect(day)}
                                        disabled={isPast}
                                        className={`w-10 h-10 rounded-full transition-colors duration-200 flex items-center justify-center
                                            ${isPast ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-slate-700'}
                                            ${isSelected ? 'bg-emerald-500 text-white font-bold' : ''}
                                            ${isToday && !isSelected ? 'ring-2 ring-emerald-500/50' : ''}`}
                                    >
                                      {day.getDate()}
                                    </button>
                                ) : <div />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots */}
            <div className="mt-6">
                <h3 className="font-semibold text-lg text-white mb-3">{t('bookingModal_selectTime')}</h3>
                <div className="grid grid-cols-4 gap-3">
                    {TIME_SLOTS.map(time => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-semibold
                                ${selectedTime === time ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Message */}
            <div className="mt-6">
                 <h3 className="font-semibold text-lg text-white mb-3">{t('bookingModal_messageLabel')}</h3>
                 <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('bookingModal_messagePlaceholder')}
                    rows={3}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                 />
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/50 mt-auto rounded-b-2xl border-t border-slate-700">
             <button
                onClick={handleConfirmClick}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {t('bookingModal_submitButton', { rate: trainer.hourlyRate })}
            </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;