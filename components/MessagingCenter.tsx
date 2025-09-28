

import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, UserProfile, Trainer } from '../types';
import { SendIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface MessagingCenterProps {
    conversations: Conversation[];
    currentUser: UserProfile;
    onSendMessage: (conversationId: string, content: string) => void;
    onSelectConversation: (conversationId: string) => void;
    selectedConversationId: string | null;
    trainers: Trainer[];
    onInitiateBooking: (trainer: Trainer) => void;
}

const MessagingCenter: React.FC<MessagingCenterProps> = ({ 
    conversations, 
    currentUser, 
    onSendMessage,
    onSelectConversation,
    selectedConversationId,
    trainers,
    onInitiateBooking,
}) => {
    const { t, language } = useTranslation();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation?.messages]);
    
    // Auto-select first conversation if none is selected
    useEffect(() => {
        if (!selectedConversationId && conversations.length > 0) {
            onSelectConversation(conversations[0].id);
        }
    }, [selectedConversationId, conversations, onSelectConversation]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConversationId) {
            onSendMessage(selectedConversationId, newMessage);
            setNewMessage('');
        }
    };

    const getOtherParticipant = (convo: Conversation) => {
        return convo.participants.find(p => p.id !== currentUser.email);
    };
    
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const locale = language === 'he' ? 'he-IL' : 'en-US';
        return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: true });
    };
    
    const otherParticipant = selectedConversation ? getOtherParticipant(selectedConversation) : null;
    const currentTrainer = otherParticipant ? trainers.find(t => t.email === otherParticipant.id) : null;


    return (
        <div className="flex h-[calc(100vh-150px)] bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
            {/* Conversation List */}
            <aside className={`w-full md:w-1/3 lg:w-1/4 border-e border-slate-700 flex-col ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">{t('messages_title')}</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(convo => {
                        const otherParticipant = getOtherParticipant(convo);
                        const lastMessage = convo.messages[convo.messages.length - 1];
                        const isUnread = lastMessage && lastMessage.senderId !== currentUser.email && !lastMessage.read;

                        return (
                            <button
                                key={convo.id}
                                onClick={() => onSelectConversation(convo.id)}
                                className={`w-full text-start p-4 flex items-center gap-4 transition-colors ${selectedConversationId === convo.id ? 'bg-emerald-500/20' : 'hover:bg-slate-700/50'}`}
                            >
                                <div className="relative">
                                    <img src={otherParticipant?.photoUrl} alt={otherParticipant?.name} className="w-12 h-12 rounded-full object-cover" />
                                    {isUnread && <span className="absolute top-0 end-0 block h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-800"></span>}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h3 className={`font-semibold ${isUnread ? 'text-white' : 'text-slate-200'}`}>{otherParticipant?.name}</h3>
                                    <p className={`text-sm truncate ${isUnread ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                                        {lastMessage ? (lastMessage.senderId === 'system' ? lastMessage.content : (lastMessage.senderId === currentUser.email ? `${t('messages_you')}${lastMessage.content}` : lastMessage.content)) : t('messages_noMessages')}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* Chat Window */}
            <main className={`flex-1 flex-col ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <header className="p-4 border-b border-slate-700 flex items-center justify-between gap-4 bg-slate-800">
                            <div className="flex items-center gap-4">
                                <img src={otherParticipant?.photoUrl} alt={otherParticipant?.name} className="w-10 h-10 rounded-full object-cover" />
                                <h2 className="text-lg font-bold text-white">{otherParticipant?.name}</h2>
                            </div>
                            {currentTrainer && (
                                <button
                                    onClick={() => onInitiateBooking(currentTrainer)}
                                    className="px-4 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
                                >
                                    {t('messages_bookSession')}
                                </button>
                            )}
                        </header>
                        
                        {/* Messages */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {selectedConversation.messages.map(msg => {
                                if (msg.senderId === 'system') {
                                    return (
                                        <div key={msg.id} className="text-center text-sm text-slate-400 py-2">
                                            {msg.content}
                                        </div>
                                    )
                                }
                                return (
                                <div key={msg.id} className={`flex items-end gap-3 ${msg.senderId === currentUser.email ? 'justify-end' : 'justify-start'}`}>
                                     {msg.senderId !== currentUser.email && (
                                        <img src={otherParticipant?.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover self-start" />
                                    )}
                                    <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.senderId === currentUser.email ? 'bg-emerald-600 text-white rounded-br-lg rtl:rounded-bl-lg rtl:rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-lg rtl:rounded-br-lg rtl:rounded-bl-none'}`}>
                                        <p className="text-sm">{msg.content}</p>
                                        <p className={`text-xs mt-1 ${msg.senderId === currentUser.email ? 'text-emerald-200/80 text-end' : 'text-slate-400 text-start'}`}>{formatTimestamp(msg.timestamp)}</p>
                                    </div>
                                </div>
                            )})}
                             <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-slate-800 border-t border-slate-700 flex items-center gap-4">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={t('messages_placeholder')}
                                className="w-full bg-slate-700 border border-slate-600 rounded-full py-2.5 px-5 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            />
                            <button type="submit" className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!newMessage.trim()}>
                                <SendIcon />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                        <p>{t('messages_selectConversation')}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MessagingCenter;