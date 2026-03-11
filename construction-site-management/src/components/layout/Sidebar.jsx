/**
 * Sidebar Component
 * Navigation menu with role-based visibility
 * Shows/hides menu items based on user role
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Users,
  Package,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Role-based navigation visibility
  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      roles: ['Admin', 'Project_Manager', 'Site_Engineer', 'Storekeeper'],
    },
    {
      label: 'Projects',
      path: '/projects',
      icon: FolderOpen,
      roles: ['Admin', 'Project_Manager', 'Site_Engineer'],
    },
    {
      label: 'Tasks',
      path: '/tasks',
      icon: CheckSquare,
      roles: ['Project_Manager', 'Site_Engineer'],
    },
    {
      label: 'Workforce',
      path: '/workforce',
      icon: Users,
      roles: ['Admin', 'Site_Engineer'],
    },
    {
      label: 'Inventory',
      path: '/inventory',
      icon: Package,
      roles: ['Admin', 'Project_Manager', 'Storekeeper'],
    },
    {
      label: 'Finance',
      path: '/finance',
      icon: BarChart3,
      roles: ['Admin', 'Project_Manager'],
    },
  ];

  // Filter items based on user role
  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden bg-slate-900 p-2 rounded-lg border border-slate-800 text-amber-500"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-800 pt-20 md:pt-0 transition-transform duration-300 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-amber-500 mb-8">SiteOS</h1>

          <nav className="space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
          <div className="text-sm">
            <p className="text-slate-400">Logged in as</p>
            <p className="text-slate-50 font-semibold">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
