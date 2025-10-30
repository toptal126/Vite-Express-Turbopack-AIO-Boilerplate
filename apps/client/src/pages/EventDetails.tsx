import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Users,
  DollarSign,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PolymarketService } from "@/modules/polymarket.module";
import { Event as PolymarketEvent, Market, Tag } from "@/types/polymarket";
import { formatVolume, formatLiquidity } from "@/utils/formatters";

// Interface for market details returned by getMarketWithDetails
interface MarketDetails {
  market: Market;
  tags: Tag[];
}

export const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<PolymarketEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(
    new Set()
  );
  const [marketDetails, setMarketDetails] = useState<
    Map<string, MarketDetails>
  >(new Map());
  const [loadingMarkets, setLoadingMarkets] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is required");
      setLoading(false);
      return;
    }

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventData: PolymarketEvent | null =
          await PolymarketService.getEventDetails(eventId);

        if (eventData) {
          setEvent(eventData);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const getTrendIcon = (volume: number) => {
    if (volume > 1000) return <TrendingUp className="h-4 w-4 text-positive" />;
    if (volume < 100)
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted" />;
  };

  const getImageUrl = (event: PolymarketEvent) => {
    if (event.imageOptimized?.imageUrlOptimized) {
      return event.imageOptimized.imageUrlOptimized;
    }
    if (event.imageOptimized?.imageUrlSource) {
      return event.imageOptimized.imageUrlSource;
    }
    if (event.image) {
      return event.image;
    }
    return "/placeholder.svg";
  };

  const handleMarketToggle = async (marketId: string) => {
    const isExpanded = expandedMarkets.has(marketId);

    if (isExpanded) {
      // Collapse market
      setExpandedMarkets((prev) => {
        const newSet = new Set(prev);
        newSet.delete(marketId);
        return newSet;
      });
    } else {
      // Expand market and fetch details if not already loaded
      setExpandedMarkets((prev) => new Set(prev).add(marketId));

      if (!marketDetails.has(marketId)) {
        setLoadingMarkets((prev) => new Set(prev).add(marketId));

        try {
          // Fetch market details using the existing service
          const details =
            await PolymarketService.getMarketWithDetails(marketId);
          setMarketDetails((prev) => new Map(prev).set(marketId, details));
        } catch (error) {
          console.error(
            `Failed to fetch details for market ${marketId}:`,
            error
          );
        } finally {
          setLoadingMarkets((prev) => {
            const newSet = new Set(prev);
            newSet.delete(marketId);
            return newSet;
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-lg text-muted">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-destructive">
            {error || "Event not found"}
          </div>
          <Button className="mt-4" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-2">
      {/* Back Button */}
      <div className="mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="h-6 px-2 text-xs"
        >
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back
        </Button>
      </div>

      {/* Event Header - Compact */}
      <div className="mb-3">
        <div className="flex items-start gap-2">
          <img
            src={getImageUrl(event)}
            alt={event.title}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
              {event.title}
            </h1>
            {event.subtitle && (
              <p className="text-xs text-muted mb-1 line-clamp-1">
                {event.subtitle}
              </p>
            )}
            {event.description && (
              <p className="text-xs text-muted mb-1 line-clamp-2">
                {event.description}
              </p>
            )}

            {/* Status and Category - Compact */}
            <div className="flex items-center gap-1 flex-wrap">
              <Badge
                variant={event.active ? "default" : "secondary"}
                className={cn(
                  "text-xs px-1 py-0 h-4",
                  event.active
                    ? "bg-positive text-positive-foreground"
                    : "bg-destructive text-destructive-foreground"
                )}
              >
                {event.active ? "Active" : "Closed"}
              </Badge>
              {event.category && (
                <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                  {event.category}
                </Badge>
              )}
              {event.featured && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 text-xs px-1 py-0 h-4"
                >
                  Featured
                </Badge>
              )}
              {event.competitive && (
                <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                  Score: {event.competitive}
                </Badge>
              )}
              {event.slug && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs px-1 py-0 h-4"
                  onClick={() =>
                    window.open(
                      `https://polymarket.com/event/${event.slug}`,
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Compact */}
      <div className="grid grid-cols-4 gap-1 mb-3">
        <Card className="p-2">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="h-3 w-3 text-muted" />
            <span className="text-xs text-muted">Vol</span>
          </div>
          <div className="flex items-center gap-1">
            {getTrendIcon(event.volume || 0)}
            <span className="text-sm font-semibold">
              {formatVolume(event.volume)}
            </span>
          </div>
        </Card>

        <Card className="p-2">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="h-3 w-3 text-muted" />
            <span className="text-xs text-muted">24h</span>
          </div>
          <div className="flex items-center gap-1">
            {getTrendIcon(event.volume24hr || 0)}
            <span className="text-sm font-semibold">
              {formatVolume(event.volume24hr)}
            </span>
          </div>
        </Card>

        <Card className="p-2">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="h-3 w-3 text-muted" />
            <span className="text-xs text-muted">Liq</span>
          </div>
          <div className="text-sm font-semibold">
            {formatLiquidity(event.liquidity)}
          </div>
        </Card>

        <Card className="p-2">
          <div className="flex items-center gap-1 mb-1">
            <Users className="h-3 w-3 text-muted" />
            <span className="text-xs text-muted">Mkts</span>
          </div>
          <div className="text-sm font-semibold">
            {event.markets?.length || 0}
          </div>
        </Card>
      </div>

      {/* Event Details - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Markets List */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold mb-2">Markets</h2>
          <div className="space-y-1">
            {event.markets
              ?.sort((a, b) => {
                // Sort by last trade price in descending order
                const priceA = a.lastTradePrice || 0;
                const priceB = b.lastTradePrice || 0;
                return priceB - priceA;
              })
              ?.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  isExpanded={expandedMarkets.has(market.id)}
                  isLoading={loadingMarkets.has(market.id)}
                  marketDetails={marketDetails.get(market.id)}
                  onToggle={() => handleMarketToggle(market.id)}
                />
              ))}
          </div>
        </div>

        {/* Event Info - Compact */}
        <div>
          <h2 className="text-sm font-semibold mb-2">Event Info</h2>
          <Card className="p-2">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted" />
                <div>
                  <div className="text-xs text-muted">Start</div>
                  <div className="text-xs font-medium">
                    {event.startDate
                      ? new Date(event.startDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted" />
                <div>
                  <div className="text-xs text-muted">End</div>
                  <div className="text-xs font-medium">
                    {event.endDate
                      ? new Date(event.endDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>

              {event.resolutionSource && (
                <div>
                  <div className="text-xs text-muted">Resolution</div>
                  <div className="text-xs font-medium">
                    {event.resolutionSource}
                  </div>
                </div>
              )}

              {event.gameStatus && (
                <div>
                  <div className="text-xs text-muted">Status</div>
                  <div className="text-xs font-medium">{event.gameStatus}</div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface MarketCardProps {
  market: Market;
  isExpanded: boolean;
  isLoading: boolean;
  marketDetails?: MarketDetails;
  onToggle: () => void;
}

const MarketCard = ({
  market,
  isExpanded,
  isLoading,
  marketDetails,
  onToggle,
}: MarketCardProps) => {
  const formatPrice = (price: number) => {
    return (price * 100).toFixed(1) + "%";
  };

  const formatVolume = (volume: number | undefined) => {
    if (!volume || volume === 0) return "$0";
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
    return `$${volume.toFixed(0)}`;
  };

  const getImageUrl = (market: Market) => {
    if (market.imageOptimized?.imageUrlOptimized) {
      return market.imageOptimized.imageUrlOptimized;
    }
    if (market.imageOptimized?.imageUrlSource) {
      return market.imageOptimized.imageUrlSource;
    }
    if (market.image) {
      return market.image;
    }
    return "/placeholder.svg";
  };

  return (
    <Card className="overflow-hidden">
      {/* Ultra Compact Header - Always Visible */}
      <div
        className="p-2 hover:bg-elevated/50 transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <img
            src={getImageUrl(market)}
            alt={market.question}
            className="w-6 h-6 rounded object-cover flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-xs line-clamp-1">
              {market.question}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
              <span
                className={cn(
                  "font-medium text-xs",
                  market.active ? "text-positive" : "text-destructive"
                )}
              >
                {market.active ? "A" : "C"}
              </span>
              {market.lastTradePrice && (
                <span className="font-semibold">
                  {formatPrice(market.lastTradePrice)}
                </span>
              )}
              {market.volumeNum && (
                <span>V:{formatVolume(market.volumeNum)}</span>
              )}
              {market.liquidityNum && (
                <span>L:{formatVolume(market.liquidityNum)}</span>
              )}
              {market.volume24hr && (
                <span>24h:{formatVolume(market.volume24hr)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {market.lastTradePrice && (
              <div className="text-normal font-semibold">
                Chance :{formatPrice(market.lastTradePrice)}
              </div>
            )}
            {isLoading ? (
              <div className="w-3 h-3 border border-muted border-t-foreground rounded-full animate-spin" />
            ) : isExpanded ? (
              <ChevronDown className="h-3 w-3 text-muted" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted" />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Details - Compact */}
      {isExpanded && (
        <div className="border-t bg-muted/20">
          <div className="p-2 space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-xs text-muted">Loading...</div>
              </div>
            ) : marketDetails ? (
              <div className="space-y-2">
                {/* Market Stats - Compact Grid */}
                <div className="grid grid-cols-4 gap-1">
                  <div className="text-center p-1 bg-background rounded text-xs">
                    <div className="text-xs text-muted">Vol</div>
                    <div className="font-semibold text-xs">
                      {formatVolume(marketDetails.market?.volumeNum)}
                    </div>
                  </div>
                  <div className="text-center p-1 bg-background rounded text-xs">
                    <div className="text-xs text-muted">Liq</div>
                    <div className="font-semibold text-xs">
                      {formatVolume(marketDetails.market?.liquidityNum)}
                    </div>
                  </div>
                  <div className="text-center p-1 bg-background rounded text-xs">
                    <div className="text-xs text-muted">24h</div>
                    <div className="font-semibold text-xs">
                      {formatVolume(marketDetails.market?.volume24hr)}
                    </div>
                  </div>
                  <div className="text-center p-1 bg-background rounded text-xs">
                    <div className="text-xs text-muted">Comp</div>
                    <div className="font-semibold text-xs">
                      {marketDetails.market?.competitive || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Additional Market Info */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {marketDetails.market?.fee && (
                    <div>
                      <span className="text-muted">Fee: </span>
                      <span className="font-medium">
                        {marketDetails.market.fee}
                      </span>
                    </div>
                  )}
                  {marketDetails.market?.marketType && (
                    <div>
                      <span className="text-muted">Type: </span>
                      <span className="font-medium">
                        {marketDetails.market.marketType}
                      </span>
                    </div>
                  )}
                  {marketDetails.market?.denominationToken && (
                    <div>
                      <span className="text-muted">Token: </span>
                      <span className="font-medium">
                        {marketDetails.market.denominationToken}
                      </span>
                    </div>
                  )}
                  {marketDetails.market?.resolutionSource && (
                    <div>
                      <span className="text-muted">Resolution: </span>
                      <span className="font-medium">
                        {marketDetails.market.resolutionSource}
                      </span>
                    </div>
                  )}
                </div>

                {/* Market Description */}
                {marketDetails.market?.description && (
                  <div>
                    <div className="text-xs font-medium text-muted mb-1">
                      Description
                    </div>
                    <div className="text-xs text-foreground">
                      {marketDetails.market.description}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {marketDetails.tags && marketDetails.tags.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-muted mb-1">
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {marketDetails.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs px-2 py-1 h-6"
                        >
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Market Links */}
                <div className="flex gap-1 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 h-6"
                    onClick={() =>
                      window.open(
                        `https://polymarket.com/event/${market.slug}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-muted">
                Failed to load details
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
