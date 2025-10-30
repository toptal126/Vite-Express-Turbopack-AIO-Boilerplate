import axios, { AxiosResponse, AxiosError } from "axios";
import {
  MarketsResponse,
  MarketResponse,
  MarketTagsResponse,
  TagsResponse,
  PublicSearchResponse,
  MarketsParams,
  PublicSearchParams,
  ApiError,
  Market,
  Tag,
  MarketValidator,
  TagValidator,
  Validator,
} from "@/types/polymarket";

// Create axios instance for Polymarket API
export const polymarketAxios = axios.create({
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handling utility
class PolymarketApiError extends Error {
  public status: number;
  public details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "PolymarketApiError";
    this.status = status;
    this.details = details;
  }
}

// Response validation utilities
const validateMarket: MarketValidator = (market: unknown): Market => {
  if (!market || typeof market !== "object") {
    throw new Error("Invalid market data: not an object");
  }
  const marketObj = market as Record<string, unknown>;
  if (!marketObj.id || !marketObj.question) {
    throw new Error("Invalid market data: missing required fields");
  }
  return market as Market;
};

const validateTag: TagValidator = (tag: unknown): Tag => {
  if (!tag || typeof tag !== "object") {
    throw new Error("Invalid tag data: not an object");
  }
  const tagObj = tag as Record<string, unknown>;
  if (!tagObj.id || !tagObj.label) {
    throw new Error("Invalid tag data: missing required fields");
  }
  return tag as Tag;
};

/**
 * Comprehensive Polymarket API Service
 * Provides type-safe access to all Polymarket API endpoints
 */
export class PolymarketService {
  private static readonly BASE_URL = "/api/polymarket";

  /**
   * Generic error handler for API requests
   */
  private static handleError(error: AxiosError): never {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const responseData = error.response.data as Record<string, unknown>;
      const message =
        (responseData?.message as string) || `HTTP ${status} Error`;
      throw new PolymarketApiError(
        message,
        status,
        error.response.data as Record<string, unknown>
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new PolymarketApiError("Network Error: No response received", 0);
    } else {
      // Something else happened
      throw new PolymarketApiError(`Request Error: ${error.message}`, 0);
    }
  }

  /**
   * Generic request handler with error handling and response validation
   */
  private static async request<T>(
    url: string,
    validator?: Validator<T>
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await polymarketAxios.get(url);

      if (validator) {
        return validator(response.data);
      }

      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  /**
   * List all markets with optional filtering
   * GET /markets
   */
  static async getMarkets(params: MarketsParams = {}): Promise<Market[]> {
    const searchParams = new URLSearchParams();

    // Basic pagination
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.offset) searchParams.append("offset", params.offset.toString());

    // Ordering
    if (params.order) searchParams.append("order", params.order);
    if (params.ascending !== undefined)
      searchParams.append("ascending", params.ascending.toString());

    // Market identifiers
    if (params.id)
      params.id.forEach((id) => searchParams.append("id", id.toString()));
    if (params.slug)
      params.slug.forEach((slug) => searchParams.append("slug", slug));
    if (params.clob_token_ids)
      params.clob_token_ids.forEach((tokenId) =>
        searchParams.append("clob_token_ids", tokenId)
      );
    if (params.condition_ids)
      params.condition_ids.forEach((conditionId) =>
        searchParams.append("condition_ids", conditionId)
      );
    if (params.market_maker_address)
      params.market_maker_address.forEach((address) =>
        searchParams.append("market_maker_address", address)
      );

    // Liquidity filters
    if (params.liquidity_num_min !== undefined)
      searchParams.append(
        "liquidity_num_min",
        params.liquidity_num_min.toString()
      );
    if (params.liquidity_num_max !== undefined)
      searchParams.append(
        "liquidity_num_max",
        params.liquidity_num_max.toString()
      );

    // Volume filters
    if (params.volume_num_min !== undefined)
      searchParams.append("volume_num_min", params.volume_num_min.toString());
    if (params.volume_num_max !== undefined)
      searchParams.append("volume_num_max", params.volume_num_max.toString());

    // Date filters
    if (params.start_date_min)
      searchParams.append("start_date_min", params.start_date_min);
    if (params.start_date_max)
      searchParams.append("start_date_max", params.start_date_max);
    if (params.end_date_min)
      searchParams.append("end_date_min", params.end_date_min);
    if (params.end_date_max)
      searchParams.append("end_date_max", params.end_date_max);

    // Tag and category filters
    if (params.tag_id !== undefined)
      searchParams.append("tag_id", params.tag_id.toString());
    if (params.related_tags !== undefined)
      searchParams.append("related_tags", params.related_tags.toString());
    if (params.include_tag !== undefined)
      searchParams.append("include_tag", params.include_tag.toString());

    // Market type filters
    if (params.cyom !== undefined)
      searchParams.append("cyom", params.cyom.toString());
    if (params.uma_resolution_status)
      searchParams.append(
        "uma_resolution_status",
        params.uma_resolution_status
      );
    if (params.game_id) searchParams.append("game_id", params.game_id);
    if (params.sports_market_types)
      params.sports_market_types.forEach((type) =>
        searchParams.append("sports_market_types", type)
      );
    if (params.rewards_min_size !== undefined)
      searchParams.append(
        "rewards_min_size",
        params.rewards_min_size.toString()
      );
    if (params.question_ids)
      params.question_ids.forEach((questionId) =>
        searchParams.append("question_ids", questionId)
      );
    if (params.closed !== undefined)
      searchParams.append("closed", params.closed.toString());

    const url = `${this.BASE_URL}/markets${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const markets = await this.request<MarketsResponse>(url);
    return markets.map(validateMarket);
  }

  /**
   * Get a specific market by ID
   * GET /markets/{id}
   */
  static async getMarket(marketId: string): Promise<Market> {
    if (!marketId) {
      throw new PolymarketApiError("Market ID is required", 400);
    }

    const url = `${this.BASE_URL}/markets/${marketId}`;
    const market = await this.request<MarketResponse>(url);
    return validateMarket(market);
  }

  /**
   * Get tags for a specific market
   * GET /markets/{id}/tags
   */
  static async getMarketTags(marketId: string): Promise<Tag[]> {
    if (!marketId) {
      throw new PolymarketApiError("Market ID is required", 400);
    }

    const url = `${this.BASE_URL}/markets/${marketId}/tags`;
    const tags = await this.request<MarketTagsResponse>(url);
    return tags.map(validateTag);
  }

  /**
   * Get all available tags
   * GET /tags
   */
  static async getTags(): Promise<Tag[]> {
    const url = `${this.BASE_URL}/tags`;
    const tags = await this.request<TagsResponse>(url);
    return tags.map(validateTag);
  }

  /**
   * Public search across events, markets, tags, and profiles
   * GET /public-search
   */
  static async publicSearch(
    params: PublicSearchParams
  ): Promise<PublicSearchResponse> {
    if (!params.q) {
      throw new PolymarketApiError("Search query is required", 400);
    }

    const searchParams = new URLSearchParams();
    searchParams.append("q", params.q);

    if (params.cache !== undefined)
      searchParams.append("cache", params.cache.toString());
    if (params.events_status)
      searchParams.append("events_status", params.events_status);
    if (params.limit_per_type)
      searchParams.append("limit_per_type", params.limit_per_type.toString());
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.events_tag)
      params.events_tag.forEach((tag) =>
        searchParams.append("events_tag", tag)
      );
    if (params.keep_closed_markets)
      searchParams.append(
        "keep_closed_markets",
        params.keep_closed_markets.toString()
      );
    if (params.sort) searchParams.append("sort", params.sort);
    if (params.ascending !== undefined)
      searchParams.append("ascending", params.ascending.toString());
    if (params.search_tags !== undefined)
      searchParams.append("search_tags", params.search_tags.toString());
    if (params.search_profiles !== undefined)
      searchParams.append("search_profiles", params.search_profiles.toString());
    if (params.recurrence) searchParams.append("recurrence", params.recurrence);
    if (params.exclude_tag_id)
      params.exclude_tag_id.forEach((id) =>
        searchParams.append("exclude_tag_id", id.toString())
      );
    if (params.optimized !== undefined)
      searchParams.append("optimized", params.optimized.toString());

    const url = `${this.BASE_URL}/public-search?${searchParams.toString()}`;
    return await this.request<PublicSearchResponse>(url);
  }

  /**
   * Search markets with enhanced filtering
   * Note: The /markets endpoint doesn't support text search directly
   * This method provides filtering by various market properties
   */
  static async searchMarkets(
    options: {
      limit?: number;
      offset?: number;
      order?: string;
      ascending?: boolean;
      closed?: boolean;
      liquidityMin?: number;
      liquidityMax?: number;
      volumeMin?: number;
      volumeMax?: number;
      tagId?: number;
      startDateMin?: string;
      startDateMax?: string;
      endDateMin?: string;
      endDateMax?: string;
    } = {}
  ): Promise<Market[]> {
    const params: MarketsParams = {
      limit: options.limit || 20,
      offset: options.offset || 0,
      order: options.order || "volume",
      ascending: options.ascending || false,
      closed: options.closed,
      liquidity_num_min: options.liquidityMin,
      liquidity_num_max: options.liquidityMax,
      volume_num_min: options.volumeMin,
      volume_num_max: options.volumeMax,
      tag_id: options.tagId,
      start_date_min: options.startDateMin,
      start_date_max: options.startDateMax,
      end_date_min: options.endDateMin,
      end_date_max: options.endDateMax,
    };

    return this.getMarkets(params);
  }

  /**
   * Get trending markets (high volume, recent)
   */
  static async getTrendingMarkets(limit: number = 10): Promise<Market[]> {
    return this.getMarkets({
      limit,
      order: "volume",
      ascending: false,
      closed: false,
    });
  }

  /**
   * Get recently created markets
   */
  static async getRecentMarkets(limit: number = 10): Promise<Market[]> {
    return this.getMarkets({
      limit,
      order: "createdAt",
      ascending: false,
      closed: false,
    });
  }

  /**
   * Get markets closing soon
   */
  static async getClosingSoonMarkets(limit: number = 10): Promise<Market[]> {
    return this.getMarkets({
      limit,
      order: "endDate",
      ascending: true,
      closed: false,
    });
  }

  /**
   * Get high liquidity markets
   */
  static async getHighLiquidityMarkets(
    limit: number = 10,
    minLiquidity: number = 10000
  ): Promise<Market[]> {
    return this.getMarkets({
      limit,
      order: "liquidity",
      ascending: false,
      liquidity_num_min: minLiquidity,
      closed: false,
    });
  }

  /**
   * Get markets by tag
   */
  static async getMarketsByTag(
    tagId: number,
    limit: number = 20
  ): Promise<Market[]> {
    return this.getMarkets({
      limit,
      tag_id: tagId,
      order: "volume",
      ascending: false,
    });
  }

  /**
   * Get markets within date range
   */
  static async getMarketsByDateRange(
    startDate: string,
    endDate: string,
    limit: number = 20
  ): Promise<Market[]> {
    return this.getMarkets({
      limit,
      start_date_min: startDate,
      end_date_max: endDate,
      order: "volume",
      ascending: false,
    });
  }

  /**
   * Get markets with volume range
   */
  static async getMarketsByVolumeRange(
    minVolume: number,
    maxVolume?: number,
    limit: number = 20
  ): Promise<Market[]> {
    return this.getMarkets({
      limit,
      volume_num_min: minVolume,
      volume_num_max: maxVolume,
      order: "volume",
      ascending: false,
      closed: false,
    });
  }

  /**
   * Get markets with liquidity range
   */
  static async getMarketsByLiquidityRange(
    minLiquidity: number,
    maxLiquidity?: number,
    limit: number = 20
  ): Promise<Market[]> {
    return this.getMarkets({
      limit,
      liquidity_num_min: minLiquidity,
      liquidity_num_max: maxLiquidity,
      order: "liquidity",
      ascending: false,
      closed: false,
    });
  }

  /**
   * Get active markets only
   */
  static async getActiveMarkets(limit: number = 20): Promise<Market[]> {
    return this.getMarkets({
      limit,
      closed: false,
      order: "volume",
      ascending: false,
    });
  }

  /**
   * Get closed markets only
   */
  static async getClosedMarkets(limit: number = 20): Promise<Market[]> {
    return this.getMarkets({
      limit,
      closed: true,
      order: "volume",
      ascending: false,
    });
  }

  /**
   * Get markets ending soon (within next 7 days)
   */
  static async getMarketsEndingSoon(limit: number = 20): Promise<Market[]> {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.getMarkets({
      limit,
      end_date_min: now.toISOString(),
      end_date_max: nextWeek.toISOString(),
      order: "endDate",
      ascending: true,
      closed: false,
    });
  }

  /**
   * Get market with full details including events, tags, and categories
   */
  static async getMarketWithDetails(marketId: string): Promise<{
    market: Market;
    tags: Tag[];
  }> {
    const [market, tags] = await Promise.all([
      this.getMarket(marketId),
      this.getMarketTags(marketId),
    ]);

    return { market, tags };
  }

  /**
   * Search across all content types (events, markets, tags, profiles)
   */
  static async globalSearch(
    query: string,
    options: {
      searchTags?: boolean;
      searchProfiles?: boolean;
      limitPerType?: number;
      page?: number;
    } = {}
  ): Promise<PublicSearchResponse> {
    return this.publicSearch({
      q: query,
      search_tags: options.searchTags || true,
      search_profiles: options.searchProfiles || false,
      limit_per_type: options.limitPerType || 10,
      page: options.page || 1,
      // Omit optimized parameter to get detailed event data including volume
    });
  }

  /**
   * Hybrid search method that can search for markets by text or filter by properties
   * For text search, uses public-search endpoint
   * For property filtering, uses markets endpoint
   */
  static async searchMarketsHybrid(
    queryOrOptions:
      | string
      | {
          limit?: number;
          offset?: number;
          order?: string;
          ascending?: boolean;
          closed?: boolean;
          liquidityMin?: number;
          liquidityMax?: number;
          volumeMin?: number;
          volumeMax?: number;
          tagId?: number;
          startDateMin?: string;
          startDateMax?: string;
          endDateMin?: string;
          endDateMax?: string;
        }
  ): Promise<Market[]> {
    // If it's a string, use public search for text-based search
    if (typeof queryOrOptions === "string") {
      const searchResults = await this.publicSearch({
        q: queryOrOptions,
        limit_per_type: 20,
        search_tags: false,
        search_profiles: false,
        // Omit optimized parameter to get detailed event data including volume
      });

      // Extract markets from events (since events contain markets)
      const markets: Market[] = [];
      searchResults.events.forEach((event) => {
        if (event.markets && event.markets.length > 0) {
          markets.push(...event.markets);
        }
      });

      return markets;
    }

    // Otherwise, use the markets endpoint for property-based filtering
    return this.searchMarkets(queryOrOptions);
  }

  /**
   * Get detailed information for a specific event by ID
   * This includes full volume, liquidity, and market data
   */
  static async getEventDetails(
    eventId: string
  ): Promise<import("@/types/polymarket").Event | null> {
    try {
      const url = `${this.BASE_URL}/events/${eventId}`;
      console.log(`Fetching event details from: ${url}`);

      const eventData = await this.request<import("@/types/polymarket").Event>(
        url
      );
      console.log(`Successfully fetched event details for ID: ${eventId}`);

      return eventData;
    } catch (error) {
      console.error(`Failed to fetch event details for ID ${eventId}:`, error);
      return null;
    }
  }
}

// Export error class for external use
export { PolymarketApiError };

// Export default instance for convenience
export default PolymarketService;
