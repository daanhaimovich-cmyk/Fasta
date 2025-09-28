import React, { type FC } from 'react';
import { TargetIcon, UsersIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface RoleSelectionProps {
  onSelectRole: (role: 'client' | 'trainer') => void;
}

const RoleSelection: FC<RoleSelectionProps> = ({ onSelectRole }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto text-center animate-fade-in-down">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        {t('roleSelection_title')}
      </h1>
      <p className="text-slate-400 mb-12 max-w-xl mx-auto">
        {t('roleSelection_subtitle')}
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <button
          onClick={() => onSelectRole('client')}
          className="bg-slate-800/50 p-8 rounded-lg border-2 border-slate-700/50 text-center flex flex-col items-center hover:border-emerald-500 hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label={t('roleSelection_client_title')}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <TargetIcon className="w-8 h-8" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-white">{t('roleSelection_client_title')}</h3>
          <p className="text-slate-400">{t('roleSelection_client_subtitle')}</p>
        </button>
        <button
          onClick={() => onSelectRole('trainer')}
          className="bg-slate-800/50 p-8 rounded-lg border-2 border-slate-700/50 text-center flex flex-col items-center hover:border-cyan-500 hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label={t('roleSelection_trainer_title')}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
            <UsersIcon className="w-8 h-8" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-white">{t('roleSelection_trainer_title')}</h3>
          <p className="text-slate-400">{t('roleSelection_trainer_subtitle')}</p>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;