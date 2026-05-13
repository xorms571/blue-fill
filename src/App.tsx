import { Routes, Route } from 'react-router-dom';
import DesignPage from './pages/design/page';
import CharacterLibraryPage from './pages/library/page';
import ProfilePage from './pages/profile/page';
import CallbackPage from './pages/auth/CallbackPage';
import AuthModal from './components/auth/AuthModal';
import AuthInitializer from './components/auth/AuthInitializer';

function App() {
  return (
    <>
      <AuthInitializer />
      <Routes>
        <Route path="/" element={<DesignPage />} />
        <Route path="/library" element={<CharacterLibraryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth/callback" element={<CallbackPage />} />
      </Routes>
      <AuthModal />
    </>
  );
}

export default App;
