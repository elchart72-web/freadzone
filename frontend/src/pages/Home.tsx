import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Pen, TrendingUp, Star } from 'lucide-react';
import api from '../api/auth';
import NovelCard from '../components/NovelCard';

export default function Home() {
  const [novels, setNovels] = useState<any[]>([]);

  useEffect(() => {
    api.get('/novels?sort=views&limit=8').then(r => setNovels(r.data.novels)).catch(() => {});
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1117] via-[#1a1d27] to-[#0f1117] border-b border-[#2a2d3e]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #1a9e75 0%, transparent 50%), radial-gradient(circle at 80% 50%, #3b5ea6 0%, transparent 50%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Оқырмандарға<br />
            <span className="text-[#1a9e75]">үй.</span> Жазушыларға{' '}
            <span className="text-[#1a9e75]">сахна.</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Қашып кеткіңіз келе ме немесе эмоцияларыңызды жеткізгіңіз бе — бұл жерде өзіңізге орын табасыз.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/browse"
              className="flex items-center gap-2 px-8 py-3 bg-[#1a9e75] text-white rounded-full font-medium hover:bg-[#0f6e56] transition-all hover:scale-105">
              <BookOpen size={18} /> Кітапхананы зерттеу
            </Link>
            <Link to="/register"
              className="flex items-center gap-2 px-8 py-3 border border-[#2a2d3e] text-slate-300 rounded-full font-medium hover:border-[#1a9e75] transition-all hover:scale-105">
              <Pen size={18} /> Автор болу
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 mt-16 text-center">
            {[['10+', 'Романдар'], ['50+', 'Тараулар'], ['5+', 'Авторлар']].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-bold text-[#1a9e75]">{n}</div>
                <div className="text-xs text-slate-500 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending novels */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={18} className="text-[#1a9e75]" />
          <h2 className="text-lg font-semibold text-white">Үздік романдар</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {novels.map(novel => <NovelCard key={novel.id} novel={novel} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/browse"
            className="px-6 py-2 border border-[#2a2d3e] text-slate-400 rounded-full text-sm hover:border-[#1a9e75] hover:text-white transition">
            Барлығын көру
          </Link>
        </div>
      </section>
    </main>
  );
}
