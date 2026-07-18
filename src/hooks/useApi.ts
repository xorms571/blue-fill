import { useState, useCallback } from 'react';
import { api } from '../lib/api';

type ApiMethod = 'post' | 'put' | 'patch' | 'delete';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T = unknown>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(
    async (method: ApiMethod, endpoint: string, payload?: unknown) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let result: T;
        
        switch (method) {
          case 'post':
            result = await api.post<T>(endpoint, payload);
            break;
          case 'put':
            result = await api.put<T>(endpoint, payload);
            break;
          case 'patch':
            result = await api.patch<T>(endpoint, payload);
            break;
          case 'delete':
            result = await api.delete<T>(endpoint);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown API error');
        setState({ data: null, loading: false, error });
        throw error;
      }
    },
    []
  );

  const post = useCallback((endpoint: string, data?: unknown) => request('post', endpoint, data), [request]);
  const put = useCallback((endpoint: string, data?: unknown) => request('put', endpoint, data), [request]);
  const patch = useCallback((endpoint: string, data?: unknown) => request('patch', endpoint, data), [request]);
  const del = useCallback((endpoint: string) => request('delete', endpoint), [request]);

  return {
    ...state,
    post,
    put,
    patch,
    delete: del,
  };
}
