import { useState } from "react";
import {
  ArrowUpRight,
  Twitter,
  Coins,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatLiquidity } from "@/utils/formatters";

interface Market {
  marketId: string;
  title: string;
  category: string;
  yesOdds: number;
  noOdds: number;
  liquidity: number;
  signalStrength: number;
  confidence: string;
  suggestedAction: string;
  sources: string[];
  rationale: string;
}

interface PotentialMarketsProps {
  markets: Market[];
  selectedCategories: string[];
}

export const PotentialMarkets = ({
  markets,
  selectedCategories,
}: PotentialMarketsProps) => {
  const [sortBy, setSortBy] = useState<"signal" | "liquidity" | "time">(
    "signal"
  );
  const [expandedMarket, setExpandedMarket] = useState<string | null>(null);

  const filteredMarkets = markets
    .filter(
      (m) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(m.category.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "signal") return b.signalStrength - a.signalStrength;
      if (sortBy === "liquidity") return b.liquidity - a.liquidity;
      return 0;
    });

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "twitter":
        return <Twitter className="w-3 h-3" />;
      case "onchain":
        return <Coins className="w-3 h-3" />;
      case "prices":
        return <TrendingUp className="w-3 h-3" />;
      case "laliga":
        return <TrendingUp className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      High: "bg-positive/20 text-positive border-positive/30",
      Medium: "bg-warning/20 text-warning border-warning/30",
      Low: "bg-muted text-muted-foreground border-muted",
    };
    return colors[confidence as keyof typeof colors] || colors.Low;
  };

  const handleQuickBuy = (marketId: string, amount: number, side: string) => {
    toast.success(`Mock: Buy ${side} $${amount} on ${marketId}`);
  };

  return (
    <div className="space-compact">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold">Potential Markets</h2>
        <div className="flex gap-1">
          <Button
            variant={sortBy === "signal" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("signal")}
            className="btn-compact h-6 text-xs"
          >
            Signal
          </Button>
          <Button
            variant={sortBy === "liquidity" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("liquidity")}
            className="btn-compact h-6 text-xs"
          >
            Liquidity
          </Button>
        </div>
      </div>

      {/* Markets List */}
      <div className="space-compact">
        {filteredMarkets.map((market) => {
          const isExpanded = expandedMarket === market.marketId;

          return (
            <div
              key={market.marketId}
              className={cn(
                "compact-card compact-card-hover",
                market.confidence === "High" &&
                  "bg-positive/5 border-positive/20",
                market.confidence === "Medium" &&
                  "bg-warning/5 border-warning/20",
                market.confidence === "Low" && "bg-card"
              )}
            >
              <div className="space-compact">
                {/* Title Row */}
                <button
                  onClick={() =>
                    setExpandedMarket(isExpanded ? null : market.marketId)
                  }
                  className="flex items-start justify-between w-full text-left gap-1.5"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Badge
                        variant="outline"
                        className="badge-compact text-[9px] h-4"
                      >
                        {market.category}
                      </Badge>
                      <Badge
                        className={cn(
                          "badge-compact text-[9px] h-4",
                          getConfidenceBadge(market.confidence)
                        )}
                      >
                        {market.confidence}
                      </Badge>
                    </div>
                    <h3 className="text-xs font-medium leading-tight">
                      {market.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {/* Metrics Row */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-muted">Signal:</span>
                    <span className="font-mono font-medium">
                      {market.signalStrength}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted">Yes:</span>
                    <span className="font-mono font-medium text-positive">
                      {(market.yesOdds * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted">No:</span>
                    <span className="font-mono font-medium text-destructive">
                      {(market.noOdds * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted">Liq:</span>
                    <span className="font-mono text-[10px]">
                      {formatLiquidity(market.liquidity)}
                    </span>
                  </div>
                </div>

                {/* Sources */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted">Sources:</span>
                  <div className="flex gap-0.5">
                    {market.sources.map((source) => (
                      <div
                        key={source}
                        className="p-0.5 bg-elevated/50 border-subtle rounded-sm"
                      >
                        {getSourceIcon(source)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="secondary"
                    className="badge-compact text-[9px] h-4"
                  >
                    {market.suggestedAction}
                  </Badge>
                  <div className="flex gap-0.5 ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickBuy(market.marketId, 25, "Yes")}
                      className="btn-compact h-6 text-xs"
                    >
                      $25
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickBuy(market.marketId, 50, "Yes")}
                      className="btn-compact h-6 text-xs"
                    >
                      $50
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleQuickBuy(market.marketId, 100, "Yes")
                      }
                      className="btn-compact h-6 text-xs"
                    >
                      $100
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-1.5">
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Rationale */}
                {isExpanded && (
                  <div className="pt-1.5 border-t border-subtle">
                    <p className="text-[10px] text-muted">{market.rationale}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
