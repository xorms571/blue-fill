import { deleteCharacterCard } from '../lib/characterApi';

export const useDeleteCharacter = () => {
  const deleteCharacter = async (publicId: string, onSuccess?: () => void) => {
    if (!confirm('정말로 이 캐릭터를 삭제하시겠습니까?')) return;

    try {
      await deleteCharacterCard(publicId);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Failed to delete character:', err);
      alert(err.message || '캐릭터 삭제에 실패했습니다.');
    }
  };

  return { deleteCharacter };
};
