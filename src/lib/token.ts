// 액세스 토큰 로컬 스토리지 키
const ACCESS_TOKEN_KEY = 'accessToken';

/**
 * 로컬 스토리지에서 액세스 토큰을 가져옵니다.
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * 액세스 토큰을 로컬 스토리지에 저장하거나 삭제합니다.
 * @param token 'Bearer '를 포함하거나 포함하지 않은 토큰 문자열. null이면 삭제합니다.
 */
export const setAccessToken = (token: string | null) => {
  if (token) {
    // 'Bearer ' 접두사가 없으면 추가
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    localStorage.setItem(ACCESS_TOKEN_KEY, formattedToken);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

/**
 * JWT 토큰에서 publicId를 추출합니다.
 */
export const getPublicIdFromToken = (token: string): string | null => {
  try {
    const payload = token.split('.')[1];
    // base64url을 base64로 변환하여 디코딩
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload).publicId;
  } catch (e) {
    return null;
  }
};
