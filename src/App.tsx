import { Routes, Route } from 'react-router-dom';
import DesignPage from './pages/design/page';
import CharacterLibraryPage from './pages/library/page';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DesignPage />} />
      <Route path="/library" element={<CharacterLibraryPage />} />
    </Routes>
  );
}

export default App;
