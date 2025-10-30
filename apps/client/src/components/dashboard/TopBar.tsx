import { Search, Activity, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkline } from "./Sparkline";
import { MarketSearchDropdown } from "./MarketSearchDropdown";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Market } from "@/types/polymarket";
import { formatPnL, formatPct } from "@/utils/formatters";

interface TopBarProps {
  autopilotOn: boolean;
  onAutopilotToggle: () => void;
  connectionStatus: string;
  latency: number;
  performance: {
    daily: { pnl: number; pnlPct: number; spark: number[] };
    weekly: { pnl: number; pnlPct: number; spark: number[] };
    total: { pnl: number; pnlPct: number; spark: number[] };
  };
  onSettingsClick: () => void;
  onMarketSelect?: (market: Market) => void;
}

export const TopBar = ({
  autopilotOn,
  onAutopilotToggle,
  connectionStatus,
  latency,
  performance,
  onSettingsClick,
  onMarketSelect,
}: TopBarProps) => {
  const PnLCard = ({
    label,
    pnl,
    pct,
    spark,
  }: {
    label: string;
    pnl: number;
    pct: number;
    spark: number[];
  }) => (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-card/30 border-subtle rounded-sm">
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-muted uppercase tracking-wide truncate">
          {label}
        </span>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "text-xs font-mono font-medium leading-none",
              pnl >= 0 ? "text-positive" : "text-destructive"
            )}
          >
            {formatPnL(pnl)}
          </span>
          <span
            className={cn(
              "text-[10px] font-mono leading-none",
              pnl >= 0 ? "text-positive" : "text-destructive"
            )}
          >
            {formatPct(pct)}
          </span>
        </div>
      </div>
      <Sparkline data={spark} width={28} height={10} />
    </div>
  );

  return (
    <header className="sticky h-12 top-0 z-50 w-full border-b border-subtle bg-background/95 backdrop-blur">
      <div className="flex h-12 items-center justify-between px-3 gap-3">
        {/* Left: Brand + Autopilot */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Link to="/">
              <img src="/logo-text-dark.svg" alt="PolyPulse" className="h-12" />
            </Link>
          </div>

          <Button
            variant={autopilotOn ? "default" : "outline"}
            size="sm"
            onClick={onAutopilotToggle}
            className="btn-compact h-6 px-2"
          >
            <span className="mr-1 text-xs">Autopilot</span>
            <span
              className={cn(
                "text-xs font-medium",
                autopilotOn ? "" : "text-muted"
              )}
            >
              {autopilotOn ? "ON" : "OFF"}
            </span>
          </Button>

          <div className="flex items-center gap-1 text-xs text-muted">
            <div
              className={cn(
                "w-1 h-1 rounded-full",
                connectionStatus === "connected"
                  ? "bg-positive"
                  : "bg-destructive"
              )}
            />
            <span>{latency}ms</span>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Center: Search Active Positions */}
          <div className="flex-1 max-w-64 relative">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search all positions..."
              className="input-compact pl-7 h-7"
            />
          </div>
          {/* Center: Search all markets */}
          <div className="flex-1 max-w-64">
            <MarketSearchDropdown
              onMarketSelect={onMarketSelect}
              placeholder="Search all markets..."
            />
          </div>
        </div>
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Link to="/markets">
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <BarChart3 className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Markets</span>
            </Button>
          </Link>
          <Link to="/trump-posts">
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <Activity className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Trump Posts</span>
            </Button>
          </Link>
        </div>

        {/* Right: PnL Cards + Settings */}
        <div className="flex items-center gap-1.5">
          <PnLCard
            label="Daily"
            pnl={performance.daily.pnl}
            pct={performance.daily.pnlPct}
            spark={performance.daily.spark}
          />
          <PnLCard
            label="Weekly"
            pnl={performance.weekly.pnl}
            pct={performance.weekly.pnlPct}
            spark={performance.weekly.spark}
          />
          <PnLCard
            label="Total"
            pnl={performance.total.pnl}
            pct={performance.total.pnlPct}
            spark={performance.total.spark}
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="h-7 w-7 p-0"
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
