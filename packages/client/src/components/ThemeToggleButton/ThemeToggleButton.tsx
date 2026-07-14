import { useTheme } from '../../hooks/useTheme';
import './ThemeToggleButton.css';

interface ThemeToggleButtonProps {
  userId?: number;
  className?: string;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  userId = 1,
  className = '',
}) => {
  const { availableThemes, currentTheme, setTheme } = useTheme();

  const themeName = currentTheme?.theme || 'light';
  const isDark = themeName === 'dark';
  const icon = isDark ? '☀︎' : '⏾';

  const handleToggle = () => {
    const targetThemeName = isDark ? 'light' : 'dark';
    const targetTheme = availableThemes.find((theme) => theme.theme === targetThemeName);

    if (!targetTheme) {
      return;
    }

    setTheme(userId, targetTheme.id);
  };

  return (
    <button
      className={`theme-toggle theme-toggle--${themeName} ${className}`}
      onClick={handleToggle}
    >
      <span className="theme-toggle__icon">{icon}</span>
    </button>
  );
};
