import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { statusBar } from '@/lib/mobile';

/**
 * Hook to sync mobile status bar with app theme
 */
export function useMobileTheme() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const isDark = resolvedTheme === 'dark';

    // Update status bar style based on theme
    statusBar.setStyle(isDark);

    // On Android, also update the background color
    const backgroundColor = isDark ? '#1a1410' : '#ffffff';
    statusBar.setBackgroundColor(backgroundColor);
  }, [resolvedTheme]);
}
