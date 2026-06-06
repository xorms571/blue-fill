import { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import InstagramPostCard from '../../components/common/InstagramPostCard';
import { api } from '../../lib/api';

const FeedPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 임시로 더미 데이터 사용 (서버에 피드 API 구현 전까지)
    const mockPosts = [
      {
        id: 1,
        user: {
          imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
          instagramId: "@cyber_ninja",
          characterName: "야마다 료",
          tags: ["#결속밴드"]
        },
        postImageUrl: "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1000",
        date: "2026.05.25",
        caption: "오늘 3시에 커피 마셨어. 맛있다!"
      },
      {
        id: 2,
        user: {
          imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
          instagramId: "@neon_dreamer",
          characterName: "고죠 사토루",
          tags: ["#주술회전"]
        },
        postImageUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=1000",
        date: "2026.06.12",
        caption: "영역 전개. 무량공처."
      }
    ];

    setPosts(mockPosts);
    setLoading(false);

    /* 
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const response = await api.get('/feed'); // 예상되는 API 경로
        setPosts(response.data);
      } catch (err) {
        console.error('Failed to fetch feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
    */
  }, []);

  return (
    <PageLayout containerClassName="max-w-xl mx-auto">
      <header className="mb-12 space-y-2">
        <h1 className="text-header-1 font-bold text-base-50">Log Feed</h1>
        <p className="text-body-3 text-base-500">다른 사람들의 일상 로그를 탐색해보세요.</p>
      </header>

      <div className="flex flex-col gap-12">
        {posts.map((post) => (
          <InstagramPostCard
            key={post.id}
            user={post.user}
            postImageUrl={post.postImageUrl}
            date={post.date}
            caption={post.caption}
          />
        ))}

        {loading && <div className="text-center py-20 text-base-500">Loading feed...</div>}
        
        {!loading && posts.length === 0 && (
          <div className="py-40 text-center text-base-600">
            <p>공유된 로그가 아직 없습니다.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default FeedPage;
