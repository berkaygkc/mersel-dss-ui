import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  FileCode,
  Mail,
  Clock,
  CreditCard,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useTubitakCredit } from '@/hooks/use-certificates';
import { useTimestampStatus } from '@/hooks/use-timestamp';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'PDF', href: '/pdf-sign', icon: FileText },
  { name: 'XML', href: '/xml-sign', icon: FileCode },
  { name: 'SOAP', href: '/soap-sign', icon: Mail },
  { name: 'Timestamp', href: '/timestamp', icon: Clock },
  { name: 'Kontör', href: '/tubitak', icon: CreditCard },
  { name: 'Sertifikalar', href: '/certificates', icon: ShieldCheck },
];

export function Topbar() {
  const location = useLocation();
  const { data: creditData } = useTubitakCredit();
  const { data: timestampData } = useTimestampStatus();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-8">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/50">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-slate-900">Sign API</h1>
              <p className="text-xs text-slate-500 -mt-1">Dijital İmza</p>
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
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
                className="hidden md:inline-flex"
              >
                TSA: {timestampData.available ? 'ON' : 'OFF'}
              </Badge>
            )}

            {/* Credit */}
            {creditData && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <CreditCard className="mr-1 h-3 w-3" />
                {creditData.credit}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

