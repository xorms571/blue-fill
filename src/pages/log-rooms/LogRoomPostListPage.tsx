import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import { MonthCalendar } from '../../components/common/MonthCalendar';
import { PostDetailModal } from '../../components/log-rooms/PostDetailModal';
import * as logRoomApi from '../../lib/logRoomApi';
import type { SharedPost, PostShareResponse } from '../../lib/logRoomApi';
import { getErrorMessage, getImageUrl } from '../../lib/utils';

const SkeletonCard = () => (
  <div className="bg-base-950/40 border border-base-900/60 rounded-[28px] overflow-hidden animate-pulse">
    <div className="aspect-video bg-base-900" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-base-900 rounded-lg w-1/2" />
      <div className="h-3 bg-base-900 rounded-lg w-1/3" />
    </div>
  </div>
);

const LogRoomPostListPage = () => {
  const location = useLocation();
  const newPostRef = useRef((location.state as { newPost?: PostShareResponse } | null)?.newPost ?? null);

  const [posts, setPosts] = useState<SharedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SharedPost | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async (isFirst = true) => {
    setLoading(true);
    try {
      const cursor = isFirst ? undefined : (nextCursor || undefined);
      const response = await logRoomApi.getPosts({ cursor, size: 12 });

      const nextPosts = isFirst ? response.content : [...posts, ...response.content];
      setPosts(nextPosts);
      setNextCursor(response.nextCursor);
      setHasNext(response.hasNext);
      setTotal(response.total);

      // 방금 공유 버튼을 눌러 넘어온 경우, 새로 생긴 게시물의 상세를 곧바로 열어 보여준다.
      if (isFirst && newPostRef.current) {
        const justShared = nextPosts.find(p => p.publicId === newPostRef.current?.publicId);
        if (justShared) setSelectedPost(justShared);
        newPostRef.current = null;
      }
    } catch (err) {
      console.error(getErrorMessage(err, '게시물 목록을 가져오는 중 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 마운트 시 목록을 페칭하는 표준 패턴 — react-hooks v7의 set-state-in-effect는
    // fetchPosts 내부의 setState를 정적으로 감지해 여기서 오탐 경고를 낸다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts(true);
  }, []);

  useEffect(() => {
    if (!isCalendarOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen]);

  const filteredPosts = posts.filter(post => {
    if (dateFilter && post.postDate !== dateFilter) return false;
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      const matchesSharer = post.sharer.nickname.toLowerCase().includes(keyword);
      const matchesAuthor = post.photos.some(p => p.authorName.toLowerCase().includes(keyword));
      if (!matchesSharer && !matchesAuthor) return false;
    }
    return true;
  });

  return (
    <PageLayout>
      <PageHeader
        category="Home"
        title="홈"
        description="로그방에서 공유된 로그들을 한 곳에서 확인해보세요."
      />

      <div className="flex items-center justify-between my-6">
        <div className="flex items-center text-body-1 font-bold gap-2">
          <h3 className="text-base-300">게시물</h3>
          <div className="border-l border-base-700 h-4.5" />
          <span className="text-base-500">{total}</span>
        </div>

        <div className="flex items-center gap-3">
          <div ref={calendarRef} className="relative">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 h-9 px-4 rounded-full bg-base-950 border border-base-700 text-base-300 hover:text-white transition-colors text-sm font-medium"
            >
              <Calendar size={16} />
              {dateFilter ? dateFilter.replaceAll('-', '. ') : '전체 날짜'}
            </button>
            {isCalendarOpen && (
              <div className="absolute right-0 top-full mt-2 bg-background-main border border-gray-700 rounded-2xl p-4 shadow-xl z-50">
                <MonthCalendar
                  value={dateFilter || ''}
                  onChange={(date) => {
                    setDateFilter(date === dateFilter ? null : date);
                    setIsCalendarOpen(false);
                  }}
                />
              </div>
            )}
          </div>
          <div className="w-55">
            <SearchBar
              variant="dark"
              placeholder="Search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onClear={() => setSearchKeyword('')}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && posts.length === 0 ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filteredPosts.map((post) => {
            const mainPhoto = post.photos[0];
            return (
              <article
                key={post.publicId}
                className="group bg-base-950 rounded-[28px] overflow-hidden border border-base-900 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(98,246,181,0.1)] transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="relative aspect-video bg-base-900 overflow-hidden">
                  {mainPhoto ? (
                    <img
                      src={getImageUrl(mainPhoto.imageUrl) || ''}
                      alt={mainPhoto.caption || 'Log'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-base-700 text-sm">사진 없음</div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-1.5 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Clock size={12} />
                    {post.timeSlot.toString().padStart(2, '0')}:00
                  </div>

                  {post.photos.length > 1 && (
                    <div className="absolute top-4 right-4 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      +{post.photos.length - 1}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-[11px] text-base-500 font-medium truncate mb-2">{post.postDate}</p>
                  <div className="flex items-center gap-2">
                    <img
                      src={getImageUrl(post.sharer.profileImageUrl) || '/default-profile.png'}
                      alt={post.sharer.nickname}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-base-300 truncate">{post.sharer.nickname}</span>
                    {post.isMine && (
                      <span className="text-[10px] text-primary border border-primary/40 rounded-full px-2 py-0.5 ml-auto">내 공유</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}

        {filteredPosts.length === 0 && !loading && (
          <div className="col-span-full py-40 text-center border-2 border-dashed border-base-900/50 rounded-[40px] bg-base-950/20">
            <h3 className="text-header-3 text-base-400 font-bold">공유된 게시물이 없습니다</h3>
            <p className="text-body-2 text-base-600 mt-2 max-w-sm mx-auto">로그방에서 로그를 공유하면 여기에서 모아볼 수 있어요.</p>
          </div>
        )}
      </div>

      {hasNext && (
        <div className="flex justify-center mt-20">
          <Button
            variant="Darkoutline"
            size="l"
            className="rounded-2xl px-12"
            loading={loading}
            onClick={() => fetchPosts(false)}
          >
            게시물 더보기
          </Button>
        </div>
      )}

      <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </PageLayout>
  );
};

export default LogRoomPostListPage;
