// types/event.ts
export interface Event {
  id: number;
  name: string;
  image: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  status: 'Активное' | 'Прошедшее' | 'Отклоненное';
  category: string;
  description: string;
  fullDescription: string;
  payment: 'Free' | 'Paid';
  paymentInfo?: string;
  userParticipating: boolean;
  location: string;
  organizer: string;
  rating: number;
  price?: string;
  invitedUsers?: number[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}