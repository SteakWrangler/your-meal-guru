import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Network } from '@capacitor/network';

/**
 * Check if the app is running on a native mobile platform
 */
export const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

/**
 * Get the current platform (ios, android, web)
 */
export const getPlatform = () => {
  return Capacitor.getPlatform();
};

/**
 * Status Bar Management
 */
export const statusBar = {
  /**
   * Set status bar style based on theme
   */
  async setStyle(isDark: boolean) {
    if (!isNativePlatform()) return;

    try {
      await StatusBar.setStyle({
        style: isDark ? Style.Dark : Style.Light,
      });
    } catch (error) {
      console.error('Error setting status bar style:', error);
    }
  },

  /**
   * Set status bar background color
   */
  async setBackgroundColor(color: string) {
    if (!isNativePlatform() || getPlatform() === 'ios') return;

    try {
      await StatusBar.setBackgroundColor({ color });
    } catch (error) {
      console.error('Error setting status bar background:', error);
    }
  },

  /**
   * Hide status bar
   */
  async hide() {
    if (!isNativePlatform()) return;

    try {
      await StatusBar.hide();
    } catch (error) {
      console.error('Error hiding status bar:', error);
    }
  },

  /**
   * Show status bar
   */
  async show() {
    if (!isNativePlatform()) return;

    try {
      await StatusBar.show();
    } catch (error) {
      console.error('Error showing status bar:', error);
    }
  },
};

/**
 * Haptic Feedback
 */
export const haptics = {
  /**
   * Light impact - for subtle interactions
   */
  async light() {
    if (!isNativePlatform()) return;

    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.error('Error triggering light haptic:', error);
    }
  },

  /**
   * Medium impact - for normal interactions
   */
  async medium() {
    if (!isNativePlatform()) return;

    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.error('Error triggering medium haptic:', error);
    }
  },

  /**
   * Heavy impact - for important actions
   */
  async heavy() {
    if (!isNativePlatform()) return;

    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.error('Error triggering heavy haptic:', error);
    }
  },

  /**
   * Success notification
   */
  async success() {
    if (!isNativePlatform()) return;

    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.error('Error triggering success haptic:', error);
    }
  },

  /**
   * Warning notification
   */
  async warning() {
    if (!isNativePlatform()) return;

    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      console.error('Error triggering warning haptic:', error);
    }
  },

  /**
   * Error notification
   */
  async error() {
    if (!isNativePlatform()) return;

    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      console.error('Error triggering error haptic:', error);
    }
  },
};

/**
 * Share functionality
 */
export const share = {
  /**
   * Share content using native share sheet
   */
  async content(options: {
    title?: string;
    text?: string;
    url?: string;
    dialogTitle?: string;
  }) {
    if (!isNativePlatform()) {
      // Fallback to Web Share API if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: options.title,
            text: options.text,
            url: options.url,
          });
          return { success: true };
        } catch (error) {
          console.error('Error sharing via Web Share API:', error);
          return { success: false, error };
        }
      }
      return { success: false, error: 'Share not available' };
    }

    try {
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.dialogTitle || 'Share',
      });
      return { success: true };
    } catch (error) {
      console.error('Error sharing:', error);
      return { success: false, error };
    }
  },

  /**
   * Check if sharing is available
   */
  canShare() {
    return isNativePlatform() || !!navigator.share;
  },
};

/**
 * Network detection
 */
export const network = {
  /**
   * Get current network status
   */
  async getStatus() {
    if (!isNativePlatform()) {
      return {
        connected: navigator.onLine,
        connectionType: 'unknown',
      };
    }

    try {
      const status = await Network.getStatus();
      return status;
    } catch (error) {
      console.error('Error getting network status:', error);
      return {
        connected: navigator.onLine,
        connectionType: 'unknown',
      };
    }
  },

  /**
   * Add listener for network status changes
   */
  addListener(callback: (status: { connected: boolean; connectionType: string }) => void) {
    if (!isNativePlatform()) {
      const handleOnline = () => callback({ connected: true, connectionType: 'unknown' });
      const handleOffline = () => callback({ connected: false, connectionType: 'none' });

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    const listenerPromise = Network.addListener('networkStatusChange', callback);
    return () => {
      listenerPromise.then(handle => handle.remove());
    };
  },
};
