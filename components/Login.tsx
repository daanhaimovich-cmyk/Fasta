

import React, { useState, type FC } from 'react';
import { EyeIcon, EyeOffIcon } from './IconComponents';
import type { UserProfile } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface LoginProps {
    onLoginSuccess: (user: UserProfile, remember: boolean) => void;
    onNavigateToSignUp: () => void;
}

const Login: FC<LoginProps> = ({ onLoginSuccess, onNavigateToSignUp }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const storedUser = localStorage.getItem(`fasta_user_${email}`);
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.password === password) {
                onLoginSuccess({ 
                    email: user.email, 
                    fullName: user.fullName, 
                    username: user.username,
                    photoUrl: user.photoUrl || `https://picsum.photos/seed/${user.username}/200/200`,
                    completedSessions: user.completedSessions || 0,
                    earnedMedalIds: user.earnedMedalIds || [],
                    conversations: user.conversations || [],
                    favoriteTrainerIds: user.favoriteTrainerIds || [],
                }, rememberMe);
                return;
            }
        }
        
        setError(t('login_error'));
    };

    return (
        <div className="max-w-md mx-auto bg-slate-800/50 p-8 rounded-lg shadow-2xl border border-slate-700/50 animate-fade-in-down">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">{t('login_welcomeBack')}</h2>
            <p className="text-slate-400 mb-8 text-center">{t('login_subtitle')}</p>
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="email-login" className="block text-sm font-medium text-slate-300 mb-2">{t('login_emailLabel')}</label>
                    <input 
                        type="email" 
                        id="email-login" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className={`w-full bg-slate-700 border rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition ${error ? 'border-red-500 animate-shake' : 'border-slate-600'}`}
                        placeholder={t('login_emailPlaceholder')} />
                </div>
                <div>
                    <label htmlFor="password-login" className="block text-sm font-medium text-slate-300 mb-2">{t('login_passwordLabel')}</label>
                    <div className="relative">
                        <input 
                            type={passwordVisible ? "text" : "password"} 
                            id="password-login" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className={`w-full bg-slate-700 border rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition ${error ? 'border-red-500 animate-shake' : 'border-slate-600'}`}
                            placeholder={t('login_passwordPlaceholder')} />
                        <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 end-0 pe-3 flex items-center text-slate-400 hover:text-white">
                            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                        <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800"
                        />
                        <span className="ms-2 text-sm text-slate-300">{t('login_rememberMe')}</span>
                    </label>
                    {/* <a href="#" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">Forgot password?</a> */}
                </div>

                {error && <p className="text-red-400 text-sm text-center -my-2">{error}</p>}

                <button 
                    type="submit"
                    className="w-full bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500">
                    {t('login_button')}
                </button>
                <p className="text-sm text-slate-400 text-center pt-4">
                    {t('login_noAccount')}{' '}
                    <button type="button" onClick={onNavigateToSignUp} className="font-semibold text-emerald-400 hover:text-emerald-300">
                        {t('login_signUpLink')}
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;