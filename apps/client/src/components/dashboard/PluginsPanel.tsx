import { useState } from "react";
import {
  Power,
  ChevronDown,
  ChevronRight,
  Twitter,
  Flag,
  TrendingUp,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Plugin {
  id: string;
  name: string;
  sources: Array<{
    id: string;
    name: string;
    status: string;
    events24h: number;
    lastUpdate: string;
  }>;
  status: string;
}

interface PluginsPanelProps {
  plugins: Plugin[];
  onPluginToggle: (id: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

export const PluginsPanel = ({
  plugins,
  onPluginToggle,
  selectedCategories,
  onCategoryToggle,
}: PluginsPanelProps) => {
  const [expandedPlugins, setExpandedPlugins] = useState<string[]>([
    "politics",
    "sports",
    "crypto",
  ]);

  const togglePlugin = (id: string) => {
    setExpandedPlugins((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const getPluginIcon = (id: string) => {
    switch (id) {
      case "politics":
        return Flag;
      case "sports":
        return TrendingUp;
      case "crypto":
        return Coins;
      default:
        return Power;
    }
  };

  const getSourceIcon = (id: string) => {
    switch (id) {
      case "twitter":
        return Twitter;
      default:
        return Power;
    }
  };

  const categories = [
    { id: "politics", name: "Politics", icon: Flag },
    { id: "sports", name: "Sports", icon: TrendingUp },
    { id: "crypto", name: "Crypto", icon: Coins },
  ];

  return (
    <div className="space-compact">
      {/* Plugins Section */}
      <div className="compact-card space-compact">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          Plugins
        </h3>

        {plugins.map((plugin) => {
          const Icon = getPluginIcon(plugin.id);
          const isExpanded = expandedPlugins.includes(plugin.id);

          return (
            <div key={plugin.id} className="space-compact">
              <div className="flex items-center justify-between p-1.5 hover:bg-elevated/50 rounded-sm transition-colors">
                <button
                  onClick={() => togglePlugin(plugin.id)}
                  className="flex items-center gap-1.5 flex-1 text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-2.5 h-2.5" />
                  ) : (
                    <ChevronRight className="w-2.5 h-2.5" />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{plugin.name}</span>
                  <div
                    className={cn(
                      "w-1 h-1 rounded-full ml-auto",
                      plugin.status === "on" ? "bg-positive" : "bg-muted"
                    )}
                  />
                </button>
                <Switch
                  checked={plugin.status === "on"}
                  onCheckedChange={() => onPluginToggle(plugin.id)}
                  className="ml-1.5 scale-75"
                />
              </div>

              {isExpanded && (
                <div className="ml-4 space-compact">
                  {plugin.sources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center justify-between p-1.5 text-xs bg-elevated/30 border-subtle rounded-sm"
                    >
                      <div className="flex items-center gap-1">
                        <Power className="w-2.5 h-2.5" />
                        <span>{source.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-muted">
                          {source.events24h}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Filters Section */}
      <div className="compact-card space-compact">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          Filters
        </h3>

        <div className="space-compact">
          <div className="text-[10px] text-muted uppercase tracking-wide">
            Category
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <Button
                  key={cat.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryToggle(cat.id)}
                  className="btn-compact h-6 text-xs"
                >
                  <Icon className="w-2.5 h-2.5 mr-1" />
                  {cat.name}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-compact">
          <div className="text-[10px] text-muted uppercase tracking-wide">
            Timeframe
          </div>
          <div className="flex gap-1">
            {["24h", "7d", "30d"].map((tf) => (
              <Button
                key={tf}
                variant="outline"
                size="sm"
                className="btn-compact h-6 text-xs flex-1"
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-warning/10 border border-warning/20 rounded-sm p-2 text-xs text-muted">
        <p className="font-medium mb-0.5">Research Mode</p>
        <p className="text-[10px]">
          For simulation. Use public information. Honor platform ToS. No trading
          on material non-public information.
        </p>
      </div>
    </div>
  );
};
