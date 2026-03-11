/**
 * Navbar Component
 * Top header with branding, date, notifications, and user menu
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Bell, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950 border-b border-slate-800 z-40 flex items-center justify-between px-6">
      {/* Left side - Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-amber-500 hidden md:block">
          SiteOS Enterprise
        </h1>
        <p className="text-sm text-slate-400">{today}</p>
      </div>

      {/* Right side - Notifications and User Menu */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-slate-50 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm text-slate-50 hidden sm:block">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-lg z-50">
              {/* Profile */}
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-sm text-slate-400">Logged in as</p>
                <p className="text-slate-50 font-semibold">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <p className="text-xs text-amber-500 mt-1 font-medium">{user?.role?.replace('_', ' ')}</p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-slate-800 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
