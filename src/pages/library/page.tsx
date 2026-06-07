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

// --- Icons ---
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3.33331V12.6666M3.33337 8.00002H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const LinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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
          <div className="relative w-full max-w-md bg-base-950 border border-base-800 rounded-3xl overflow-hidden shadow-2xl">
            <button onClick={() => setSelectedCharacter(null)} className="absolute top-4 right-4 z-10 text-base-400 hover:text-base-50 transition-colors"><CloseIcon /></button>
            <div className="flex flex-col">
              <div className="aspect-square w-full overflow-hidden"><img src={selectedCharacter.imageUrl} alt={selectedCharacter.name} className="w-full h-full object-cover" /></div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-header-2 font-bold text-base-50">{selectedCharacter.name}</h2>
                  <div className="space-y-2">
                    <h4 className="text-caption-1 text-base-600 font-bold uppercase tracking-widest">캐릭터 설명</h4>
                    <p className="text-body-3 text-base-400 leading-relaxed">{selectedCharacter.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-base-900 border border-white/5 text-primary"><LinkIcon /> <span className="text-[11px] font-bold">{selectedCharacter.creatorNickname}</span></div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-base-900 border border-white/5 text-primary"><ClockIcon /> <span className="text-[11px] font-bold">{selectedCharacter.useCount}회</span></div>
                </div>
                <Button
                  variant="solid"
                  fullWidth
                  size="m"
                  className="h-12 rounded-xl text-base-950 font-bold"
                  onClick={() => navigate('/feed/new', { state: { characterId: selectedCharacter.publicId } })}
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

      <section className="flex items-center justify-end gap-3 mb-12">
        <Dropdown
          options={sortOptions}
          value={sort}
          onChange={(val) => setSort(val as 'LATEST' | 'POPULAR')}
          className="w-40 h-9"
        />
        <div className="w-72">
          <SearchBar
            variant="dark"
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword('')}
            containerClassName="h-9 border-base-700"
          />
        </div>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
        {characters.map((char) => (
          <article key={char.publicId} className="group cursor-pointer" onClick={() => setSelectedCharacter(char)}>
            <div className="relative aspect-4/5 mb-4 overflow-hidden rounded-[20px] bg-base-900 border border-base-800">
              <img src={char.imageUrl} alt={char.name} className="size-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100" />
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10"><ClockIcon /><span className="text-[10px] font-bold">{char.useCount}</span></div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-header-4 font-bold text-base-50">{char.name}</h3>
              <div className="text-body-4 text-base-500 line-clamp-2">{char.description}</div>
              <div className="flex items-center gap-2 text-primary pt-1.5">
                <div className="size-5 rounded bg-base-800 flex items-center justify-center border border-white/5"><LinkIcon /></div>
                <span className="text-[11px] font-bold">{char.creatorNickname}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasNext && (
        <div className="flex justify-center mt-16">
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
