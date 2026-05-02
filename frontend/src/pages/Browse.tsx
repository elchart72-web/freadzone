import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import api from '../api/auth';
import NovelCard from '../components/NovelCard';

const GENRES   = ['fantasy','sci-fi','romance','thriller','history','drama'];
const STATUSES = ['ongoing','completed','hiatus'];
const SORTS    = [{ val: 'views', label: 'Танымал' }, { val: 'rating', label: 'Рейтинг' }, { val: 'newest', label: 'Жаңа' }];

export default function Browse() {
  const [novels, setNovels]   = useState<any[]>([]);
  const [total, setTotal]     = useState(0);
  const [search, setSearch]   = useState('');
  const [genre, setGenre]     = useState('');
  const [status, setStatus]   = useState('');
  const [sort, setSort]       = useState('views');
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { sort, limit: 24 };
      if (search) params.search = search;
      if (genre)  params.genre  = genre;
      if (status) params.status = status;
      const r = await api.get('/novels', { params });
      setNovels(r.data.novels);
      setTotal(r.data.total);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [genre, status, sort]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Романдарды шолу</h1>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetch()}
            placeholder="Атауы немесе кілт сөз бойынша іздеу..."
            className="w-full bg-[#1a1d27] border border-[#2a2d3e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-[#1a9e75]" />
        </div>
        <button onClick={fetch}
          className="px-5 py-2.5 bg-[#1a9e75] text-white rounded-xl text-sm font-medium hover:bg-[#0f6e56] transition">
          Іздеу
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Сұрыптау:</span>
          {SORTS.map(s => (
            <button key={s.val} onClick={() => setSort(s.val)}
              className={`px-3 py-1 rounded-full border transition ${sort === s.val ? 'bg-[#1a9e75] border-[#1a9e75] text-white' : 'border-[#2a2d3e] text-slate-400 hover:border-[#1a9e75]'}`}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Жанр:</span>
          <button onClick={() => setGenre('')}
            className={`px-3 py-1 rounded-full border transition ${!genre ? 'bg-[#1a9e75] border-[#1a9e75] text-white' : 'border-[#2a2d3e] text-slate-400 hover:border-[#1a9e75]'}`}>
            Барлығы
          </button>
          {GENRES.map(g => (
            <button key={g} onClick={() => setGenre(g)}
              className={`px-3 py-1 rounded-full border transition ${genre === g ? 'bg-[#1a9e75] border-[#1a9e75] text-white' : 'border-[#2a2d3e] text-slate-400 hover:border-[#1a9e75]'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-slate-500 text-sm mb-4">{total} роман табылды</p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-[#1a1d27] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {novels.map(n => <NovelCard key={n.id} novel={n} />)}
        </div>
      )}
    </main>
  );
}
