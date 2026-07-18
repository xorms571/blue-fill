import { deleteCharacterCard } from '../lib/characterApi';
import { getErrorMessage } from '../lib/utils';

export const useDeleteCharacter = () => {
  const deleteCharacter = async (publicId: string, onSuccess?: () => void) => {
    if (!confirm('정말로 이 캐릭터를 삭제하시겠습니까?')) return;

    try {
      await deleteCharacterCard(publicId);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const message = getErrorMessage(err, '캐릭터 삭제에 실패했습니다.');
      console.error(message);
      alert(message);
    }
  };

  return { deleteCharacter };
};
