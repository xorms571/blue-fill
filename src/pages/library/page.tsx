import { useState } from 'react';
import SearchBar from '../../components/common/SearchBar';
import Dropdown from '../../components/common/Dropdown';
import Button from '../../components/common/Button';
import PageLayout from '../../components/layout/PageLayout';
import { cn } from '../../lib/utils';

// --- Icons ---
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3.33331V12.6666M3.33337 8.00002H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
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

// --- Dummy Data ---
const CHARACTERS = [
  { id: 1, name: '야마다 료', img: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=400', desc: '결속밴드의 베이스 담당으로, 무뚝뚝하고 쿨한 성격의 음악 천재 캐릭터다.' },
  { id: 2, name: '고죠 사토루', img: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=400', desc: '주술회전의 최강 주술사. 무하한 주술과 육안을 사용하는 현대 최강의 주술사다.' },
  { id: 3, name: '아냐 포저', img: 'https://images.unsplash.com/photo-1638612913771-8f197bd27048?auto=format&fit=crop&q=80&w=400', desc: '타인의 마음을 읽을 수 있는 초능력자 소녀. 와쿠와쿠한 일상을 좋아한다.' },
  { id: 4, name: '히나타 휴가', img: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=400', desc: '나뭇잎 마을 휴가 일족의 종가 출신 주권사. 백안을 사용한다.' },
  { id: 5, name: '곤 프릭스', img: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400', desc: '헌터가 되기 위해 고향을 떠난 소년. 자연과 교감하는 능력이 뛰어나다.' },
  { id: 6, name: '탄지로 카마도', img: 'https://images.unsplash.com/photo-1621478373722-151d7e62a1c6?auto=format&fit=crop&q=80&w=400', desc: '가족을 잃고 혈귀가 된 여동생을 구하기 위해 귀살대에 들어간 소년.' },
  { id: 7, name: '유메코 쟈바미', img: 'https://images.unsplash.com/photo-1607604276483-4efdd6d4adbb?auto=format&fit=crop&q=80&w=400', desc: '도박을 광적으로 좋아하는 전학생. 리스크가 큰 승부일수록 흥분한다.' },
  { id: 8, name: '미도리야 이즈쿠', img: 'https://images.unsplash.com/photo-1613323593608-abc90fec84ff?auto=format&fit=crop&q=80&w=400', desc: '히어로를 꿈꾸는 소년. 올마이트로부터 원 포 올 개성을 물려받았다.' },
  { id: 9, name: '키리토', img: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&q=80&w=400', desc: '검은 검사라 불리는 솔로 플레이어. 소드 아트 온라인의 영웅이다.' },
  { id: 10, name: '나루토 우즈마키', img: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?auto=format&fit=crop&q=80&w=400', desc: '호카게를 꿈꾸는 닌자 소년. 구미의 인주력이다.' },
];

const CharacterLibraryPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isFABOpen, setIsFABOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<typeof CHARACTERS[0] | null>(null);

  return (
    <PageLayout>
      {/* --- Character Detail Modal --- */}
      {selectedCharacter && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCharacter(null)} />
          <div className="relative w-full max-w-md bg-base-950 border border-base-800 rounded-3xl overflow-hidden shadow-2xl">
            <button onClick={() => setSelectedCharacter(null)} className="absolute top-4 right-4 z-10 text-base-400 hover:text-base-50 transition-colors"><CloseIcon /></button>
            <div className="flex flex-col">
              <div className="aspect-square w-full overflow-hidden"><img src={selectedCharacter.img} alt={selectedCharacter.name} className="w-full h-full object-cover" /></div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-header-2 font-bold text-base-50">{selectedCharacter.name}</h2>
                  <div className="space-y-2">
                     <h4 className="text-caption-1 text-base-600 font-bold uppercase tracking-widest">캐릭터 설명</h4>
                     <p className="text-body-3 text-base-400 leading-relaxed">{selectedCharacter.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                   <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-base-900 border border-white/5 text-primary"><LinkIcon /> <span className="text-[11px] font-bold">wjandf</span></div>
                   <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-base-900 border border-white/5 text-primary"><ClockIcon /> <span className="text-[11px] font-bold">125회</span></div>
                </div>
                <Button variant="solid" fullWidth size="m" className="h-12 rounded-xl text-base-950 font-bold">게시물 만들기</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Main UI --- */}
      <header className="mb-16 space-y-4">
        <span className="text-caption-1 text-base-500 font-bold tracking-widest">LIBRARY</span>
        <h1 className="text-display-2 font-bold tracking-tight">Character Library</h1>
        <p className="text-body-2 text-base-500 max-w-3xl leading-relaxed">BLUEPILL에서 만들어진 모든 캐릭터를 탐색하고, 나만의 캐릭터 제작을 위한 영감을 얻어보세요.</p>
        <Button variant="solid" size="m" className="rounded-full px-10 h-11 text-base-950 font-bold mt-4" leftIcon={<PlusIcon />}>캐릭터 생성하기</Button>
      </header>

      <section className="flex items-center justify-end gap-3 mb-12">
        <Dropdown options={[{ label: 'option', value: 'option' }]} value="option" className="w-40 h-9" />
        <div className="w-72"><SearchBar variant="dark" placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onClear={() => setSearchValue('')} containerClassName="h-9 border-base-700" /></div>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
        {CHARACTERS.map((char) => (
          <article key={char.id} className="group cursor-pointer" onClick={() => setSelectedCharacter(char)}>
            <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-[20px] bg-base-900 border border-base-800">
              <img src={char.img} alt={char.name} className="size-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100" />
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10"><ClockIcon /><span className="text-[10px] font-bold">000 M</span></div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-header-4 font-bold text-base-50">{char.name}</h3>
              <div className="text-body-4 text-base-500">Description<br/>Description</div>
              <div className="flex items-center gap-2 text-primary pt-1.5">
                  <div className="size-5 rounded bg-base-800 flex items-center justify-center border border-white/5"><LinkIcon /></div>
                  <span className="text-[11px] font-bold">Text</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* FAB & Menu */}
      <div className="fixed bottom-12 right-12 z-[150]">
        <div className={cn("absolute bottom-20 right-0 flex flex-col gap-2 transition-all duration-300 origin-bottom scale-95 opacity-0 pointer-events-none", isFABOpen && "scale-100 opacity-100 pointer-events-auto")}>
          <button className="flex items-center gap-3 px-4 py-2.5 bg-base-900 border border-base-800 rounded-xl text-base-50 hover:bg-base-800 transition-all whitespace-nowrap shadow-xl"><PlusIcon /> <span className="text-sm font-bold">게시물</span></button>
          <button className="flex items-center gap-3 px-4 py-2.5 bg-base-900 border border-base-800 rounded-xl text-base-50 hover:bg-base-800 transition-all whitespace-nowrap shadow-xl"><PlusIcon /> <span className="text-sm font-bold">캐릭터 카드</span></button>
        </div>
        <button onClick={() => setIsFABOpen(!isFABOpen)} className={cn("size-16 bg-primary/20 backdrop-blur-2xl border border-primary/40 rounded-full flex items-center justify-center text-primary shadow-2xl transition-all cursor-pointer", isFABOpen ? "rotate-45" : "hover:scale-110")}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
      </div>
    </PageLayout>
  );
};

export default CharacterLibraryPage;
