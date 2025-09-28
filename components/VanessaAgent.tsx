import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { SparklesIcon, XIcon, SendIcon } from './IconComponents';
import type { ChatMessage } from '../types';

const SYSTEM_INSTRUCTION = `You are Vanessa, a friendly and helpful AI assistant for FASTA, a fitness app that connects users with personal trainers in Israel. Your goal is to guide users, answer their questions about the app, and provide fitness-related advice.

Key App Features:
- Users can browse and filter trainers by specialty (Yoga, Weightlifting, etc.), rating, price (in Israeli Shekels, ₪), and location (major Israeli cities).
- Users can view detailed trainer profiles, read reviews, and book sessions.
- The app has a gamification system with medals for completing session milestones (e.g., 1st session, 5th session).
- There is a messaging center for users to chat with trainers they've booked.
- The currency is Israeli Shekels (ILS/₪).

Your Persona:
- You are encouraging, positive, and knowledgeable.
- Keep your answers concise and easy to understand.
- When asked about a feature, explain how to use it.
- If a user asks a general fitness question, provide safe, general advice and recommend they consult a professional trainer on the platform for personalized plans.
- Do not mention that you are a language model. You are Vanessa, the FASTA guide.`;

const VanessaAgent: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'model',
            text: "Hi! I'm Vanessa, your personal guide to FASTA. How can I help you achieve your goals today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isOpen) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const chatSession = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
              },
            });
            setChat(chatSession);
        } catch (error) {
            console.error("Failed to initialize Gemini:", error);
            setMessages(prev => [...prev, {role: 'model', text: 'Sorry, I am having trouble connecting right now. Please try again later.'}]);
        }
      }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent, prompt?: string) => {
        e.preventDefault();
        const userMessage = prompt || input;
        if (!userMessage.trim() || isLoading || !chat) return;

        const userMessageObj: ChatMessage = { role: 'user', text: userMessage };
        setMessages(prev => [...prev, userMessageObj]);
        setInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: userMessage });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error('Gemini API error:', error);
            setMessages(prev => [...prev, { role: 'model', text: 'Oops! Something went wrong. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const suggestionPrompts = [
        "How do I find a yoga trainer?",
        "What are medals?",
        "How do I book a session?",
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-emerald-500 text-white w-16 h-16 rounded-full shadow-lg hover:bg-emerald-600 transition-transform hover:scale-110 flex items-center justify-center z-50"
                aria-label="Open AI Assistant"
            >
                {isOpen ? <XIcon className="w-8 h-8"/> : <SparklesIcon className="w-8 h-8" />}
            </button>

            {isOpen && (
                <div 
                    className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] max-w-sm h-[65vh] bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in-down"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="vanessa-agent-title"
                >
                    <header className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center">
                                <SparklesIcon className="w-6 h-6 text-white"/>
                            </div>
                            <div>
                                <h2 id="vanessa-agent-title" className="font-bold text-white text-lg">Vanessa</h2>
                                <p className="text-xs text-emerald-400">Your AI Guide</p>
                            </div>
                        </div>
                         <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <XIcon />
                        </button>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                                        <SparklesIcon className="w-5 h-5 text-white"/>
                                    </div>
                                )}
                                <div className={`max-w-xs md:max-w-sm p-3 rounded-2xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-lg' : 'bg-slate-700 text-slate-200 rounded-bl-lg'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                                    <SparklesIcon className="w-5 h-5 text-white"/>
                                </div>
                                <div className="max-w-xs md:max-w-sm p-3 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-lg flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length <= 1 && (
                      <div className="px-4 pb-2 flex flex-wrap gap-2">
                          {suggestionPrompts.map(prompt => (
                            <button
                                key={prompt}
                                onClick={(e) => handleSendMessage(e, prompt)}
                                className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300 transition-colors"
                            >
                                {prompt}
                            </button>
                          ))}
                      </div>
                    )}

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700 flex items-center gap-3 flex-shrink-0">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full bg-slate-700 border border-slate-600 rounded-full py-2 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors disabled:bg-slate-600" disabled={isLoading || !input.trim()}>
                            <SendIcon className="w-5 h-5"/>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default VanessaAgent;