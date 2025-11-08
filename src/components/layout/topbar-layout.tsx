import { Outlet } from 'react-router-dom';
import { Topbar } from './topbar';
import { Toaster } from '@/components/ui/sonner';

export function TopbarLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <div className="container mx-auto max-w-7xl px-4 relative">
        <main className="py-8">
          <Outlet />
        </main>
        <div className="toast-container">
          <Toaster richColors position="top-right" />
        </div>
      </div>
    </div>
  );
}

