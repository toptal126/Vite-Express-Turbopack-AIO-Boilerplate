import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { TruthSocialPost } from "@polypulse/shared";
import {
  truthSocialApi,
  TruthSocialPostsResponse,
} from "@/modules/truthSocial.module";
import { Link } from "react-router-dom";
import FeedingStatusSidebar from "@/components/FeedingStatusSidebar";
import { Monitor, X } from "lucide-react";

const TrumpPosts = () => {
  const [posts, setPosts] = useState<TruthSocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    limit: 20,
    skip: 0,
    hasMore: true,
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const { toast } = useToast();

  const fetchTrumpPosts = async (skip: number = 0, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await truthSocialApi.getTrumpPosts(
        pagination.limit,
        skip
      );

      if (response.success) {
        const newPosts = response.data;
        setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
        setPagination((prev) => ({
          ...prev,
          skip,
          hasMore: newPosts.length === pagination.limit,
        }));
      } else {
        throw new Error("Failed to fetch posts");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch Trump posts";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrumpPosts();
  }, []);

  const loadMore = () => {
    if (!loading && pagination.hasMore) {
      fetchTrumpPosts(pagination.skip + pagination.limit, true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const decodeHtmlEntities = (html: string) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`flex gap-6 ${!showSidebar ? "justify-center" : ""}`}>
        {/* Main Content */}
        <div className="flex-1 max-w-[600px] transition-all duration-300 ease-in-out">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Donald Trump's Truth Social Posts
                </h1>
                <p className="text-muted-foreground">
                  Latest posts from @realDonaldTrump on Truth Social
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="flex items-center space-x-2"
              >
                {showSidebar ? (
                  <>
                    <X className="h-4 w-4" />
                    <span>Hide Status</span>
                  </>
                ) : (
                  <>
                    <Monitor className="h-4 w-4" />
                    <span>Show Status</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="w-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        crossOrigin="anonymous"
                        src={post.account.avatar}
                        alt={post.account.display_name}
                      />
                      <AvatarFallback>
                        {post.account.display_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">
                          {post.account.display_name}
                        </h3>
                        <Badge variant="secondary">
                          @{post.account.username}
                        </Badge>
                        {post.account.verified && (
                          <Badge variant="default" className="bg-blue-500">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: decodeHtmlEntities(post.content),
                        }}
                      />
                    </div>

                    {post.media_attachments.length > 0 && (
                      <div className="space-y-2">
                        {post.media_attachments.map((media) => (
                          <div key={media.id}>
                            {media.type === "image" ? (
                              <img
                                referrerPolicy="no-referrer"
                                src={media.preview_url}
                                alt="Post media"
                                className="rounded-lg max-w-full h-auto"
                              />
                            ) : media.type === "video" ? (
                              <video
                                crossOrigin="anonymous"
                                src={media.url}
                                controls
                                className="rounded-lg max-w-full h-auto"
                              >
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <div className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                  Media attachment: {media.type}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <span>👍</span>
                          <span>{formatNumber(post.upvotes_count)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>{formatNumber(post.replies_count)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>🔄</span>
                          <span>{formatNumber(post.reblogs_count)}</span>
                        </div>
                      </div>
                      <div className="text-xs">Post ID: {post.id}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {loading && (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && posts.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No Trump posts found.</p>
                </CardContent>
              </Card>
            )}

            {!loading && pagination.hasMore && (
              <div className="text-center">
                <Button onClick={loadMore} variant="outline">
                  Load More Posts
                </Button>
              </div>
            )}

            {!loading && !pagination.hasMore && posts.length > 0 && (
              <div className="text-center text-muted-foreground">
                <p>No more posts to load.</p>
              </div>
            )}
          </div>
        </div>

        {/* Vertical Separator */}
        {showSidebar && (
          <div className="w-px bg-border flex-shrink-0 transition-all duration-300 ease-in-out" />
        )}

        {/* Feeding Status Sidebar */}
        {showSidebar && (
          <div className="transition-all duration-300 ease-in-out">
            <FeedingStatusSidebar className="flex-shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrumpPosts;
