export interface TruthSocialAccount {
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

export interface TruthSocialMediaAttachment {
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

export interface TruthSocialMention {
  id: string;
  username: string;
  url: string;
  acct: string;
}

export interface TruthSocialCard {
  id?: string;
  url: string;
  title: string;
  description: string;
  type: string;
  author_name?: string;
  author_url?: string;
  provider_name: string;
  provider_url?: string;
  html?: string;
  width?: number;
  height?: number;
  image?: string;
  embed_url?: string;
  blurhash?: string;
  links?: unknown;
  group?: unknown;
}

export interface TruthSocialQuote {
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
  account: TruthSocialAccount;
  media_attachments: TruthSocialMediaAttachment[];
  mentions: TruthSocialMention[];
  tags: unknown[];
  card?: TruthSocialCard;
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
}

export interface TruthSocialPost {
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
  account: TruthSocialAccount;
  media_attachments: TruthSocialMediaAttachment[];
  mentions: TruthSocialMention[];
  tags: unknown[];
  card?: TruthSocialCard;
  group?: unknown;
  quote?: TruthSocialQuote;
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
}

export type TruthSocialFeedData = TruthSocialPost[];

export interface TruthSocialFeedSummary {
  totalPosts: number;
  totalUpvotes: number;
  totalReplies: number;
  totalReblogs: number;
  uniqueUsers: number;
}

export interface TruthSocialApiResponse {
  success: boolean;
  message?: string;
  summary?: TruthSocialFeedSummary;
  error?: string;
}
