import { useState } from "react";
import { X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatPnL } from "@/utils/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Ticket {
  ticketId: string;
  marketId: string;
  title: string;
  category: string;
  side: string;
  shares: number;
  avgPrice: number;
  markPrice: number;
  pnl: number;
  pnl24h: number;
  tp: number;
  sl: number;
  confidence: number;
  createdAt: string;
}

interface ActiveTicketsProps {
  tickets: Ticket[];
}

export const ActiveTickets = ({ tickets }: ActiveTicketsProps) => {
  const [sortBy, setSortBy] = useState<
    "pnl" | "pnl24h" | "shares" | "confidence"
  >("pnl");
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortBy === "pnl") return b.pnl - a.pnl;
    if (sortBy === "pnl24h") return b.pnl24h - a.pnl24h;
    if (sortBy === "shares") return b.shares - a.shares;
    if (sortBy === "confidence") return b.confidence - a.confidence;
    return 0;
  });

  const getSortLabel = () => {
    switch (sortBy) {
      case "pnl":
        return "PnL";
      case "pnl24h":
        return "24h PnL";
      case "shares":
        return "Shares";
      case "confidence":
        return "Confidence";
      default:
        return "Sort";
    }
  };

  const handleClose = (ticketId: string, pct: number) => {
    toast.success(`Mock: Closing ${pct}% of ${ticketId}`);
  };

  const handleSetTPSL = (ticketId: string) => {
    toast.success(`Mock: Set TP/SL for ${ticketId}`);
  };

  return (
    <div className="space-compact">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold">Active Tickets</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="btn-compact h-6 text-xs"
            >
              Sort: {getSortLabel()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("pnl")}>
              PnL (Highest)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("pnl24h")}>
              24h PnL (Highest)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("shares")}>
              Shares (Most)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("confidence")}>
              Confidence (Highest)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tickets Table */}
      <div className="space-compact">
        {sortedTickets.map((ticket) => {
          const isExpanded = expandedTicket === ticket.ticketId;

          return (
            <div
              key={ticket.ticketId}
              className={cn(
                "compact-card compact-card-hover overflow-hidden",
                ticket.pnl > 0 && "bg-positive/5 border-positive/20",
                ticket.pnl < 0 && "bg-destructive/5 border-destructive/20",
                ticket.pnl === 0 && "bg-card"
              )}
            >
              {/* Main Row */}
              <button
                onClick={() =>
                  setExpandedTicket(isExpanded ? null : ticket.ticketId)
                }
                className="w-full p-2 text-left"
              >
                <div className="space-compact">
                  {/* Title + Category */}
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Badge
                          variant="outline"
                          className="badge-compact text-[9px] h-4"
                        >
                          {ticket.category}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="badge-compact text-[9px] h-4"
                        >
                          {ticket.side}
                        </Badge>
                        <span className="text-[9px] text-muted font-mono">
                          {ticket.ticketId}
                        </span>
                      </div>
                      <h3 className="text-xs font-medium leading-tight">
                        {ticket.title}
                      </h3>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-7 gap-1.5 text-xs">
                    <div className="space-y-0.5">
                      <div className="text-[9px] text-muted">Shares</div>
                      <div className="font-mono text-[10px]">
                        {ticket.shares.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] text-muted">Avg</div>
                      <div className="font-mono text-[10px]">
                        {ticket.avgPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] text-muted">Mark</div>
                      <div className="font-mono text-[10px]">
                        {ticket.markPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] text-muted">PnL</div>
                      <div
                        className={cn(
                          "font-mono font-medium text-[10px]",
                          ticket.pnl >= 0 ? "text-positive" : "text-destructive"
                        )}
                      >
                        {formatPnL(ticket.pnl)}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] text-muted">24h</div>
                      <div
                        className={cn(
                          "font-mono font-medium text-[10px]",
                          ticket.pnl24h >= 0
                            ? "text-positive"
                            : "text-destructive"
                        )}
                      >
                        {formatPnL(ticket.pnl24h)}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] text-muted">TP</div>
                      <div className="font-mono text-[10px] text-positive">
                        {ticket.tp.toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] text-muted">SL</div>
                      <div className="font-mono text-[10px] text-destructive">
                        {ticket.sl.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Actions */}
              <div className="flex items-center gap-1 px-2 pb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClose(ticket.ticketId, 25)}
                  className="btn-compact h-6 text-xs"
                >
                  Close 25%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClose(ticket.ticketId, 50)}
                  className="btn-compact h-6 text-xs"
                >
                  Close 50%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClose(ticket.ticketId, 100)}
                  className="btn-compact h-6 text-xs"
                >
                  <X className="w-2.5 h-2.5 mr-0.5" />
                  Close All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSetTPSL(ticket.ticketId)}
                  className="h-6 px-1.5 ml-auto"
                >
                  <Settings className="w-2.5 h-2.5" />
                </Button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-2 pb-2 border-t border-subtle pt-2">
                  <div className="space-compact">
                    <div>
                      <div className="text-[9px] text-muted uppercase tracking-wide mb-0.5">
                        Market ID
                      </div>
                      <div className="text-[10px] font-mono">
                        {ticket.marketId}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-muted uppercase tracking-wide mb-0.5">
                        Confidence
                      </div>
                      <div className="text-[10px]">
                        {(ticket.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-muted uppercase tracking-wide mb-0.5">
                        Created
                      </div>
                      <div className="text-[10px]">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
