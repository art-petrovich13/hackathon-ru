const API_BASE_URL = 'https://entrance-meets-shaw-released.trycloudflare.com/api';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  errors?: Record<string, string[]>;
  error?: string;
}

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}



// Остальной код остается без изменений
async function apiRequest<T = ApiResponse>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include' // Добавляем для отправки куки, если нужно
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    // Проверяем, успешен ли ответ
    if (!response.ok) {
      // Пытаемся получить ошибку из JSON
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` }
      }
      throw errorData
    }

    return await response.json()
  } catch (error) {
    console.error('API Request error:', error)
    throw error
  }
}

// Регистрация
export async function register(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  return apiRequest('/register', {
    method: 'POST',
    body: data,
  });
}

// Подтверждение email
export async function verifyEmail(data: { email: string; code: string }) {
  return apiRequest('/verify-email', {
    method: 'POST',
    body: data,
  });
}

// Вход
export async function login(data: { email: string; password: string }) {
  return apiRequest('/login', {
    method: 'POST',
    body: data,
  });
}

// Запрос сброса пароля
export async function forgotPassword(data: { email: string }) {
  return apiRequest('/forgot-password', {
    method: 'POST',
    body: data,
  });
}

// Сброс пароля
export async function resetPassword(data: {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}) {
  return apiRequest('/reset-password', {
    method: 'POST',
    body: data,
  });
}

// Проверка токена сброса пароля
export async function checkResetToken(data: { email: string; token: string }) {
  return apiRequest('/check-reset-token', {
    method: 'POST',
    body: data,
  });
}

// Повторная отправка кода подтверждения
export async function resendVerification(data: { email: string }) {
  return apiRequest('/resend-verification', {
    method: 'POST',
    body: data,
  });
}

// Сохранение токена в localStorage
export function saveToken(token: string) {
  localStorage.setItem('token', token);
}

// Получение токена из localStorage
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// Удаление токена (выход)
export function removeToken() {
  localStorage.removeItem('token');
}