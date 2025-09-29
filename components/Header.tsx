




import React, { useState, useEffect, useRef, type FC } from 'react';
import type { UserProfile } from '../types';
import { View } from '../App';
import { DashboardIcon, ChatBubbleIcon, FastaLogoIcon, LogoutIcon, ChevronDownIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface HeaderProps {
    onNavigate: (view: View) => void;
    user: UserProfile | null;
    onLogout: () => void;
    unreadMessagesCount: number;
    view: View;
}

const Header: FC<HeaderProps> = ({ onNavigate, user, onLogout, unreadMessagesCount, view }) => {
  const { t } = useTranslation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleMessagesClick = () => {
    if (user) {
      onNavigate('messages');
    } else {
      onNavigate('signup-role-select');
    }
  };

  const NavLink: FC<{ targetView: View; children: React.ReactNode }> = ({ targetView, children }) => (
    <button 
        onClick={() => onNavigate(targetView)} 
        className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
            view === targetView 
            ? 'text-white bg-slate-700' 
            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
        }`}
    >
        {children}
    </button>
  );
  
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <button onClick={() => onNavigate('discovery')} className="flex items-center gap-2 text-2xl font-bold tracking-tighter focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-4 focus:ring-offset-slate-900 rounded-lg">
          <FastaLogoIcon className="w-7 h-7 text-emerald-400"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            FASTA
          </span>
        </button>
        
        <nav className="hidden md:flex items-center space-x-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700/50">
          <NavLink targetView='discovery'>{t('header_browseTrainers')}</NavLink>
          <NavLink targetView='about'>{t('header_about')}</NavLink>
        </nav>

        <div className="flex items-center space-x-4">
            {user ? (
                <>
                    <button onClick={handleMessagesClick} className="relative text-slate-400 hover:text-white transition-colors" aria-label={t('header_messages')} title={t('header_messages')}>
                        <ChatBubbleIcon className="w-6 h-6" />
                        {unreadMessagesCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {unreadMessagesCount}
                            </span>
                        )}
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-full"
                            title={t('header_userMenu')}
                        >
                            <img src={user.photoUrl} alt="User avatar" className="w-9 h-9 rounded-full object-cover border-2 border-slate-600 group-hover:border-emerald-500 transition"/>
                            <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isUserMenuOpen && (
                           <div className="absolute right-0 mt-3 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden z-10 animate-fade-in-down">
                                <div className="p-3 border-b border-slate-700">
                                  <p className="text-sm font-semibold text-white truncate">@{user.username}</p>
                                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                </div>
                                <div className="p-1">
                                    <button onClick={() => { onNavigate('dashboard'); setIsUserMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700/50 rounded-md transition-colors">
                                        <DashboardIcon className="w-5 h-5"/>
                                        <span>{t('header_dashboard')}</span>
                                    </button>
                                     <button onClick={() => { onLogout(); setIsUserMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700/50 rounded-md transition-colors">
                                        <LogoutIcon className="w-5 h-5"/>
                                        <span>{t('header_logout')}</span>
                                    </button>
                                </div>
                           </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <button onClick={handleMessagesClick} className="relative text-slate-400 hover:text-white transition-colors" aria-label={t('header_messages')} title={t('header_messages')}>
                      <ChatBubbleIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => onNavigate('login')} className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">{t('header_login')}</button>
                    <button 
                        onClick={() => onNavigate('signup-role-select')}
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