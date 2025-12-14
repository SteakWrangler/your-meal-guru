import { useState, useEffect } from 'react';
import { network } from '@/lib/mobile';

interface NetworkStatus {
  connected: boolean;
  connectionType: string;
}

/**
 * Hook to monitor network connectivity status
 */
export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    connected: true,
    connectionType: 'unknown',
  });

  useEffect(() => {
    // Get initial status
    network.getStatus().then(setStatus);

    // Listen for changes
    const removeListener = network.addListener(setStatus);

    return removeListener;
  }, []);

  return status;
}
