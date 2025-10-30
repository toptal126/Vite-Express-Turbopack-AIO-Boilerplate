import axios from "axios";
import {
  TruthSocialPost,
  TruthSocialAccount,
  TruthSocialFeedData,
  TruthSocialFeedSummary,
  TruthSocialApiResponse,
} from "@polypulse/shared";

// Use proxy endpoints to avoid CORS issues
const TRUTHSOCIAL_API_BASE = `${import.meta.env.VITE_POLYPULSE_API_URL}/api/truthsocial`;

// Create axios instance for TruthSocial API
export const truthSocialAxios = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface TruthSocialPostsResponse {
  success: boolean;
  data: TruthSocialPost[];
  pagination: {
    limit: number;
    skip: number;
    count: number;
  };
}

export interface TruthSocialPostResponse {
  success: boolean;
  data: TruthSocialPost;
}

export interface TruthSocialStatisticsResponse {
  success: boolean;
  data: {
    totalPosts: number;
    trumpPosts: number;
    totalAccounts: number;
    latestPostDate?: string;
  };
  feedStats: {
    expectedFeedCounter: number;
    actualFeedCounter: number;
    missingFeeds: number;
    feedingHealthPercentage: number;
    feedingStatus: "excellent" | "good" | "fair" | "poor";
    feedInterval: number;
    longestUnfeedInterval: number;
    currentUnfeedInterval: number;
    uptime: number;
  };
}

export interface FeedingEvent {
  _id: string;
  timestamp: string;
  feedCount: number;
  postsReceived: number;
  postsSaved: number;
  postsSkipped: number;
  postsErrors: number;
  processingTimeMs: number;
  isSuccessful: boolean;
  errorMessage?: string;
}

export interface FeedingEventsResponse {
  success: boolean;
  data: FeedingEvent[];
  timeRange: {
    start: string;
    end: string;
    duration: string;
  };
}

export interface FeedingStatistics {
  totalFeeds: number;
  successfulFeeds: number;
  failedFeeds: number;
  totalPostsReceived: number;
  totalPostsSaved: number;
  totalPostsSkipped: number;
  totalPostsErrors: number;
  averageProcessingTime: number;
  successRate: number;
}

export interface FeedingStatisticsResponse {
  success: boolean;
  data: FeedingStatistics;
  timeRange: {
    start: string;
    end: string;
    duration: string;
  };
}

export interface TruthSocialFeedResponse {
  success: boolean;
  message: string;
  summary: TruthSocialFeedSummary;
  database: {
    saved: number;
    skipped: number;
    errors: number;
  };
}

export class TruthSocialApiService {
  /**
   * Get all Trump posts with pagination
   */
  static async getTrumpPosts(
    limit: number = 50,
    skip: number = 0
  ): Promise<TruthSocialPostsResponse> {
    try {
      const response = await truthSocialAxios.get<TruthSocialPostsResponse>(
        `${TRUTHSOCIAL_API_BASE}/posts/trump`,
        {
          params: { limit, skip },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Trump posts:", error);
      throw new Error("Failed to fetch Trump posts");
    }
  }

  /**
   * Get all posts with optional filtering
   */
  static async getAllPosts(
    limit: number = 50,
    skip: number = 0,
    username?: string
  ): Promise<TruthSocialPostsResponse> {
    try {
      const params: { limit: number; skip: number; username?: string } = {
        limit,
        skip,
      };
      if (username) {
        params.username = username;
      }

      const response = await truthSocialAxios.get<TruthSocialPostsResponse>(
        `${TRUTHSOCIAL_API_BASE}/posts`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }

  /**
   * Get a specific post by ID
   */
  static async getPostById(postId: string): Promise<TruthSocialPostResponse> {
    try {
      const response = await truthSocialAxios.get<TruthSocialPostResponse>(
        `${TRUTHSOCIAL_API_BASE}/posts/${postId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      throw new Error("Failed to fetch post");
    }
  }

  /**
   * Get post statistics
   */
  static async getStatistics(): Promise<TruthSocialStatisticsResponse> {
    try {
      const response =
        await truthSocialAxios.get<TruthSocialStatisticsResponse>(
          `${TRUTHSOCIAL_API_BASE}/statistics`
        );
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw new Error("Failed to fetch statistics");
    }
  }

  /**
   * Submit feed data to the server
   */
  static async submitFeed(
    feedData: TruthSocialFeedData
  ): Promise<TruthSocialFeedResponse> {
    try {
      const response = await truthSocialAxios.post<TruthSocialFeedResponse>(
        `${TRUTHSOCIAL_API_BASE}/feed`,
        { feed: feedData }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting feed:", error);
      throw new Error("Failed to submit feed data");
    }
  }

  /**
   * Get feeding events for a time range
   */
  static async getFeedingEvents(
    duration: string = "1h",
    limit: number = 1000
  ): Promise<FeedingEventsResponse> {
    try {
      const response = await truthSocialAxios.get<FeedingEventsResponse>(
        `${TRUTHSOCIAL_API_BASE}/feeding-events`,
        {
          params: { duration, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching feeding events:", error);
      throw new Error("Failed to fetch feeding events");
    }
  }

  /**
   * Get feeding statistics for a time range
   */
  static async getFeedingStatistics(
    duration: string = "1h"
  ): Promise<FeedingStatisticsResponse> {
    try {
      const response = await truthSocialAxios.get<FeedingStatisticsResponse>(
        `${TRUTHSOCIAL_API_BASE}/feeding-statistics`,
        {
          params: { duration },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching feeding statistics:", error);
      throw new Error("Failed to fetch feeding statistics");
    }
  }

  /**
   * Health check
   */
  static async healthCheck(): Promise<{
    success: boolean;
    message: string;
    timestamp: string;
  }> {
    try {
      const response = await truthSocialAxios.get(
        `${TRUTHSOCIAL_API_BASE}/health`
      );
      return response.data;
    } catch (error) {
      console.error("Error checking health:", error);
      throw new Error("Failed to check health");
    }
  }
}

// Export the service instance
export const truthSocialApi = TruthSocialApiService;
