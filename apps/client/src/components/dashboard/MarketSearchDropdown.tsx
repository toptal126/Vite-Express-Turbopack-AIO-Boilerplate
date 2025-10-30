import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PolymarketService } from "@/modules/polymarket.module";
import { Market, Event } from "@/types/polymarket";
import { useDebounce } from "@/hooks/useDebounce";
import { formatVolume } from "@/utils/formatters";

interface MarketSearchDropdownProps {
  onMarketSelect?: (market: Market) => void;
  placeholder?: string;
  className?: string;
}

// Maximum number of search results to display
const MAX_SEARCH_RESULTS = 20;

interface CompactEventCardProps {
  event: Event;
  onClick: () => void;
}

const CompactEventCard = ({ event, onClick }: CompactEventCardProps) => {
  const getTrendIcon = () => {
    // Trend calculation based on volume
    const volume = event.volume || 0;
    if (volume > 100000)
      // High volume
      return <TrendingUp className="h-3 w-3 text-positive" />;
    if (volume < 10000)
      // Low volume
      return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-muted" />;
  };

  // Get the best available image URL with proper fallback
  const getImageUrl = () => {
    // Priority: optimized image -> source image -> regular image -> placeholder
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

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 p-2 hover:bg-elevated/50 transition-colors cursor-pointer border-b border-border/10 last:border-b-0"
    >
      {/* Event Image */}
      <div className="flex-shrink-0">
        <img
          src={getImageUrl()}
          alt={event.title}
          className="w-8 h-8 rounded-sm object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>

      {/* Event Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          {getTrendIcon()}
          <span className="text-xs font-medium text-foreground truncate">
            {event.title}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted">
          <span
            className={cn(event.active ? "text-positive" : "text-destructive")}
          >
            {event.active ? "Active" : "Closed"}
          </span>
          <span>•</span>
          <span>{event.markets?.length || 0} markets</span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <DollarSign className="h-2.5 w-2.5" />
            {formatVolume(event.volume || 0)}
          </span>
        </div>
      </div>

      {/* Volume and Date Info */}
      <div className="flex-shrink-0 text-right">
        <div className="text-xs font-mono font-medium text-muted">
          {event.endDate ? new Date(event.endDate).toLocaleDateString() : "N/A"}
        </div>
        {event.volume1wk && event.volume1wk > 0 && (
          <div className="text-[10px] text-muted">
            1wk: {formatVolume(event.volume1wk)}
          </div>
        )}
      </div>
    </div>
  );
};

export const MarketSearchDropdown = ({
  onMarketSelect,
  placeholder = "Search events...",
  className,
}: MarketSearchDropdownProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Event[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search markets when query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchMarkets = async () => {
      setLoading(true);
      try {
        // Use the public search method to get events directly with detailed data
        const searchResults = await PolymarketService.publicSearch({
          q: debouncedQuery,
          limit_per_type: MAX_SEARCH_RESULTS,
          search_tags: false,
          search_profiles: false,
          // Omit optimized parameter to get detailed event data including volume
        });
        // Get events from the search results and limit them
        const limitedResults = searchResults.events.slice(
          0,
          MAX_SEARCH_RESULTS
        );
        setResults(limitedResults);
        setIsOpen(limitedResults.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    };

    searchMarkets();
  }, [debouncedQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleEventSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleEventSelect = (event: Event) => {
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
    // Navigate to event details page
    navigate(`/event/${event.id}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length >= 2) {
      setIsOpen(true);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            query.length >= 2 && results.length > 0 && setIsOpen(true)
          }
          placeholder={placeholder}
          className="input-compact pl-7 h-7 pr-7"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border/30 rounded-sm shadow-lg z-50 max-h-80 overflow-y-auto w-96">
          {loading ? (
            <div className="p-3 text-center text-xs text-muted">
              Searching events...
            </div>
          ) : results.length > 0 ? (
            <div className="py-1">
              {results.map((event, index) => (
                <div
                  key={`event-${event.id}-${index}`}
                  className={cn(
                    "transition-colors",
                    index === selectedIndex && "bg-elevated/50"
                  )}
                >
                  <CompactEventCard
                    event={event}
                    onClick={() => handleEventSelect(event)}
                  />
                </div>
              ))}
            </div>
          ) : debouncedQuery.length >= 2 ? (
            <div className="p-3 text-center text-xs text-muted">
              No events found for "{debouncedQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
