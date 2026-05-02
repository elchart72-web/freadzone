import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Bell, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../api/auth';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0f1117]/95 backdrop-blur border-b border-[#2a2d3e]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white shrink-0">
          <BookOpen className="text-[#1a9e75]" size={24} />
          <span>Fread<span className="text-[#1a9e75]">Zone</span></span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <Link to="/"       className="hover:text-white transition">Басты бет</Link>
          <Link to="/browse" className="hover:text-white transition">Шолу</Link>
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <button onClick={() => navigate('/browse')} className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#1a1d27] border border-[#2a2d3e] rounded-lg text-slate-400 text-sm hover:border-[#1a9e75] transition">
          <Search size={14} />
          Іздеу...
        </button>

        {/* Auth */}
        {user ? (
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-slate-400 cursor-pointer hover:text-white" />
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-[#1a9e75] flex items-center justify-center text-white font-medium text-sm">
                {user.username[0].toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#1a1d27] border border-[#2a2d3e] rounded-lg py-1 shadow-xl">
                  <Link to="/profile" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#2a2d3e]">
                    <User size={14} /> Профиль
                  </Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#2a2d3e]">
                    <LogOut size={14} /> Шығу
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-slate-400 hover:text-white transition">Кіру</Link>
            <Link to="/register" className="text-sm px-4 py-1.5 bg-[#1a9e75] text-white rounded-lg hover:bg-[#0f6e56] transition">
              Тіркелу
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
