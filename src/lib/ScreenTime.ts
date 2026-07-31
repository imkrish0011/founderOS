import { registerPlugin } from '@capacitor/core';

export interface ScreenTimePlugin {
  /**
   * Fetches the screen time stats for the given time range.
   * Requires PACKAGE_USAGE_STATS permission on Android.
   */
  getUsageStats(options: { startTime: number; endTime: number }): Promise<{ totalTimeMs: number; apps: { packageName: string, timeMs: number }[] }>;
  
  /**
   * Prompts the user to open settings to grant the usage access permission.
   */
  requestUsagePermission(): Promise<void>;
  
  /**
   * Checks if the usage access permission has been granted.
   */
  checkUsagePermission(): Promise<{ granted: boolean }>;
}

const ScreenTime = registerPlugin<ScreenTimePlugin>('ScreenTime');

export default ScreenTime;
