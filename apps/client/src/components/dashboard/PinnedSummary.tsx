import { TrendingUp, DollarSign, Target, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PinnedSummaryProps {
  summary: {
    count: number;
    invested: number;
    markValue: number;
    unrealizedPnl: number;
    pnl24h: number;
  };
}

export const PinnedSummary = ({ summary }: PinnedSummaryProps) => {
  const formatCurrency = (val: number) =>
    `$${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatPnL = (val: number) => {
    const formatted = formatCurrency(Math.abs(val));
    return val >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className="mt-auto sticky bottom-0 z-40 w-full border-t border-border bg-elevated/95 backdrop-blur">
      <div className="flex items-center justify-between px-3 py-1.5 gap-3">
        <div className="flex items-center gap-4 flex-wrap text-sm">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground uppercase tracking-wide text-xs">
              Open Tickets:
            </span>
            <span className="font-mono font-semibold">{summary.count}</span>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground uppercase tracking-wide text-xs">
              Invested:
            </span>
            <span className="font-mono font-semibold">
              {formatCurrency(summary.invested)}
            </span>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground uppercase tracking-wide text-xs">
              Mark Value:
            </span>
            <span className="font-mono font-semibold">
              {formatCurrency(summary.markValue)}
            </span>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground uppercase tracking-wide text-xs">
              Unrealized PnL:
            </span>
            <span
              className={cn(
                "font-mono font-semibold",
                summary.unrealizedPnl >= 0
                  ? "text-positive"
                  : "text-destructive"
              )}
            >
              {formatPnL(summary.unrealizedPnl)}
            </span>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground uppercase tracking-wide text-xs">
              24h PnL:
            </span>
            <span
              className={cn(
                "font-mono font-semibold",
                summary.pnl24h >= 0 ? "text-positive" : "text-destructive"
              )}
            >
              {formatPnL(summary.pnl24h)}
            </span>
          </div>
        </div>

        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-[10px] px-2"
            disabled
          >
            Close All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] px-2"
            disabled
          >
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
};
