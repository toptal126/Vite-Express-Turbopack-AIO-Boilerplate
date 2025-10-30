// Polymarket API Types
// Based on https://gamma-api.polymarket.com documentation

// Re-export shared types
export * from "@polypulse/shared";

export interface OptimizedImage {
  id: string;
  imageUrlSource: string;
  imageUrlOptimized: string;
  imageSizeKbSource: number;
  imageSizeKbOptimized: number;
  imageOptimizedComplete: boolean;
  imageOptimizedLastUpdated: string;
  relID: number;
  field: string;
  relname: string;
}

export interface Tag {
  id: string;
  label: string;
  slug: string;
  forceShow: boolean;
  publishedAt: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  forceHide: boolean;
  isCarousel: boolean;
  event_count?: number; // Only in search results
}

export interface Category {
  id: string;
  label: string;
  parentCategory: string;
  slug: string;
  publishedAt: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventCreator {
  id: string;
  creatorName: string;
  creatorHandle: string;
  creatorUrl: string;
  creatorImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  channelId: string;
  channelName: string;
  channelImage: string;
  live: boolean;
  startTime: string;
  endTime: string;
}

export interface Template {
  id: string;
  eventTitle: string;
  eventSlug: string;
  eventImage: string;
  marketTitle: string;
  description: string;
  resolutionSource: string;
  negRisk: boolean;
  sortBy: string;
  showMarketImages: boolean;
  seriesSlug: string;
  outcomes: string;
}

export interface Collection {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  subtitle: string;
  collectionType: string;
  description: string;
  tags: string;
  image: string;
  icon: string;
  headerImage: string;
  layout: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  isTemplate: boolean;
  templateVariables: string;
  publishedAt: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  commentsEnabled: boolean;
  imageOptimized: OptimizedImage;
  iconOptimized: OptimizedImage;
  headerImageOptimized: OptimizedImage;
}

export interface Series {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  subtitle: string;
  seriesType: string;
  recurrence: string;
  description: string;
  image: string;
  icon: string;
  layout: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  isTemplate: boolean;
  templateVariables: boolean;
  publishedAt: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  commentsEnabled: boolean;
  competitive: string;
  volume24hr: number;
  volume: number;
  liquidity: number;
  startDate: string;
  pythTokenID: string;
  cgAssetName: string;
  score: number;
  events: Event[];
  collections: Collection[];
  categories: Category[];
  tags: Tag[];
  commentCount: number;
  chats: Chat[];
}

export interface Event {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  resolutionSource: string;
  startDate: string;
  creationDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  liquidity: number;
  volume: number;
  openInterest: number;
  sortBy: string;
  category: string;
  subcategory: string;
  isTemplate: boolean;
  templateVariables: string;
  published_at: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  commentsEnabled: boolean;
  competitive: number;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  featuredImage: string;
  disqusThread: string;
  parentEvent: string;
  enableOrderBook: boolean;
  liquidityAmm: number;
  liquidityClob: number;
  negRisk: boolean;
  negRiskMarketID: string;
  negRiskFeeBips: number;
  commentCount: number;
  imageOptimized: OptimizedImage;
  iconOptimized: OptimizedImage;
  featuredImageOptimized: OptimizedImage;
  subEvents: string[];
  markets: Market[];
  series: Series[];
  categories: Category[];
  collections: Collection[];
  tags: Tag[];
  cyom: boolean;
  closedTime: string;
  showAllOutcomes: boolean;
  showMarketImages: boolean;
  automaticallyResolved: boolean;
  enableNegRisk: boolean;
  automaticallyActive: boolean;
  eventDate: string;
  startTime: string;
  eventWeek: number;
  seriesSlug: string;
  score: string;
  elapsed: string;
  period: string;
  live: boolean;
  ended: boolean;
  finishedTimestamp: string;
  gmpChartMode: string;
  eventCreators: EventCreator[];
  tweetCount: number;
  chats: Chat[];
  featuredOrder: number;
  estimateValue: boolean;
  cantEstimate: boolean;
  estimatedValue: string;
  templates: Template[];
  spreadsMainLine: number;
  totalsMainLine: number;
  carouselMap: string;
  pendingDeployment: boolean;
  deploying: boolean;
  deployingTimestamp: string;
  scheduledDeploymentTimestamp: string;
  gameStatus: string;
}

export interface Market {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  twitterCardImage: string;
  resolutionSource: string;
  endDate: string;
  category: string;
  ammType: string;
  liquidity: string;
  sponsorName: string;
  sponsorImage: string;
  startDate: string;
  xAxisValue: string;
  yAxisValue: string;
  denominationToken: string;
  fee: string;
  image: string;
  icon: string;
  lowerBound: string;
  upperBound: string;
  description: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  active: boolean;
  marketType: string;
  formatType: string;
  lowerBoundDate: string;
  upperBoundDate: string;
  closed: boolean;
  marketMakerAddress: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  closedTime: string;
  wideFormat: boolean;
  new: boolean;
  mailchimpTag: string;
  featured: boolean;
  archived: boolean;
  resolvedBy: string;
  restricted: boolean;
  marketGroup: number;
  groupItemTitle: string;
  groupItemThreshold: string;
  questionID: string;
  umaEndDate: string;
  enableOrderBook: boolean;
  orderPriceMinTickSize: number;
  orderMinSize: number;
  umaResolutionStatus: string;
  curationOrder: number;
  volumeNum: number;
  liquidityNum: number;
  endDateIso: string;
  startDateIso: string;
  umaEndDateIso: string;
  hasReviewedDates: boolean;
  readyForCron: boolean;
  commentsEnabled: boolean;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  gameStartTime: string;
  secondsDelay: number;
  clobTokenIds: string;
  disqusThread: string;
  shortOutcomes: string;
  teamAID: string;
  teamBID: string;
  umaBond: string;
  umaReward: string;
  fpmmLive: boolean;
  volume24hrAmm: number;
  volume1wkAmm: number;
  volume1moAmm: number;
  volume1yrAmm: number;
  volume24hrClob: number;
  volume1wkClob: number;
  volume1moClob: number;
  volume1yrClob: number;
  volumeAmm: number;
  volumeClob: number;
  liquidityAmm: number;
  liquidityClob: number;
  makerBaseFee: number;
  takerBaseFee: number;
  customLiveness: number;
  acceptingOrders: boolean;
  notificationsEnabled: boolean;
  score: number;
  imageOptimized: OptimizedImage;
  iconOptimized: OptimizedImage;
  events: Event[];
  categories: Category[];
  tags: Tag[];
  creator: string;
  ready: boolean;
  funded: boolean;
  pastSlugs: string;
  readyTimestamp: string;
  fundedTimestamp: string;
  acceptingOrdersTimestamp: string;
  competitive: number;
  rewardsMinSize: number;
  rewardsMaxSpread: number;
  spread: number;
  automaticallyResolved: boolean;
  oneDayPriceChange: number;
  oneHourPriceChange: number;
  oneWeekPriceChange: number;
  oneMonthPriceChange: number;
  oneYearPriceChange: number;
  lastTradePrice: number;
  bestBid: number;
  bestAsk: number;
  automaticallyActive: boolean;
  clearBookOnStart: boolean;
  chartColor: string;
  seriesColor: string;
  showGmpSeries: boolean;
  showGmpOutcome: boolean;
  manualActivation: boolean;
  negRiskOther: boolean;
  gameId: string;
  groupItemRange: string;
  sportsMarketType: string;
  line: number;
  umaResolutionStatuses: string;
  pendingDeployment: boolean;
  deploying: boolean;
  deployingTimestamp: string;
  scheduledDeploymentTimestamp: string;
  rfqEnabled: boolean;
  eventStartTime: string;
}

export interface Profile {
  id: string;
  name: string;
  user: number;
  referral: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  walletActivated: boolean;
  pseudonym: string;
  displayUsernamePublic: boolean;
  profileImage: string;
  bio: string;
  proxyWallet: string;
  profileImageOptimized: OptimizedImage;
  isCloseOnly: boolean;
  isCertReq: boolean;
  certReqDate: string;
}

export interface Pagination {
  hasMore: boolean;
  totalResults: number;
}

// API Response Types
export interface MarketsResponse extends Array<Market> {}

export interface MarketResponse extends Market {}

export interface MarketTagsResponse extends Array<Tag> {}

export interface TagsResponse extends Array<Tag> {}

export interface PublicSearchResponse {
  events: Event[];
  tags: Tag[];
  profiles: Profile[];
  pagination: Pagination;
}

// Request Parameters
export interface MarketsParams {
  limit?: number;
  offset?: number;
  order?: string; // Comma-separated list of fields to order by
  ascending?: boolean;
  id?: number[];
  slug?: string[];
  clob_token_ids?: string[];
  condition_ids?: string[];
  market_maker_address?: string[];
  liquidity_num_min?: number;
  liquidity_num_max?: number;
  volume_num_min?: number;
  volume_num_max?: number;
  start_date_min?: string; // ISO date-time
  start_date_max?: string; // ISO date-time
  end_date_min?: string; // ISO date-time
  end_date_max?: string; // ISO date-time
  tag_id?: number;
  related_tags?: boolean;
  cyom?: boolean;
  uma_resolution_status?: string;
  game_id?: string;
  sports_market_types?: string[];
  rewards_min_size?: number;
  question_ids?: string[];
  include_tag?: boolean;
  closed?: boolean;
}

export interface PublicSearchParams {
  q: string;
  cache?: boolean;
  events_status?: string;
  limit_per_type?: number;
  page?: number;
  events_tag?: string[];
  keep_closed_markets?: number;
  sort?: string;
  ascending?: boolean;
  search_tags?: boolean;
  search_profiles?: boolean;
  recurrence?: string;
  exclude_tag_id?: number[];
  optimized?: boolean;
}

// Error Response
export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

// Additional types for API responses and validation
export interface MarketSearchResponse {
  markets: SimpleMarket[];
  total: number;
  page: number;
  limit: number;
}

export interface MarketDetails {
  id: string;
  question: string;
  description: string;
  image: string;
  volume: number;
  volumeFormatted: string;
  price: number;
  priceFormatted: string;
  change24h: number;
  change24hFormatted: string;
  trend: "up" | "down" | "neutral";
  createdAt: string;
  closesAt: string;
  marketMaker: string;
  outcomeTokens: Record<string, unknown>[];
  url: string;
  active: boolean;
  archived: boolean;
  candlesticks: MarketCandlestick[];
  liquidity: number;
  totalLiquidity: number;
  fees: number;
  resolutionSource: string;
  endDate: string;
  resolutionDate: string;
}

export interface MarketCandlestick {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Validation function types
export type MarketValidator = (market: unknown) => Market;
export type TagValidator = (tag: unknown) => Tag;

// Generic validator type
export type Validator<T> = (data: unknown) => T;

// API Market interface (what comes from the API)
export interface ApiMarket {
  id: string;
  question: string;
  description: string;
  image?: string;
  volumeNum?: number;
  outcomePrices?: string;
  oneDayPriceChange?: number;
  createdAt: string;
  endDate: string;
  marketMakerAddress?: string;
  outcomeTokens?: string;
  active?: boolean;
  archived?: boolean;
  volume?: string | number;
  liquidity?: string | number;
  fee?: string;
  resolutionSource?: string;
  totalLiquidity?: number;
  fees?: number;
  resolutionDate?: string;
}

// Simplified Market interface for the application
export interface SimpleMarket {
  id: string;
  question: string;
  description: string;
  image: string;
  volume: number;
  volumeFormatted: string;
  price: number;
  priceFormatted: string;
  change24h: number;
  change24hFormatted: string;
  trend: "up" | "down" | "neutral";
  createdAt: string;
  closesAt: string;
  marketMaker: string;
  outcomeTokens: Record<string, unknown>[];
  url: string;
  active: boolean;
  archived: boolean;
}
