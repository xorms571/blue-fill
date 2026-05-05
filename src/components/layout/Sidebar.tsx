import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

// --- Icons ---
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LibraryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" /><path d="M7 17h10" /><path d="M7 13h10" /><path d="M7 9h10" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isLibrary = location.pathname === '/library';

  return (
    <nav className={cn(
      "shrink-0 bg-background-main border-base-900 z-50 transition-all duration-300",
      "md:w-16 md:h-screen md:flex md:flex-col md:items-center md:py-8 md:border-r md:gap-10 md:relative",
      "fixed bottom-0 left-0 w-full h-16 flex flex-row items-center justify-around md:justify-start px-6 border-t backdrop-blur-xl bg-background-main/80 md:backdrop-blur-none md:bg-background-main"
    )}>
      <div
        className="hidden md:block text-header-2 font-bold text-base-50 mb-4 cursor-pointer hover:text-primary transition-colors"
        onClick={() => navigate('/')}
      >
        B
      </div>

      <div className="flex flex-row md:flex-col gap-8 md:gap-8 items-center w-full justify-around md:justify-start">
        <button
          className={cn(
            "p-2 transition-colors cursor-pointer rounded-xl",
            isHome ? "text-primary md:bg-primary/10" : "text-base-500 hover:text-primary"
          )}
          onClick={() => navigate('/')}
        >
          <HomeIcon />
        </button>

        <button
          className={cn(
            "p-2 transition-colors cursor-pointer rounded-xl",
            isLibrary ? "text-primary md:bg-primary/10" : "text-base-500 hover:text-primary"
          )}
          onClick={() => navigate('/library')}
        >
          <LibraryIcon />
        </button>

        <button className="p-2 text-base-500 hover:text-primary transition-colors cursor-pointer">
          <ProfileIcon />
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
