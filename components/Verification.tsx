import React, { useState, useRef, useEffect, type FC } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface VerificationProps {
    email: string | null;
    onSuccess: (email: string) => void;
    onResendCode: (email: string) => void;
}

const Verification: FC<VerificationProps> = ({ email, onSuccess, onResendCode }) => {
    const { t } = useTranslation();
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Automatically focus the first input on component mount
        inputRefs.current[0]?.focus();
    }, []);

    if (!email) {
        // This should ideally not happen if the flow is correct, but it's a good safeguard.
        return null; 
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (!/^[0-9]*$/.test(value)) return; // Only allow numbers

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Ensure only one character per input
        setCode(newCode);

        // Move to next input if a digit is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        if (/^[0-9]{6}$/.test(pastedData)) {
            const newCode = pastedData.split('');
            setCode(newCode);
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const fullCode = code.join('');

        if (fullCode.length !== 6) {
            setError(t('verification_error_invalid'));
            return;
        }

        const storedUserRaw = localStorage.getItem(`fasta_user_${email}`);
        if (storedUserRaw) {
            const user = JSON.parse(storedUserRaw);
            if (user.verificationCode === fullCode) {
                onSuccess(email);
            } else {
                setError(t('verification_error_invalid'));
                inputRefs.current[0]?.focus();
            }
        } else {
            setError(t('verification_error_noAccount'));
        }
    };

    const handleResend = () => {
        onResendCode(email);
        setCode(Array(6).fill(''));
        setError('');
        inputRefs.current[0]?.focus();
    };

    return (
        <div className="max-w-md mx-auto bg-slate-800/50 p-8 rounded-lg shadow-2xl border border-slate-700/50 animate-fade-in-down">
            <h2 data-design-id="verification-title" className="text-3xl font-bold text-white mb-2 text-center">{t('verification_title')}</h2>
            <p data-design-id="verification-subtitle" className="text-slate-400 mb-8 text-center">
                {t('verification_subtitle')} <strong className="text-slate-200">{email}</strong>.
            </p>
            <form onSubmit={handleVerify} className="space-y-6">
                <div>
                    <label htmlFor="verification-code-0" className="block text-sm font-medium text-slate-300 mb-2 sr-only">{t('verification_codeLabel')}</label>
                     <div className="flex justify-center gap-2 md:gap-3" onPaste={handlePaste}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                id={`verification-code-${index}`}
                                // FIX: Use a block body for the ref callback to ensure it returns void. The assignment in an arrow function with parentheses causes an implicit return, which is not allowed for refs.
                                ref={el => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(e, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                required
                                className={`w-12 h-14 md:w-14 md:h-16 text-center text-3xl font-bold bg-slate-700 border rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition ${error ? 'border-red-500 animate-shake' : 'border-slate-600'}`}
                            />
                        ))}
                    </div>
                </div>
                
                {error && <p className="text-red-400 text-sm text-center -my-2">{error}</p>}

                <button 
                    data-design-id="verification-submit-button"
                    type="submit"
                    className="w-full bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500">
                    {t('verification_button')}
                </button>
                <p className="text-sm text-slate-400 text-center pt-4">
                    {t('verification_resend_prompt')}{' '}
                    <button data-design-id="verification-resend-button" type="button" onClick={handleResend} className="font-semibold text-emerald-400 hover:text-emerald-300">
                        {t('verification_resend_button')}
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Verification;