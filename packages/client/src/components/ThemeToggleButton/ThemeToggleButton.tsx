import { useTheme } from '../../hooks/useTheme';
import { useSelector } from '../../store';
import { selectUser } from '../../slices/userSlice';
import './ThemeToggleButton.css';

interface ThemeToggleButtonProps {
  userId?: number;
  className?: string;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ userId, className = '' }) => {
  const user = useSelector(selectUser);
  const { availableThemes, currentTheme, setTheme } = useTheme();
  const resolvedUserId = userId ?? user?.id;

  const themeName = currentTheme?.theme || 'light';
  const isDark = themeName === 'dark';
  const icon = isDark ? '☀︎' : '⏾';

  const handleToggle = () => {
    const targetThemeName = isDark ? 'light' : 'dark';
    const targetTheme = availableThemes.find((theme) => theme.theme === targetThemeName);

    if (!targetTheme) {
      return;
    }

    if (!resolvedUserId) {
      return;
    }

    setTheme(resolvedUserId, targetTheme.id);
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
