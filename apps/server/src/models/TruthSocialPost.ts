import mongoose, { Schema, Document } from "mongoose";
import { ITruthSocialAccount } from "./TruthSocialAccount";

export interface ITruthSocialMediaAttachment {
  id: string;
  type: string;
  url: string;
  preview_url: string;
  external_video_id?: string;
  remote_url?: string;
  preview_remote_url?: string;
  text_url?: string;
  meta: {
    colors?: {
      accent: string;
      background: string;
      foreground: string;
    };
    original?: {
      bitrate?: number;
      duration?: number;
      frame_rate?: string;
      height: number;
      width: number;
    };
    small?: {
      aspect: number;
      height: number;
      size: string;
      width: number;
    };
  };
  description?: string;
  blurhash?: string;
  processing: string;
}

export interface ITruthSocialMention {
  id: string;
  username: string;
  url: string;
  acct: string;
}

export interface ITruthSocialCard {
  id?: string;
  url: string;
  title: string;
  description: string;
  type: string;
  author_name: string;
  author_url: string;
  provider_name: string;
  provider_url: string;
  html: string;
  width: number;
  height: number;
  image: string;
  embed_url: string;
  blurhash?: string;
  links?: unknown;
  group?: unknown;
}

export interface ITruthSocialPost extends Document {
  id: string;
  created_at: string;
  in_reply_to_id?: string;
  quote_id?: string;
  in_reply_to_account_id?: string;
  sensitive: boolean;
  spoiler_text: string;
  visibility: string;
  language?: string;
  uri: string;
  url: string;
  content: string;
  account: ITruthSocialAccount;
  media_attachments: ITruthSocialMediaAttachment[];
  mentions: ITruthSocialMention[];
  tags: unknown[];
  card?: ITruthSocialCard;
  group?: unknown;
  quote?: unknown;
  in_reply_to?: unknown;
  reblog?: unknown;
  sponsored: boolean;
  replies_count: number;
  reblogs_count: number;
  favourites_count: number;
  reaction?: unknown;
  upvotes_count: number;
  downvotes_count: number;
  favourited: boolean;
  reblogged: boolean;
  muted: boolean;
  pinned: boolean;
  bookmarked: boolean;
  poll?: unknown;
  emojis: unknown[];
  votable: boolean;
  edited_at?: string;
  version: string;
  editable: boolean;
  title?: string;

  // Additional fields for our app
  is_trump_post: boolean;
  processed_at: Date;
}

const MediaAttachmentSchema = new Schema<ITruthSocialMediaAttachment>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
    preview_url: { type: String, required: true },
    external_video_id: { type: String },
    remote_url: { type: String },
    preview_remote_url: { type: String },
    text_url: { type: String },
    meta: {
      colors: {
        accent: { type: String },
        background: { type: String },
        foreground: { type: String },
      },
      original: {
        bitrate: { type: Number },
        duration: { type: Number },
        frame_rate: { type: String },
        height: { type: Number, required: true },
        width: { type: Number, required: true },
      },
      small: {
        aspect: { type: Number, required: true },
        height: { type: Number, required: true },
        size: { type: String, required: true },
        width: { type: Number, required: true },
      },
    },
    description: { type: String },
    blurhash: { type: String },
    processing: { type: String, required: true },
  },
  { _id: false }
);

const MentionSchema = new Schema<ITruthSocialMention>(
  {
    id: { type: String, required: true },
    username: { type: String, required: true },
    url: { type: String, required: true },
    acct: { type: String, required: true },
  },
  { _id: false }
);

const CardSchema = new Schema<ITruthSocialCard>(
  {
    id: { type: String },
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    author_name: { type: String, default: "" },
    author_url: { type: String, default: "" },
    provider_name: { type: String, required: true },
    provider_url: { type: String, default: "" },
    html: { type: String, default: "" },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    image: { type: String, default: "" },
    embed_url: { type: String, default: "" },
    blurhash: { type: String },
    links: { type: Schema.Types.Mixed },
    group: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const TruthSocialPostSchema = new Schema<ITruthSocialPost>(
  {
    id: { type: String, required: true, unique: true },
    created_at: { type: String, required: true },
    in_reply_to_id: { type: String },
    quote_id: { type: String },
    in_reply_to_account_id: { type: String },
    sensitive: { type: Boolean, default: false },
    spoiler_text: { type: String, default: "" },
    visibility: { type: String, required: true },
    language: { type: String },
    uri: { type: String, required: true },
    url: { type: String, required: true },
    content: { type: String, required: true },
    account: {
      type: Schema.Types.ObjectId,
      ref: "TruthSocialAccount",
      required: true,
    },
    media_attachments: { type: [MediaAttachmentSchema], default: [] },
    mentions: { type: [MentionSchema], default: [] },
    tags: { type: [Schema.Types.Mixed], default: [] },
    card: { type: CardSchema },
    group: { type: Schema.Types.Mixed },
    quote: { type: Schema.Types.Mixed },
    in_reply_to: { type: Schema.Types.Mixed },
    reblog: { type: Schema.Types.Mixed },
    sponsored: { type: Boolean, default: false },
    replies_count: { type: Number, default: 0 },
    reblogs_count: { type: Number, default: 0 },
    favourites_count: { type: Number, default: 0 },
    reaction: { type: Schema.Types.Mixed },
    upvotes_count: { type: Number, default: 0 },
    downvotes_count: { type: Number, default: 0 },
    favourited: { type: Boolean, default: false },
    reblogged: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    bookmarked: { type: Boolean, default: false },
    poll: { type: Schema.Types.Mixed },
    emojis: { type: [Schema.Types.Mixed], default: [] },
    votable: { type: Boolean, default: false },
    edited_at: { type: String },
    version: { type: String, required: true },
    editable: { type: Boolean, default: false },
    title: { type: String },

    // Additional fields for our app
    is_trump_post: { type: Boolean, default: false },
    processed_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
TruthSocialPostSchema.index({ created_at: -1 });
TruthSocialPostSchema.index({ is_trump_post: 1 });
TruthSocialPostSchema.index({ "account.username": 1 });
TruthSocialPostSchema.index({ upvotes_count: -1 });
TruthSocialPostSchema.index({ created_at: -1, is_trump_post: 1 });

export const TruthSocialPost = mongoose.model<ITruthSocialPost>(
  "TruthSocialPost",
  TruthSocialPostSchema
);
