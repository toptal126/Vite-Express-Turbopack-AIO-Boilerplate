import mongoose, { Schema, Document } from "mongoose";

export interface ITruthSocialAccount extends Document {
  id: string;
  username: string;
  acct: string;
  display_name: string;
  locked: boolean;
  bot: boolean;
  discoverable: boolean;
  group: boolean;
  created_at: string;
  note: string;
  url: string;
  avatar: string;
  avatar_static: string;
  header: string;
  header_static: string;
  followers_count: number;
  following_count: number;
  statuses_count: number;
  last_status_at: string;
  verified: boolean;
  location: string;
  website: string;
  unauth_visibility: boolean;
  chats_onboarded: boolean;
  feeds_onboarded: boolean;
  accepting_messages: boolean;
  show_nonmember_group_statuses: boolean;
  emojis: unknown[];
  fields: unknown[];
  tv_onboarded: boolean;
  tv_account: boolean;
  premium: boolean;
}

const TruthSocialAccountSchema = new Schema<ITruthSocialAccount>(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    acct: { type: String, required: true },
    display_name: { type: String, required: true },
    locked: { type: Boolean, default: false },
    bot: { type: Boolean, default: false },
    discoverable: { type: Boolean, default: true },
    group: { type: Boolean, default: false },
    created_at: { type: String, required: true },
    note: { type: String, default: "" },
    url: { type: String, required: true },
    avatar: { type: String, required: true },
    avatar_static: { type: String, required: true },
    header: { type: String, required: true },
    header_static: { type: String, required: true },
    followers_count: { type: Number, default: 0 },
    following_count: { type: Number, default: 0 },
    statuses_count: { type: Number, default: 0 },
    last_status_at: { type: String, required: true },
    verified: { type: Boolean, default: false },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    unauth_visibility: { type: Boolean, default: true },
    chats_onboarded: { type: Boolean, default: false },
    feeds_onboarded: { type: Boolean, default: false },
    accepting_messages: { type: Boolean, default: false },
    show_nonmember_group_statuses: { type: Boolean, default: false },
    emojis: { type: [Schema.Types.Mixed], default: [] },
    fields: { type: [Schema.Types.Mixed], default: [] },
    tv_onboarded: { type: Boolean, default: false },
    tv_account: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
TruthSocialAccountSchema.index({ username: 1 });
TruthSocialAccountSchema.index({ verified: 1 });

export const TruthSocialAccount = mongoose.model<ITruthSocialAccount>(
  "TruthSocialAccount",
  TruthSocialAccountSchema
);
