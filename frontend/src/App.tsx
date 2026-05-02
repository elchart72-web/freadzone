import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './api/auth';
import Header   from './components/Header';
import Home     from './pages/Home';
import Browse   from './pages/Browse';
import NovelPage from './pages/NovelPage';
import ReadPage  from './pages/ReadPage';
import Profile   from './pages/Profile';
import Login     from './pages/Login';
import Register  from './pages/Register';
import AiAssistant from './components/AiAssistant';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0f1117]">
        <Header />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/browse"    element={<Browse />} />
          <Route path="/novel/:id" element={<NovelPage />} />
          <Route path="/read/:id"  element={<ReadPage />} />
          <Route path="/profile"   element={<Profile />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
        </Routes>
        <AiAssistant />
      </div>
    </AuthProvider>
  );
}
