

import React from 'react';
import type { UserProfile } from '../types';
import { View } from '../App';
import { DashboardIcon, ChatBubbleIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface HeaderProps {
    onNavigate: (view: View) => void;
    user: UserProfile | null;
    onLogout: () => void;
    unreadMessagesCount: number;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, user, onLogout, unreadMessagesCount }) => {
  const { language, setLanguage, t } = useTranslation();

  const handleMessagesClick = () => {
    if (user) {
      onNavigate('messages');
    } else {
      onNavigate('client-signup');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };
  
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button onClick={() => onNavigate('discovery')} className="text-3xl font-bold tracking-tighter focus:outline-none">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            FASTA
          </span>
        </button>
        <nav className="hidden md:flex items-center space-x-6">
          <button onClick={() => onNavigate('discovery')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{t('header_browseTrainers')}</button>
          <button onClick={() => onNavigate('trainer-signup')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{t('header_forTrainers')}</button>
          <button onClick={() => onNavigate('about')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{t('header_about')}</button>
        </nav>
        <div className="flex items-center space-x-4">
            <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 text-sm font-semibold bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
                aria-label={`Switch to ${language === 'en' ? 'Hebrew' : 'English'}`}
            >
              {language === 'en' ? 'עב' : 'EN'}
            </button>
            {user ? (
                <>
                    <button onClick={() => onNavigate('dashboard')} className="text-slate-400 hover:text-white transition-colors" aria-label={t('header_dashboard')}>
                        <DashboardIcon />
                    </button>
                     <button onClick={handleMessagesClick} className="relative text-slate-400 hover:text-white transition-colors" aria-label={t('header_messages')}>
                        <ChatBubbleIcon className="w-6 h-6" />
                        {unreadMessagesCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {unreadMessagesCount}
                            </span>
                        )}
                    </button>
                    <span className="text-sm font-medium text-slate-300 hidden sm:block">{t('header_welcome')}@{user.username}</span>
                    <button 
                        onClick={onLogout}
                        className="px-4 py-2 text-sm font-semibold bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors">
                        {t('header_logout')}
                    </button>
                </>
            ) : (
                <>
                    <button onClick={handleMessagesClick} className="relative text-slate-400 hover:text-white transition-colors" aria-label={t('header_messages')}>
                      <ChatBubbleIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => onNavigate('login')} className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">{t('header_login')}</button>
                    <button 
                        onClick={() => onNavigate('client-signup')}
                        className="px-4 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20">
                        {t('header_signup')}
                    </button>
                </>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;