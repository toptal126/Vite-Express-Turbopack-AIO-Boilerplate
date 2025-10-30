import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PolymarketService } from "@/modules/polymarket.module";
import { Market, MarketsParams } from "@/types/polymarket";

interface MarketFiltersProps {
  onMarketsChange: (markets: Market[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const MarketFilters = ({
  onMarketsChange,
  onLoadingChange,
}: MarketFiltersProps) => {
  const [filters, setFilters] = useState({
    limit: 20,
    order: "volume",
    ascending: false,
    closed: false,
    liquidityMin: "",
    liquidityMax: "",
    volumeMin: "",
    volumeMax: "",
    tagId: "",
  });

  const handleFilterChange = (
    key: string,
    value: string | number | boolean
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = async () => {
    onLoadingChange(true);
    try {
      const params: MarketsParams = {
        limit: filters.limit,
        order: filters.order,
        ascending: filters.ascending,
        closed: filters.closed,
      };

      if (filters.liquidityMin)
        params.liquidity_num_min = parseFloat(filters.liquidityMin);
      if (filters.liquidityMax)
        params.liquidity_num_max = parseFloat(filters.liquidityMax);
      if (filters.volumeMin)
        params.volume_num_min = parseFloat(filters.volumeMin);
      if (filters.volumeMax)
        params.volume_num_max = parseFloat(filters.volumeMax);
      if (filters.tagId) params.tag_id = parseInt(filters.tagId);

      const markets = await PolymarketService.getMarkets(params);
      onMarketsChange(markets);
    } catch (error) {
      console.error("Filter error:", error);
      onMarketsChange([]);
    } finally {
      onLoadingChange(false);
    }
  };

  const loadQuickFilter = async (filterType: string) => {
    onLoadingChange(true);
    try {
      let markets: Market[] = [];

      switch (filterType) {
        case "trending":
          markets = await PolymarketService.getTrendingMarkets(20);
          break;
        case "recent":
          markets = await PolymarketService.getRecentMarkets(20);
          break;
        case "closing":
          markets = await PolymarketService.getMarketsEndingSoon(20);
          break;
        case "high-liquidity":
          markets = await PolymarketService.getHighLiquidityMarkets(20, 10000);
          break;
        case "active":
          markets = await PolymarketService.getActiveMarkets(20);
          break;
        default:
          markets = await PolymarketService.getMarkets({ limit: 20 });
      }

      onMarketsChange(markets);
    } catch (error) {
      console.error("Quick filter error:", error);
      onMarketsChange([]);
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border border-border/30 rounded-sm bg-card">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium">Market Filters</h3>
      </div>

      {/* Quick Filters */}
      <div className="space-y-2">
        <Label className="text-xs text-muted">Quick Filters</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadQuickFilter("trending")}
            className="text-xs h-7"
          >
            Trending
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadQuickFilter("recent")}
            className="text-xs h-7"
          >
            Recent
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadQuickFilter("closing")}
            className="text-xs h-7"
          >
            Closing Soon
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadQuickFilter("high-liquidity")}
            className="text-xs h-7"
          >
            High Liquidity
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadQuickFilter("active")}
            className="text-xs h-7"
          >
            Active Only
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="space-y-3">
        <Label className="text-xs text-muted">Advanced Filters</Label>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Limit</Label>
            <Input
              type="number"
              value={filters.limit}
              onChange={(e) =>
                handleFilterChange("limit", parseInt(e.target.value) || 20)
              }
              className="h-7 text-xs"
              min="1"
              max="100"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Order By</Label>
            <Select
              value={filters.order}
              onValueChange={(value) => handleFilterChange("order", value)}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="liquidity">Liquidity</SelectItem>
                <SelectItem value="createdAt">Created</SelectItem>
                <SelectItem value="endDate">End Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Min Liquidity ($)</Label>
            <Input
              type="number"
              value={filters.liquidityMin}
              onChange={(e) =>
                handleFilterChange("liquidityMin", e.target.value)
              }
              className="h-7 text-xs"
              placeholder="0"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Max Liquidity ($)</Label>
            <Input
              type="number"
              value={filters.liquidityMax}
              onChange={(e) =>
                handleFilterChange("liquidityMax", e.target.value)
              }
              className="h-7 text-xs"
              placeholder="No limit"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Min Volume ($)</Label>
            <Input
              type="number"
              value={filters.volumeMin}
              onChange={(e) => handleFilterChange("volumeMin", e.target.value)}
              className="h-7 text-xs"
              placeholder="0"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Max Volume ($)</Label>
            <Input
              type="number"
              value={filters.volumeMax}
              onChange={(e) => handleFilterChange("volumeMax", e.target.value)}
              className="h-7 text-xs"
              placeholder="No limit"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ascending"
            checked={filters.ascending}
            onChange={(e) => handleFilterChange("ascending", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="ascending" className="text-xs">
            Ascending Order
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="closed"
            checked={filters.closed}
            onChange={(e) => handleFilterChange("closed", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="closed" className="text-xs">
            Include Closed Markets
          </Label>
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full h-7 text-xs">
        Apply Filters
      </Button>
    </div>
  );
};
