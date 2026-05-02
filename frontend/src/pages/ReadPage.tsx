import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import api from '../api/auth';

export default function ReadPage() {
  const { id } = useParams();
  const [chapter, setChapter] = useState<any>(null);

  useEffect(() => { api.get(`/chapters/${id}`).then(r => setChapter(r.data)); }, [id]);

  if (!chapter) return <div className="flex items-center justify-center h-64 text-slate-500">Жүктелуде...</div>;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <Link to={`/novel/${chapter.novel_id}`} className="flex items-center gap-1 text-slate-500 hover:text-white text-sm mb-6 transition">
        <ArrowLeft size={14} /> {chapter.novel_title}
      </Link>

      {/* Title */}
      <div className="mb-8 pb-6 border-b border-[#2a2d3e]">
        <p className="text-[#1a9e75] text-sm mb-1">{chapter.chapter_num}-тарау</p>
        <h1 className="text-xl font-bold text-white">{chapter.title}</h1>
      </div>

      {/* Content */}
      <div className="prose text-slate-300 leading-8 text-base whitespace-pre-line mb-12">
        {chapter.content}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-[#2a2d3e] pt-6">
        {chapter.prev_id ? (
          <Link to={`/read/${chapter.prev_id}`}
            className="flex items-center gap-2 px-4 py-2 border border-[#2a2d3e] text-slate-400 rounded-lg text-sm hover:border-[#1a9e75] hover:text-white transition">
            <ChevronLeft size={16} /> Алдыңғы тарау
          </Link>
        ) : <div />}
        {chapter.next_id ? (
          <Link to={`/read/${chapter.next_id}`}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a9e75] text-white rounded-lg text-sm hover:bg-[#0f6e56] transition">
            Келесі тарау <ChevronRight size={16} />
          </Link>
        ) : <div className="text-slate-500 text-sm">Аяқталды</div>}
      </div>
    </main>
  );
}
