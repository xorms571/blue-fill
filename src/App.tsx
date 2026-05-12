import { Routes, Route } from 'react-router-dom';
import DesignPage from './pages/design/page';
import CharacterLibraryPage from './pages/library/page';
import AuthModal from './components/auth/AuthModal';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DesignPage />} />
        <Route path="/library" element={<CharacterLibraryPage />} />
      </Routes>
      <AuthModal />
    </>
  );
}

export default App;
