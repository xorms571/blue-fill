import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/common/SearchBar';
import Dropdown from '../../components/common/Dropdown';
import Button from '../../components/common/Button';
import PageLayout from '../../components/layout/PageLayout';
import { cn } from '../../lib/utils';
import { useCharacterLibrary } from '../../hooks/useCharacterLibrary';
import type { CharacterCard } from '../../lib/characterApi';
import PageHeader from '../../components/common/PageHeader';
import Chip from '../../components/common/Chip';

// --- Icons ---
const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.39844 3.13867V7.66175" stroke="#27272A" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M3.14062 5.40039H7.6637" stroke="#27272A" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M8.03846 0.5H2.76154C1.51253 0.5 0.5 1.51253 0.5 2.76154V8.03846C0.5 9.28751 1.51253 10.3 2.76154 10.3H8.03846C9.28751 10.3 10.3 9.28751 10.3 8.03846V2.76154C10.3 1.51253 9.28751 0.5 8.03846 0.5Z" stroke="#27272A" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const FireIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.29098 1.02401C4.04061 0.924277 3.81411 1.15698 3.9214 1.32321C4.29749 1.93231 4.54815 2.60124 4.66055 3.29569C4.81546 4.2757 4.66143 5.34975 3.981 6.14363C3.95514 6.1737 3.92256 6.19819 3.88551 6.21541C3.84845 6.23263 3.80783 6.24217 3.76642 6.24337C3.72395 6.24516 3.68159 6.23813 3.6424 6.22279C3.60323 6.20745 3.56822 6.1842 3.53991 6.1547C3.23239 5.85865 2.9136 5.55865 2.70541 5.19063C2.64579 5.07981 2.4312 4.90251 2.12125 5.19063C1.37278 5.76354 0.91723 6.64331 1.01254 7.53984C1.05138 9.52567 2.94014 10.976 5.00956 10.9997C7.12111 11.0238 8.98312 9.57028 9 7.53984C9 6.25892 8.58446 5.00771 7.80777 3.9495C6.95611 2.68532 5.73679 1.67105 4.29098 1.02401Z" stroke="#62F6B5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_2629_6428)">
      <g clip-path="url(#clip1_2629_6428)">
        <path d="M2.375 7.10151C2.92143 6.37003 3.7941 5.89648 4.77736 5.89648C5.47732 5.89648 6.12124 6.13646 6.63132 6.53864" stroke="#62F6B5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4.35295 9.10705H1.35621C1.12913 9.10705 0.911346 9.0168 0.750779 8.85626C0.590208 8.69572 0.5 8.47792 0.5 8.25084V1.40114C0.5 1.17405 0.590208 0.956276 0.750779 0.795701C0.911346 0.63513 1.12913 0.544922 1.35621 0.544922H8.20591C8.433 0.544922 8.65076 0.63513 8.81138 0.795701C8.97192 0.956276 9.06217 1.17405 9.06217 1.40114V3.96978" stroke="#62F6B5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4.78432 4.61161C5.49363 4.61161 6.06864 4.03659 6.06864 3.32729C6.06864 2.61798 5.49363 2.04297 4.78432 2.04297C4.07502 2.04297 3.5 2.61798 3.5 3.32729C3.5 4.03659 4.07502 4.61161 4.78432 4.61161Z" stroke="#62F6B5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6.28785 9.05058C5.98738 8.99826 5.98738 8.56693 6.28785 8.51466C7.37641 8.32528 8.2422 7.49615 8.47847 6.41681L8.49658 6.33407C8.56159 6.03711 8.98445 6.03526 9.05201 6.33164L9.07401 6.42806C9.31906 7.50231 10.185 8.32443 11.2706 8.51329C11.5726 8.56583 11.5726 8.99938 11.2706 9.05195C10.185 9.24074 9.31906 10.0629 9.07401 11.1372L9.05201 11.2336C8.98445 11.5299 8.56159 11.5281 8.49658 11.2311L8.47847 11.1484C8.2422 10.069 7.37641 9.23989 6.28785 9.05058Z" stroke="#62F6B5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_2629_6428">
        <rect width="12" height="12" fill="white" />
      </clipPath>
      <clipPath id="clip1_2629_6428">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1859_13153)">
      <path d="M13.5 0.5L0.5 13.5" stroke="#FFFAEA" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M0.5 0.5L13.5 13.5" stroke="#FFFAEA" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_1859_13153">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const UseCountIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.71484 1L9.61961 2.92308L7.71484 4.84616" stroke="#62F6B5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 6.96132C10 7.76005 9.76541 8.54085 9.32587 9.20493C8.88632 9.86909 8.26164 10.3867 7.53074 10.6924C6.79983 10.998 5.99557 11.078 5.21964 10.9222C4.44372 10.7664 3.73099 10.3817 3.17157 9.81693C2.61217 9.25216 2.2312 8.53255 2.07686 7.74918C1.92252 6.96579 2.00173 6.15379 2.30448 5.41586C2.60723 4.67793 3.11992 4.04721 3.77772 3.60345C4.43552 3.15971 5.20888 2.92285 6 2.92285H9.61905" stroke="#62F6B5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const CharacterLibraryPage = () => {
  const navigate = useNavigate();
  const {
    characters,
    loading,
    hasNext,
    keyword,
    setKeyword,
    sort,
    setSort,
    loadMore
  } = useCharacterLibrary();

  const [isFABOpen, setIsFABOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterCard | null>(null);

  const sortOptions = [
    { label: '최신순', value: 'LATEST' },
    { label: '인기순', value: 'POPULAR' },
  ];

  return (
    <PageLayout>
      {/* --- Character Detail Modal --- */}
      {selectedCharacter && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCharacter(null)} />
          <div className="relative w-full max-w-86.5 bg-base-950 border border-base-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className='flex items-center justify-between px-4 py-1 mt-3 mb-4'>
              <h2 className="text-body-1 font-medium text-base-400">캐릭터 정보</h2>
              <button onClick={() => setSelectedCharacter(null)} className="text-base-400 hover:text-base-50 transition-colors cursor-pointer">
                <CloseIcon />
              </button>
            </div>
            <div className="flex flex-col">
              <div className="aspect-square w-full overflow-hidden border-t border-b border-base-700 bg-base-800 box-border">
                <img src={selectedCharacter.imageUrl} alt={selectedCharacter.name} className="w-full h-full object-cover" />
              </div>
              <div className="py-5 px-4">
                <div>
                  <div className='flex gap-3 items-center'>
                    <h2 className="text-header-3 font-medium text-base-100">{selectedCharacter.name}</h2>
                    <Chip size='s'>#{selectedCharacter.characterCode}</Chip>
                  </div>
                  <div className='my-6'>
                    <h4 className="text-body-2 text-base-100 font-medium uppercase tracking-widest mb-2">캐릭터 설명</h4>
                    <p className="text-body-3 text-base-200 leading-relaxed">{selectedCharacter.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Chip size='s' icon={<UserIcon />} >{selectedCharacter.creatorNickname}</Chip>
                  <Chip size='s' icon={<UseCountIcon />}>{selectedCharacter.useCount}회</Chip>
                </div>
                <hr className='my-4 border-base-700' />
                <Button
                  variant="solid"
                  fullWidth
                  size="m"
                  onClick={() => navigate('/feed/new', { state: { characterId: selectedCharacter.publicId } })}
                  leftIcon={<PlusIcon />}
                >
                  게시물 만들기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Main UI --- */}
      <PageHeader
        category="LIBRARY"
        title="Character Library"
        description="BLUEPILL에서 만들어진 모든 캐릭터를 탐색하고, 나만의 캐릭터 제작을 위한 영감을 얻어보세요."
        action={{
          label: "캐릭터 생성하기",
          onClick: () => navigate('/library/new'),
          icon: <PlusIcon />
        }}
      />

      <section className="flex items-center justify-end gap-3 my-6 mx-auto max-w-273 w-full">
        <Dropdown
          options={sortOptions}
          value={sort}
          onChange={(val) => setSort(val as 'LATEST' | 'POPULAR')}
          className="w-41"
        />
        <div className="w-55">
          <SearchBar
            variant="dark"
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword('')}
            className='w-full'
          />
        </div>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-7 gap-y-8 max-w-273 mx-auto w-full">
        {characters.map((char) => (
          <article key={char.publicId} className="group cursor-pointer" onClick={() => setSelectedCharacter(char)}>
            <div className="relative aspect-square mb-3 overflow-hidden rounded-2xl bg-base-900">
              <img src={char.imageUrl} alt={char.name} className="size-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100" />
              <Chip className='absolute bottom-2 right-2' variant='black' icon={<FireIcon />}>{char.useCount} M</Chip>
            </div>
            <div>
              <h3 className="text-body-2 font-semibold text-base-300">{char.name}</h3>
              <div className="text-body-4 my-1 text-base-500 line-clamp-2">{char.description}</div>
              <Chip variant='gray' icon={<UserIcon />}>{char.creatorNickname}</Chip>
            </div>
          </article>
        ))}
      </div>

      {hasNext && (
        <div className="flex justify-center my-16">
          <Button
            variant="Outline"
            size="m"
            loading={loading}
            onClick={loadMore}
            className="rounded-full px-8"
          >
            Load More
          </Button>
        </div>
      )}

      {/* FAB & Menu */}
      <div className="fixed bottom-12 right-12 z-150">
        <div className={cn("absolute bottom-20 right-0 flex flex-col gap-2 transition-all duration-300 origin-bottom scale-95 opacity-0 pointer-events-none", isFABOpen && "scale-100 opacity-100 pointer-events-auto")}>
          <button
            onClick={() => navigate('/feed/new')}
            className="flex items-center gap-3 px-4 py-2.5 bg-base-900 border border-base-800 rounded-xl text-base-50 hover:bg-base-800 transition-all whitespace-nowrap shadow-xl cursor-pointer"
          >
            <PlusIcon /> <span className="text-sm font-bold">게시물</span>
          </button>
          <button
            onClick={() => navigate('/library/new')}
            className="flex items-center gap-3 px-4 py-2.5 bg-base-900 border border-base-800 rounded-xl text-base-50 hover:bg-base-800 transition-all whitespace-nowrap shadow-xl cursor-pointer"
          >
            <PlusIcon /> <span className="text-sm font-bold">캐릭터 카드</span>
          </button>
        </div>
        <button onClick={() => setIsFABOpen(!isFABOpen)} className={cn("size-16 bg-primary/20 backdrop-blur-2xl border border-primary/40 rounded-full flex items-center justify-center text-primary shadow-2xl transition-all cursor-pointer", isFABOpen ? "rotate-45" : "hover:scale-110")}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
      </div>
    </PageLayout>
  );
};

export default CharacterLibraryPage;
