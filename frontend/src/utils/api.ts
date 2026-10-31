const API_BASE = (((import.meta as any).env?.VITE_API_URL as string) || '/api').replace(/\/+$/, '');

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

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE}${normalizedEndpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};
