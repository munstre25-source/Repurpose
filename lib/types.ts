export type SourceType =
  | 'blog'
  | 'tweet'
  | 'thread'
  | 'youtube_transcript'
  | 'newsletter'
  | 'podcast'
  | 'changelog'
  | 'case_study';

export type PlatformSlug =
  | 'twitter'
  | 'linkedin'
  | 'reddit'
  | 'email'
  | 'blog'
  | 'youtube_shorts'
  | 'seo';

export type PlanTier = 'free' | 'pro' | 'agency';

export interface NormalizedContent {
  title?: string;
  body: string;
  chunks?: string[];
}

export interface ContentAnalysis {
  topic: string;
  tone: string;
  audience: string;
  key_points: string[];
  suggested_platforms?: PlatformSlug[];
}

export interface VoiceProfileTraits {
  sentence_length: string;
  emoji_usage: string;
  formatting_habits: string;
  tone: string;
}
