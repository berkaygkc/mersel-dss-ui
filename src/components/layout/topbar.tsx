import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { useTimestampStatus } from '@/hooks/use-timestamp';
import { cn } from '@/lib/utils';
import {
  Clock,
  CreditCard,
  LayoutDashboard,
  PenTool,
  ShieldCheck,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Ana Sayfa', href: '/', icon: LayoutDashboard },
  { name: 'İmzalama', href: '/sign', icon: PenTool },
  { name: 'Zaman Damgası', href: '/timestamp', icon: Clock },
  { name: 'Tübitak ZD.', href: '/tubitak', icon: CreditCard },
  { name: 'Sertifikalar', href: '/certificates', icon: ShieldCheck },
];

export function Topbar() {
  const location = useLocation();
  const { data: timestampData } = useTimestampStatus();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-8">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-violet-700 shadow-lg shadow-violet-500/50">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold">Sign API</h1>
              <p className="text-xs text-muted-foreground -mt-1">Dijital İmza</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-1 items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Status Indicators */}
          <div className="flex items-center gap-3 ml-4">
            {/* Timestamp Status */}
            {timestampData && (
              <Badge
                variant={timestampData.available ? 'success' : 'destructive'}
                className="hidden md:inline-flex gap-1"
              >
                <Clock className="h-3 w-3" />
                ZD: {timestampData.available ? 'Aktif' : 'Kapalı'}
              </Badge>
            )}


            {/* Theme Toggle */}
            <div className="hidden md:flex">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

