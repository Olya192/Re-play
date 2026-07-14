import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../store';
import { changeUserTheme, loadThemeData, setThemeOptimistic } from '../slices/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { availableThemes, currentTheme, status, error } = useSelector((state) => state.theme);

  const loadThemes = useCallback(
    (userId?: number) => {
      dispatch(loadThemeData(userId));
    },
    [dispatch]
  );

  const setTheme = useCallback(
    (userId: number | undefined, themeId: number) => {
      const themeObject = availableThemes.find((t) => t.id === themeId);

      if (!themeObject) {
        return;
      }

      dispatch(setThemeOptimistic(themeObject));

      if (userId) {
        dispatch(changeUserTheme({ userId, themeId }));
      }
    },
    [dispatch, availableThemes]
  );

  useEffect(() => {
    if (currentTheme?.theme) {
      document.documentElement.setAttribute('data-theme', currentTheme.theme);
      localStorage.setItem('preferred-theme', currentTheme.theme);
    }
  }, [currentTheme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('preferred-theme');

    if (savedTheme && !currentTheme && availableThemes.length > 0) {
      const found = availableThemes.find((t) => t.theme === savedTheme);

      if (found) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } else if (!currentTheme) {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [availableThemes, currentTheme]);

  return {
    availableThemes,
    currentTheme,
    status,
    error,
    loadThemes,
    setTheme,
  };
};
