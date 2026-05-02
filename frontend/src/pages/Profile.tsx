import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bookmark, Book, Clock, Star } from 'lucide-react';
import { useAuth } from '../api/auth';
import api from '../api/auth';
import NovelCard from '../components/NovelCard';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats]         = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/users/me/stats').then(r => setStats(r.data));
    api.get('/users/me/bookmarks').then(r => setBookmarks(r.data));
  }, [user]);

  if (!user) return null;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex items-start gap-6 mb-8 p-6 bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-[#1a9e75] flex items-center justify-center text-white text-2xl font-bold">
          {user.username[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{user.username}</h1>
          <p className="text-slate-500 text-sm">{user.email} · {user.role}</p>
        </div>
        <button onClick={() => { logout(); navigate('/'); }}
          className="px-4 py-2 border border-[#2a2d3e] text-slate-400 rounded-lg text-sm hover:border-red-400 hover:text-red-400 transition">
          Шығу
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Bookmark, label: 'Бетбелгілер', val: stats.bookmarks_count },
            { icon: Star,     label: 'Пікірлер',    val: stats.reviews_count },
            { icon: Book,     label: 'Оқыған тараулар', val: stats.chapters_read },
            { icon: Clock,    label: 'Оқу уақыты',   val: `${Math.round(stats.total_time_spent / 60)} мин` },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="p-4 bg-[#1a1d27] border border-[#2a2d3e] rounded-xl text-center">
              <Icon size={20} className="text-[#1a9e75] mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{val}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Bookmarks */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Сақталған романдар <span className="text-slate-500 font-normal text-sm">({bookmarks.length})</span>
        </h2>
        {bookmarks.length === 0 ? (
          <p className="text-slate-500 text-sm">Әзірше бетбелгілер жоқ. <Link to="/browse" className="text-[#1a9e75]">Романдарды шолу</Link></p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {bookmarks.map(b => <NovelCard key={b.novel_id} novel={{ ...b, id: b.novel_id, chapter_count: b.chapter_count }} />)}
          </div>
        )}
      </div>
    </main>
  );
}
