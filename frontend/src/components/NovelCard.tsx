import { Link } from 'react-router-dom';
import { Star, BookOpen } from 'lucide-react';

interface Novel {
  id: number; title: string; author_name: string; genre: string;
  cover_url?: string; rating: number; chapter_count: number; status: string; views: number;
}

const GENRE_COLORS: Record<string, string> = {
  fantasy: 'bg-purple-900/50 text-purple-300',
  'sci-fi': 'bg-blue-900/50 text-blue-300',
  romance: 'bg-pink-900/50 text-pink-300',
  thriller: 'bg-red-900/50 text-red-300',
  history: 'bg-amber-900/50 text-amber-300',
  drama: 'bg-teal-900/50 text-teal-300',
};

const STATUS_LABELS: Record<string, string> = {
  ongoing: 'Жалғасуда', completed: 'Аяқталды', hiatus: 'Кідіріс',
};

export default function NovelCard({ novel }: { novel: Novel }) {
  const genreColor = GENRE_COLORS[novel.genre] || 'bg-slate-800 text-slate-300';
  const coverBg = `hsl(${(novel.id * 47) % 360}, 40%, 20%)`;

  return (
    <Link to={`/novel/${novel.id}`} className="group block">
      <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl overflow-hidden hover:border-[#1a9e75]/50 transition-all duration-200 hover:-translate-y-0.5">
        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden" style={{ background: coverBg }}>
          {novel.cover_url ? (
            <img src={novel.cover_url} alt={novel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={40} className="text-white/20" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${genreColor}`}>
              {novel.genre}
            </span>
          </div>
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] text-white">{novel.rating?.toFixed(1)}</span>
          </div>
        </div>
        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug mb-1">{novel.title}</h3>
          <p className="text-[11px] text-slate-500 mb-2">{novel.author_name}</p>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>{novel.chapter_count} тарау</span>
            <span className={novel.status === 'completed' ? 'text-green-400' : 'text-slate-400'}>
              {STATUS_LABELS[novel.status]}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
