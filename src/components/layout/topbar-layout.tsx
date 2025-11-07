import { Outlet } from 'react-router-dom';
import { Topbar } from './topbar';

export function TopbarLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

