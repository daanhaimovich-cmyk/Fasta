import React, { useState, type FC } from 'react';
import { EyeIcon, EyeOffIcon } from './IconComponents';
import type { UserProfile } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface LoginProps {
    onLoginSuccess: (user: UserProfile, remember: boolean) => void;
    onNavigateToSignUp: () => void;
    onRequireVerification: (email: string) => void;
}

const Login: FC<LoginProps> = ({ onLoginSuccess, onNavigateToSignUp, onRequireVerification }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const storedUserRaw = localStorage.getItem(`fasta_user_${email}`);
        if (storedUserRaw) {
            const user = JSON.parse(storedUserRaw);
            if (user.password === password) {
                if (user.verified === false) {
                    onRequireVerification(email);
                    return;
                }
                const { password: P, verified, verificationCode, ...userProfile } = user;
                onLoginSuccess(userProfile, rememberMe);
                return;
            }
        }
        
        setError(t('login_error'));
    };

    return (
        <div className="max-w-md mx-auto bg-slate-800/50 p-8 rounded-lg shadow-2xl border border-slate-700/50 animate-fade-in-down">
            <h2 data-design-id="login-title" className="text-3xl font-bold text-white mb-2 text-center">{t('login_welcomeBack')}</h2>
            <p data-design-id="login-subtitle" className="text-slate-400 mb-8 text-center">{t('login_subtitle')}</p>
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="email-login" className="block text-sm font-medium text-slate-300 mb-2">{t('login_emailLabel')}</label>
                    <input 
                        data-design-id="login-email-input"
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
                            data-design-id="login-password-input"
                            type={passwordVisible ? "text" : "password"} 
                            id="password-login" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className={`w-full bg-slate-700 border rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition ${error ? 'border-red-500 animate-shake' : 'border-slate-600'}`}
                            placeholder={t('login_passwordPlaceholder')} />
                        <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 end-0 pe-3 flex items-center text-slate-400 hover:text-white" title={passwordVisible ? t('common_hidePassword') : t('common_showPassword')}>
                            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label data-design-id="login-remember-me-checkbox" className="flex items-center cursor-pointer">
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
                    data-design-id="login-submit-button"
                    type="submit"
                    className="w-full bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500">
                    {t('login_button')}
                </button>
                <p className="text-sm text-slate-400 text-center pt-4">
                    {t('login_noAccount')}{' '}
                    <button data-design-id="login-navigate-to-signup-link" type="button" onClick={onNavigateToSignUp} className="font-semibold text-emerald-400 hover:text-emerald-300">
                        {t('login_signUpLink')}
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;