import { useState, useEffect, useCallback } from 'react';
import { getCharacterLibrary } from '../lib/characterApi';
import type { CharacterCard, CharacterCardListResponse } from '../lib/characterApi';

export const useCharacterLibrary = (initialSize = 10) => {
  const [characters, setCharacters] = useState<CharacterCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<'LATEST' | 'POPULAR'>('LATEST');

  const fetchCharacters = useCallback(async (isFirst = true) => {
    setLoading(true);
    setError(null);
    try {
      const currentCursor = isFirst ? undefined : nextCursor;
      const response: CharacterCardListResponse = await getCharacterLibrary({
        keyword,
        sort,
        cursor: currentCursor || undefined,
        size: initialSize,
      });

      const { content, nextCursor: newCursor, hasNext: newHasNext } = response;
      
      if (isFirst) {
        setCharacters(content);
      } else {
        setCharacters((prev) => [...prev, ...content]);
      }
      
      setNextCursor(newCursor);
      setHasNext(newHasNext);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch characters');
    } finally {
      setLoading(false);
    }
  }, [keyword, sort, nextCursor, initialSize]);

  // 키워드나 정렬이 바뀌면 처음부터 다시 로드
  useEffect(() => {
    fetchCharacters(true);
  }, [keyword, sort]);

  const loadMore = () => {
    if (!loading && hasNext) {
      fetchCharacters(false);
    }
  };

  return {
    characters,
    loading,
    error,
    hasNext,
    keyword,
    setKeyword,
    sort,
    setSort,
    loadMore,
    refresh: () => fetchCharacters(true),
  };
};
