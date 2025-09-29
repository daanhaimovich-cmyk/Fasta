import React, { useState, useEffect, useRef, type FC } from 'react';
import type { Trainer } from '../types';
import { XIcon, CreditCardIcon, LockClosedIcon, BitIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface PaymentModalProps {
  trainer: Trainer;
  bookingDetails: { date: string; time: string };
  onClose: () => void;
  onPaymentSuccess: () => void;
}

// A public test key should be used here.
// In a real application, this would come from an environment variable.
const STRIPE_PUBLIC_KEY = 'pk_test_51PbiPzRxt9145dyoTxlfe2YCVb013G1xG8uARfL7zRVx0k3ePSDt2d4s28o9d4w3RHp59w8lJ10L3bL5D3I3d2Ua00bJ1D9Fh9';

const cardElementStyle = {
  base: {
    color: '#e2e8f0', // slate-200
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#64748b' // slate-500
    }
  },
  invalid: {
    color: '#f87171', // red-400
    iconColor: '#f87171'
  }
};

const PaymentModal: FC<PaymentModalProps> = ({ trainer, bookingDetails, onClose, onPaymentSuccess }) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bit'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const stripeRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);
  const cardElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paymentMethod === 'card' && !stripeRef.current) {
      if (window.Stripe) {
        stripeRef.current = window.Stripe(STRIPE_PUBLIC_KEY);
        elementsRef.current = stripeRef.current.elements();
        
        const cardElement = elementsRef.current.create('card', { style: cardElementStyle });
        
        if (cardElementRef.current) {
          cardElement.mount(cardElementRef.current);
          cardElement.on('change', (event: any) => {
            if (event.error) {
              setStripeError(event.error.message);
            } else {
              setStripeError(null);
            }
          });
        }
      } else {
        console.error("Stripe.js has not loaded yet.");
      }
    }
  }, [paymentMethod]);

  const handleCardPayment = async () => {
    if (!stripeRef.current || !elementsRef.current) {
        console.error("Stripe has not initialized.");
        return;
    }
    
    setIsProcessing(true);
    setStripeError(null);

    const cardElement = elementsRef.current.getElement('card');

    const { error, paymentMethod } = await stripeRef.current.createPaymentMethod({
        type: 'card',
        card: cardElement,
    });

    if (error) {
        setStripeError(error.message);
        setIsProcessing(false);
    } else {
        // In a real application, you would send paymentMethod.id to your server
        // to confirm the payment. Here, we'll simulate success.
        console.log('Stripe PaymentMethod created:', paymentMethod);
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess();
        }, 1500);
    }
  };

  const handleBitPayment = () => {
      setIsProcessing(true);
      // Simulate confirming payment after user has scanned
      setTimeout(() => {
          setIsProcessing(false);
          onPaymentSuccess();
      }, 1500);
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      handleCardPayment();
    } else {
      handleBitPayment();
    }
  };

  const locale = 'en-US';
  const formattedDate = new Date(bookingDetails.date).toLocaleDateString(locale, {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
  
  const qrData = encodeURIComponent(`FASTA Payment to ${trainer.name} for ₪${trainer.hourlyRate}`);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}&bgcolor=0f172a&color=e2e8f0&qzone=1`;


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
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label={t('common_close')} title={t('common_close')}>
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
            <div className="mt-6 space-y-4 animate-fade-in-down">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('paymentModal_card_numberLabel')}</label>
                    <div className="bg-slate-700 border border-slate-600 rounded-md py-3 px-4 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                        <div ref={cardElementRef}></div>
                    </div>
                    {stripeError && <p className="text-red-400 text-xs mt-1.5">{stripeError}</p>}
                </div>
                 <p className="text-xs text-slate-500 flex items-center justify-center gap-2 pt-2">
                    <LockClosedIcon className="w-4 h-4" /> {t('paymentModal_card_secure')}
                </p>
            </div>
          ) : (
             <div className="mt-6 text-center py-4 px-4 animate-fade-in-down">
                <h3 className="text-lg font-semibold text-white">{t('paymentModal_bit_title')}</h3>
                <p className="text-slate-400 mt-2 text-sm">{t('paymentModal_bit_subtitle')}</p>
                 <div className="flex justify-center my-4">
                     <div className="bg-slate-900 p-2 rounded-lg border border-slate-700">
                       <img src={qrCodeUrl} alt="QR Code for Bit payment" className="w-40 h-40" />
                     </div>
                </div>
                <p className="text-xs text-slate-500 flex items-center justify-center gap-2 mt-6">
                    <LockClosedIcon className="w-4 h-4" /> {t('paymentModal_bit_secure')}
                </p>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-900/50 mt-auto rounded-b-2xl border-t border-slate-700">
          <button
            onClick={handleSubmit}
            disabled={isProcessing || (paymentMethod === 'card' && !!stripeError)}
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
                paymentMethod === 'card' ? t('paymentModal_submitButton_card', { rate: trainer.hourlyRate }) : t('paymentModal_submitButton_bit_confirm')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;