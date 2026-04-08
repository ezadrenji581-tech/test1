import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Courses } from '@/pages/Courses';
import { CourseDetail } from '@/pages/CourseDetail';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <HashRouter>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </HashRouter>
      <Toaster position="top-center" richColors />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
