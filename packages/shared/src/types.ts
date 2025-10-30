export interface IFeedingEvent {
  timestamp: Date;
  feedCount: number;
  postsReceived: number;
  postsSaved: number;
  postsSkipped: number;
  postsErrors: number;
  processingTimeMs: number;
  isSuccessful: boolean;
  errorMessage?: string;
}
