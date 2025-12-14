import { useCallback } from 'react';
import { haptics } from '@/lib/mobile';

/**
 * Hook to easily add haptic feedback to interactions
 */
export function useHaptics() {
  const light = useCallback(() => haptics.light(), []);
  const medium = useCallback(() => haptics.medium(), []);
  const heavy = useCallback(() => haptics.heavy(), []);
  const success = useCallback(() => haptics.success(), []);
  const warning = useCallback(() => haptics.warning(), []);
  const error = useCallback(() => haptics.error(), []);

  return {
    light,
    medium,
    heavy,
    success,
    warning,
    error,
  };
}
