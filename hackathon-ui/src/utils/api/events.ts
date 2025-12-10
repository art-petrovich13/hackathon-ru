const API_BASE_URL = 'https://woods-decreased-projector-rebate.trycloudflare.com/api';

interface Event {
    id: number;
    title: string;
    description: string;
    short_description: string;
    image: string;
    image_thumbnail: string;
    start_date: string;
    end_date: string;
    location: string;
    price: number;
    max_participants: number;
    status: 'draft' | 'pending' | 'active' | 'past' | 'rejected';
    payment_type: 'free' | 'paid' | 'donation';
    participants_count: number;
    created_by: number;
    is_active: boolean;
    is_past: boolean;
    is_full: boolean;
    available_spots: number;
    is_participating: boolean;
    organizer: {
        id: number;
        name: string;
        email: string;
    };
}

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    errors?: Record<string, string[]>;
}

interface EventsResponse {
    events: Event[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        tab: string;
        total_events: number;
    };
}

// Общая функция для API запросов с авторизацией
async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');

    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        credentials: 'include' as RequestCredentials,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        // Логирование для отладки
        console.log(`API ${endpoint}:`, {
            status: response.status,
            ok: response.ok,
            data: data
        });
        
        if (!response.ok) {
            throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Request error:', error);
        throw error;
    }
}

// Получение списка событий
export async function getEvents(
    tab: 'active' | 'my' | 'past' = 'my',
    page: number = 1,
    perPage: number = 12
): Promise<ApiResponse<EventsResponse>> {
    return apiRequest(`/events?tab=${tab}&page=${page}&per_page=${perPage}`);
}

// Получение деталей события
export async function getEvent(id: number): Promise<ApiResponse<{ data: Event }>> {
    return apiRequest(`/events/${id}`);
}

// Подтверждение участия
export async function participateEvent(id: number): Promise<ApiResponse> {
    return apiRequest(`/events/${id}/participate`, {
        method: 'POST',
        body: JSON.stringify({}),
    });
}

// Отмена участия
export async function cancelParticipation(id: number): Promise<ApiResponse> {
    return apiRequest(`/events/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({}),
    });
}

// Получение информации о текущем пользователе
export async function getCurrentUser(): Promise<ApiResponse<{ user: any }>> {
    return apiRequest('/me');
}

// Проверка авторизации
export function isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
}

// Выход
export function logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
}