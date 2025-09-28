



import React, { useState, type FC } from 'react';
import type { Trainer } from '../types';
import { XIcon, CreditCardIcon, LockClosedIcon, BitIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface PaymentModalProps {
  trainer: Trainer;
  bookingDetails: { date: string; time: string };
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: FC<PaymentModalProps> = ({ trainer, bookingDetails, onClose, onPaymentSuccess }) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bit'>('card');
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: ''
  });
  const [errors, setErrors] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1 / $2');
      if (formattedValue.length > 7) return;
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3) return;
    }

    setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = { name: '', number: '', expiry: '', cvc: '' };
    let isValid = true;

    if (!cardDetails.name.trim()) {
      newErrors.name = t('paymentModal_card_error_name');
      isValid = false;
    }
    if (cardDetails.number.length !== 19) {
      newErrors.number = t('paymentModal_card_error_number');
      isValid = false;
    }
    if (!/^(0[1-9]|1[0-2])\s\/\s\d{2}$/.test(cardDetails.expiry)) {
      newErrors.expiry = t('paymentModal_card_error_expiry');
      isValid = false;
    }
    if (cardDetails.cvc.length !== 3) {
      newErrors.cvc = t('paymentModal_card_error_cvc');
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      if (!validateForm()) {
          return;
      }
    }
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1500);
  };

  const locale = 'en-US';
  const formattedDate = new Date(bookingDetails.date).toLocaleDateString(locale, {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
  });

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-down"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto text-slate-200 border border-slate-700 max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between pb-4 border-b border-slate-700">
            <div>
              <h2 id="payment-modal-title" className="text-2xl font-bold text-white">{t('paymentModal_title')}</h2>
              <p className="text-slate-400 text-sm">{t('paymentModal_subtitle', { name: trainer.name })}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close modal">
              <XIcon />
            </button>
          </div>

          <div className="text-start bg-slate-900/50 p-4 rounded-lg mt-6 border border-slate-700 space-y-2">
             <div className="flex justify-between items-center">
                <span className="text-slate-400">{t('paymentModal_details_dateTime')}</span>
                <span className="font-semibold text-white">{formattedDate}, {bookingDetails.time}</span>
             </div>
             <div className="flex justify-between items-center text-lg">
                <span className="text-slate-300">{t('paymentModal_details_total')}</span>
                <span className="font-bold text-emerald-400">₪{trainer.hourlyRate}</span>
             </div>
          </div>
          
           {/* Payment Method Tabs */}
          <div className="mt-6 flex border-b border-slate-700">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${paymentMethod === 'card' ? 'border-b-2 border-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <CreditCardIcon className="w-5 h-5" />
              {t('paymentModal_tab_card')}
            </button>
            <button
              onClick={() => setPaymentMethod('bit')}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${paymentMethod === 'bit' ? 'border-b-2 border-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <BitIcon className="w-5 h-5" />
              {t('paymentModal_tab_bit')}
            </button>
          </div>

          {paymentMethod === 'card' ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 animate-fade-in-down">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">{t('paymentModal_card_nameLabel')}</label>
                  <input type="text" id="name" name="name" value={cardDetails.name} onChange={handleInputChange} className={`w-full bg-slate-700 border rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:border-emerald-500 transition ${errors.name ? 'border-red-500 ring-red-500/50' : 'border-slate-600 focus:ring-emerald-500'}`} placeholder={t('paymentModal_card_namePlaceholder')} />
                  {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-slate-300 mb-2">{t('paymentModal_card_numberLabel')}</label>
                  <div className="relative">
                    <CreditCardIcon className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" id="number" name="number" value={cardDetails.number} onChange={handleInputChange} className={`w-full bg-slate-700 border rounded-md py-2.5 ps-10 pe-4 text-white placeholder-slate-400 focus:ring-2 focus:border-emerald-500 transition ${errors.number ? 'border-red-500 ring-red-500/50' : 'border-slate-600 focus:ring-emerald-500'}`} placeholder={t('paymentModal_card_numberPlaceholder')} />
                  </div>
                  {errors.number && <p className="text-red-400 text-xs mt-1.5">{errors.number}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-slate-300 mb-2">{t('paymentModal_card_expiryLabel')}</label>
                    <input type="text" id="expiry" name="expiry" value={cardDetails.expiry} onChange={handleInputChange} className={`w-full bg-slate-700 border rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:border-emerald-500 transition ${errors.expiry ? 'border-red-500 ring-red-500/50' : 'border-slate-600 focus:ring-emerald-500'}`} placeholder={t('paymentModal_card_expiryPlaceholder')} />
                    {errors.expiry && <p className="text-red-400 text-xs mt-1.5">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-slate-300 mb-2">{t('paymentModal_card_cvcLabel')}</label>
                    <input type="text" id="cvc" name="cvc" value={cardDetails.cvc} onChange={handleInputChange} className={`w-full bg-slate-700 border rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:border-emerald-500 transition ${errors.cvc ? 'border-red-500 ring-red-500/50' : 'border-slate-600 focus:ring-emerald-500'}`} placeholder={t('paymentModal_card_cvcPlaceholder')} />
                    {errors.cvc && <p className="text-red-400 text-xs mt-1.5">{errors.cvc}</p>}
                  </div>
                </div>
                <p className="text-xs text-slate-500 flex items-center justify-center gap-2 pt-2">
                    <LockClosedIcon className="w-4 h-4" /> {t('paymentModal_card_secure')}
                </p>
            </form>
          ) : (
             <div className="mt-6 text-center py-8 px-4 animate-fade-in-down">
                <div className="flex justify-center mb-4">
                    <BitIcon className="w-16 h-16" />
                </div>
                <h3 className="text-lg font-semibold text-white">{t('paymentModal_bit_title')}</h3>
                <p className="text-slate-400 mt-2 text-sm">{t('paymentModal_bit_subtitle', { amount: trainer.hourlyRate })}</p>
                <p className="text-xs text-slate-500 flex items-center justify-center gap-2 mt-6">
                    <LockClosedIcon className="w-4 h-4" /> {t('paymentModal_bit_secure')}
                </p>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-900/50 mt-auto rounded-b-2xl border-t border-slate-700">
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-md shadow-emerald-500/20 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center"
          >
            {isProcessing ? (
                <>
                    <svg className="animate-spin -ms-1 me-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('paymentModal_submitButton_processing')}
                </>
            ) : (
                paymentMethod === 'card' ? t('paymentModal_submitButton_card', { rate: trainer.hourlyRate }) : t('paymentModal_submitButton_bit')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;