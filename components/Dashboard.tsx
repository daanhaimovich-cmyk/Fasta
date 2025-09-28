


import React, { type FC } from 'react';
import type { UserProfile } from '../types';
import { ALL_MEDALS } from '../medals';
import { LockClosedIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

const Dashboard: FC<{ user: UserProfile | null }> = ({ user }) => {
  const { t } = useTranslation();

  if (!user) {
    return <div className="text-center text-slate-400">Loading user profile...</div>;
  }

  const earnedMedals = ALL_MEDALS.filter(medal => user.earnedMedalIds.includes(medal.id));
  const unearnedMedals = ALL_MEDALS.filter(medal => !user.earnedMedalIds.includes(medal.id));
  const userFirstName = user.fullName.split(' ')[0];

  return (
    <div className="space-y-12 animate-fade-in-down">
      {/* User Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">{t('dashboard_welcome', { name: userFirstName })}</h1>
        <p className="text-lg text-slate-400">@{user.username}</p>
      </div>

      {/* Stats */}
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-semibold text-white mb-4">{t('dashboard_progressTitle')}</h2>
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-emerald-400">{user.completedSessions}</div>
          <div className="text-xl text-slate-300">{t('dashboard_sessionsCompleted')}</div>
        </div>
      </div>

      {/* Medals */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">{t('dashboard_medalsTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earnedMedals.map(medal => (
            <div key={medal.id} className="bg-slate-800 p-6 rounded-lg border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10 flex items-center gap-5">
              <medal.Icon className="w-16 h-16 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white">{medal.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{medal.description}</p>
              </div>
            </div>
          ))}
          {unearnedMedals.map(medal => (
            <div key={medal.id} className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center gap-5 opacity-60">
              <div className="w-16 h-16 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center">
                 <LockClosedIcon className="w-8 h-8 text-slate-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-400">{medal.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{t('dashboard_unlockMedal', { milestone: medal.milestone })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;