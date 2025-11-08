import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
      <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
    </div>
  );
}

export function ThemeToggleWithLabel() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor="dark-mode" className="flex items-center gap-2 cursor-pointer">
        <Sun className="h-4 w-4" />
        <span>Dark Mode</span>
        <Moon className="h-4 w-4" />
      </Label>
      <Switch
        id="dark-mode"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
    </div>
  );
}

