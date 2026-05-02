import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Star, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import api, { useAuth } from '../api/auth';

export default function NovelPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [novel, setNovel]       = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [reviews, setReviews]   = useState<any[]>([]);

  useEffect(() => {
    api.get(`/novels/${id}`).then(r => setNovel(r.data));
    api.get(`/chapters/novel/${id}`).then(r => setChapters(r.data));
    api.get(`/novels/${id}/reviews`).then(r => setReviews(r.data));
  }, [id]);

  const toggleBookmark = async () => {
    if (!user) return;
    if (bookmarked) {
      await api.delete(`/users/me/bookmarks/${id}`);
    } else {
      await api.post('/users/me/bookmarks', { novel_id: id });
    }
    setBookmarked(!bookmarked);
  };

  if (!novel) return <div className="flex items-center justify-center h-64 text-slate-500">Жүктелуде...</div>;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Top section */}
      <div className="flex gap-8 mb-10">
        {/* Cover */}
        <div className="w-40 h-56 rounded-xl bg-[#1a1d27] border border-[#2a2d3e] flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: `hsl(${(novel.id * 47) % 360}, 40%, 20%)` }}>
          {novel.cover_url ? <img src={novel.cover_url} className="w-full h-full object-cover" /> : <BookOpen size={40} className="text-white/20" />}
        </div>

        {/* Info */}
        <div className="flex-1">
          <span className="text-xs px-2 py-1 bg-[#1a9e75]/20 text-[#1a9e75] rounded-full mb-2 inline-block">{novel.genre}</span>
          <h1 className="text-2xl font-bold text-white mb-1">{novel.title}</h1>
          <p className="text-slate-400 text-sm mb-4">{novel.author_name} · {novel.chapter_count} тарау</p>

          <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
            <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400" />{novel.rating?.toFixed(1)}</span>
            <span className="flex items-center gap-1"><Eye size={14} />{novel.views?.toLocaleString()}</span>
            <span className={novel.status === 'completed' ? 'text-green-400' : 'text-slate-400'}>
              {novel.status === 'completed' ? 'Аяқталды' : 'Жалғасуда'}
            </span>
          </div>

          <p className="text-slate-400 text-sm mb-6 leading-relaxed">{novel.description}</p>

          <div className="flex gap-3">
            {chapters[0] && (
              <Link to={`/read/${chapters[0].id}`}
                className="px-5 py-2 bg-[#1a9e75] text-white rounded-lg text-sm font-medium hover:bg-[#0f6e56] transition">
                Оқуды бастау
              </Link>
            )}
            <button onClick={toggleBookmark}
              className="flex items-center gap-2 px-4 py-2 border border-[#2a2d3e] text-slate-300 rounded-lg text-sm hover:border-[#1a9e75] transition">
              {bookmarked ? <BookmarkCheck size={16} className="text-[#1a9e75]" /> : <Bookmark size={16} />}
              {bookmarked ? 'Сақталды' : 'Сақтау'}
            </button>
          </div>
        </div>
      </div>

      {/* Chapters list */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Тараулар</h2>
        <div className="space-y-1">
          {chapters.map(ch => (
            <Link key={ch.id} to={`/read/${ch.id}`}
              className="flex items-center justify-between px-4 py-3 bg-[#1a1d27] border border-[#2a2d3e] rounded-lg hover:border-[#1a9e75]/40 transition group">
              <span className="text-sm text-slate-300 group-hover:text-white">{ch.chapter_num}-тарау · {ch.title}</span>
              <span className="text-xs text-slate-600">{ch.word_count} сөз</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Пікірлер</h2>
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="p-4 bg-[#1a1d27] border border-[#2a2d3e] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-[#1a9e75] flex items-center justify-center text-white text-xs font-bold">
                    {r.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-white">{r.username}</span>
                  <div className="flex ml-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-400">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
