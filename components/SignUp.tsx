import React, { useState, useRef, type FC } from 'react';
import { CITIES } from '../constants';
import { EyeIcon, EyeOffIcon, UserCircleIcon, CameraIcon } from './IconComponents';
import type { UserProfile } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface SignUpProps {
    onAccountCreated: (email: string) => void;
    onNavigateToLogin: () => void;
}

const SignUp: FC<SignUpProps> = ({ onAccountCreated, onNavigateToLogin }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        profilePicture: null as File | null,
        profilePicturePreview: null as string | null,
        fullName: '',
        age: '',
        sex: '',
        fitnessGoals: '',
        city: '',
        trainingLocations: [] as string[],
        medicalHistory: ''
    });
    const [errors, setErrors] = useState({ email: '', password: '', username: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentLocations = prev.trainingLocations;
            if (checked) {
                return { ...prev, trainingLocations: [...currentLocations, value] };
            } else {
                return { ...prev, trainingLocations: currentLocations.filter(loc => loc !== value) };
            }
        });
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                profilePicture: file,
                profilePicturePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleEmailPasswordContinue = () => {
        const newErrors = { email: '', password: '', username: '' };
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('signup_emailError');
        }
        if (formData.password.length < 6) {
            newErrors.password = t('signup_passwordError');
        }
        if (!formData.username.trim() || formData.username.length < 3) {
            newErrors.username = t('signup_usernameError_length');
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = t('signup_usernameError_format');
        }
        
        setErrors(newErrors);

        if (!newErrors.email && !newErrors.password && !newErrors.username) {
            nextStep();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newUser: UserProfile = {
            email: formData.email,
            username: formData.username,
            fullName: formData.fullName,
            photoUrl: formData.profilePicturePreview || `https://picsum.photos/seed/${formData.username}/200/200`,
            completedSessions: 0,
            earnedMedalIds: [],
            conversations: [],
            favoriteTrainerIds: [],
        };

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const userForStorage = {
            ...newUser,
            password: formData.password,
            fitnessGoals: formData.fitnessGoals,
            verified: false,
            verificationCode: verificationCode,
        };
        localStorage.setItem(`fasta_user_${formData.email}`, JSON.stringify(userForStorage));

        onAccountCreated(formData.email);
    };

    const ProgressIndicator = () => (
        <div className="flex items-center w-full max-w-lg mx-auto mb-10">
            <div data-design-id="signup-progress-step-1" className="flex items-center text-emerald-400 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-10 w-10 border-2 border-emerald-400 flex items-center justify-center font-bold">1</div>
                <div className="absolute top-0 -mx-10 text-center mt-16 w-32 text-xs font-medium uppercase text-emerald-400">{t('signup_progress_step1')}</div>
            </div>
            <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step > 1 ? 'border-emerald-400' : 'border-slate-700'}`}></div>
            <div data-design-id="signup-progress-step-2" className={`flex items-center relative ${step > 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                <div className={`rounded-full transition duration-500 ease-in-out h-10 w-10 border-2 flex items-center justify-center font-bold ${step > 1 ? 'border-emerald-400' : 'border-slate-700'}`}>2</div>
                 <div className="absolute top-0 -mx-10 text-center mt-16 w-32 text-xs font-medium uppercase">{t('signup_progress_step2')}</div>
            </div>
            <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step > 2 ? 'border-emerald-400' : 'border-slate-700'}`}></div>
            <div data-design-id="signup-progress-step-3" className={`flex items-center relative ${step > 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                <div className={`rounded-full transition duration-500 ease-in-out h-10 w-10 border-2 flex items-center justify-center font-bold ${step > 2 ? 'border-emerald-400' : 'border-slate-700'}`}>3</div>
                 <div className="absolute top-0 -mx-10 text-center mt-16 w-32 text-xs font-medium uppercase">{t('signup_progress_step3')}</div>
            </div>
        </div>
    );

    const trainingLocationsOptions = [
        { key: t('signup_locationAtHome'), value: 'At Home' },
        { key: t('signup_locationGym'), value: 'Gym' },
        { key: t('signup_locationPark'), value: 'Park' },
        { key: t('signup_locationOnline'), value: 'Online' }
    ];

    return (
        <div className="max-w-3xl mx-auto bg-slate-800/50 p-8 rounded-lg shadow-2xl border border-slate-700/50">
            <ProgressIndicator />
            
            <form onSubmit={handleSubmit} className="mt-20">
                {step === 1 && (
                    <div data-design-id="signup-step-1-container" className="space-y-6 animate-fade-in-down">
                        <h2 className="text-3xl font-bold text-white mb-2 text-center">{t('signup_createAccountTitle')}</h2>
                        <p className="text-slate-400 mb-8 text-center">{t('signup_step1_subtitle')}</p>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">{t('login_emailLabel')}</label>
                            <input data-design-id="signup-email-input" type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required 
                                className={`w-full bg-slate-700 border rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.email ? 'border-red-500 ring-red-500/50 animate-shake' : 'border-slate-600'}`} 
                                placeholder={t('login_emailPlaceholder')} />
                            {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                        </div>
                         <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">{t('signup_usernameLabel')}</label>
                            <div className="relative">
                               <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400">@</span>
                               <input data-design-id="signup-username-input" type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required
                                  className={`w-full bg-slate-700 border rounded-md py-2.5 ps-7 pe-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.username ? 'border-red-500 ring-red-500/50 animate-shake' : 'border-slate-600'}`}
                                  placeholder={t('signup_usernamePlaceholder')} />
                            </div>
                            {errors.username && <p className="text-red-400 text-xs mt-1.5">{errors.username}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">{t('login_passwordLabel')}</label>
                             <div className="relative">
                                <input data-design-id="signup-password-input" type={passwordVisible ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} required 
                                    className={`w-full bg-slate-700 border rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.password ? 'border-red-500 ring-red-500/50 animate-shake' : 'border-slate-600'}`} 
                                    placeholder={t('login_passwordPlaceholder')} />
                                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 end-0 pe-3 flex items-center text-slate-400 hover:text-white" title={passwordVisible ? t('common_hidePassword') : t('common_showPassword')}>
                                    {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1.5">{t('signup_passwordHelper')}</p>
                            {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
                        </div>
                         <button data-design-id="signup-step1-continue-button" type="button" onClick={handleEmailPasswordContinue} className="w-full bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500">
                            {t('signup_continue')}
                        </button>
                         <p className="text-sm text-slate-400 text-center pt-4">
                            {t('signup_haveAccount')}{' '}
                            <button data-design-id="signup-navigate-to-login-link" type="button" onClick={onNavigateToLogin} className="font-semibold text-emerald-400 hover:text-emerald-300">
                                {t('signup_loginLink')}
                            </button>
                        </p>
                    </div>
                )}
                
                {step === 2 && (
                    <div data-design-id="signup-step-2-container" className="space-y-6 animate-fade-in-down text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">{t('signup_step2_title')}</h2>
                        <p className="text-slate-400 mb-8">{t('signup_step2_subtitle')}</p>
                        
                        <div className="flex justify-center">
                            <div data-design-id="signup-profile-picture-upload" className="relative group">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                {formData.profilePicturePreview ? (
                                    <img
                                        src={formData.profilePicturePreview}
                                        alt="Profile Preview"
                                        className="w-48 h-48 rounded-full object-cover border-4 border-slate-700 group-hover:border-emerald-500 transition-all duration-300 cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    />
                                ) : (
                                    <div 
                                        className="w-48 h-48 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-700 group-hover:border-emerald-500 transition-all duration-300 cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <UserCircleIcon className="w-24 h-24 text-slate-500" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    title={t('signup_uploadPicture')}
                                    className="absolute bottom-2 end-2 bg-emerald-500 p-2 rounded-full text-white cursor-pointer group-hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <CameraIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                         <div className="flex items-center justify-between pt-4">
                             <button data-design-id="signup-step2-back-button" type="button" onClick={prevStep} className="text-slate-300 font-semibold py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                                {t('signup_back')}
                            </button>
                            <button data-design-id="signup-step2-continue-button" type="button" onClick={nextStep} className="bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500">
                                {formData.profilePicture ? t('signup_continue') : t('signup_skipContinue')}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div data-design-id="signup-step-3-container" className="space-y-6 animate-fade-in-down">
                        <h2 className="text-3xl font-bold text-white mb-2 text-center">{t('signup_step3_title')}</h2>
                        <p className="text-slate-400 mb-8 text-center">{t('signup_step3_subtitle')}</p>
                        
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">{t('signup_fullNameLabel')}</label>
                            <input data-design-id="signup-fullname-input" type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder={t('signup_fullNamePlaceholder')} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-2">{t('signup_ageLabel')}</label>
                                <input data-design-id="signup-age-input" type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} required min="16" max="100" className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder={t('signup_agePlaceholder')} />
                            </div>
                            <div>
                                <label htmlFor="sex" className="block text-sm font-medium text-slate-300 mb-2">{t('signup_sexLabel')}</label>
                                <select data-design-id="signup-sex-select" id="sex" name="sex" value={formData.sex} onChange={handleInputChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                    <option value="">{t('signup_sexSelect')}</option>
                                    <option value="Male">{t('signup_sexMale')}</option>
                                    <option value="Female">{t('signup_sexFemale')}</option>
                                    <option value="Other">{t('signup_sexOther')}</option>
                                    <option value="Prefer not to say">{t('signup_sexPreferNotToSay')}</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="fitnessGoals" className="block text-sm font-medium text-slate-300 mb-2">{t('signup_goalsLabel')}</label>
                            <textarea data-design-id="signup-goals-textarea" id="fitnessGoals" name="fitnessGoals" value={formData.fitnessGoals} onChange={handleInputChange} required rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder={t('signup_goalsPlaceholder')}></textarea>
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-2">{t('signup_cityLabel')}</label>
                            <select data-design-id="signup-city-select" id="city" name="city" value={formData.city} onChange={handleInputChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                <option value="">{t('signup_citySelect')}</option>
                                {CITIES.sort().map(city => <option key={city} value={city}>{city}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">{t('signup_locationsLabel')}</label>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                                {trainingLocationsOptions.map(location => (
                                    <label data-design-id={`signup-training-location-checkbox-${location.value}`} key={location.value} className="flex items-center space-x-3 bg-slate-700/50 p-3 rounded-md hover:bg-slate-700 transition cursor-pointer">
                                        <input type="checkbox" value={location.value} checked={formData.trainingLocations.includes(location.value)} onChange={handleCheckboxChange} className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800"/>
                                        <span className="text-slate-300 font-medium">{location.key}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="medicalHistory" className="block text-sm font-medium text-slate-300 mb-2">{t('signup_medicalLabel')}</label>
                             <p className="text-xs text-slate-500 mb-2">{t('signup_medicalSublabel')}</p>
                            <textarea data-design-id="signup-medical-history-textarea" id="medicalHistory" name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder={t('signup_medicalPlaceholder')}></textarea>
                        </div>

                         <div className="flex items-center justify-between pt-4">
                             <button data-design-id="signup-step3-back-button" type="button" onClick={prevStep} className="text-slate-300 font-semibold py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                                {t('signup_back')}
                            </button>
                            <button data-design-id="signup-submit-button" type="submit" className="bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500">
                                {t('signup_submitButton')}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default SignUp;