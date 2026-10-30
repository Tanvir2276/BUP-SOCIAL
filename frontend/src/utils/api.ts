const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('bupsoc_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('bupsoc_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('bupsoc_token');
};

export const apiFetch = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};
