import React from 'react';
import { useNavigate } from 'react-router-dom';
import Chip from "../common/Chip";
import Button from "../common/Button";
import { getImageUrl } from '../../lib/utils';
import { CloseIcon } from '../../assets/icons/CloseIcon';
import { UserIcon } from '../../assets/icons/UserIcon';
import { UseCountIcon } from '../../assets/icons/UserCountIcon';
import { PlusIcon } from '../../assets/icons/PlusIcon';
import type { CharacterCard } from '../../lib/characterApi';

interface CharacterInfoModalProps {
    character: CharacterCard;
    onClose: () => void;
}

export const CharacterInfoModal: React.FC<CharacterInfoModalProps> = ({ character, onClose }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-86.5 bg-base-950 border border-base-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className='flex items-center justify-between px-4 py-1 mt-3 mb-4'>
                    <h2 className="text-body-1 font-medium text-base-400">캐릭터 정보</h2>
                    <button onClick={onClose} className="text-base-400 hover:text-base-50 transition-colors cursor-pointer">
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex flex-col">
                    <div className="aspect-square w-full overflow-hidden border-t border-b border-base-700 bg-base-800 box-border">
                        <img src={getImageUrl(character.imageUrl) || ''} alt={character.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="py-5 px-4">
                        <div>
                            <div className='flex gap-3 items-center'>
                                <h2 className="text-header-3 font-medium text-base-100">{character.name}</h2>
                                <Chip size='s'>#{character.characterCode}</Chip>
                            </div>
                            <div className='my-6'>
                                <h4 className="text-body-2 text-base-100 font-medium uppercase tracking-widest mb-2">캐릭터 설명</h4>
                                <p className="text-body-3 text-base-200 leading-relaxed">{character.description}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Chip size='s' icon={<UserIcon />}>{character.creatorNickname}</Chip>
                            <Chip size='s' icon={<UseCountIcon />}>{character.useCount}회</Chip>
                        </div>
                        <hr className='my-4 border-base-700' />
                        <Button
                            variant="solid"
                            fullWidth
                            size="m"
                            leftIcon={<PlusIcon />}
                            onClick={() => navigate('/feed/new', { state: { characterId: character.publicId } })}
                        >
                            게시물 만들기
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};