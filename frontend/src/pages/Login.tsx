import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../api/auth';
import api from '../api/auth';

// ── Login ────────────────────────────────────────────
export function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');
  const [err, setErr]       = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setErr('');
    try { await login(email, pass); navigate('/'); }
    catch { setErr('Электрондық пошта немесе құпия сөз қате'); }
    finally { setLoading(false); }
  };

  return <AuthLayout title="Жүйеге кіру" link={{ to: '/register', label: 'Тіркелу' }}>
    <Input icon={<Mail size={16} />} placeholder="Электрондық пошта" value={email} onChange={setEmail} type="email" />
    <Input icon={<Lock size={16} />} placeholder="Құпия сөз" value={pass} onChange={setPass} type="password" />
    {err && <p className="text-red-400 text-sm">{err}</p>}
    <button onClick={submit} disabled={loading}
      className="w-full py-2.5 bg-[#1a9e75] text-white rounded-xl font-medium hover:bg-[#0f6e56] transition disabled:opacity-60">
      {loading ? 'Жүктелуде...' : 'Кіру'}
    </button>
  </AuthLayout>;
}

// ── Register ─────────────────────────────────────────
export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [pass, setPass]         = useState('');
  const [err, setErr]           = useState('');
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    setLoading(true); setErr('');
    try {
      const r = await api.post('/auth/register', { username, email, password: pass });
      localStorage.setItem('token', r.data.token);
      navigate('/');
      window.location.reload();
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Тіркелу қатесі');
    } finally { setLoading(false); }
  };

  return <AuthLayout title="Тіркелу" link={{ to: '/login', label: 'Кіру' }}>
    <Input icon={<User size={16} />} placeholder="Пайдаланушы аты" value={username} onChange={setUsername} />
    <Input icon={<Mail size={16} />} placeholder="Электрондық пошта" value={email} onChange={setEmail} type="email" />
    <Input icon={<Lock size={16} />} placeholder="Құпия сөз" value={pass} onChange={setPass} type="password" />
    {err && <p className="text-red-400 text-sm">{err}</p>}
    <button onClick={submit} disabled={loading}
      className="w-full py-2.5 bg-[#1a9e75] text-white rounded-xl font-medium hover:bg-[#0f6e56] transition disabled:opacity-60">
      {loading ? 'Жүктелуде...' : 'Тіркелу'}
    </button>
  </AuthLayout>;
}

// ── Shared components ────────────────────────────────
function Input({ icon, placeholder, value, onChange, type = 'text' }: any) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-[#1a1d27] border border-[#2a2d3e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-[#1a9e75]" />
    </div>
  );
}

function AuthLayout({ title, children, link }: any) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BookOpen className="text-[#1a9e75]" size={28} />
            <span className="text-2xl font-bold text-white">Fread<span className="text-[#1a9e75]">Zone</span></span>
          </div>
          <p className="text-slate-400 text-sm">Ашық онлайн веб-роман платформасы</p>
        </div>
        <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl p-6 space-y-4">
          <div className="flex gap-2 mb-2">
            {[{ to: '/login', label: 'Кіру' }, { to: '/register', label: 'Тіркелу' }].map(tab => (
              <Link key={tab.to} to={tab.to}
                className={`flex-1 py-2 text-center text-sm rounded-lg transition ${tab.label === link.label ? 'bg-[#0f1117] text-white font-medium' : 'text-slate-400 hover:text-white'}`}>
                {tab.label}
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Login;
