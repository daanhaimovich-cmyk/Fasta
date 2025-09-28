

import React, { useState, useRef } from 'react';
import { ISRAELI_CITIES } from '../constants';
import { Specialty } from '../types';
import { EyeIcon, EyeOffIcon, UserCircleIcon, CameraIcon, LinkIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';


const TrainerSignUp: React.FC = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        profilePicture: null as File | null,
        profilePicturePreview: null as string | null,
        fullName: '',
        age: '',
        city: '',
        experience: '',
        bio: '',
        certifications: '',
        specialties: [] as Specialty[],
        trainingLocations: [] as string[],
        agendaLink: ''
    });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [submitted, setSubmitted] = useState(false);
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

    const handleSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target as { value: Specialty, checked: boolean };
        setFormData(prev => {
            const currentSpecialties = prev.specialties;
            if (checked) {
                if (currentSpecialties.length < 3) {
                    return { ...prev, specialties: [...currentSpecialties, value] };
                }
                return prev;
            } else {
                return { ...prev, specialties: currentSpecialties.filter(spec => spec !== value) };
            }
        });
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const newErrors = { email: '', password: '' };
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('login_error');
        }
        if (formData.password.length < 6) {
            newErrors.password = t('signup_passwordHelper');
        }
        
        setErrors(newErrors);

        if (!newErrors.email && !newErrors.password) {
            nextStep();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Trainer Form Submitted:', formData);
        setSubmitted(true);
    };
    
    const trainingLocationsOptions = [
        { key: t('signup_locationGym'), value: 'Gym' },
        { key: t('signup_locationPark'), value: 'Park' },
        { key: t('signup_locationAtHome'), value: 'At Home' },
        { key: t('trainerSignup_locationClientsHome'), value: "Client's Home" }
    ];

    if (submitted) {
        return (
            <div className="max-w-3xl mx-auto bg-slate-800/50 p-8 rounded-lg shadow-2xl text-center">
                 <h2 className="text-3xl font-bold text-white mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                        {t('trainerSignup_successTitle', { name: formData.fullName })}
                    </span>
                </h2>
                <p className="text-slate-300 text-lg">{t('trainerSignup_successSubtitle')}</p>
                <p className="text-slate-400 mt-2">{t('trainerSignup_successInfo')}</p>
                <button 
                    onClick={() => { setSubmitted(false); setStep(1); setFormData({
                        email: '', password: '', profilePicture: null, profilePicturePreview: null, fullName: '', age: '', city: '',
                        experience: '', bio: '', certifications: '', specialties: [], trainingLocations: [], agendaLink: ''
                    }); }}
                    className="mt-8 px-6 py-2.5 text-sm font-semibold bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
                >
                    {t('trainerSignup_successButton')}
                </button>
            </div>
        );
    }

    const ProgressIndicator = () => (
        <div className="flex items-center w-full max-w-lg mx-auto mb-10">
            <div className="flex items-center text-emerald-400 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-10 w-10 border-2 border-emerald-400 flex items-center justify-center font-bold">1</div>
                <div className="absolute top-0 -mx-10 text-center mt-16 w-32 text-xs font-medium uppercase text-emerald-400">{t('signup_progress_step1')}</div>
            </div>
            <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step > 1 ? 'border-emerald-400' : 'border-slate-700'}`}></div>
            <div className={`flex items-center relative ${step > 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                <div className={`rounded-full transition duration-500 ease-in-out h-10 w-10 border-2 flex items-center justify-center font-bold ${step > 1 ? 'border-emerald-400' : 'border-slate-700'}`}>2</div>
                 <div className="absolute top-0 -mx-10 text-center mt-16 w-32 text-xs font-medium uppercase">{t('signup_progress_step2')}</div>
            </div>
            <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step > 2 ? 'border-emerald-400' : 'border-slate-700'}`}></div>
            <div className={`flex items-center relative ${step > 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                <div className={`rounded-full transition duration-500 ease-in-out h-10 w-10 border-2 flex items-center justify-center font-bold ${step > 2 ? 'border-emerald-400' : 'border-slate-700'}`}>3</div>
                 <div className="absolute top-0 -mx-10 text-center mt-16 w-32 text-xs font-medium uppercase">{t('signup_progress_step3')}</div>
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto bg-slate-800/50 p-8 rounded-lg shadow-2xl border border-slate-700/50">
            <ProgressIndicator />
            
            <form onSubmit={handleSubmit} className="mt-20">
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in-down">
                        <h2 className="text-3xl font-bold text-white mb-2 text-center">{t('trainerSignup_title')}</h2>
                        <p className="text-slate-400 mb-8 text-center">{t('trainerSignup_subtitle')}</p>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">{t('login_emailLabel')}</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required 
                                className={`w-full bg-slate-700 border rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.email ? 'border-red-500 ring-red-500/50 animate-shake' : 'border-slate-600'}`} 
                                placeholder={t('login_emailPlaceholder')} />
                            {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">{t('login_passwordLabel')}</label>
                             <div className="relative">
                                <input type={passwordVisible ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} required 
                                    className={`w-full bg-slate-700 border rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.password ? 'border-red-500 ring-red-500/50 animate-shake' : 'border-slate-600'}`} 
                                    placeholder={t('login_passwordPlaceholder')} />
                                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 end-0 pe-3 flex items-center text-slate-400 hover:text-white">
                                    {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1.5">{t('signup_passwordHelper')}</p>
                            {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
                        </div>
                         <button type="button" onClick={handleEmailPasswordContinue} className="w-full bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500">
                            {t('signup_continue')}
                        </button>
                    </div>
                )}
                
                {step === 2 && (
                    <div className="space-y-6 animate-fade-in-down text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">{t('trainerSignup_step2_title')}</h2>
                        <p className="text-slate-400 mb-8">{t('trainerSignup_step2_subtitle')}</p>
                        <div className="flex justify-center">
                            <div className="relative group">
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                                {formData.profilePicturePreview ? (
                                    <img src={formData.profilePicturePreview} alt="Profile Preview" className="w-48 h-48 rounded-full object-cover border-4 border-slate-700 group-hover:border-emerald-500 transition-all duration-300 cursor-pointer" onClick={() => fileInputRef.current?.click()} />
                                ) : (
                                    <div className="w-48 h-48 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-700 group-hover:border-emerald-500 transition-all duration-300 cursor-pointer" onClick={() => fileInputRef.current?.click()} >
                                        <UserCircleIcon className="w-24 h-24 text-slate-500" />
                                    </div>
                                )}
                                <div className="absolute bottom-2 end-2 bg-emerald-500 p-2 rounded-full text-white cursor-pointer group-hover:scale-110 transition-transform" onClick={() => fileInputRef.current?.click()} >
                                    <CameraIcon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                         <div className="flex items-center justify-between pt-4">
                             <button type="button" onClick={prevStep} className="text-slate-300 font-semibold py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                                {t('signup_back')}
                            </button>
                            <button type="button" onClick={nextStep} className="bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500">
                                {formData.profilePicture ? t('signup_continue') : t('signup_skipContinue')}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-fade-in-down">
                        <h2 className="text-3xl font-bold text-white mb-2 text-center">{t('trainerSignup_step3_title')}</h2>
                        <p className="text-slate-400 mb-8 text-center">{t('trainerSignup_step3_subtitle')}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">{t('signup_fullNameLabel')}</label>
                                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder={t('signup_fullNamePlaceholder')} />
                            </div>
                             <div>
                                <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-2">{t('signup_ageLabel')}</label>
                                <input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} required min="18" max="100" className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder={t('signup_agePlaceholder')} />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-2">{t('signup_cityLabel')}</label>
                                <select id="city" name="city" value={formData.city} onChange={handleInputChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                    <option value="">{t('signup_citySelect')}</option>
                                    {ISRAELI_CITIES.sort().map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-slate-300 mb-2">{t('trainerSignup_experienceLabel')}</label>
                                <input type="number" id="experience" name="experience" value={formData.experience} onChange={handleInputChange} required min="0" className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder={t('trainerSignup_experiencePlaceholder')} />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">{t('trainerSignup_specialtiesLabel')}</label>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                                {Object.values(Specialty).map(spec => (
                                    <label key={spec} className={`flex items-center space-x-3 rtl:space-x-reverse bg-slate-700/50 p-3 rounded-md transition ${formData.specialties.length >= 3 && !formData.specialties.includes(spec) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700 cursor-pointer'}`}>
                                        <input type="checkbox" value={spec} checked={formData.specialties.includes(spec)} onChange={handleSpecialtyChange} disabled={formData.specialties.length >= 3 && !formData.specialties.includes(spec)} className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800"/>
                                        <span className="text-slate-300 font-medium">{t(`specialty_${spec}`)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">{t('trainerSignup_locationsLabel')}</label>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                                {trainingLocationsOptions.map(location => (
                                    <label key={location.value} className="flex items-center space-x-3 rtl:space-x-reverse bg-slate-700/50 p-3 rounded-md hover:bg-slate-700 transition cursor-pointer">
                                        <input type="checkbox" value={location.value} checked={formData.trainingLocations.includes(location.value)} onChange={handleLocationChange} className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800"/>
                                        <span className="text-slate-300 font-medium">{location.key}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">{t('trainerSignup_bioLabel')}</label>
                            <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} required rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder={t('trainerSignup_bioPlaceholder')}></textarea>
                        </div>
                        
                        <div>
                            <label htmlFor="certifications" className="block text-sm font-medium text-slate-300 mb-2">{t('trainerSignup_certificationsLabel')}</label>
                            <textarea id="certifications" name="certifications" value={formData.certifications} onChange={handleInputChange} required rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder={t('trainerSignup_certificationsPlaceholder')}></textarea>
                        </div>
                        
                        <div>
                            <label htmlFor="agendaLink" className="block text-sm font-medium text-slate-300 mb-2">{t('trainerSignup_agendaLabel')}</label>
                             <div className="relative">
                                <LinkIcon className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="url" id="agendaLink" name="agendaLink" value={formData.agendaLink} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 ps-10 pe-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder={t('trainerSignup_agendaPlaceholder')} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                             <button type="button" onClick={prevStep} className="text-slate-300 font-semibold py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                                {t('signup_back')}
                            </button>
                            <button type="submit" className="bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500">
                                {t('trainerSignup_submitButton')}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default TrainerSignUp;