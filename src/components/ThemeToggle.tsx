import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors focus:outline-none"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <Sun className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 transform ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0'}`} />
        <Moon className={`absolute inset-0 w-5 h-5 transition-all duration-300 transform ${theme === 'light' ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0'}`} />
      </div>
    </button>
  );
}
