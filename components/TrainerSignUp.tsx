
import React, { useState, useRef, type FC } from 'react';
import { ISRAELI_CITIES } from '../constants';
import { Specialty } from '../types';
import { EyeIcon, EyeOffIcon, UserCircleIcon, CameraIcon, LinkIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';


const TrainerSignUp: FC = () => {
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

    const nextStep