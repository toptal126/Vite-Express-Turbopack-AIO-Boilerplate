import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  truthSocialApi,
  FeedingEvent,
  FeedingStatistics,
  TruthSocialStatisticsResponse,
} from "@/modules/truthSocial.module";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Activity, Clock, CheckCircle, XCircle } from "lucide-react";

interface FeedingStatusSidebarProps {
  className?: string;
}

const DURATION_OPTIONS = [
  { value: "15s", label: "15 seconds" },
  { value: "1m", label: "1 minute" },
  { value: "5m", label: "5 minutes" },
  { value: "10m", label: "10 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "1d", label: "1 day" },
  { value: "1w", label: "1 week" },
];

const FeedingStatusSidebar = ({ className }: FeedingStatusSidebarProps) => {
  const [events, setEvents] = useState<FeedingEvent[]>([]);
  const [statistics, setStatistics] = useState<FeedingStatistics | null>(null);
  const [feedStats, setFeedStats] = useState<
    TruthSocialStatisticsResponse["feedStats"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState("1h");
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { toast } = useToast();

  const fetchFeedingData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [eventsResponse, statisticsResponse, overallStatsResponse] =
        await Promise.all([
          truthSocialApi.getFeedingEvents(duration, 100),
          truthSocialApi.getFeedingStatistics(duration),
          truthSocialApi.getStatistics(),
        ]);

      if (
        eventsResponse.success &&
        statisticsResponse.success &&
        overallStatsResponse.success
      ) {
        setEvents(eventsResponse.data);
        setStatistics(statisticsResponse.data);
        setFeedStats(overallStatsResponse.feedStats);
        setLastRefresh(new Date());
      } else {
        throw new Error("Failed to fetch feeding data");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch feeding data";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedingData();
  }, [duration]);

  useEffect(() => {
    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      fetchFeedingData(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [duration]);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-yellow-500";
      case "fair":
        return "bg-orange-500";
      case "poor":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Good";
      case "fair":
        return "Fair";
      case "poor":
        return "Poor";
      default:
        return "Unknown";
    }
  };

  // Generate chart data
  const chartData = events.map((event) => ({
    time: new Date(event.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    postsReceived: event.postsReceived,
    postsSaved: event.postsSaved,
    postsSkipped: event.postsSkipped,
    postsErrors: event.postsErrors,
    processingTime: event.processingTimeMs,
    success: event.isSuccessful ? 1 : 0,
  }));

  if (error) {
    return (
      <div className={`w-80 ${className}`}>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`w-[600px] space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
          Feed Status
        </h2>
        <div className="flex items-center space-x-2">
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchFeedingData(true)}
            disabled={refreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : statistics && feedStats ? (
        <div className="space-y-4">
          {/* Status Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Feeding Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(feedStats.feedingStatus)}`}
                />
                <span className="text-sm font-medium">
                  {getStatusText(feedStats.feedingStatus)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {feedStats.feedingHealthPercentage.toFixed(1)}%
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Last refresh: {lastRefresh.toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>

          {/* Feed Coverage */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Feed Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {feedStats.actualFeedCounter}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Actual Feeds
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {feedStats.expectedFeedCounter}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Expected Feeds
                  </div>
                </div>
              </div>
              {feedStats.missingFeeds > 0 && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">
                    Missing: {feedStats.missingFeeds} feeds
                  </div>
                  <div className="text-xs text-red-500 dark:text-red-400">
                    {(
                      (feedStats.missingFeeds / feedStats.expectedFeedCounter) *
                      100
                    ).toFixed(1)}
                    % of expected feeds
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs font-medium text-green-600 dark:text-green-400">
                  Total Feeds
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg font-bold">{statistics.totalFeeds}</div>
                <div className="text-xs text-muted-foreground">
                  {statistics.successfulFeeds} success
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs font-medium text-purple-600 dark:text-purple-400">
                  Posts Saved
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg font-bold">
                  {formatNumber(statistics.totalPostsSaved)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {statistics.totalPostsSkipped} skipped
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg font-bold">
                  {statistics.successRate.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {statistics.failedFeeds} failed
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          {chartData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Feed Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    postsReceived: {
                      label: "Received",
                      color: "hsl(var(--chart-1))",
                    },
                    postsSaved: {
                      label: "Saved",
                      color: "hsl(var(--chart-2))",
                    },
                    postsErrors: {
                      label: "Errors",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-60"
                >
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="postsReceived"
                      stroke="var(--color-postsReceived)"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="postsSaved"
                      stroke="var(--color-postsSaved)"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="postsErrors"
                      stroke="var(--color-postsErrors)"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Processing Time Chart */}
          {chartData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
                  Processing Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    processingTime: {
                      label: "Time (ms)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-48"
                >
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="processingTime"
                      fill="var(--color-processingTime)"
                      radius={[1, 1, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Recent Events */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {events.slice(0, 8).map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      {event.isSuccessful ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span className="text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{event.postsSaved}</span>
                      <span className="text-muted-foreground">saved</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Processing:</span>
                  <span>{statistics.averageProcessingTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span>{statistics.successRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Errors:</span>
                  <span>{statistics.totalPostsErrors}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default FeedingStatusSidebar;
