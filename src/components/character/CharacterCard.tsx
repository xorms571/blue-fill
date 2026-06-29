import { R2_DOMAIN } from '../../lib/config';
import type { CharacterCard } from '../../lib/characterApi';
import Chip from '../common/Chip';
import { UserIcon } from '../../assets/icons/UserIcon';
import { FireIcon } from '../../assets/icons/FireIcon';
import { cn } from '../../lib/utils';

interface CharacterCardProps {
  char: CharacterCard;
  onClick?: () => void;
  className?: string;
  creatorNickname?: string;
}

const getImageUrl = (key: string | null) => {
  if (!key) return null;
  if (key.startsWith('http')) return key;
  return `${R2_DOMAIN}/${key}`;
};

const CharacterCardComponent: React.FC<CharacterCardProps> = ({ char, onClick, className, creatorNickname }) => {
  return (
    <article key={char.publicId} className={cn("group cursor-pointer", className)} onClick={onClick}>
      <div className="relative aspect-square mb-3 overflow-hidden rounded-2xl bg-base-900">
        <img src={getImageUrl(char.imageUrl) || ''} alt={char.name} className="size-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100" />
        <Chip className='absolute bottom-2 right-2' variant='black' icon={<FireIcon />}>{char.useCount} M</Chip>
      </div>
      <div>
        <h3 className="text-body-2 font-semibold text-base-300">{char.name} <Chip variant='gray' size='s'>#{char.characterCode}</Chip></h3>
        <div className="text-body-4 my-1 text-base-500 line-clamp-2">{char.description}</div>
        <Chip variant='gray' size='s' icon={<UserIcon />}>{creatorNickname || char.creatorNickname}</Chip>
      </div>
    </article>
  );
};

export default CharacterCardComponent;
