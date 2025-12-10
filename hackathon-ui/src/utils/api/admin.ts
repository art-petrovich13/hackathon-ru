import { apiRequest } from './events';
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    status: 'active' | 'deleted';
    created_at: string;
    updated_at: string;
}

export interface AdminEvent {
    id: number;
    title: string;
    short_description: string;
    description: string;
    status: 'draft' | 'pending' | 'active' | 'past' | 'rejected' | 'deleted';
    start_date: string;
    end_date: string;
    location: string;
    max_participants: number;
    participants_count: number;
    organizer_name: string;
    organizer_id: number;
    created_at: string;
    payment_type: 'free' | 'paid' | 'donation';
    price: number;
    image?: string;
}

export interface EventFormData {
    title: string;
    short_description: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    price: number;
    payment_type: 'free' | 'paid' | 'donation';
    max_participants: number;
    image?: File;
    participant_ids?: number[];
}

export interface UserFormData {
    name: string;
    email: string;
    role: 'user' | 'admin';
    status: 'active' | 'deleted';
}

export interface UsersResponse {
    users: AdminUser[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        name: string;
        role: string;
        status: string;
        start_date: string;
        end_date: string;
    };
}

export interface EventsResponse {
    events: AdminEvent[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

// Получение списка пользователей с фильтрацией
export async function getUsers(
    params: {
        name?: string;
        role?: string;
        status?: string;
        start_date?: string;
        end_date?: string;
        page?: number;
        per_page?: number;
    } = {}
): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.name) queryParams.append('name', params.name);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    
    const response = await apiRequest(`/admin/users?${queryParams}`);
    return response.data;
}

// Получение информации о пользователе
export async function getUser(id: number): Promise<{ user: AdminUser }> {
    const response = await apiRequest(`/admin/users/${id}`);
    return response.data;
}

// Обновление пользователя
export async function updateUser(id: number, data: Partial<UserFormData>): Promise<any> {
    const response = await apiRequest(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response;
}

// Сброс пароля пользователя
export async function resetUserPassword(id: number, password: string): Promise<any> {
    const response = await apiRequest(`/admin/users/${id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ password, password_confirmation: password }),
    });
    return response;
}

// Удаление пользователя
export async function deleteUser(id: number): Promise<any> {
    const response = await apiRequest(`/admin/users/${id}`, {
        method: 'DELETE',
    });
    return response;
}

// Получение списка событий
export async function getAdminEvents(
    params: {
        status?: string;
        title?: string;
        start_date?: string;
        end_date?: string;
        page?: number;
        per_page?: number;
    } = {}
): Promise<EventsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.title) queryParams.append('title', params.title);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    
    const response = await apiRequest(`/admin/events?${queryParams}`);
    return response.data;
}

// Получение детальной информации о событии
export async function getAdminEvent(id: number): Promise<{ event: any }> {
    const response = await apiRequest(`/admin/events/${id}`);
    return response.data;
}

// Создание события
export async function createEvent(data: FormData): Promise<any> {
    const response = await apiRequest('/admin/events', {
        method: 'POST',
        headers: {}, // Убираем Content-Type для FormData
        body: data,
    });
    return response;
}

// Обновление события
export async function updateEvent(id: number, data: FormData): Promise<any> {
    const response = await apiRequest(`/admin/events/${id}`, {
        method: 'PUT',
        headers: {}, // Убираем Content-Type для FormData
        body: data,
    });
    return response;
}

// Удаление события
export async function deleteEvent(id: number): Promise<any> {
    const response = await apiRequest(`/admin/events/${id}`, {
        method: 'DELETE',
    });
    return response;
}

// Экспорт участников
export async function exportParticipants(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/admin/events/${id}/export-participants`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Ошибка при экспорте участников');
  }
  
  // Получаем имя файла из заголовков
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `participants_event_${id}_${new Date().toISOString().split('T')[0]}.csv`;
  
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match) {
      filename = match[1];
    }
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}