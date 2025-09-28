


import React, { type FC } from 'react';
import type { Medal } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface MedalUnlockedModalProps {
  medal: Medal;
  onClose: () => void;
}

const MedalUnlockedModal: FC<MedalUnlockedModalProps> = ({ medal, onClose }) => {
  const { t } = useTranslation();
  
  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-down"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="medal-unlocked-title"
    >
      <div
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-slate-200 border border-emerald-500/50 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="p-8 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <medal.Icon className="w-24 h-24" />
          </div>

          <h2 id="medal-unlocked-title" className="text-2xl font-bold text-white">{t('medalModal_title')}</h2>
          <p className="text-lg font-semibold text-slate-300 mt-2">{medal.name}</p>
          <p className="text-slate-400 text-sm mt-1">{medal.description}</p>

          <button
            onClick={onClose}
            className="mt-8 px-6 py-2.5 text-sm font-semibold bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
          >
            {t('medalModal_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

// FIX: Added default export to allow the component to be imported correctly.
export default MedalUnlockedModal;