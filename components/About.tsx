


import React, { type FC } from 'react';
import { TargetIcon, UsersIcon, BriefcaseIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

const FeatureCard: FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50 text-center flex flex-col items-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-slate-400">{children}</p>
    </div>
  );
};

const About: FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-down">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            {t('about_title')}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
          {t('about_subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<TargetIcon className="w-7 h-7" />}
          title={t('about_mission_title')}
        >
          {t('about_mission_text')}
        </FeatureCard>

        <FeatureCard
          icon={<UsersIcon className="w-7 h-7" />}
          title={t('about_clients_title')}
        >
          {t('about_clients_text')}
        </FeatureCard>
        
        <FeatureCard
          icon={<BriefcaseIcon className="w-7 h-7" />}
          title={t('about_trainers_title')}
        >
          {t('about_trainers_text')}
        </FeatureCard>
      </div>
    </div>
  );
};

export default About;