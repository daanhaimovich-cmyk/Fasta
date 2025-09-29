import React, { useState, type FC } from 'react';
import type { Trainer, UserProfile, Review } from '../types';
import { XIcon, StarIcon, ChatBubbleIcon, ShareIcon, CalendarDaysIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

interface TrainerProfileModalProps {
  trainer: Trainer;
  onClose: () => void;
  currentUser: UserProfile | null;
  onReviewSubmit: (trainerId: number, reviewData: { rating: number; comment: string }) => void;
  onMessageTrainer: (trainer: Trainer) => void;
  onBookSession: (trainer: Trainer) => void;
}

const TrainerProfileModal: FC<TrainerProfileModalProps> = ({ 
  trainer, 
  onClose, 
  currentUser, 
  onReviewSubmit,
  onMessageTrainer,
  onBookSession,
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const trainerFirstName = trainer.name.split(' ')[0];

  const avgRating = trainer.reviews.length > 0
    ? trainer.reviews.reduce((acc, review) => acc + review.rating, 0) / trainer.reviews.length
    : 0;
    
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?trainerId=${trainer.id}`;
    const shareData = {
        title: `Check out ${trainer.name} on FASTA`,
        text: `I found this great trainer, ${trainer.name}, on FASTA. Check out their profile!`,
        url: shareUrl,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Error sharing:', err);
        }
    } else {
        // Fallback for desktop browsers
        navigator.clipboard.writeText(shareUrl).then(() => {
            addToast("Profile link copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy link:', err);
            addToast("Failed to copy link.");
        });
    }
  };

  const handleMessageClick = () => {
      onClose(); // Close this modal first
      onMessageTrainer(trainer);
  };
  
  const handleBookClick = () => {
      if (!currentUser) return;
      onClose(); // Close this modal first
      onBookSession(trainer);
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating > 0 && newComment.trim() !== '') {
      onReviewSubmit(trainer.id, { rating: newRating, comment: newComment });
      setNewRating(0);
      setNewComment('');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto text-slate-200 border border-slate-700 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex flex-col items-start justify-between sticky top-0 bg-slate-800 rounded-t-2xl">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-5">
              <img src={trainer.photoUrl} alt={trainer.name} className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500" />
              <div>
                <h2 id="profile-modal-title" className="text-3xl font-bold text-white">{trainer.name}</h2>
                <div className="flex items-center text-slate-400 mt-1 space-x-4 text-sm">
                  <span>{trainer.location}</span>
                  {trainer.isOnline && <span className="text-emerald-400 font-semibold">{t('trainerCard_online')}</span>}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {trainer.specialties.map(spec => (
                    <span key={spec} className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-full">
                      {t(`specialty_${spec}`)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label={t('common_close')} title={t('common_close')}>
              <XIcon />
            </button>
          </div>
           {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
              <button 
                  onClick={handleMessageClick} 
                  disabled={!currentUser}
                  title={!currentUser ? t('shareProfile_loginToMessage') : t('trainerCard_messageTrainer')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20 disabled:bg-slate-600 disabled:cursor-not-allowed">
                  <ChatBubbleIcon className="w-5 h-5" />
                  <span>{t('trainerCard_messageTrainer')}</span>
              </button>
              <button 
                  onClick={handleBookClick} 
                  disabled={!currentUser}
                  title={!currentUser ? t('shareProfile_loginToBook') : t('messages_bookSession')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                  <CalendarDaysIcon className="w-5 h-5" />
                  <span>{t('messages_bookSession')}</span>
              </button>
              <button onClick={handleShare} title={t('shareProfile_button')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors">
                  <ShareIcon className="w-5 h-5" />
                  <span>{t('shareProfile_button')}</span>
              </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Bio */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">{t('profileModal_about', { name: trainerFirstName })}</h3>
            <p className="text-slate-300 whitespace-pre-wrap">{trainer.bio}</p>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-semibold text-white">{t('profileModal_reviews')}</h3>
              <div className="flex items-center bg-slate-700/50 px-2.5 py-1 rounded-md">
                <StarIcon filled className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white ms-1.5">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-slate-400 ms-1.5">{t('profileModal_reviewsCount', { count: trainer.reviews.length })}</span>
              </div>
            </div>

            {/* Leave a Review Form */}
            {currentUser && (
              <form onSubmit={handleReviewSubmit} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-6">
                <h4 className="font-semibold text-white mb-3">{t('profileModal_leaveReview')}</h4>
                <div className="flex items-center mb-3">
                  <span className="text-slate-300 me-3">{t('profileModal_yourRating')}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setNewRating(star)}
                        className="focus:outline-none"
                        title={t('profileModal_rate', { count: star })}
                      >
                        <StarIcon
                          filled={(hoverRating || newRating) >= star}
                          className="w-6 h-6 transition-colors"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('profileModal_commentPlaceholder')}
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  required
                />
                <div className="text-end mt-3">
                  <button
                    type="submit"
                    disabled={!newRating || !newComment}
                    className="px-5 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {t('profileModal_submitReview')}
                  </button>
                </div>
              </form>
            )}

            {/* Existing Reviews */}
            <div className="space-y-5 max-h-60 pe-2 -me-2 overflow-y-auto">
              {trainer.reviews.length > 0 ? (
                trainer.reviews.slice().reverse().map(review => (
                  <div key={review.id} className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-emerald-400 flex-shrink-0">
                      {review.author.charAt(1).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-white">{review.author}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} filled={i < review.rating} className="w-4 h-4" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 mt-1">{review.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                    <ChatBubbleIcon className="w-10 h-10 mx-auto mb-2 text-slate-500" />
                    <p>{t('profileModal_noReviews', { name: trainerFirstName })}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfileModal;