const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface FetchOptions extends RequestInit {
  data?: any;
}

// 액세스 토큰 메모리 저장소
let accessToken: string | null = null;
// 재발급 중인지 여부를 저장하여 중복 요청 방지
let isReissuing = false;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { data, ...rest } = options;
  const url = `${BASE_URL}${endpoint}`;

  const headers = new Headers(rest.headers);
  if (data && !(data instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // 액세스 토큰이 있으면 Authorization 헤더 추가
  if (accessToken) {
    headers.set('Authorization', accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`);
  }

  const config: RequestInit = {
    ...rest,
    headers,
    credentials: 'include', // 쿠키(리프레시 토큰) 포함 필수
  };

  if (data) {
    config.body = data instanceof FormData ? data : JSON.stringify(data);
  }

  const response = await fetch(url, config);

  // 디버깅을 위한 로그 추가
  if (response.headers.get('content-type')?.includes('text/html')) {
    console.warn(`[API] HTML 응답 감지됨! URL: ${url}, Status: ${response.status}`);
  }

  // 401 에러 발생 시 (토큰 만료 등)
  if (response.status === 401 && endpoint !== '/auth/reissue' && !isReissuing) {
    isReissuing = true;
    try {
      // 토큰 재발급 시도
      const reissueRes = await fetch(`${BASE_URL}/auth/reissue`, {
        method: 'POST',
        credentials: 'include',
      });

      if (reissueRes.ok) {
        const reissueData = await reissueRes.json();
        const newToken = reissueData.data.accessToken;
        setAccessToken(newToken);
        isReissuing = false;
        
        // 재발급 성공 시 원래 요청 다시 시도
        return apiFetch<T>(endpoint, options);
      }
    } catch (err) {
      console.error('Auto reissue failed:', err);
    } finally {
      isReissuing = false;
    }
    
    // 재발급 실패 시 특수 에러 던짐
    throw new Error('AUTH_REQUIRED');
  }

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
