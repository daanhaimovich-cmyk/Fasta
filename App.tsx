

import React, { useState, useEffect, useMemo, useCallback, type FC } from 'react';
import Header from './components/Header';
import SignUp from './components/SignUp';
import TrainerSignUp from './components/TrainerSignUp';
import Login from './components/Login';
import TrainerDiscovery from './components/TrainerDiscovery';
import TrainerProfileModal from './components/TrainerProfileModal';
import BookingModal from './components/BookingModal';
import PaymentModal from './components/PaymentModal';
import BookingConfirmationModal from './components/BookingConfirmationModal';
import Dashboard from './components/Dashboard';
import MedalUnlockedModal from './components/MedalUnlockedModal';
import MessagingCenter from './components/MessagingCenter';
import About from './components/About';
import { MOCK_TRAINERS, MOCK_CONVERSATIONS, MOCK_USERS } from './constants';
import { ALL_MEDALS } from './medals';
import type { Trainer, Review, UserProfile, Booking, Medal, Conversation, Message, Participant } from './types';
import { useTranslation } from './contexts/LanguageContext';


export type View = 'discovery' | 'client-signup' | 'trainer-signup' | 'login' | 'dashboard' | 'messages' | 'about';

interface PendingBooking {
    trainer: Trainer;
    details: { date: string; time: string; message: string };
}

const App: FC = () => {
  const [view, setView] = useState<View>('discovery');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [trainerToBook, setTrainerToBook] = useState<Trainer | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>(MOCK_TRAINERS);
  const [selectedTrainerProfile, setSelectedTrainerProfile] = useState<Trainer | null>(null);
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [newlyUnlockedMedal, setNewlyUnlockedMedal] = useState<Medal | null>(null);
  
  // Messaging State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // This is a one-time mock data setup for demonstration
    if (!localStorage.getItem('fasta_conversations_initialized')) {
      localStorage.setItem('fasta_conversations', JSON.stringify(MOCK_CONVERSATIONS));
      
      // Mock users for login demo
      const mockUsersArray: UserProfile[] = Object.values(MOCK_USERS);
      mockUsersArray.forEach(u => {
        const userForStorage = { ...u, password: 'password123' };
        localStorage.setItem(`fasta_user_${u.email}`, JSON.stringify(userForStorage));
      });
      localStorage.setItem('fasta_conversations_initialized', 'true');
    }

    try {
        const allConversations = JSON.parse(localStorage.getItem('fasta_conversations') || '[]');
        setConversations(allConversations);
    } catch (error) {
        console.error("Failed to parse conversations from localStorage", error);
        localStorage.removeItem('fasta_conversations'); // Clear corrupted data
    }


    const loggedInUserLocal = localStorage.getItem('fasta_user');
    if (loggedInUserLocal) {
        try {
            const userData = JSON.parse(loggedInUserLocal);
            if (typeof userData === 'object' && userData !== null && userData.email) {
                handleLoginSuccess(userData, true, false);
                return;
            }
            throw new Error('Invalid user data structure in localStorage');
        } catch (error) {
            console.error("Failed to process user from localStorage", error);
            localStorage.removeItem('fasta_user'); // Clear corrupted data
        }
    }

    const loggedInUserSession = sessionStorage.getItem('fasta_user');
    if (loggedInUserSession) {
        try {
            const userData = JSON.parse(loggedInUserSession);
            if (typeof userData === 'object' && userData !== null && userData.email) {
                handleLoginSuccess(userData, false, false);
            } else {
                throw new Error('Invalid user data structure in sessionStorage');
            }
        } catch (error) {
            console.error("Failed to process user from sessionStorage", error);
            sessionStorage.removeItem('fasta_user'); // Clear corrupted data
        }
    }
  }, []);
  
  useEffect(() => {
    // Persist conversations to local storage whenever they change
    if (conversations.length > 0) {
      localStorage.setItem('fasta_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // This effect ensures any change to the user's profile is saved to their permanent record.
  useEffect(() => {
    if (user) {
        // Persist changes to the main user account record (which includes the password)
        const userAccountKey = `fasta_user_${user.email}`;
        try {
            const storedAccountRaw = localStorage.getItem(userAccountKey);
            // Start with the existing account data (like password) or an empty object
            const storedAccount = storedAccountRaw ? JSON.parse(storedAccountRaw) : {};

            const updatedAccount = {
                ...storedAccount,
                ...user, // Overwrite with the latest state from the app
            };

            localStorage.setItem(userAccountKey, JSON.stringify(updatedAccount));

            // Also, update the "logged-in session" record, which doesn't store the password
            if (localStorage.getItem('fasta_user')) {
                localStorage.setItem('fasta_user', JSON.stringify(user));
            } else if (sessionStorage.getItem('fasta_user')) {
                sessionStorage.setItem('fasta_user', JSON.stringify(user));
            }
        } catch (e) {
            console.error("Failed to persist user data:", e);
        }
    }
  }, [user]);

  const userConversations = useMemo(() => {
    if (!user) return [];
    return conversations.filter(c => c.participants.some(p => p.id === user.email));
  }, [user, conversations]);
  
  const unreadMessagesCount = useMemo(() => {
    if (!user) return 0;
    return userConversations.reduce((count, convo) => {
        const unread = convo.messages.some(m => !m.read && m.senderId !== user.email);
        return count + (unread ? 1 : 0);
    }, 0);
  }, [user, userConversations]);

  const handleMarkConversationAsRead = useCallback((conversationId: string) => {
    if(!user) return;
    setConversations(prev => prev.map(convo => {
        if (convo.id === conversationId) {
            return {
                ...convo,
                messages: convo.messages.map(msg => 
                    msg.senderId !== user.email ? { ...msg, read: true } : msg
                ),
            };
        }
        return convo;
    }));
  }, [user]);

  const handleNavigate = (targetView: View) => {
    if (targetView === 'messages' && selectedConversationId) {
        // Mark messages as read when opening a conversation
        handleMarkConversationAsRead(selectedConversationId);
    }
    setView(targetView);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('fasta_user');
    sessionStorage.removeItem('fasta_user');
    setUser(null);
    setView('discovery');
    setConfirmedBooking(null);
    setTrainerToBook(null);
    setSelectedTrainerProfile(null);
    setSelectedConversationId(null);
  };

  const handleLoginSuccess = (userData: UserProfile, remember: boolean, navigate = true) => {
    let allConvos : Conversation[] = [];
    try {
        allConvos = JSON.parse(localStorage.getItem('fasta_conversations') || '[]');
    } catch (error) {
        console.error("Failed to parse conversations on login:", error);
        localStorage.removeItem('fasta_conversations'); // Clear corrupted data
    }
    const userConvos = allConvos.filter((c: Conversation) => c.participants.some(p => p.id === userData.email));

    const completeUserData: UserProfile = {
      ...userData,
      photoUrl: userData.photoUrl || `https://picsum.photos/seed/${userData.username}/200/200`,
      completedSessions: userData.completedSessions || 0,
      earnedMedalIds: userData.earnedMedalIds || [],
      conversations: userConvos,
      favoriteTrainerIds: userData.favoriteTrainerIds || [],
    };
    
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('fasta_user', JSON.stringify(completeUserData));
    
    // Clear the other storage type to prevent conflicts
    const otherStorage = remember ? sessionStorage : localStorage;
    otherStorage.removeItem('fasta_user');
    
    setUser(completeUserData);
    
    if (navigate) {
        setView('discovery');
    }
  };
  
  const handleSignUpSuccess = (userData: UserProfile) => {
     handleLoginSuccess(userData, true); // Default to remembering new sign-ups
  };

  const handleInitiateBooking = (trainer: Trainer) => {
      setTrainerToBook(trainer);
  };
  
  const handleModalClose = () => {
      setTrainerToBook(null);
  };
  
  const handleCreateOrSelectConversation = (trainer: Trainer) => {
      if (!user) {
        setView('client-signup');
        return;
      };
      
      const existingConversation = conversations.find(c => 
          c.participants.some(p => p.id === user.email) &&
          c.participants.some(p => p.id === trainer.email)
      );

      if (existingConversation) {
          setSelectedConversationId(existingConversation.id);
      } else {
          const newConversation: Conversation = {
              id: `conv-${Date.now()}`,
              participants: [
                  { id: user.email, name: user.fullName, photoUrl: user.photoUrl },
                  { id: trainer.email, name: trainer.name, photoUrl: trainer.photoUrl },
              ],
              messages: [],
          };
          setConversations(prev => [...prev, newConversation]);
          setSelectedConversationId(newConversation.id);
      }
      setView('messages');
  };
  
  const handleConfirmBooking = (bookingDetails: { date: string; time: string; message: string }) => {
    if (!trainerToBook) return;

    setPendingBooking({
      trainer: trainerToBook,
      details: bookingDetails,
    });
    
    setTrainerToBook(null); // Close booking modal
  };
  
  const handlePaymentSuccess = () => {
    if (!pendingBooking || !user) return;

    const { trainer, details } = pendingBooking;

    const newBooking: Booking = {
      id: new Date().toISOString(),
      trainerId: trainer.id,
      trainerName: trainer.name,
      userId: user.email,
      userFullName: user.fullName,
      ...details
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('fasta_bookings') || '[]');
    localStorage.setItem('fasta_bookings', JSON.stringify([...existingBookings, newBooking]));
    
    handleBookingConfirmed(newBooking);
    setPendingBooking(null); // Close payment modal
  };

  const handleBookingConfirmed = (booking: Booking) => {
      setConfirmedBooking(booking); // Show confirmation modal
      const trainer = trainers.find(t => t.id === booking.trainerId);

      if (user && trainer) {
        const updatedUser: UserProfile = {
          ...user,
          completedSessions: (user.completedSessions || 0) + 1,
          earnedMedalIds: user.earnedMedalIds || [],
        };
        
        const newlyEarnedMedals = ALL_MEDALS.filter(medal => 
            updatedUser.completedSessions >= medal.milestone && 
            !updatedUser.earnedMedalIds.includes(medal.id)
        );

        if (newlyEarnedMedals.length > 0) {
            updatedUser.earnedMedalIds.push(...newlyEarnedMedals.map(m => m.id));
            setNewlyUnlockedMedal(newlyEarnedMedals[0]);
        }
        
        setUser(updatedUser);
        
        // Add system message to conversation
        const locale = 'en-US';
        const formattedDate = new Date(booking.date).toLocaleDateString(locale, {
            weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
        });

        const systemMessageContent = t('messages_system_bookingConfirmed', { date: formattedDate, time: booking.time });
        
        const newMessage: Message = {
            id: `msg-sys-${Date.now()}`,
            senderId: 'system',
            content: systemMessageContent,
            timestamp: new Date().toISOString(),
            read: false,
        };

        setConversations(prev => prev.map(convo => {
            const isTargetConvo = convo.participants.some(p => p.id === user.email) &&
                                  convo.participants.some(p => p.id === trainer.email);
            if (isTargetConvo) {
                return { ...convo, messages: [...convo.messages, newMessage] };
            }
            return convo;
        }));
      }
  };
  
  const handleSelectConversation = useCallback((conversationId: string) => {
      setSelectedConversationId(conversationId);
      handleMarkConversationAsRead(conversationId);
      setView('messages');
  }, [handleMarkConversationAsRead]);

  const handleSendMessage = (conversationId: string, content: string) => {
      if (!user) return;
      
      const newMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId: user.email,
          content,
          timestamp: new Date().toISOString(),
          read: true, // It's read by the sender
      };

      setConversations(prev => prev.map(convo => {
          if (convo.id === conversationId) {
              return { ...convo, messages: [...convo.messages, newMessage] };
          }
          return convo;
      }));
  };


  const handleCloseConfirmation = () => {
      setConfirmedBooking(null);
  };

  const handleViewProfile = (trainer: Trainer) => {
    setSelectedTrainerProfile(trainer);
  };

  const handleCloseProfileModal = () => {
    setSelectedTrainerProfile(null);
  };
    
  const handleAddReview = (trainerId: number, reviewData: { rating: number; comment: string; }) => {
      if (!user) return; 
      
      const updatedTrainers = trainers.map(trainer => {
          if (trainer.id === trainerId) {
              const newReview: Review = {
                  id: Date.now(),
                  author: `@${user.username}`,
                  ...reviewData,
              };
              const updatedReviews = [...trainer.reviews, newReview];
              return { ...trainer, reviews: updatedReviews };
          }
          return trainer;
      });
      setTrainers(updatedTrainers);

      if(selectedTrainerProfile && selectedTrainerProfile.id === trainerId) {
        const updatedSelectedTrainer = updatedTrainers.find(t => t.id === trainerId);
        if(updatedSelectedTrainer) {
          setSelectedTrainerProfile(updatedSelectedTrainer);
        }
      }
  };

  const renderView = () => {
    switch(view) {
        case 'client-signup':
            return <SignUp onSignUpSuccess={handleSignUpSuccess} onNavigateToLogin={() => setView('login')} />;
        case 'trainer-signup':
            return <TrainerSignUp />;
        case 'login':
            return <Login onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={() => setView('client-signup')} />;
        case 'dashboard':
            return <Dashboard user={user} />;
        case 'messages':
            return user ? <MessagingCenter 
                                conversations={userConversations}
                                currentUser={user}
                                onSendMessage={handleSendMessage}
                                onSelectConversation={handleSelectConversation}
                                selectedConversationId={selectedConversationId}
                                trainers={trainers}
                                onInitiateBooking={handleInitiateBooking}
                           /> : <Login onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={() => setView('client-signup')} />;
        case 'about':
            return <About />;
        case 'discovery':
        default:
            return <TrainerDiscovery 
                        trainers={trainers} 
                        onMessageTrainer={handleCreateOrSelectConversation}
                        onViewProfile={handleViewProfile}
                    />;
    }
  };

  const bookedTrainerForConfirmation = confirmedBooking ? trainers.find(t => t.id === confirmedBooking.trainerId) : null;

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header onNavigate={handleNavigate} user={user} onLogout={handleLogout} unreadMessagesCount={unreadMessagesCount} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {renderView()}
      </main>
      {trainerToBook && user && (
          <BookingModal trainer={trainerToBook} onClose={handleModalClose} onConfirm={handleConfirmBooking} />
      )}
      {pendingBooking && (
        <PaymentModal 
            trainer={pendingBooking.trainer}
            bookingDetails={pendingBooking.details}
            onClose={() => setPendingBooking(null)}
            onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      {selectedTrainerProfile && (
        <TrainerProfileModal
            trainer={selectedTrainerProfile}
            onClose={handleCloseProfileModal}
            currentUser={user}
            onReviewSubmit={handleAddReview}
        />
      )}
      {confirmedBooking && bookedTrainerForConfirmation && (
        <BookingConfirmationModal 
            booking={confirmedBooking}
            trainer={bookedTrainerForConfirmation}
            onClose={handleCloseConfirmation}
            onMessageTrainer={handleCloseConfirmation}
        />
      )}
      {newlyUnlockedMedal && (
          <MedalUnlockedModal medal={newlyUnlockedMedal} onClose={() => setNewlyUnlockedMedal(null)} />
      )}
    </div>
  );
};

export default App;