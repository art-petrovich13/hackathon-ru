// src/pages/AdminPage/types.ts
import type { AdminUser, AdminEvent } from '../../utils/api/admin';

export type ModalType = 'editUser' | 'resetPassword' | 'createEvent' | 'editEvent' | 'deleteConfirm' | null;
export type TabType = 'users' | 'events';
export type EventStatusType = 'upcoming' | 'ongoing' | 'past';

export interface UserFilters {
  name: string;
  role: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface EventFilters {
  status: string;
  title: string;
  start_date: string;
  end_date: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'deleted';
}

export interface EventFormState {
  title: string;
  short_description: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  price: string;
  payment_type: 'free' | 'paid' | 'donation';
  max_participants: string;
  image: File | null;
  participant_ids: number[];
}

export interface PaginationState {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}