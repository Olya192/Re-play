import { ConfigProvider, theme } from 'antd';
import { useEffect, useMemo, ReactNode } from 'react';
import { useDispatch, useSelector } from '../store';
import { loadThemeData } from '../slices/themeSlice';

interface AntdThemeSyncProps {
  children: ReactNode;
}

export const AntdThemeSync = ({ children }: AntdThemeSyncProps) => {
  const dispatch = useDispatch();
  const { currentTheme, status } = useSelector((state) => state.theme);
  const isDark = currentTheme?.theme === 'dark';

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadThemeData(1));
    }
  }, [dispatch, status]);

  const antdThemeConfig = useMemo(
    () => ({
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorBgBase: isDark ? '#0D1117' : '#ffffff',
        colorTextBase: isDark ? '#F0F6FC' : '#1e1e1e',
        colorPrimary: isDark ? '#58A6FF' : '#3369f3',
        colorBgContainer: isDark ? '#161B22' : '#f8f8f8',
        colorBorder: isDark ? '#30363D' : '#f0f0f0',
        colorTextSecondary: isDark ? '#8B949E' : '#999',
      },
    }),
    [isDark]
  );

  return <ConfigProvider theme={antdThemeConfig}>{children}</ConfigProvider>;
};
