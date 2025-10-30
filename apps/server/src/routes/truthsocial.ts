import { Router, Request, Response } from "express";
import { truthSocialService } from "../services/truthsocialService";
import { TruthSocialFeedData } from "@polypulse/shared";

const router: Router = Router();

let servicedInitialized = false;
let serviceStartedAt = new Date();
let feedCounter = 0;
let lastFeedAt = new Date();
let longestUnfeedInterval = 0;
/**
 * POST /feed - Accept TruthSocial feed data
 * Accepts an array of TruthSocial posts and processes them
 */
router.post("/feed", async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    if (!servicedInitialized) {
      servicedInitialized = true;
      serviceStartedAt = new Date();
      lastFeedAt = new Date();
      longestUnfeedInterval = 0;
      feedCounter = 0;
    }
    const feedData: TruthSocialFeedData = req.body.feed;

    const currentTime = new Date();
    const unfeedInterval = currentTime.getTime() - lastFeedAt.getTime();
    if (unfeedInterval > longestUnfeedInterval) {
      longestUnfeedInterval = unfeedInterval;
    }
    lastFeedAt = currentTime;

    // Validate that we received an array
    if (!Array.isArray(feedData)) {
      return res.status(400).json({
        success: false,
        error: "Invalid data format. Expected an array of TruthSocial posts.",
      });
    }

    // Process the feed data
    truthSocialService.processFeedData(feedData);
    feedCounter++;

    // Save posts to MongoDB
    const saveResult = await truthSocialService.savePosts(
      feedData,
      feedCounter
    );

    // Get summary statistics
    const summary = truthSocialService.getFeedSummary(feedData);

    // Calculate processing time
    const processingTimeMs = Date.now() - startTime;

    // Return success response with summary
    return res.status(200).json({
      success: true,
      message: `Successfully processed ${feedData.length} TruthSocial posts`,
      summary: {
        totalPosts: summary.totalPosts,
        totalUpvotes: summary.totalUpvotes,
        totalReplies: summary.totalReplies,
        totalReblogs: summary.totalReblogs,
        uniqueUsers: summary.uniqueUsers,
      },
      database: {
        saved: saveResult.saved,
        skipped: saveResult.skipped,
        errors: saveResult.errors,
      },
      processingTimeMs,
    });
  } catch (error) {
    console.error("Error processing TruthSocial feed data:", error);

    // Log failed feeding event
    const processingTimeMs = Date.now() - startTime;
    await truthSocialService.logFeedingEvent({
      feedCount: feedCounter + 1,
      postsReceived: 0,
      postsSaved: 0,
      postsSkipped: 0,
      postsErrors: 0,
      processingTimeMs,
      isSuccessful: false,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return res.status(500).json({
      success: false,
      error: "Internal server error while processing feed data",
    });
  }
});

/**
 * GET /posts/trump - Get all Trump posts
 */
router.get("/posts/trump", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const posts = await truthSocialService.getTrumpPosts(limit, skip);

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        limit,
        skip,
        count: posts.length,
      },
    });
  } catch (error) {
    console.error("Error fetching Trump posts:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching Trump posts",
    });
  }
});

/**
 * GET /posts - Get all posts with optional filtering
 */
router.get("/posts", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;
    const username = req.query.username as string;

    const posts = await truthSocialService.getAllPosts(limit, skip, username);

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        limit,
        skip,
        count: posts.length,
      },
      filters: {
        username: username || null,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching posts",
    });
  }
});

/**
 * GET /posts/:id - Get a specific post by ID
 */
router.get("/posts/:id", async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({
        success: false,
        error: "Post ID is required",
      });
    }
    const post = await truthSocialService.getPostById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching post",
    });
  }
});

/**
 * GET /statistics - Get post statistics
 */
router.get("/statistics", async (req: Request, res: Response) => {
  try {
    const uptime = new Date().getTime() - serviceStartedAt.getTime();
    const currentTime = new Date().getTime();

    // Calculate expected feed counter based on actual time intervals
    // The first feed might not happen immediately, so we calculate from the first actual feed
    const timeSinceFirstFeed = currentTime - lastFeedAt.getTime();
    const expectedFeedCounter = Math.max(1, Math.ceil(uptime / 15000));

    // Calculate missing feeds
    const missingFeeds = Math.max(0, expectedFeedCounter - feedCounter);
    const feedingHealthPercentage =
      expectedFeedCounter > 0 ? (feedCounter / expectedFeedCounter) * 100 : 100;

    // Determine feeding status
    let feedingStatus = "excellent";
    if (feedingHealthPercentage < 95) feedingStatus = "good";
    if (feedingHealthPercentage < 80) feedingStatus = "fair";
    if (feedingHealthPercentage < 60) feedingStatus = "poor";

    const stats = await truthSocialService.getPostStatistics();

    return res.status(200).json({
      success: true,
      data: stats,
      feedStats: {
        expectedFeedCounter,
        actualFeedCounter: feedCounter,
        missingFeeds,
        feedingHealthPercentage:
          Math.round(feedingHealthPercentage * 100) / 100,
        feedingStatus,
        feedInterval: 15000,
        longestUnfeedInterval: longestUnfeedInterval,
        currentUnfeedInterval: new Date().getTime() - lastFeedAt.getTime(),
        uptime,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching statistics",
    });
  }
});

/**
 * GET /feeding-events - Get feeding events for a time range
 */
router.get("/feeding-events", async (req: Request, res: Response) => {
  try {
    const duration = (req.query.duration as string) || "1h";
    const limit = parseInt(req.query.limit as string) || 1000;

    // Calculate time range based on duration
    const now = new Date();
    let startTime: Date;

    switch (duration) {
      case "15s":
        startTime = new Date(now.getTime() - 15 * 1000);
        break;
      case "1m":
        startTime = new Date(now.getTime() - 60 * 1000);
        break;
      case "5m":
        startTime = new Date(now.getTime() - 5 * 60 * 1000);
        break;
      case "10m":
        startTime = new Date(now.getTime() - 10 * 60 * 1000);
        break;
      case "1h":
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "1d":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "1w":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 60 * 60 * 1000); // Default to 1 hour
    }

    const events = await truthSocialService.getFeedingEvents(
      startTime,
      now,
      limit
    );

    return res.status(200).json({
      success: true,
      data: events,
      timeRange: {
        start: startTime,
        end: now,
        duration,
      },
    });
  } catch (error) {
    console.error("Error fetching feeding events:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching feeding events",
    });
  }
});

/**
 * GET /feeding-statistics - Get feeding statistics for a time range
 */
router.get("/feeding-statistics", async (req: Request, res: Response) => {
  try {
    const duration = (req.query.duration as string) || "1h";

    // Calculate time range based on duration
    const now = new Date();
    let startTime: Date;

    switch (duration) {
      case "15s":
        startTime = new Date(now.getTime() - 15 * 1000);
        break;
      case "1m":
        startTime = new Date(now.getTime() - 60 * 1000);
        break;
      case "5m":
        startTime = new Date(now.getTime() - 5 * 60 * 1000);
        break;
      case "10m":
        startTime = new Date(now.getTime() - 10 * 60 * 1000);
        break;
      case "1h":
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "1d":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "1w":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 60 * 60 * 1000); // Default to 1 hour
    }

    const statistics = await truthSocialService.getFeedingStatistics(
      startTime,
      now
    );

    return res.status(200).json({
      success: true,
      data: statistics,
      timeRange: {
        start: startTime,
        end: now,
        duration,
      },
    });
  } catch (error) {
    console.error("Error fetching feeding statistics:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching feeding statistics",
    });
  }
});

/**
 * GET /health - Health check endpoint for TruthSocial routes
 */
router.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "TruthSocial routes are healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
