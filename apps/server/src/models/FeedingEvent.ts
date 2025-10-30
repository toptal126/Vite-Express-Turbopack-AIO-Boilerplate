import { Schema, model } from "mongoose";
import { IFeedingEvent } from "@polypulse/shared";

const FeedingEventSchema = new Schema<IFeedingEvent>(
  {
    timestamp: { type: Date, required: true, default: Date.now },
    feedCount: { type: Number, required: true },
    postsReceived: { type: Number, required: true, default: 0 },
    postsSaved: { type: Number, required: true, default: 0 },
    postsSkipped: { type: Number, required: true, default: 0 },
    postsErrors: { type: Number, required: true, default: 0 },
    processingTimeMs: { type: Number, required: true, default: 0 },
    isSuccessful: { type: Boolean, required: true, default: true },
    errorMessage: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
FeedingEventSchema.index({ timestamp: -1 });
FeedingEventSchema.index({ feedCount: 1 });
FeedingEventSchema.index({ isSuccessful: 1 });

export const FeedingEvent = model<IFeedingEvent>(
  "FeedingEvent",
  FeedingEventSchema
);
