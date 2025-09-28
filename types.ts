// FIX: Import FC type from React to resolve namespace issue.
import type { FC } from 'react';

// This declaration is necessary to inform TypeScript about the global objects
// provided by external libraries (Leaflet, Stripe) which are loaded via <script> tags.
declare global {
  var L: any;
  var Stripe: any;
}

export enum Specialty {
  Yoga = 'Yoga',
  Weightlifting = 'Weightlifting',
  Cardio = 'Cardio',
  Pilates = 'Pilates',
  CrossFit = 'CrossFit',
  Boxing = 'Boxing',
  Nutrition = 'Nutrition',
  Running = 'Running',
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

export interface Trainer {
  id: number;
  name: string;
  email: string; // Added for messaging identification
  photoUrl: string;
  reviews: Review[];
  specialties: Specialty[];
  hourlyRate: number;
  location: string;
  isOnline: boolean;
  bio: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Filters {
  specialties: Specialty[];
  minRating: number;
  priceRange: [number, number];
  location: string;
  onlineOnly: boolean;
}

export interface UserProfile {
    email: string;
    fullName: string;
    username: string;
    photoUrl: string;
    completedSessions: number;
    earnedMedalIds: string[];
    conversations: Conversation[];
    favoriteTrainerIds: number[];
}

export interface Booking {
  id: string;
  trainerId: number;
  trainerName: string;
  userId: string; // user's email
  userFullName: string;
  date: string;
  time: string;
  message: string;
}

export interface Medal {
  id: string;
  name: string;
  description: string;
  milestone: number; // Number of sessions to unlock
  // FIX: Use imported FC type instead of React.FC
  Icon: FC<{ className?: string }>;
}

// Messaging types
export interface Message {
    id: string;
    senderId: string; // email of sender
    content: string;
    timestamp: string;
    read: boolean;
}

export interface Participant {
    id: string; // email
    name: string;
    photoUrl: string;
}

export interface Conversation {
    id: string;
    participants: Participant[];
    messages: Message[];
}

// FIX: Add ChatMessage type for VanessaAgent component.
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}