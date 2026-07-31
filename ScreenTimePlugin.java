package com.founderos.app;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.List;

@CapacitorPlugin(name = "ScreenTime")
public class ScreenTimePlugin extends Plugin {

    @PluginMethod
    public void checkUsagePermission(PluginCall call) {
        boolean granted = hasUsageStatsPermission(getContext());
        JSObject ret = new JSObject();
        ret.put("granted", granted);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestUsagePermission(PluginCall call) {
        if (!hasUsageStatsPermission(getContext())) {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
        }
        call.resolve();
    }

    @PluginMethod
    public void getUsageStats(PluginCall call) {
        if (!hasUsageStatsPermission(getContext())) {
            call.reject("Usage stats permission not granted.");
            return;
        }

        long startTime = call.getLong("startTime", System.currentTimeMillis() - 86400000);
        long endTime = call.getLong("endTime", System.currentTimeMillis());

        UsageStatsManager usm = (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);
        List<UsageStats> usageStatsList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime);

        long totalTimeMs = 0;
        JSArray apps = new JSArray();

        if (usageStatsList != null) {
            for (UsageStats stats : usageStatsList) {
                long timeInForeground = stats.getTotalTimeInForeground();
                if (timeInForeground > 0) {
                    totalTimeMs += timeInForeground;
                    
                    try {
                        JSObject appObj = new JSObject();
                        appObj.put("packageName", stats.getPackageName());
                        appObj.put("timeMs", timeInForeground);
                        apps.put(appObj);
                    } catch (Exception e) {}
                }
            }
        }

        JSObject ret = new JSObject();
        ret.put("totalTimeMs", totalTimeMs);
        ret.put("apps", apps);
        call.resolve(ret);
    }

    private boolean hasUsageStatsPermission(Context context) {
        AppOpsManager appOps = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(), context.getPackageName());
        return mode == AppOpsManager.MODE_ALLOWED;
    }
}
