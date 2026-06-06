import { Routes, Route } from 'react-router-dom';
import DesignPage from './pages/design/page';
import CharacterLibraryPage from './pages/library/page';
import CharacterCreationPage from './pages/character-creation/CharacterCreationPage';
import ProfilePage from './pages/profile/page';
import CallbackPage from './pages/auth/CallbackPage';
import AuthModal from './components/auth/AuthModal';
import AuthInitializer from './components/auth/AuthInitializer';

function App() {
  return (
    <>
      <AuthInitializer />
      <Routes>
        {/* Character Library is now the home page */}
        <Route path="/" element={<CharacterLibraryPage />} />
        
        {/* Other active routes */}
        <Route path="/library/new" element={<CharacterCreationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users/:publicId" element={<ProfilePage />} />
        <Route path="/auth/callback" element={<CallbackPage />} />
        <Route path="/design-system" element={<DesignPage />} />

        {/* 
          Log Room routes are temporarily hidden as requested.
          <Route path="/log-rooms" element={<LogRoomListPage />} />
          <Route path="/log-rooms/:publicId" element={<LogRoomPage />} />
          <Route path="/log-rooms/:publicId/chats" element={<ChatRoomPage />} />
          <Route path="/feed" element={<FeedPage />} /> 
        */}
      </Routes>
      <AuthModal />
    </>
  );
}

export default App;
