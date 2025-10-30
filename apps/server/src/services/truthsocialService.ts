import {
  TruthSocialFeedData,
  TruthSocialPost,
  TruthSocialAccount,
} from "@polypulse/shared";
import {
  TruthSocialPost as TruthSocialPostModel,
  ITruthSocialPost,
} from "../models/TruthSocialPost";
import {
  TruthSocialAccount as TruthSocialAccountModel,
  ITruthSocialAccount,
} from "../models/TruthSocialAccount";
import { FeedingEvent } from "../models/FeedingEvent";
import { IFeedingEvent } from "@polypulse/shared";

export class TruthSocialService {
  /**
   * Check if a post already exists in the database
   * @param postId - The TruthSocial post ID
   * @returns Promise<boolean> - True if post exists, false otherwise
   */

  public async postExists(postId: string): Promise<boolean> {
    try {
      const existingPost = await TruthSocialPostModel.findOne({ id: postId });
      return !!existingPost;
    } catch (error) {
      console.error("Error checking if post exists:", error);
      return false;
    }
  }

  /**
   * Save or update a TruthSocial account
   * @param accountData - The account data from TruthSocial
   * @returns Promise<ITruthSocialAccount> - The saved account
   */
  public async saveAccount(
    accountData: TruthSocialAccount
  ): Promise<ITruthSocialAccount> {
    try {
      const existingAccount = await TruthSocialAccountModel.findOne({
        id: accountData.id,
      });

      if (existingAccount) {
        // Update existing account
        Object.assign(existingAccount, accountData);
        return await existingAccount.save();
      } else {
        // Create new account
        const newAccount = new TruthSocialAccountModel(accountData);
        return await newAccount.save();
      }
    } catch (error) {
      console.error("Error saving account:", error);
      throw error;
    }
  }

  /**
   * Save a TruthSocial post to the database
   * @param postData - The post data from TruthSocial
   * @returns Promise<ITruthSocialPost> - The saved post
   */
  public async savePost(postData: TruthSocialPost): Promise<ITruthSocialPost> {
    try {
      // Check if post already exists
      const existingPost = await TruthSocialPostModel.findOne({
        id: postData.id,
      });

      if (existingPost) {
        // console.log(`Post ${postData.id} already exists, skipping...`);
        return existingPost;
      }

      // Save the account first
      const savedAccount = await this.saveAccount(postData.account);

      // Create post data with account reference
      const postToSave = {
        ...postData,
        account: savedAccount._id,
        is_trump_post: postData.account.username === "realDonaldTrump",
        processed_at: new Date(),
      };

      const newPost = new TruthSocialPostModel(postToSave);
      const savedPost = await newPost.save();

      // Log new post
      console.log(
        `🆕 NEW POST: ${postData.id} by @${postData.account.username} - "${postData.content.substring(0, 100)}${postData.content.length > 100 ? "..." : ""}"`
      );

      return savedPost;
    } catch (error) {
      console.error("Error saving post:", error);
      throw error;
    }
  }

  /**
   * Save multiple TruthSocial posts to the database
   * @param postsData - Array of post data from TruthSocial
   * @param feedCount - Current feed count for tracking
   * @returns Promise<{saved: number, skipped: number, errors: number}> - Summary of operation
   */
  public async savePosts(
    postsData: TruthSocialFeedData,
    feedCount: number
  ): Promise<{
    saved: number;
    skipped: number;
    errors: number;
    posts: ITruthSocialPost[];
  }> {
    let saved = 0;
    let skipped = 0;
    let errors = 0;
    const savedPosts: ITruthSocialPost[] = [];

    for (const postData of postsData) {
      try {
        const existingPost = await this.postExists(postData.id);

        if (existingPost) {
          skipped++;
          // console.log(`Post ${postData.id} already exists, skipping...`);
          continue;
        }

        const savedPost = await this.savePost(postData);
        savedPosts.push(savedPost);
        saved++;
        // console.log(`Successfully saved post ${postData.id}`);
      } catch (error) {
        errors++;
        console.error(`Error saving post ${postData.id}:`, error);
      }
    }

    // Log feeding event
    await this.logFeedingEvent({
      feedCount,
      postsReceived: postsData.length,
      postsSaved: saved,
      postsSkipped: skipped,
      postsErrors: errors,
      processingTimeMs: 0, // Will be calculated by the route
      isSuccessful: errors === 0,
    });

    return { saved, skipped, errors, posts: savedPosts };
  }

  /**
   * Process TruthSocial feed data
   * @param feedData - Array of TruthSocial posts
   */
  public processFeedData(feedData: TruthSocialFeedData): void {
    // Process feed data without logging since we're using MongoDB
  }

  /**
   * Get summary statistics from feed data
   * @param feedData - Array of TruthSocial posts
   * @returns Summary statistics
   */
  public getFeedSummary(feedData: TruthSocialFeedData): {
    totalPosts: number;
    totalUpvotes: number;
    totalReplies: number;
    totalReblogs: number;
    uniqueUsers: number;
  } {
    const totalPosts = feedData.length;
    const totalUpvotes = feedData.reduce(
      (sum, post) => sum + post.upvotes_count,
      0
    );
    const totalReplies = feedData.reduce(
      (sum, post) => sum + post.replies_count,
      0
    );
    const totalReblogs = feedData.reduce(
      (sum, post) => sum + post.reblogs_count,
      0
    );
    const uniqueUsers = new Set(feedData.map((post) => post.account.id)).size;

    const summary = {
      totalPosts,
      totalUpvotes,
      totalReplies,
      totalReblogs,
      uniqueUsers,
    };

    // console.log("TruthSocial Service - Feed Summary:", summary);
    return summary;
  }

  /**
   * Get all Trump posts from the database
   * @param limit - Maximum number of posts to return
   * @param skip - Number of posts to skip for pagination
   * @returns Promise<ITruthSocialPost[]> - Array of Trump posts
   */
  public async getTrumpPosts(
    limit: number = 50,
    skip: number = 0
  ): Promise<ITruthSocialPost[]> {
    try {
      const posts = await TruthSocialPostModel.find({ is_trump_post: true })
        .populate("account")
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip);

      return posts;
    } catch (error) {
      console.error("Error fetching Trump posts:", error);
      throw error;
    }
  }

  /**
   * Get all posts from the database
   * @param limit - Maximum number of posts to return
   * @param skip - Number of posts to skip for pagination
   * @param username - Optional username filter
   * @returns Promise<ITruthSocialPost[]> - Array of posts
   */
  public async getAllPosts(
    limit: number = 50,
    skip: number = 0,
    username?: string
  ): Promise<ITruthSocialPost[]> {
    try {
      const query: any = {};

      if (username) {
        query["account.username"] = username;
      }

      const posts = await TruthSocialPostModel.find(query)
        .populate("account")
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip);

      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  /**
   * Get post statistics
   * @returns Promise<{totalPosts: number, trumpPosts: number, totalAccounts: number}>
   */
  public async getPostStatistics(): Promise<{
    totalPosts: number;
    trumpPosts: number;
    totalAccounts: number;
    latestPostDate?: string;
  }> {
    try {
      const [totalPosts, trumpPosts, totalAccounts, latestPost] =
        await Promise.all([
          TruthSocialPostModel.countDocuments(),
          TruthSocialPostModel.countDocuments({ is_trump_post: true }),
          TruthSocialAccountModel.countDocuments(),
          TruthSocialPostModel.findOne().sort({ created_at: -1 }),
        ]);

      const result: {
        totalPosts: number;
        trumpPosts: number;
        totalAccounts: number;
        latestPostDate?: string;
      } = {
        totalPosts,
        trumpPosts,
        totalAccounts,
      };

      if (latestPost?.created_at) {
        result.latestPostDate = latestPost.created_at;
      }

      return result;
    } catch (error) {
      console.error("Error fetching post statistics:", error);
      throw error;
    }
  }

  /**
   * Get a specific post by ID
   * @param postId - The TruthSocial post ID
   * @returns Promise<ITruthSocialPost | null> - The post or null if not found
   */
  public async getPostById(postId: string): Promise<ITruthSocialPost | null> {
    try {
      const post = await TruthSocialPostModel.findOne({ id: postId }).populate(
        "account"
      );

      return post;
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      throw error;
    }
  }

  /**
   * Log a feeding event to the database
   * @param eventData - The feeding event data
   * @returns Promise<IFeedingEvent> - The saved feeding event
   */
  public async logFeedingEvent(eventData: {
    feedCount: number;
    postsReceived: number;
    postsSaved: number;
    postsSkipped: number;
    postsErrors: number;
    processingTimeMs: number;
    isSuccessful: boolean;
    errorMessage?: string;
  }): Promise<IFeedingEvent> {
    try {
      const feedingEvent = new FeedingEvent(eventData);
      return await feedingEvent.save();
    } catch (error) {
      console.error("Error logging feeding event:", error);
      throw error;
    }
  }

  /**
   * Get feeding events for a specific time range
   * @param startTime - Start time for the range
   * @param endTime - End time for the range
   * @param limit - Maximum number of events to return
   * @returns Promise<IFeedingEvent[]> - Array of feeding events
   */
  public async getFeedingEvents(
    startTime: Date,
    endTime: Date,
    limit: number = 1000
  ): Promise<IFeedingEvent[]> {
    try {
      const events = await FeedingEvent.find({
        timestamp: {
          $gte: startTime,
          $lte: endTime,
        },
      })
        .sort({ timestamp: -1 })
        .limit(limit);

      return events;
    } catch (error) {
      console.error("Error fetching feeding events:", error);
      throw error;
    }
  }

  /**
   * Get feeding statistics for a specific time range
   * @param startTime - Start time for the range
   * @param endTime - End time for the range
   * @returns Promise<object> - Feeding statistics
   */
  public async getFeedingStatistics(
    startTime: Date,
    endTime: Date
  ): Promise<{
    totalFeeds: number;
    successfulFeeds: number;
    failedFeeds: number;
    totalPostsReceived: number;
    totalPostsSaved: number;
    totalPostsSkipped: number;
    totalPostsErrors: number;
    averageProcessingTime: number;
    successRate: number;
  }> {
    try {
      const events = await FeedingEvent.find({
        timestamp: {
          $gte: startTime,
          $lte: endTime,
        },
      });

      const totalFeeds = events.length;
      const successfulFeeds = events.filter((e) => e.isSuccessful).length;
      const failedFeeds = totalFeeds - successfulFeeds;
      const totalPostsReceived = events.reduce(
        (sum, e) => sum + e.postsReceived,
        0
      );
      const totalPostsSaved = events.reduce((sum, e) => sum + e.postsSaved, 0);
      const totalPostsSkipped = events.reduce(
        (sum, e) => sum + e.postsSkipped,
        0
      );
      const totalPostsErrors = events.reduce(
        (sum, e) => sum + e.postsErrors,
        0
      );
      const averageProcessingTime =
        events.length > 0
          ? events.reduce((sum, e) => sum + e.processingTimeMs, 0) /
            events.length
          : 0;
      const successRate =
        totalFeeds > 0 ? (successfulFeeds / totalFeeds) * 100 : 0;

      return {
        totalFeeds,
        successfulFeeds,
        failedFeeds,
        totalPostsReceived,
        totalPostsSaved,
        totalPostsSkipped,
        totalPostsErrors,
        averageProcessingTime,
        successRate,
      };
    } catch (error) {
      console.error("Error fetching feeding statistics:", error);
      throw error;
    }
  }
}

export const truthSocialService = new TruthSocialService();
