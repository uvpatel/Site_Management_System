/**
 * AppLayout Component
 * Main layout wrapper with Sidebar, Navbar, and content area
 * Provides consistent layout structure across all authenticated pages
 */

import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AppContext } from '../../context/AppContext';

const AppLayout = () => {
  const { dataLoading, dataError } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-6 overflow-auto">
          {dataError && (
            <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              {dataError}
            </div>
          )}
          {dataLoading && (
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              Refreshing site data...
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
