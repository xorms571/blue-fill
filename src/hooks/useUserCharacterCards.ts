import { useState, useEffect, useCallback } from 'react';
import { getUserCharacterCards } from '../lib/characterApi';
import type { CharacterCard } from '../lib/characterApi';

export const useUserCharacterCards = (userPublicId: string | undefined, initialSize = 10) => {
  const [characters, setCharacters] = useState<CharacterCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchCharacters = useCallback(async (isFirst = true) => {
    if (!userPublicId || userPublicId === 'undefined') return; // undefined 체크 강화
    
    setLoading(true);
    setError(null);
    try {
      const currentCursor = isFirst ? undefined : nextCursor;
      const response = await getUserCharacterCards(userPublicId, {
        cursor: currentCursor || undefined,
        size: initialSize,
      });

      const { content, nextCursor: newCursor, hasNext: newHasNext } = response;
      
      if (isFirst) {
        setCharacters(content);
        console.log(content);
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
  }, [userPublicId, nextCursor, initialSize]);

  useEffect(() => {
    if (userPublicId && userPublicId !== 'undefined') {
      fetchCharacters(true);
    }
  }, [userPublicId, fetchCharacters]);

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
    loadMore,
    refresh: () => fetchCharacters(true),
  };
};
