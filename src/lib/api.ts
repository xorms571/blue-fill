const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface FetchOptions extends RequestInit {
  data?: any;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { data, ...rest } = options;
  const url = `${BASE_URL}${endpoint}`;

  const headers = new Headers(rest.headers);
  if (data && !(data instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...rest,
    headers,
  };

  if (data) {
    config.body = data instanceof FormData ? data : JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: any, options?: FetchOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'POST', data }),
  
  put: <T>(endpoint: string, data?: any, options?: FetchOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'PUT', data }),
  
  patch: <T>(endpoint: string, data?: any, options?: FetchOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'PATCH', data }),
  
  delete: <T>(endpoint: string, options?: FetchOptions) => 
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
