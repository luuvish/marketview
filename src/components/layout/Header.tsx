import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard' },
  { path: '/stocks', label: 'Stocks' },
  { path: '/korean', label: 'Korean' },
  { path: '/crypto', label: 'Crypto' },
  { path: '/forex', label: 'Forex' },
  { path: '/metals', label: 'Metals' },
];

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="border-b border-gray-700/50 bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-white tracking-tight">
          Marketview
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === item.path
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link to="/settings" className="btn-ghost text-sm">
          Settings
        </Link>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex overflow-x-auto px-4 pb-2 gap-1 scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
              pathname === item.path
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
