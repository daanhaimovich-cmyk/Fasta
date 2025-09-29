import React, { useState, useEffect, type FC } from 'react';
import type { UserProfile, Conversation, Booking } from '../types';
import { View } from '../App';
import { useTranslation } from '../contexts/LanguageContext';
import { WalletIcon, CalendarDaysIcon, ClientGroupIcon, ChatBubbleIcon } from './IconComponents';

interface TrainerDashboardProps {
    user: UserProfile;
    conversations: Conversation[];
    onNavigate: (view: View) => void;
}

const StatCard: FC<{ title: string; value: string | number; icon: React.ReactNode; designId: string }> = ({ title, value, icon, designId }) => (
    <div data-design-id={designId} className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center gap-5">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const TrainerDashboard: FC<TrainerDashboardProps> = ({ user, conversations, onNavigate }) => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({ sessions: 0, earnings: 0, clients: 0 });

    useEffect(() => {
        if (!user || user.role !== 'trainer') return;
        
        const allBookings: Booking[] = JSON.parse(localStorage.getItem('fasta_bookings') || '[]');
        // Fragile matching based on name, as new trainers aren't in the mock data with IDs.
        const trainerBookings = allBookings.filter(b => b.trainerName === user.fullName); 
        
        const totalSessions = trainerBookings.length;
        const totalEarnings = totalSessions * (user.hourlyRate || 0);
        const uniqueClients = new Set(trainerBookings.map(b => b.userId)).size;

        setStats({ sessions: totalSessions, earnings: totalEarnings, clients: uniqueClients });

    }, [user]);

    const getOtherParticipant = (convo: Conversation) => {
        return convo.participants.find(p => p.id !== user.email);
    };

    const recentConversations = conversations
        .slice()
        .sort((a, b) => {
            const lastMsgA = a.messages[a.messages.length - 1];
            const lastMsgB = b.messages[b.messages.length - 1];
            if (!lastMsgA) return 1;
            if (!lastMsgB) return -1;
            return new Date(lastMsgB.timestamp).getTime() - new Date(lastMsgA.timestamp).getTime();
        })
        .slice(0, 3);
    
    const userFirstName = user.fullName.split(' ')[0];

    return (
        <div className="space-y-8 animate-fade-in-down">
            <div>
                <h1 className="text-4xl font-bold text-white">{t('dashboard_welcome', { name: userFirstName })}</h1>
                <p className="text-lg text-slate-400">{t('trainerDashboard_subtitle')}</p>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title={t('trainerDashboard_totalEarnings')} value={`₪${stats.earnings.toLocaleString()}`} icon={<WalletIcon />} designId="trainer-dashboard-earnings-card" />
                <StatCard title={t('trainerDashboard_completedSessions')} value={stats.sessions} icon={<CalendarDaysIcon />} designId="trainer-dashboard-sessions-card" />
                <StatCard title={t('trainerDashboard_activeClients')} value={stats.clients} icon={<ClientGroupIcon />} designId="trainer-dashboard-clients-card" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Messages */}
                <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-white">{t('trainerDashboard_recentMessages')}</h2>
                        <button onClick={() => onNavigate('messages')} className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">
                            {t('trainerDashboard_viewAllMessages')}
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentConversations.length > 0 ? recentConversations.map(convo => {
                            const other = getOtherParticipant(convo);
                            const lastMsg = convo.messages[convo.messages.length - 1];
                            return (
                                <div key={convo.id} className="flex items-center gap-4 p-3 bg-slate-800 rounded-md">
                                    <img src={other?.photoUrl} alt={other?.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-semibold text-white truncate">{other?.name}</p>
                                        <p className="text-sm text-slate-400 truncate">{lastMsg ? lastMsg.content : t('messages_noMessages')}</p>
                                    </div>
                                    <ChatBubbleIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                </div>
                            );
                        }) : (
                            <p className="text-slate-400 text-center py-8">{t('trainerDashboard_noMessages')}</p>
                        )}
                    </div>
                </div>

                {/* Profile Snapshot */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                     <h2 className="text-2xl font-semibold text-white mb-4">{t('trainerDashboard_profileSnapshot')}</h2>
                     <div className="flex flex-col items-center text-center">
                        <img src={user.photoUrl} alt={user.fullName} className="w-24 h-24 rounded-full object-cover border-4 border-slate-700 mb-4" />
                        <h3 className="text-xl font-bold text-white">{user.fullName}</h3>
                        <p className="text-slate-400">@{user.username}</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                             {(user.specialties || []).map(spec => (
                                <span key={spec} className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-full">
                                    {t(`specialty_${spec}`)}
                                </span>
                            ))}
                        </div>
                        <p className="text-lg font-semibold text-emerald-400 mt-4">
                            ₪{user.hourlyRate}<span className="text-sm font-normal text-slate-400">{t('trainerCard_perHour')}</span>
                        </p>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerDashboard;