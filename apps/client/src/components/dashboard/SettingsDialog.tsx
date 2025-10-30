import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Activity, Bell, Sliders } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slippage: number;
  onSlippageChange: (value: number) => void;
  notifications: { desktop: boolean; email: boolean };
  onNotificationsChange: (notifications: { desktop: boolean; email: boolean }) => void;
}

export const SettingsDialog = ({
  open,
  onOpenChange,
  slippage,
  onSlippageChange,
  notifications,
  onNotificationsChange,
}: SettingsDialogProps) => {
  const apiHealth = [
    { name: "X/Twitter", status: "connected", latency: 38 },
    { name: "Truth Social", status: "connected", latency: 42 },
    { name: "LaLiga API", status: "connected", latency: 28 },
    { name: "Price Feeds", status: "connected", latency: 15 },
    { name: "On-Chain", status: "connected", latency: 52 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* API Health Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <h3 className="text-sm font-semibold">API Health Status</h3>
            </div>
            <div className="space-y-2">
              {apiHealth.map((api) => (
                <div
                  key={api.name}
                  className="flex items-center justify-between p-2 bg-elevated rounded text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-positive animate-pulse" />
                    <span>{api.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] h-5">
                      {api.latency}ms
                    </Badge>
                    <span className="text-muted-foreground text-[10px]">{api.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slippage Setting */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <h3 className="text-sm font-semibold">Slippage Tolerance</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Max Slippage</Label>
                <span className="text-xs font-mono">{slippage.toFixed(1)}%</span>
              </div>
              <Slider
                value={[slippage]}
                onValueChange={(value) => onSlippageChange(value[0])}
                min={0.1}
                max={5.0}
                step={0.1}
                className="w-full"
              />
              <p className="text-[10px] text-muted-foreground">
                Maximum price difference before transaction reverts
              </p>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <h3 className="text-sm font-semibold">Notifications</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs">Desktop Notifications</Label>
                  <p className="text-[10px] text-muted-foreground">Get alerts on new signals</p>
                </div>
                <Switch
                  checked={notifications.desktop}
                  onCheckedChange={(checked) =>
                    onNotificationsChange({ ...notifications, desktop: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs">Email Notifications</Label>
                  <p className="text-[10px] text-muted-foreground">Daily summary reports</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    onNotificationsChange({ ...notifications, email: checked })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
