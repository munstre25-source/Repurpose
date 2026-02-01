/**
 * Programmatic SEO matrix: workflow-level intent, approved combinations only.
 * Tiers: 1 (source→target), 2 (source→target→persona), 3 (persona→use-case), 4 (outcome-based).
 */

// ─── 1️⃣ SOURCE CONTENT ─────────────────────────────────────────────────────
export const SOURCES = [
  { slug: 'blog-post', label: 'Blog post' },
  { slug: 'twitter-thread', label: 'Twitter/X thread' },
  { slug: 'tweet', label: 'Single tweet' },
  { slug: 'youtube-video', label: 'YouTube video' },
  { slug: 'podcast', label: 'Podcast episode' },
  { slug: 'newsletter', label: 'Newsletter' },
  { slug: 'changelog', label: 'Changelog' },
  { slug: 'case-study', label: 'Case study' },
  { slug: 'webinar', label: 'Webinar' },
  { slug: 'loom', label: 'Loom / screen recording' },
  { slug: 'notion', label: 'Notion / internal doc' },
  { slug: 'pdf', label: 'PDF / whitepaper' },
] as const;

// ─── 2️⃣ TARGET PLATFORM ─────────────────────────────────────────────────────
export const TARGETS = [
  { slug: 'twitter', label: 'Twitter/X' },
  { slug: 'linkedin', label: 'LinkedIn' },
  { slug: 'reddit', label: 'Reddit' },
  { slug: 'email', label: 'Email newsletter' },
  { slug: 'youtube-shorts', label: 'YouTube Shorts' },
  { slug: 'blog', label: 'Blog' },
  { slug: 'tiktok', label: 'TikTok' },
  { slug: 'instagram', label: 'Instagram' },
  { slug: 'threads', label: 'Threads' },
] as const;

// ─── 3️⃣ PERSONA ───────────────────────────────────────────────────────────
export const PERSONAS = [
  { slug: 'founders', label: 'Founders' },
  { slug: 'indie-hackers', label: 'Indie hackers' },
  { slug: 'content-creators', label: 'Content creators' },
  { slug: 'marketers', label: 'Marketers' },
  { slug: 'coaches', label: 'Coaches & consultants' },
  { slug: 'agencies', label: 'Agencies & freelancers' },
] as const;

// ─── 4️⃣ USE CASE ───────────────────────────────────────────────────────────
export const USE_CASES = [
  { slug: 'build-in-public', label: 'Build in public' },
  { slug: 'product-launch', label: 'Product launch' },
  { slug: 'content-batching', label: 'Content batching' },
  { slug: 'personal-brand', label: 'Personal brand' },
  { slug: 'distribution', label: 'Distribution scaling' },
  { slug: 'newsletter-growth', label: 'Newsletter growth' },
  { slug: 'seo', label: 'SEO & organic' },
  { slug: 'community', label: 'Community & engagement' },
  { slug: 'webinar-repurpose', label: 'Webinar repurpose' },
] as const;

// ─── PAGE TYPES ─────────────────────────────────────────────────────────────

/** Contextual FAQ for rich results (FAQPage schema) and E-E-A-T. */
export interface PSEO_FAQ {
  question: string;
  answer: string;
}

export interface RepurposePage {
  slug: string;
  tier: 1 | 2;
  source: string;
  sourceLabel: string;
  target: string;
  targetLabel: string;
  persona?: string;
  personaLabel?: string;
  title: string;
  description: string;
  /** Unique lead paragraph (never repeats h1). Used as first body paragraph; description stays for meta. */
  intro: string;
  h1: string;
  whyManualFails: string;
  howWeSolve: string;
  exampleSnippet: string;
  bestFor: string;
  /** Unique pain points for this source→target (bullets). */
  painPoints: string[];
  /** Actionable tips for this workflow (bullets). */
  tips: string[];
  /** What the user gets (paragraph or short bullets). */
  whatYouGet: string;
  /** Contextual FAQs for this source→target (rich results + E-E-A-T). */
  faqs: PSEO_FAQ[];
}

export interface Tier3Page {
  persona: string;
  personaLabel: string;
  useCase: string;
  useCaseLabel: string;
  title: string;
  description: string;
  h1: string;
  body: string;
  cta: string;
  /** Rich sections so each persona+useCase page is unique. */
  problemParagraph: string;
  solutionParagraph: string;
  howItWorksParagraph: string;
  /** Contextual FAQs for this persona+useCase (rich results + E-E-A-T). */
  faqs: PSEO_FAQ[];
}

export interface Tier4Page {
  slug: string;
  source: string;
  sourceLabel: string;
  target: string;
  targetLabel: string;
  number: number;
  title: string;
  description: string;
  h1: string;
  body: string;
  cta: string;
  /** Contextual FAQs for this outcome (rich results + E-E-A-T). */
  faqs: PSEO_FAQ[];
}

/** E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness. Shown on every pSEO page. */
export const EEAT_BLURB =
  'Silho AI is built by founders who ship weekly. We built it because we were repurposing by hand and wanted one place to turn one piece into platform-native content—without losing our voice. This guide reflects what we\'ve learned helping solo founders and indie hackers scale distribution.';

// ─── CONTENT BLOCKS (unique copy per source/target/persona) ───────────────────

type SourceSlug = (typeof SOURCES)[number]['slug'];
type TargetSlug = (typeof TARGETS)[number]['slug'];

/** Source-specific pain points (why this content type is hard to repurpose). */
const SOURCE_PAINS: Record<SourceSlug, string[]> = {
  'blog-post': [
    'Long-form posts have multiple angles—picking one for a short post takes time.',
    'Key quotes and takeaways are buried in paragraphs; manual extraction is tedious.',
    'Tone and depth that work for reading don\'t match platform norms (e.g. Twitter threads, LinkedIn).',
  ],
  'twitter-thread': [
    'Threads are long and nested—turning them into one LinkedIn post or email requires heavy editing.',
    'Tweet-length chunks don\'t map 1:1 to other formats; you end up rewriting, not repurposing.',
    'Hashtags and @mentions don\'t translate; each platform has its own conventions.',
  ],
  tweet: [
    'One tweet is short—expanding it for LinkedIn or a newsletter without fluff is hard.',
    'The hook that works on X may not fit professional or long-form tone elsewhere.',
    'You have to invent structure (sections, CTA) that the original tweet doesn\'t have.',
  ],
  'youtube-video': [
    'Video has to be transcribed or summarized before you can turn it into text for other platforms.',
    'Key moments and quotes aren\'t obvious without watching; manual note-taking is slow.',
    'Tone and pacing from video don\'t automatically translate to written formats.',
  ],
  podcast: [
    'Long episodes have many topics—choosing what to pull for a single post or thread is subjective.',
    'Transcription is step one; then you still have to shape it for each platform.',
    'Conversational tone and tangents need tightening for LinkedIn, Twitter, or email.',
  ],
  newsletter: [
    'Newsletters mix updates, links, and personality—slicing into platform-sized pieces is manual.',
    'Sections that work in email (length, formatting) don\'t map directly to social posts.',
    'You want to reuse the best bits without sounding like you\'re recycling the same email.',
  ],
  changelog: [
    'Changelogs are dense and technical—making them engaging for Twitter or LinkedIn takes rewriting.',
    'You need both accuracy (for existing users) and punch (for distribution); one draft rarely does both.',
    'Different audiences (users vs. prospects) need different angles from the same update.',
  ],
  'case-study': [
    'Case studies are long and narrative—extracting proof points for social or email is manual.',
    'Quotes and metrics need to stand alone without the full story; that\'s extra editing.',
    'B2B tone for case studies often needs softening or shortening for Twitter or LinkedIn.',
  ],
  webinar: [
    'Webinars are long and dense—turning key moments into social posts or email requires transcription and editing.',
    'Q&A and tangents don\'t map to platform formats; you have to pick the best clips and rewrite.',
    'Different audiences (attendees vs. prospects) need different angles from the same recording.',
  ],
  loom: [
    'Loom and screen recordings are informal—shaping them for LinkedIn or blog needs structure and polish.',
    'Verbal explanations don\'t translate 1:1 to written posts; you have to extract the insight and reframe.',
    'Short format works for internal use but needs expansion or slicing for external distribution.',
  ],
  notion: [
    'Notion docs mix structure and freeform—slicing into platform-sized pieces is manual.',
    'Internal tone and jargon need translation for public posts; one draft rarely works everywhere.',
    'Sections that work in a doc don\'t map directly to hooks and CTAs for social.',
  ],
  pdf: [
    'PDFs and whitepapers are long-form—turning them into threads or posts means summarizing and restructuring.',
    'Dense content needs distillation for character limits and feed-friendly format.',
    'Authority tone in a PDF often needs softening or shortening for Twitter or LinkedIn.',
  ],
};

/** Target-specific requirements (what this platform needs). */
const TARGET_NEEDS: Record<TargetSlug, string[]> = {
  twitter: [
    'Short hooks and clear thread structure; character limits per tweet.',
    'Punchy tone and scannable format—readers scroll fast.',
    'Hashtags and CTAs that fit X culture without sounding like bots.',
  ],
  linkedin: [
    'Professional tone and thought-leadership angle; longer than Twitter, shorter than a blog.',
    'Opening line that works in the feed; formatting (line breaks, bullets) that reads on mobile.',
    'No hashtag stuffing; subtle CTA that fits a professional audience.',
  ],
  reddit: [
    'Value-first tone; fits the sub\'s norms and avoids self-promo language.',
    'Context and authenticity—sounds like a human, not a brand.',
    'Length and format that match the sub (e.g. r/SaaS vs. r/startups).',
  ],
  email: [
    'Subject line and preview that drive opens; scannable sections and clear CTA.',
    'Personal tone and structure (greeting, body, sign-off) that fits your list.',
    'Length that respects inbox attention; no wall of text.',
  ],
  'youtube-shorts': [
    'Script or captions in Shorts format: hook in first seconds, tight narrative.',
    'Vertical-friendly pacing; text overlays that work on mobile.',
    'CTA that fits short-form (subscribe, link in description).',
  ],
  blog: [
    'Full structure: intro, sections, conclusion; SEO-friendly without sounding generic.',
    'Depth and narrative that justify a long-form read; not just a stretched social post.',
    'Internal links and CTAs that fit your site\'s content strategy.',
  ],
  tiktok: [
    'Hook in the first second; vertical format and tight pacing; captions that work without sound.',
    'Trend-aware tone and length; CTA that fits short-form (link in bio, follow).',
    'Native feel—not a cut-down YouTube video; built for scroll and share.',
  ],
  instagram: [
    'Feed posts: caption length and structure; carousel narrative; hashtag strategy.',
    'Reels: hook, pacing, and CTA; format that works in Explore and profile.',
    'Professional or creator tone that fits your niche; not a cross-post from another platform.',
  ],
  threads: [
    'Conversational tone; length and format that work in the Threads feed.',
    'Hook and CTA that drive engagement; fits Meta ecosystem without duplicating Instagram.',
    'Native feel—readable, shareable, and on-brand for Threads audience.',
  ],
};

/** Unique intro paragraph per source→target (never repeats h1). Used as first body paragraph. */
function getIntroForCombo(
  source: (typeof SOURCES)[number],
  target: (typeof TARGETS)[number],
  persona?: (typeof PERSONAS)[number]
): string {
  const s = source.label.toLowerCase();
  const t = target.label.toLowerCase();
  const k = `${source.slug}-to-${target.slug}`;
  const introMap: Record<string, string> = {
    'youtube-video-to-reddit':
      'Turn YouTube videos into Reddit posts that fit the sub. One video, one click—value-first Reddit content without rewriting or sounding like marketing.',
    'youtube-video-to-blog':
      'Turn YouTube videos into blog posts with structure and depth. One video, one click—SEO-friendly long-form content without manual transcription.',
    'youtube-video-to-twitter':
      'Turn YouTube videos into Twitter threads that hook and convert. One video, one click—punchy threads without rewatching and rewriting.',
    'youtube-video-to-linkedin':
      'Turn YouTube videos into LinkedIn thought-leadership posts. One video, one click—professional tone and length without manual reformatting.',
    'blog-post-to-twitter':
      'Turn blog posts into Twitter threads that drive traffic. One post, one click—hook, key points, and CTA without manual slicing.',
    'blog-post-to-linkedin':
      'Turn blog posts into LinkedIn posts that perform. One post, one click—thought-leadership tone and format without rewriting.',
    'twitter-thread-to-linkedin':
      'Turn Twitter threads into LinkedIn posts that don’t feel like cross-posts. One thread, one click—professional structure and length.',
    'newsletter-to-twitter':
      'Turn newsletter editions into tweets and threads. One edition, one click—shareable bits without copy-pasting the whole email.',
    'changelog-to-twitter':
      'Turn changelogs into Twitter threads that ship the update. One changelog, one click—founder voice, not press release.',
  };
  const intro = introMap[k];
  if (intro) return persona ? `${intro} Built for ${persona.label.toLowerCase()} who ship weekly.` : intro;
  return `One ${s}, many formats. Paste once; get ${t}-native content in one click. No manual reformatting—we handle length, tone, and platform norms.${persona ? ` Built for ${persona.label.toLowerCase()}.` : ''}`;
}

/** Combo-specific problem/solution/example (source→target). Override generic copy for key combos. */
function getComboCopy(
  source: (typeof SOURCES)[number],
  target: (typeof TARGETS)[number]
): { whyManualFails?: string; howWeSolve?: string; exampleSnippet?: string } {
  const k = `${source.slug}-to-${target.slug}`;
  const map: Record<string, { whyManualFails: string; howWeSolve: string; exampleSnippet: string }> = {
    'youtube-video-to-reddit': {
      whyManualFails: `YouTube videos have to be transcribed or summarized before you can turn them into Reddit posts—and Reddit demands value-first tone, sub norms, and no corporate speak. Most founders either skip Reddit or paste the same promo everywhere, which gets downvoted.`,
      howWeSolve: `Paste your YouTube URL or transcript. We turn it into Reddit-ready posts: value-first tone, sub-appropriate length, and no marketing speak. Voice Lock keeps your voice so it doesn't sound like a bot. One video, one click.`,
      exampleSnippet: `Example: A 10-minute product walkthrough becomes a Reddit post that shares the insight without sounding like an ad—fits r/SaaS or r/startups instead of getting removed.`,
    },
    'youtube-video-to-blog': {
      whyManualFails: `Turning a YouTube video into a blog post means transcribing, structuring, and adding depth—most founders don't have time. The result is either a thin summary or a wall of text that doesn't rank.`,
      howWeSolve: `Paste your YouTube URL or transcript. We generate a blog-ready piece: intro, sections, and conclusion with SEO-friendly structure. Voice Lock keeps your tone. One video, one click—long-form content without manual writing.`,
      exampleSnippet: `Example: A tutorial video becomes a 1,500-word blog post with H2/H3 structure, key takeaways, and a CTA—ready to publish and rank.`,
    },
    'youtube-video-to-twitter': {
      whyManualFails: `YouTube videos are long—turning them into a thread means rewatching, pulling quotes, and fitting character limits. Most founders either skip Twitter or post one generic tweet and miss the thread opportunity.`,
      howWeSolve: `Paste your YouTube URL or transcript. We extract key points and turn them into a thread with a strong hook and clear structure. Voice Lock keeps your voice. One video, one click.`,
      exampleSnippet: `Example: A 15-minute update becomes a 5-tweet thread that hooks in the first line and drives clicks to the video—no manual slicing.`,
    },
    'blog-post-to-twitter': {
      whyManualFails: `Blog posts are long—turning them into a thread means picking angles, compressing, and fitting character limits. Most founders either post one link tweet (low engagement) or spend an hour rewriting.`,
      howWeSolve: `Paste your blog URL or copy. We generate a thread with hook, key points, and CTA. Voice Lock keeps your tone. One post, one click—thread-ready without manual slicing.`,
      exampleSnippet: `Example: A 1,200-word post becomes a 6-tweet thread that drives traffic—hook in tweet 1, key insight in the middle, CTA at the end.`,
    },
  };
  return map[k] ?? {};
}

/** Combo-specific tips (source→target). Key combos get unique tips; others use fallback. */
function getTipsForCombo(
  source: (typeof SOURCES)[number],
  target: (typeof TARGETS)[number],
  persona?: (typeof PERSONAS)[number]
): string[] {
  const k = `${source.slug}-to-${target.slug}`;
  const tipsMap: Record<string, string[]> = {
    'youtube-video-to-twitter': [
      'Paste the video URL or transcript—we extract key points and turn them into a thread with a strong hook.',
      'Use the first 2–3 takeaways for the thread; save deeper points for LinkedIn or email.',
      'Keep your voice: add 5–10 sample tweets in Voice Lock so the thread sounds like you.',
    ],
    'blog-post-to-twitter': [
      'Paste the blog URL or copy; we generate a thread with hook, key points, and CTA.',
      'One blog can become multiple threads (different angles); start with the strongest angle.',
      'Voice Lock keeps your tone so the thread doesn\'t sound like generic AI.',
    ],
    'tweet-to-linkedin': [
      'Paste your best tweet; we expand it into a LinkedIn post with structure and professional tone.',
      'One tweet can inspire 2–3 LinkedIn posts (different hooks); repurpose the same idea without repeating.',
      'Add line breaks and a clear CTA so it reads natively on LinkedIn.',
    ],
    'twitter-thread-to-linkedin': [
      'Paste the full thread; we turn it into one cohesive LinkedIn post, not a copy-paste.',
      'We keep the narrative flow and adjust length and tone for a professional audience.',
      'Voice Lock ensures your build-in-public voice carries over to LinkedIn.',
    ],
    'newsletter-to-twitter': [
      'Paste the newsletter URL or text; we slice the best bits into tweets or a thread.',
      'Lead with the most shareable insight or story; save the rest for other platforms.',
      'One edition can fuel a week of tweets—batch and schedule.',
    ],
    'changelog-to-twitter': [
      'Paste your changelog; we turn it into a thread that ships the update without sounding like a press release.',
      'Lead with the user benefit, not the feature name; keep it founder-voice, not corporate.',
      'Use Voice Lock so your product updates sound consistent with your other content.',
    ],
  };
  const tips = tipsMap[k];
  if (tips) return persona ? [...tips, `${persona.label}: we tune tone and examples for your audience.`] : tips;
  return [
    `Paste your ${source.label} (or URL if applicable); we generate ${target.label}-native content in one click.`,
    `We match length, tone, and format to ${target.label} so it doesn't look like a cross-post.`,
    'Use Voice Lock with 5–10 sample posts so output sounds like you.',
  ];
}

function getPainPoints(source: (typeof SOURCES)[number], target: (typeof TARGETS)[number]): string[] {
  const pains = SOURCE_PAINS[source.slug as SourceSlug] ?? SOURCE_PAINS['blog-post'];
  const needs = TARGET_NEEDS[target.slug as TargetSlug] ?? TARGET_NEEDS['twitter'];
  return [
    ...pains.slice(0, 2),
    `${target.label} needs: ${needs[0]?.toLowerCase() ?? 'platform-native format and tone.'}`,
  ];
}

function getWhatYouGet(
  source: (typeof SOURCES)[number],
  target: (typeof TARGETS)[number],
  persona?: (typeof PERSONAS)[number]
): string {
  const s = source.label.toLowerCase();
  const t = target.label.toLowerCase();
  if (target.slug === 'twitter')
    return `One ${s} becomes a Twitter thread (or multiple tweets) with a strong hook, clear structure, and the right length. No manual slicing—paste once, get platform-native output.${persona ? ` Built for ${persona.label.toLowerCase()} who ship weekly.` : ''}`;
  if (target.slug === 'linkedin')
    return `One ${s} becomes a LinkedIn post with thought-leadership tone, proper length, and formatting that works in the feed. Not a cross-post—native structure and CTA.${persona ? ` Voice Lock keeps your ${persona.label.toLowerCase()} voice.` : ''}`;
  if (target.slug === 'reddit')
    return `One ${s} becomes a Reddit-ready post: value-first tone, sub-appropriate length, and no corporate speak. Fits the community instead of sounding like marketing.${persona ? ` Tuned for ${persona.label.toLowerCase()} who share in relevant subs.` : ''}`;
  if (target.slug === 'email')
    return `One ${s} becomes email-ready: subject line, scannable body, and CTA. Fits your list's tone and length.${persona ? ` Ideal for ${persona.label.toLowerCase()} newsletters.` : ''}`;
  if (target.slug === 'youtube-shorts')
    return `One ${s} becomes a Shorts-style script or captions: hook in the first seconds, tight narrative, vertical-friendly.${persona ? ` For ${persona.label.toLowerCase()} who repurpose to Shorts.` : ''}`;
  if (target.slug === 'blog')
    return `One ${s} becomes a blog-ready piece: structure, depth, and SEO-friendly flow. Not just a stretched social post—full narrative.${persona ? ` For ${persona.label.toLowerCase()} content batching.` : ''}`;
  if (target.slug === 'tiktok')
    return `One ${s} becomes TikTok-ready: hook in the first second, vertical pacing, captions that work without sound. Native short-form, not a cut-down long video.${persona ? ` Built for ${persona.label.toLowerCase()}.` : ''}`;
  if (target.slug === 'instagram')
    return `One ${s} becomes Instagram-ready: feed caption or Reels script with the right length and structure. Carousel narrative or short-form that fits Explore.${persona ? ` For ${persona.label.toLowerCase()} who repurpose to Instagram.` : ''}`;
  if (target.slug === 'threads')
    return `One ${s} becomes Threads-ready: conversational tone, feed-friendly length, and CTA that drives engagement. Native to the Threads audience.${persona ? ` For ${persona.label.toLowerCase()}.` : ''}`;
  return `One ${s} becomes ${t}-native content: right length, tone, and format. Paste once, get output you can publish.${persona ? ` Built for ${persona.label.toLowerCase()}.` : ''}`;
}

/** Contextual FAQs for repurpose pages (source→target). Rich results + E-E-A-T. */
function getFaqsForRepurposePage(
  source: (typeof SOURCES)[number],
  target: (typeof TARGETS)[number],
  persona?: (typeof PERSONAS)[number]
): PSEO_FAQ[] {
  const s = source.label.toLowerCase();
  const t = target.label.toLowerCase();
  const who = persona ? persona.label.toLowerCase() : 'founders and indie hackers';
  return [
    {
      question: `How do I turn a ${s} into ${target.label} content?`,
      answer: `Paste your ${s} (or paste a URL for blogs, newsletters, or articles) into Silho AI, select ${target.label} as the target, and click generate. We produce platform-native content with the right length, tone, and format. You can add 5–10 voice samples in Settings so the output sounds like you.`,
    },
    {
      question: `How long does it take to repurpose ${s} for ${target.label}?`,
      answer: `Silho AI generates ${target.label}-ready content in one click. You paste once and get output you can edit or publish. No manual reformatting—we handle length, structure, and platform norms so you don't have to.`,
    },
    {
      question: `Can I keep my own voice when repurposing to ${target.label}?`,
      answer: `Yes. Voice Lock uses 5–10 sample posts of yours (from any platform) so generated content matches your tone and style. Built for ${who} who want distribution without sounding like a bot.`,
    },
    {
      question: `What formats can I repurpose from?`,
      answer: `We support blog posts, Twitter/X threads, single tweets, YouTube videos, podcasts, newsletters, changelogs, and case studies. Paste text or a URL (for blogs and newsletters); we generate ${target.label}-native output.`,
    },
    {
      question: `Is Silho AI built for ${persona ? persona.label : 'founders'}?`,
      answer: `Yes. Silho AI is built by founders who ship weekly. We built it for solo founders and indie hackers who repurpose by hand and want one place to turn one piece into platform-native content—without losing their voice. No content team required.`,
    },
  ];
}

/** Contextual FAQs for Tier 3 (persona + use case). */
function getFaqsForTier3Page(persona: string, useCase: string): PSEO_FAQ[] {
  const p = PERSONAS.find((x) => x.slug === persona);
  const personaLabel = p?.label ?? 'Founders';
  const useCaseLabel = useCase.replace(/-/g, ' ');
  return [
    {
      question: `What is content repurposing for ${personaLabel.toLowerCase()}?`,
      answer: `Content repurposing means turning one piece of content (a thread, blog, newsletter, or changelog) into platform-native posts for X, LinkedIn, Reddit, email, and more. Silho AI does this in one click so ${personaLabel.toLowerCase()} can ship weekly without a content team.`,
    },
    {
      question: `How does Silho AI help with ${useCaseLabel}?`,
      answer: `Silho AI turns one piece into the right format for each platform—length, tone, and structure. You paste once; we generate native content for Twitter, LinkedIn, Reddit, email, and blog. Voice Lock keeps your voice consistent. Built for ${personaLabel.toLowerCase()} who ${useCaseLabel}.`,
    },
    {
      question: `Do I need to write different copy for each platform?`,
      answer: `No. Paste one piece (update, thread, blog, or newsletter) and select each target platform. We generate platform-native content for each in one click. You can edit before publishing. No manual reformatting.`,
    },
    {
      question: `Who is Silho AI for?`,
      answer: `Silho AI is built for solo founders and indie hackers who ship weekly and want distribution without a content team. We built it because we were repurposing by hand; this reflects what we've learned helping builders scale distribution.`,
    },
  ];
}

/** Contextual FAQs for Tier 4 (outcome pages). */
function getFaqsForTier4Page(
  sourceLabel: string,
  targetLabel: string,
  number: number
): PSEO_FAQ[] {
  const s = sourceLabel.toLowerCase();
  const t = targetLabel.toLowerCase();
  return [
    {
      question: `How do I turn one ${s} into ${number} ${t} posts?`,
      answer: `Paste your ${s} (or URL if it's a blog or newsletter) into Silho AI, select ${targetLabel} as the target, and click generate. We produce ${number} platform-native posts (or a thread) in one click. You can add voice samples in Settings so the output sounds like you.`,
    },
    {
      question: `How long does it take?`,
      answer: `Silho AI generates ${number} ${t} posts in one click. Paste once, get output you can edit or schedule. No manual slicing or reformatting.`,
    },
    {
      question: `Can I use my own voice?`,
      answer: `Yes. Voice Lock uses 5–10 sample posts of yours so generated content matches your tone. Built for founders and indie hackers who want distribution without sounding like a bot.`,
    },
    {
      question: `What can I repurpose from?`,
      answer: `We support blog posts, Twitter/X threads, single tweets, YouTube videos, podcasts, newsletters, changelogs, and case studies. Paste text or a URL; we generate ${targetLabel}-native output.`,
    },
  ];
}

// ─── TIER 1: Source → Target ────────────────────────────────────────────────
function buildTier1Pages(): RepurposePage[] {
  const pages: RepurposePage[] = [];
  for (const source of SOURCES) {
    for (const target of TARGETS) {
      if (source.slug === (target.slug as string)) continue;
      const slug = `repurpose-${source.slug}-to-${target.slug}`;
      const h1 = `Turn your ${source.label} into ${target.label} content`;
      const combo = getComboCopy(source, target);
      const defaultWhy = `Reformatting ${source.label} for ${target.label} takes time: different lengths, tone, and formatting rules. Most founders skip it or post the same copy everywhere.`;
      const defaultHow = `Paste your ${source.label} (or paste a URL for blogs/newsletters). Select ${target.label}. We generate platform-native content in one click. Optionally lock your voice with 5–10 sample posts.`;
      const defaultExample = `Example: A 500-word blog becomes a ${target.slug === 'twitter' ? 'thread of tweets' : target.slug === 'linkedin' ? 'thought-leadership post' : `native ${target.label} post`} with the right length and format.`;
      pages.push({
        slug,
        tier: 1,
        source: source.slug,
        sourceLabel: source.label,
        target: target.slug,
        targetLabel: target.label,
        title: `${source.label} to ${target.label} | Silho AI`,
        description: `${source.label} to ${target.label}: paste once, get platform-native ${target.label} output. No manual reformatting. Built for founders and indie hackers.`,
        intro: getIntroForCombo(source, target),
        h1,
        whyManualFails: combo.whyManualFails ?? defaultWhy,
        howWeSolve: combo.howWeSolve ?? defaultHow,
        exampleSnippet: combo.exampleSnippet ?? defaultExample,
        bestFor: 'Founders and indie hackers building in public.',
        painPoints: getPainPoints(source, target),
        tips: getTipsForCombo(source, target),
        whatYouGet: getWhatYouGet(source, target),
        faqs: getFaqsForRepurposePage(source, target),
      });
    }
  }
  return pages;
}

// ─── TIER 2: Source → Target → Persona (unique copy per persona) ─────────────
function buildTier2Pages(): RepurposePage[] {
  const pages: RepurposePage[] = [];
  const foundersCopy = (
    source: (typeof SOURCES)[number],
    target: (typeof TARGETS)[number]
  ) => {
    const combo = getComboCopy(source, target);
    return {
      h1: `Turn your ${source.label} into ${target.label} content — for founders`,
      title: `${source.label} to ${target.label} for founders | Silho AI`,
      description: `Founders: turn your ${source.label.toLowerCase()} into ${target.label} content without a content team. One weekly update or changelog becomes platform-native ${target.label} output. Paste once, ship everywhere.`,
      intro: getIntroForCombo(source, target, PERSONAS[0]),
      whyManualFails: combo.whyManualFails ?? `Founders already write weekly updates, changelogs, and launch notes—but reformatting that same content for ${target.label} (length, tone, format) eats time you don't have. Most end up posting the same copy everywhere or skipping channels entirely.`,
      howWeSolve: combo.howWeSolve ?? `Paste your ${source.label} (or a URL for blogs/newsletters). We turn it into ${target.label}-native content in one click. Voice Lock uses 5–10 of your existing posts so outputs sound like you, not generic AI. Built for solo founders who ship weekly.`,
      exampleSnippet: combo.exampleSnippet ?? (target.slug === 'twitter'
        ? `Example: Your product changelog becomes a thread that ships the update without sounding like a press release.`
        : target.slug === 'linkedin'
          ? `Example: Your founder update becomes a thought-leadership post with the right length and professional tone for LinkedIn.`
          : target.slug === 'reddit'
            ? `Example: Your launch note becomes a value-first Reddit post that fits the sub's norms instead of sounding like marketing.`
            : `Example: One ${source.label} becomes a ${target.label}-ready piece with the right format and length.`),
      bestFor: 'Solo founders shipping weekly updates, changelogs, or launch notes who want distribution without a content team.',
    };
  };
  const indieHackersCopy = (
    source: (typeof SOURCES)[number],
    target: (typeof TARGETS)[number]
  ) => {
    const combo = getComboCopy(source, target);
    return {
      h1: `Turn your ${source.label} into ${target.label} content — for indie hackers`,
      title: `${source.label} to ${target.label} for indie hackers | Silho AI`,
      description: `Indie hackers: repurpose your ${source.label.toLowerCase()} into ${target.label} in one click. Build in public once, get platform-native ${target.label} output. No manual reformatting—ship to every channel.`,
      intro: getIntroForCombo(source, target, PERSONAS[1]),
      whyManualFails: combo.whyManualFails ?? `Indie hackers ship fast and build in public, but rewriting the same thread or blog for ${target.label} (character limits, tone, community norms) takes time you'd rather spend building. Result: one channel gets love, the rest get copy-paste or silence.`,
      howWeSolve: combo.howWeSolve ?? `Paste your ${source.label}—thread, blog, or newsletter. We generate ${target.label}-native content in one click. Voice Lock keeps your build-in-public voice so you don't sound like a bot. Built for solo builders who want one piece to feed X, LinkedIn, Reddit, and more.`,
      exampleSnippet: combo.exampleSnippet ?? (target.slug === 'twitter'
        ? `Example: Your build-in-public thread becomes a proper thread (or multiple tweets) with the right hook and length for X.`
        : target.slug === 'linkedin'
          ? `Example: Your thread or ship log becomes a LinkedIn post that doesn't feel like a cross-post—right length, professional tone.`
          : target.slug === 'reddit'
            ? `Example: Your update becomes a Reddit post that adds value and fits the sub instead of sounding like self-promo.`
            : `Example: One ${source.label} becomes a ${target.label} post that fits the platform instead of a generic paste.`),
      bestFor: 'Indie hackers building in public who want one piece of content to drive X, LinkedIn, Reddit, and email without rewriting by hand.',
    };
  };
  for (const source of SOURCES) {
    for (const target of TARGETS) {
      if (source.slug === (target.slug as string)) continue;
      for (const persona of PERSONAS) {
        const copy =
          persona.slug === 'founders'
            ? foundersCopy(source, target)
            : indieHackersCopy(source, target);
        const slug = `repurpose-${source.slug}-to-${target.slug}-for-${persona.slug}`;
        pages.push({
          slug,
          tier: 2,
          source: source.slug,
          sourceLabel: source.label,
          target: target.slug,
          targetLabel: target.label,
          persona: persona.slug,
          personaLabel: persona.label,
          ...copy,
          painPoints: getPainPoints(source, target),
          tips: getTipsForCombo(source, target, persona),
          whatYouGet: getWhatYouGet(source, target, persona),
          faqs: getFaqsForRepurposePage(source, target, persona),
        });
      }
    }
  }
  return pages;
}

// ─── TIER 3: Persona → Use Case (rich sections from TIER3_RICH) ──────────────
const TIER3_RICH: Record<string, Record<string, { problemParagraph: string; solutionParagraph: string; howItWorksParagraph: string }>> = {
  'build-in-public': {
    founders: {
      problemParagraph: 'Founders already write weekly updates, changelogs, and launch notes—but reformatting that same content for X, LinkedIn, Reddit, and email (length, tone, format) eats time you don\'t have. Most end up posting the same copy everywhere or skipping channels entirely. Result: one channel gets love, the rest get silence or copy-paste that doesn\'t fit.',
      solutionParagraph: 'Silho AI turns one piece of founder content (update, changelog, thread) into platform-native posts in one click. You paste once; we generate the right length, tone, and format for each channel. Voice Lock uses 5–10 of your existing posts so outputs sound like you, not generic AI. Built for solo founders who ship weekly and want distribution without a content team.',
      howItWorksParagraph: 'Paste your update, thread, or changelog (or a URL for blogs/newsletters). Select your target platform—Twitter, LinkedIn, Reddit, email, or blog. We generate platform-native content in one click. Optionally add voice samples in Settings so every output keeps your founder voice. No manual reformatting; no thin cross-posts.',
    },
    'indie-hackers': {
      problemParagraph: 'Indie hackers ship fast and build in public, but rewriting the same thread or blog for X, LinkedIn, Reddit, and email (character limits, tone, community norms) takes time you\'d rather spend building. Result: one channel gets love, the rest get copy-paste or silence. Your build-in-public voice gets diluted when you stretch one piece across platforms by hand.',
      solutionParagraph: 'Silho AI turns one build-in-public piece (thread, blog, newsletter) into platform-native content in one click. We match length, tone, and format to each channel so you don\'t sound like a bot. Voice Lock keeps your indie-hacker voice so outputs feel like you on X, LinkedIn, Reddit, and email. Built for solo builders who want one piece to feed every channel without rewriting.',
      howItWorksParagraph: 'Paste your thread, blog, or newsletter (or a URL). Select your target—Twitter, LinkedIn, Reddit, email, or blog. We generate native content in one click. Add 5–10 sample posts in Voice Lock so every output sounds like you. No manual reformatting; no generic AI tone.',
    },
  },
  'product-launch': {
    founders: {
      problemParagraph: 'You put real work into your launch post—but it lives in one place. Reformulating it for LinkedIn (professional tone, longer), Twitter (thread, hooks), Reddit (value-first, sub norms), and email (subject line, scannable body) takes hours. Most founders either skip channels or post the same copy everywhere, which falls flat on each platform.',
      solutionParagraph: 'Silho AI turns your launch post or thread into platform-native content for X, LinkedIn, Reddit, and email in one click. We keep the message; we change the format, length, and tone so each audience gets a version that fits. Voice Lock keeps your founder voice so launch content doesn\'t sound like a press release. Built for solo founders who want one launch to reach every audience.',
      howItWorksParagraph: 'Paste your launch post, thread, or announcement. Select each target platform—Twitter, LinkedIn, Reddit, email. We generate native content for each in one click. Add voice samples so launch content sounds like you everywhere. No manual rewriting; no thin cross-posts.',
    },
    'indie-hackers': {
      problemParagraph: 'Indie hackers launch fast—but one post or thread doesn\'t automatically become a LinkedIn post, Reddit announcement, or email. Each platform needs different length, tone, and structure. Rewriting by hand eats time you\'d rather spend on the product. Result: launch lives in one place, or you copy-paste and it falls flat elsewhere.',
      solutionParagraph: 'Silho AI turns your launch post or thread into platform-native content for LinkedIn, Reddit, email, and more in one click. We match each platform\'s norms so your launch doesn\'t sound like a cross-post. Voice Lock keeps your build-in-public voice so launch content feels authentic everywhere. Built for indie hackers who want one launch to drive distribution without a team.',
      howItWorksParagraph: 'Paste your launch post or thread. Select targets—LinkedIn, Reddit, email, Twitter. We generate native content for each in one click. Add voice samples so launch sounds like you. No manual reformatting; no generic tone.',
    },
  },
  'content-batching': {
    founders: {
      problemParagraph: 'Founders who batch content write one deep piece per week—blog, newsletter, or changelog—but turning that into a week of tweets, LinkedIn posts, Reddit posts, and email snippets is manual. Different lengths, tones, and formats per platform; most end up repurposing by hand or posting the same thing everywhere.',
      solutionParagraph: 'Silho AI turns one batched piece (blog, newsletter, changelog) into platform-native content for X, LinkedIn, Reddit, and email in one click. Batch once; we generate the right format for each channel so you ship all week without rewriting. Voice Lock keeps your tone consistent so batched content doesn\'t sound generic. Built for founders who want one piece to fuel a week of distribution.',
      howItWorksParagraph: 'Paste your batched blog, newsletter, or changelog (or URL). Select each platform you want to feed. We generate native content for each in one click. Add voice samples so batched output sounds like you. No manual slicing; no thin repurposing.',
    },
    'indie-hackers': {
      problemParagraph: 'Indie hackers who batch write one thread or blog per week—but turning that into tweets, LinkedIn posts, Reddit posts, and email is manual. Each platform needs different length and tone; rewriting by hand burns time you\'d rather spend building. Result: one piece gets love, the rest get copy-paste or nothing.',
      solutionParagraph: 'Silho AI turns one batched piece (thread, blog) into platform-native content for X, LinkedIn, Reddit, and email in one click. Write once; we generate the right format for each channel so you ship all week. Voice Lock keeps your build-in-public voice so batched content doesn\'t sound like a bot. Built for indie hackers who want one piece to drive a week of distribution.',
      howItWorksParagraph: 'Paste your batched thread or blog (or URL). Select platforms—Twitter, LinkedIn, Reddit, email. We generate native content for each in one click. Add voice samples so output sounds like you. No manual reformatting; no generic tone.',
    },
  },
  'personal-brand': {
    founders: {
      problemParagraph: 'Founder personal brand depends on a consistent voice—but when you repurpose by hand, tone drifts. One post sounds like you; the next sounds like a template. When you use generic AI without tuning, everything sounds the same. Result: your brand gets diluted across channels.',
      solutionParagraph: 'Silho AI keeps your founder voice consistent across X, LinkedIn, Reddit, and email. Voice Lock uses 5–10 of your existing posts so every output sounds like you—not generic AI. You paste once; we generate platform-native content that keeps your tone. Built for founders who care about personal brand and don\'t want to sound like everyone else.',
      howItWorksParagraph: 'Paste your content. Select target platform. We generate native output in one click. Add voice samples in Settings so every piece keeps your founder voice. No tone drift; no generic AI sound.',
    },
    'indie-hackers': {
      problemParagraph: 'Indie hacker brand is about authenticity—but when you repurpose by hand or use untuned AI, tone drifts. One post sounds like you; the next sounds like a bot. Copy-pasting the same thing everywhere doesn\'t scale and doesn\'t feel authentic.',
      solutionParagraph: 'Silho AI keeps your indie-hacker voice consistent across X, LinkedIn, Reddit, and email. Voice Lock uses your existing posts so every output sounds like you—not generic AI. Paste once; we generate platform-native content that keeps your build-in-public voice. Built for indie hackers who want to scale distribution without losing authenticity.',
      howItWorksParagraph: 'Paste your content. Select platform. We generate native output in one click. Add 5–10 sample posts in Voice Lock so every piece sounds like you. No generic tone; no brand drift.',
    },
  },
  'distribution': {
    founders: {
      problemParagraph: 'Founders know distribution matters—but reaching X, LinkedIn, Reddit, email, and blog with one piece means rewriting for each. Different lengths, tones, and formats; manual work doesn\'t scale. Most founders either stick to one channel or post the same copy everywhere and get weak results.',
      solutionParagraph: 'Silho AI turns one piece into platform-native content for X, LinkedIn, Reddit, email, and blog in one click. You scale distribution without 10x the work. Voice Lock keeps your founder voice so every channel gets content that sounds like you. Built for founders who want to reach every audience without a content team.',
      howItWorksParagraph: 'Paste your content (or URL). Select each platform you want to feed. We generate native content for each in one click. Add voice samples so distribution scales without losing your voice. No manual rewriting; no thin cross-posts.',
    },
    'indie-hackers': {
      problemParagraph: 'Indie hackers want to be everywhere—but one piece doesn\'t automatically work on X, LinkedIn, Reddit, and email. Each platform has different norms; rewriting by hand doesn\'t scale. Result: one channel gets love, the rest get copy-paste or silence.',
      solutionParagraph: 'Silho AI turns one piece into platform-native content for X, LinkedIn, Reddit, email, and more in one click. Scale distribution without burning out. Voice Lock keeps your build-in-public voice so every channel gets content that sounds like you. Built for indie hackers who want one piece to drive every channel.',
      howItWorksParagraph: 'Paste your content. Select platforms. We generate native content for each in one click. Add voice samples so scaling doesn\'t dilute your voice. No manual reformatting; no generic tone.',
    },
  },
  'newsletter-growth': {
    founders: {
      problemParagraph: 'You put real work into your newsletter—but it lives in one place. Turning the best bits into signup drivers, social teases, and lead magnets for X, LinkedIn, and email takes manual slicing. Most founders either underuse the content or copy-paste the same promo everywhere.',
      solutionParagraph: 'Silho AI turns one newsletter (or blog) into platform-native content that drives signups and engagement. Paste once; we generate teasers, threads, and email snippets that hook and convert. Voice Lock keeps your voice so growth content doesn\'t sound like a bot. Built for founders who want one piece to fuel newsletter growth.',
      howItWorksParagraph: 'Paste your newsletter or blog URL (or copy). Select target—Twitter, LinkedIn, email. We generate native content in one click. Use output as signup drivers, social teases, or lead magnets. Add voice samples so growth content sounds like you.',
    },
    'indie-hackers': {
      problemParagraph: 'Indie hackers who write newsletters struggle to repurpose that content for social and signup—different length, tone, and CTA per channel. Manual slicing eats time you\'d rather spend building. Result: one edition gets one audience, or you recycle the same link everywhere.',
      solutionParagraph: 'Silho AI turns one newsletter or blog into content that drives signups and engagement across X, LinkedIn, and email. One piece; we generate teasers, threads, and snippets that fit each platform. Voice Lock keeps your voice. Built for indie hackers who want newsletter growth without a content team.',
      howItWorksParagraph: 'Paste your newsletter or blog. Select platforms. We generate native content in one click. Use for signup drivers and social. Add voice samples so output sounds like you.',
    },
  },
  seo: {
    founders: {
      problemParagraph: 'You create deep content—but turning it into SEO-friendly blog posts, meta, and organic social that ranks and converts takes manual restructuring. Different formats (blog, thread, LinkedIn) need different structure and keywords; one draft rarely does all.',
      solutionParagraph: 'Silho AI turns one piece (blog, video, podcast) into SEO-ready long-form and platform-native social in one click. We preserve depth and structure for ranking while generating the right format for each channel. Voice Lock keeps your authority tone. Built for founders who want organic reach without 10x the writing.',
      howItWorksParagraph: 'Paste your content or URL. Select target—blog (SEO), Twitter, LinkedIn, email. We generate native, structured output in one click. Add voice samples so organic content sounds like you. No manual rewriting for each format.',
    },
    'indie-hackers': {
      problemParagraph: 'Indie hackers who care about SEO struggle to repurpose one piece into blog, threads, and LinkedIn without thin or duplicate content. Manual reformatting for each channel burns time. Result: one format gets love, the rest get copy-paste or nothing.',
      solutionParagraph: 'Silho AI turns one piece into SEO-friendly blog and platform-native social in one click. We match structure and tone to each format so you get organic reach without duplicate or thin content. Voice Lock keeps your voice. Built for indie hackers who want SEO and distribution from one piece.',
      howItWorksParagraph: 'Paste your content. Select blog, Twitter, LinkedIn, or email. We generate native output in one click. Add voice samples so SEO content sounds like you.',
    },
  },
  community: {
    founders: {
      problemParagraph: 'You want to show up in community—Discord, Reddit, Slack—but reformatting the same update or launch for each space (tone, length, norms) is manual. Post the same thing everywhere and you sound like a bot; skip channels and you leave reach on the table.',
      solutionParagraph: 'Silho AI turns one piece into community-native content: value-first Reddit posts, Discord-friendly updates, and engagement-ready snippets. Paste once; we generate the right length and tone for each space. Voice Lock keeps your voice so community content doesn\'t sound like marketing. Built for founders who want to show up everywhere without copying and pasting.',
      howItWorksParagraph: 'Paste your update, launch, or thread. Select target—Reddit, email, or use output for Discord/Slack. We generate native content in one click. Add voice samples so community posts sound like you.',
    },
    'indie-hackers': {
      problemParagraph: 'Indie hackers who build in community struggle to repurpose one piece for Reddit, Discord, and Slack—each has different norms and length. Manual rewrites eat time. Result: one community gets the update, the rest get silence or copy-paste that doesn\'t fit.',
      solutionParagraph: 'Silho AI turns one piece into community-native content for Reddit, Discord-style updates, and more. We match tone and length to each space so you show up without sounding like a bot. Voice Lock keeps your build-in-public voice. Built for indie hackers who want one piece to feed every community.',
      howItWorksParagraph: 'Paste your content. Select Reddit, email, or use output for Discord/Slack. We generate native content in one click. Add voice samples so community content sounds like you.',
    },
  },
  'webinar-repurpose': {
    founders: {
      problemParagraph: 'Webinars are high-intent—but turning them into social clips, email sequences, and blog posts means transcription, editing, and reformatting for each channel. Most founders either leave the recording as-is or post one generic clip everywhere.',
      solutionParagraph: 'Silho AI turns webinar content (transcript or URL) into platform-native posts, email snippets, and blog-ready pieces in one click. We extract key moments and shape them for each format. Voice Lock keeps your voice so webinar repurposing doesn\'t sound like a script. Built for founders who want one webinar to drive ongoing distribution.',
      howItWorksParagraph: 'Paste your webinar transcript or URL. Select target—Twitter, LinkedIn, email, blog. We generate native content in one click. Add voice samples so repurposed webinar content sounds like you.',
    },
    'indie-hackers': {
      problemParagraph: 'Indie hackers who run webinars rarely repurpose them beyond one recap—turning a 60-minute session into threads, posts, and email is manual. Result: the webinar lives in one place, or you copy-paste the same summary everywhere.',
      solutionParagraph: 'Silho AI turns webinar content into platform-native threads, posts, and email in one click. Paste transcript or URL; we extract key moments and format for each channel. Voice Lock keeps your voice. Built for indie hackers who want one webinar to fuel a week of content.',
      howItWorksParagraph: 'Paste your webinar transcript or URL. Select Twitter, LinkedIn, email, or blog. We generate native content in one click. Add voice samples so output sounds like you.',
    },
  },
};

function buildTier3Pages(): Tier3Page[] {
  const pages: Tier3Page[] = [];
  const copy: Record<string, Record<string, { h1: string; body: string; cta: string }>> = {
    'build-in-public': {
      founders: {
        h1: 'Content repurposing for founders building in public',
        body: 'You ship updates, threads, and product news. Silho AI turns one piece into platform-native posts for X, LinkedIn, Reddit, and more—so you stay consistent without rewriting everything by hand.',
        cta: 'Repurpose your next update',
      },
      'indie-hackers': {
        h1: 'Content repurposing for indie hackers building in public',
        body: 'Ship one update, get a week of content. Silho AI turns your thread or blog into X, LinkedIn, Reddit, email—with your voice locked in. No generic AI tone.',
        cta: 'Turn one post into many',
      },
    },
    'product-launch': {
      founders: {
        h1: 'Content repurposing for your product launch',
        body: 'One launch post shouldn’t live in one place. Silho AI turns your launch content into Twitter threads, LinkedIn posts, Reddit announcements, and email—so every audience sees it in the right format.',
        cta: 'Repurpose your launch content',
      },
      'indie-hackers': {
        h1: 'Product launch content repurposing for indie hackers',
        body: 'Launch once, distribute everywhere. Turn your launch post or thread into LinkedIn, Reddit, email, and more. Platform-native length and tone, one click.',
        cta: 'Scale your launch',
      },
    },
    'content-batching': {
      founders: {
        h1: 'Content batching for founders',
        body: 'Batch one deep piece per week and spread it everywhere. Silho AI turns that blog or newsletter into X, LinkedIn, Reddit, email—so you batch once and ship all week.',
        cta: 'Batch and repurpose',
      },
      'indie-hackers': {
        h1: 'Content batching for indie hackers',
        body: 'Write once, ship everywhere. Silho AI batches your best content into platform-native posts. One thread or blog becomes a full week of distribution.',
        cta: 'Batch your content',
      },
    },
    'personal-brand': {
      founders: {
        h1: 'Content repurposing for founder personal brand',
        body: 'Your voice should be consistent everywhere. Silho AI keeps your tone across X, LinkedIn, Reddit, and email—so your personal brand stays recognizable, not generic.',
        cta: 'Build your brand',
      },
      'indie-hackers': {
        h1: 'Personal brand repurposing for indie hackers',
        body: 'One voice, every platform. Silho AI uses Voice Lock so your posts sound like you on X, LinkedIn, Reddit, and email. Scale your brand without losing authenticity.',
        cta: 'Lock your voice',
      },
    },
    'distribution': {
      founders: {
        h1: 'Distribution scaling for founders',
        body: 'Reach every audience without 10x the work. Silho AI turns one piece into platform-native content for X, LinkedIn, Reddit, email, and more—so you scale distribution, not hours.',
        cta: 'Scale distribution',
      },
      'indie-hackers': {
        h1: 'Distribution scaling for indie hackers',
        body: 'One piece, many channels. Silho AI turns your content into the right format for each platform. Scale distribution without burning out.',
        cta: 'Scale your reach',
      },
    },
    'newsletter-growth': {
      founders: {
        h1: 'Content repurposing for newsletter growth',
        body: 'Turn one newsletter or blog into signup drivers, social teases, and lead magnets. Silho AI generates platform-native content that hooks and converts—so you grow your list without rewriting by hand.',
        cta: 'Repurpose for growth',
      },
      'indie-hackers': {
        h1: 'Newsletter growth repurposing for indie hackers',
        body: 'One piece, many growth channels. Silho AI turns your newsletter or blog into teasers, threads, and snippets that drive signups and engagement. Built for indie hackers who want list growth without a content team.',
        cta: 'Grow your list',
      },
    },
    seo: {
      founders: {
        h1: 'Content repurposing for SEO and organic reach',
        body: 'Turn one piece into SEO-ready blog and platform-native social. Silho AI preserves depth and structure for ranking while generating the right format for each channel—so you get organic reach without 10x the writing.',
        cta: 'Repurpose for SEO',
      },
      'indie-hackers': {
        h1: 'SEO and organic repurposing for indie hackers',
        body: 'One piece, blog and social. Silho AI turns your content into SEO-friendly long-form and platform-native posts so you get organic reach without duplicate or thin content.',
        cta: 'Scale organic reach',
      },
    },
    community: {
      founders: {
        h1: 'Content repurposing for community engagement',
        body: 'Turn one update or launch into community-native content for Reddit, Discord, and more. Silho AI generates value-first, norm-fitting posts—so you show up everywhere without copying and pasting.',
        cta: 'Repurpose for community',
      },
      'indie-hackers': {
        h1: 'Community engagement repurposing for indie hackers',
        body: 'One piece, every community. Silho AI turns your content into Reddit posts, Discord-style updates, and more so you show up without sounding like a bot.',
        cta: 'Show up in community',
      },
    },
    'webinar-repurpose': {
      founders: {
        h1: 'Webinar repurposing for founders',
        body: 'Turn one webinar into social clips, email sequences, and blog posts. Silho AI extracts key moments and shapes them for each format—so one webinar drives ongoing distribution.',
        cta: 'Repurpose your webinar',
      },
      'indie-hackers': {
        h1: 'Webinar repurposing for indie hackers',
        body: 'One webinar, a week of content. Silho AI turns your transcript or URL into threads, posts, and email so you get distribution without manual slicing.',
        cta: 'Turn webinar into content',
      },
    },
  };
  for (const persona of PERSONAS) {
    for (const useCase of USE_CASES) {
      const fallback = {
        h1: `Content repurposing for ${persona.label}: ${useCase.label}`,
        body: `Repurpose your content for ${useCase.label.toLowerCase()}. Built for ${persona.label.toLowerCase()}. One source, many platforms.`,
        cta: 'Get started',
        problemParagraph: `Repurposing for ${useCase.label.toLowerCase()} takes time when you do it by hand—different formats and tones per platform. Most ${persona.label.toLowerCase()} end up posting the same copy everywhere or skipping channels.`,
        solutionParagraph: `Silho AI turns one piece into platform-native content for X, LinkedIn, Reddit, email, and more in one click. Built for ${persona.label.toLowerCase()}. Voice Lock keeps your voice consistent.`,
        howItWorksParagraph: 'Paste your content (or URL). Select your target platform. We generate native content in one click. Add voice samples so output sounds like you.',
      };
      const c = copy[useCase.slug]?.[persona.slug] ?? fallback;
      const rich = TIER3_RICH[useCase.slug]?.[persona.slug];
      pages.push({
        persona: persona.slug,
        personaLabel: persona.label,
        useCase: useCase.slug,
        useCaseLabel: useCase.label,
        title: `${useCase.label} for ${persona.label} | Content repurposing`,
        description: `Content repurposing for ${persona.label.toLowerCase()}: ${useCase.label.toLowerCase()}. One source, many platforms. Paste once, ship everywhere. Built by Silho AI.`,
        h1: c.h1,
        body: c.body,
        cta: c.cta,
        problemParagraph: rich?.problemParagraph ?? fallback.problemParagraph,
        solutionParagraph: rich?.solutionParagraph ?? fallback.solutionParagraph,
        howItWorksParagraph: rich?.howItWorksParagraph ?? fallback.howItWorksParagraph,
        faqs: getFaqsForTier3Page(persona.slug, useCase.slug),
      });
    }
  }
  return pages;
}

// ─── TIER 4: Outcome-based (curated) ─────────────────────────────────────────
const TIER4_CURATED: Tier4Page[] = [
  {
    slug: 'blog-post-into-10-twitter-posts',
    source: 'blog-post',
    sourceLabel: 'Blog post',
    target: 'twitter',
    targetLabel: 'Twitter/X',
    number: 10,
    title: 'Turn one blog post into 10 Twitter posts',
    description: 'Turn one blog post into 10 Twitter posts. Paste your blog, get 10 platform-native tweets or thread. One click.',
    h1: 'Turn one blog post into 10 Twitter posts',
    body: 'One blog post can become a full week of tweets. Paste your post, select Twitter, and get 10 platform-native tweets—or a thread—in one click. Voice Lock keeps your tone.',
    cta: 'Turn your blog into tweets',
    faqs: getFaqsForTier4Page('Blog post', 'Twitter/X', 10),
  },
  {
    slug: 'one-tweet-into-5-linkedin-posts',
    source: 'tweet',
    sourceLabel: 'One tweet',
    target: 'linkedin',
    targetLabel: 'LinkedIn',
    number: 5,
    title: 'Turn one tweet into 5 LinkedIn posts',
    description: 'Turn one tweet into 5 LinkedIn posts. Expand your best tweet into thought-leadership posts. One click.',
    h1: 'Turn one tweet into 5 LinkedIn posts',
    body: 'Your best tweet can become a week of LinkedIn. Paste it, get 5 thought-leadership style posts with the right length and format. Voice Lock optional.',
    cta: 'Expand your tweet',
    faqs: getFaqsForTier4Page('One tweet', 'LinkedIn', 5),
  },
  {
    slug: 'newsletter-into-10-twitter-posts',
    source: 'newsletter',
    sourceLabel: 'Newsletter',
    target: 'twitter',
    targetLabel: 'Twitter/X',
    number: 10,
    title: 'Turn your newsletter into 10 Twitter posts',
    description: 'Turn your newsletter into 10 Twitter posts. One edition, 10 tweets or a thread. Paste the URL or text.',
    h1: 'Turn your newsletter into 10 Twitter posts',
    body: 'One newsletter edition can fuel a week of tweets. Paste the URL or paste the text—get 10 platform-native tweets or a thread. No manual slicing.',
    cta: 'Repurpose your newsletter',
    faqs: getFaqsForTier4Page('Newsletter', 'Twitter/X', 10),
  },
  {
    slug: 'twitter-thread-into-5-linkedin-posts',
    source: 'twitter-thread',
    sourceLabel: 'Twitter thread',
    target: 'linkedin',
    targetLabel: 'LinkedIn',
    number: 5,
    title: 'Turn a Twitter thread into 5 LinkedIn posts',
    description: 'Turn a Twitter thread into 5 LinkedIn posts. One thread, five thought-leadership posts. One click.',
    h1: 'Turn a Twitter thread into 5 LinkedIn posts',
    body: 'Your best thread deserves a second life on LinkedIn. Paste the thread, get 5 posts with the right length and professional tone. Voice Lock keeps your voice.',
    cta: 'Turn your thread into LinkedIn',
    faqs: getFaqsForTier4Page('Twitter thread', 'LinkedIn', 5),
  },
  {
    slug: 'blog-post-into-5-linkedin-posts',
    source: 'blog-post',
    sourceLabel: 'Blog post',
    target: 'linkedin',
    targetLabel: 'LinkedIn',
    number: 5,
    title: 'Turn one blog post into 5 LinkedIn posts',
    description: 'Turn one blog post into 5 LinkedIn posts. One post, five thought-leadership pieces. One click.',
    h1: 'Turn one blog post into 5 LinkedIn posts',
    body: 'One long-form post can become a week of LinkedIn. Paste your blog, get 5 platform-native posts. Perfect for founders and indie hackers.',
    cta: 'Repurpose your blog for LinkedIn',
    faqs: getFaqsForTier4Page('Blog post', 'LinkedIn', 5),
  },
  {
    slug: 'podcast-into-5-linkedin-posts',
    source: 'podcast',
    sourceLabel: 'Podcast episode',
    target: 'linkedin',
    targetLabel: 'LinkedIn',
    number: 5,
    title: 'Turn one podcast into 5 LinkedIn posts',
    description: 'Turn one podcast episode into 5 LinkedIn posts. Paste transcript or URL, get thought-leadership posts. One click.',
    h1: 'Turn one podcast into 5 LinkedIn posts',
    body: 'One podcast episode can fuel a week of LinkedIn. Paste transcript or URL, get 5 platform-native posts with the right length and professional tone. Voice Lock keeps your voice.',
    cta: 'Repurpose your podcast for LinkedIn',
    faqs: getFaqsForTier4Page('Podcast episode', 'LinkedIn', 5),
  },
  {
    slug: 'youtube-video-into-10-twitter-posts',
    source: 'youtube-video',
    sourceLabel: 'YouTube video',
    target: 'twitter',
    targetLabel: 'Twitter/X',
    number: 10,
    title: 'Turn one YouTube video into 10 Twitter posts',
    description: 'Turn one YouTube video into 10 Twitter posts. Paste URL or transcript, get tweets or a thread. One click.',
    h1: 'Turn one YouTube video into 10 Twitter posts',
    body: 'One video can become a week of tweets. Paste URL or transcript, get 10 platform-native tweets or a thread. Voice Lock keeps your tone. No manual slicing.',
    cta: 'Turn your video into tweets',
    faqs: getFaqsForTier4Page('YouTube video', 'Twitter/X', 10),
  },
  {
    slug: 'changelog-into-5-linkedin-posts',
    source: 'changelog',
    sourceLabel: 'Changelog',
    target: 'linkedin',
    targetLabel: 'LinkedIn',
    number: 5,
    title: 'Turn one changelog into 5 LinkedIn posts',
    description: 'Turn one changelog into 5 LinkedIn posts. Ship the update in thought-leadership format. One click.',
    h1: 'Turn one changelog into 5 LinkedIn posts',
    body: 'One changelog can become a week of LinkedIn. Paste your update, get 5 platform-native posts—founder voice, not press release. Voice Lock keeps your tone.',
    cta: 'Repurpose your changelog for LinkedIn',
    faqs: getFaqsForTier4Page('Changelog', 'LinkedIn', 5),
  },
  {
    slug: 'newsletter-into-5-linkedin-posts',
    source: 'newsletter',
    sourceLabel: 'Newsletter',
    target: 'linkedin',
    targetLabel: 'LinkedIn',
    number: 5,
    title: 'Turn one newsletter into 5 LinkedIn posts',
    description: 'Turn one newsletter edition into 5 LinkedIn posts. One edition, five thought-leadership pieces. One click.',
    h1: 'Turn one newsletter into 5 LinkedIn posts',
    body: 'One newsletter can fuel a week of LinkedIn. Paste URL or copy, get 5 platform-native posts. Voice Lock keeps your voice. No manual slicing.',
    cta: 'Repurpose your newsletter for LinkedIn',
    faqs: getFaqsForTier4Page('Newsletter', 'LinkedIn', 5),
  },
  {
    slug: 'blog-post-into-5-tiktok-scripts',
    source: 'blog-post',
    sourceLabel: 'Blog post',
    target: 'tiktok',
    targetLabel: 'TikTok',
    number: 5,
    title: 'Turn one blog post into 5 TikTok scripts',
    description: 'Turn one blog post into 5 TikTok scripts. Hook in the first second, vertical pacing. One click.',
    h1: 'Turn one blog post into 5 TikTok scripts',
    body: 'One blog can become a week of TikToks. Paste your post, get 5 script-style captions with hook, pacing, and CTA. Voice Lock keeps your tone. Native short-form, not a cut-down long video.',
    cta: 'Turn your blog into TikToks',
    faqs: getFaqsForTier4Page('Blog post', 'TikTok', 5),
  },
];

// ─── EAGER BUILD (no lazy cache – ensure pages always available at runtime) ───

const TIER1_PAGES = buildTier1Pages();
const TIER2_PAGES = buildTier2Pages();
const TIER3_PAGES = buildTier3Pages();

function getTier1(): RepurposePage[] {
  return TIER1_PAGES;
}
function getTier2(): RepurposePage[] {
  return TIER2_PAGES;
}
function getTier3(): Tier3Page[] {
  return TIER3_PAGES;
}

/** All Tier 1 + Tier 2 pages (for /repurpose/[slug]). */
export function getRepurposePages(): RepurposePage[] {
  return [...TIER1_PAGES, ...TIER2_PAGES];
}

function getSourceBySlug(s: string) {
  return SOURCES.find((x) => x.slug === s);
}
function getTargetBySlug(s: string) {
  return TARGETS.find((x) => x.slug === s);
}
function getPersonaBySlug(s: string) {
  return PERSONAS.find((x) => x.slug === s);
}

/** Build a repurpose page from slug so we never 404 for valid repurpose-* URLs. */
function buildRepurposePageFromSlug(slug: string): RepurposePage | null {
  const m = slug.match(/^repurpose-(.+)-to-(.+?)(?:-for-(.+))?$/);
  if (!m) return null;
  const [, sourceSlug, targetSlug, personaSlug] = m;
  const source = getSourceBySlug(sourceSlug);
  const target = getTargetBySlug(targetSlug);
  if (!source || !target || (source.slug as string) === (target.slug as string)) return null;
  const persona = personaSlug ? getPersonaBySlug(personaSlug) : null;
  const isTier2 = Boolean(persona);
  const h1 = persona
    ? `Turn your ${source.label} into ${target.label} content — for ${persona.label}`
    : `Turn your ${source.label} into ${target.label} content`;
  const desc = `${source.label} to ${target.label}: paste once, get platform-native ${target.label} output.${persona ? ` Built for ${persona.label.toLowerCase()}.` : ' No manual reformatting.'}`;
  const combo = getComboCopy(source, target);
  const defaultWhy = `Reformatting ${source.label} for ${target.label} takes time: different lengths, tone, and formatting rules. Most founders skip it or post the same copy everywhere.`;
  const defaultHow = `Paste your ${source.label} (or paste a URL for blogs/newsletters). Select ${target.label}. We generate platform-native content in one click. Optionally lock your voice with 5–10 sample posts.`;
  const example =
    target.slug === 'twitter'
      ? 'thread of tweets'
      : target.slug === 'linkedin'
        ? 'thought-leadership post'
        : `native ${target.label} post`;
  const defaultExample = `Example: A 500-word blog becomes a ${example} with the right length and format.`;
  return {
    slug,
    tier: isTier2 ? 2 : 1,
    source: source.slug,
    sourceLabel: source.label,
    target: target.slug,
    targetLabel: target.label,
    ...(persona && { persona: persona.slug, personaLabel: persona.label }),
    title: `${source.label} to ${target.label}${persona ? ` for ${persona.label}` : ''} | Silho AI`,
    description: desc,
    intro: getIntroForCombo(source, target, persona ?? undefined),
    h1,
    whyManualFails: combo.whyManualFails ?? defaultWhy,
    howWeSolve: combo.howWeSolve ?? defaultHow,
    exampleSnippet: combo.exampleSnippet ?? defaultExample,
    bestFor: persona ? `${persona.label} building in public and scaling distribution.` : 'Founders and indie hackers building in public.',
    painPoints: getPainPoints(source, target),
    tips: getTipsForCombo(source, target, persona ?? undefined),
    whatYouGet: getWhatYouGet(source, target, persona ?? undefined),
    faqs: getFaqsForRepurposePage(source, target, persona ?? undefined),
  };
}

/** Fallback so /repurpose/[slug] always has content at runtime (no 404). */
function buildRepurposePageFallback(slug: string): RepurposePage {
  const humanSlug = slug.replace(/^repurpose-/, '').replace(/-/g, ' ');
  const source = getSourceBySlug('blog-post')!;
  const target = getTargetBySlug('twitter')!;
  return {
    slug,
    tier: 1,
    source: 'blog-post',
    sourceLabel: 'Blog post',
    target: 'twitter',
    targetLabel: 'Twitter/X',
    title: `${humanSlug} | Silho AI`,
    description: `Repurpose your content in one click. Paste once, get platform-native output. Built for founders and indie hackers.`,
    intro: 'One piece of content, many formats. Paste once; get platform-native output for Twitter, LinkedIn, Reddit, email, and more. No manual reformatting—we handle length, tone, and platform norms.',
    h1: `Repurpose: ${humanSlug}`,
    whyManualFails: 'Reformatting content for different platforms takes time: different lengths, tone, and formatting rules. Most founders skip it or post the same copy everywhere.',
    howWeSolve: 'Paste your content (or a URL for blogs/newsletters). Select your target platform. We generate platform-native content in one click. Optionally lock your voice with 5–10 sample posts.',
    exampleSnippet: 'Example: One piece of content becomes a thread, post, or email with the right length and format for each platform.',
    bestFor: 'Founders and indie hackers building in public.',
    painPoints: getPainPoints(source, target),
    tips: getTipsForCombo(source, target),
    whatYouGet: getWhatYouGet(source, target),
    faqs: getFaqsForRepurposePage(source, target),
  };
}

/** Tier 3 generic h1 — never use for /repurpose/[slug]; repurpose pages must have slug-specific copy. Export so page can reject wrong data. */
export const PSEO_REPURPOSE_GENERIC_H1 = 'Content repurposing for founders building in public';

/** Always returns a page so /repurpose/[slug] never 404s; content is built at runtime. Prefer building from slug so every page gets unique copy. Never return Tier 3 generic h1 for repurpose slugs. */
export function getRepurposePageBySlug(slug: string): RepurposePage {
  const built = buildRepurposePageFromSlug(slug);
  if (built) return built;
  const found = getRepurposePages().find((p) => p.slug === slug);
  if (found && found.h1 !== PSEO_REPURPOSE_GENERIC_H1) return found;
  return buildRepurposePageFallback(slug);
}

export function getRepurposeSlugs(): string[] {
  return getRepurposePages().map((p) => p.slug);
}

/** Tier 1 slugs only (source→target). Use for sitemap so only strongest pSEO set is indexed. */
export function getRepurposeSlugsTier1Only(): string[] {
  return getTier1().map((p) => p.slug);
}

/** Related workflows: same source or same target (Tier 1/2 only). */
export function getRelatedRepurposeSlugs(slug: string, limit = 4): string[] {
  const page = getRepurposePageBySlug(slug);
  if (!page) return [];
  return getRepurposePages()
    .filter((p) => p.slug !== slug && (p.source === page.source || p.target === page.target))
    .slice(0, limit)
    .map((p) => p.slug);
}

// ─── TIER 3 ────────────────────────────────────────────────────────────────

export function getTier3Pages(): Tier3Page[] {
  return getTier3();
}

export function getTier3Page(persona: string, useCase: string): Tier3Page | undefined {
  return getTier3().find((p) => p.persona === persona && p.useCase === useCase);
}

/** Build Tier3 page at runtime so /content-repurposing/for/[persona]/[use-case] always has content (no 404). */
function buildTier3PageFallback(persona: string, useCase: string): Tier3Page {
  const p = typeof persona === 'string' ? persona : 'founders';
  const u = typeof useCase === 'string' ? useCase : 'build-in-public';
  const personaLabel = p.replace(/-/g, ' ');
  const useCaseLabel = u.replace(/-/g, ' ');
  return {
    persona: p,
    personaLabel: personaLabel.charAt(0).toUpperCase() + personaLabel.slice(1),
    useCase: u,
    useCaseLabel: useCaseLabel.charAt(0).toUpperCase() + useCaseLabel.slice(1),
    title: `${useCaseLabel} for ${personaLabel} | Content repurposing`,
    description: `Content repurposing for ${personaLabel}: ${useCaseLabel}. One source, many platforms. Paste once, ship everywhere. Built by Silho AI.`,
    h1: `Content repurposing for ${personaLabel}: ${useCaseLabel}`,
    body: `Repurpose your content for ${useCaseLabel}. Built for ${personaLabel}. One source, many platforms—paste once, get platform-native output for X, LinkedIn, Reddit, email, and more.`,
    cta: 'Get started',
    problemParagraph: `Repurposing for ${useCaseLabel} takes time when you do it by hand—different formats and tones per platform. Most ${personaLabel} end up posting the same copy everywhere or skipping channels.`,
    solutionParagraph: `Silho AI turns one piece into platform-native content for X, LinkedIn, Reddit, email, and more in one click. Built for ${personaLabel}. Voice Lock keeps your voice consistent.`,
    howItWorksParagraph: 'Paste your content (or URL). Select your target platform. We generate native content in one click. Add voice samples so output sounds like you.',
    faqs: getFaqsForTier3Page(p, u),
  };
}

/** Always returns a Tier3 page; content built at runtime so every URL has content. */
export function getTier3PageOrFallback(persona: string, useCase: string): Tier3Page {
  const p = typeof persona === 'string' ? persona : 'founders';
  const u = typeof useCase === 'string' ? useCase : 'build-in-public';
  const exact = getTier3Page(p, u);
  if (exact) return exact;
  return buildTier3PageFallback(p, u);
}

export function getTier3Slugs(): { persona: string; useCase: string }[] {
  return getTier3().map((p) => ({ persona: p.persona, useCase: p.useCase }));
}

// ─── TIER 4 ────────────────────────────────────────────────────────────────

export function getTier4Pages(): Tier4Page[] {
  return TIER4_CURATED;
}

export function getTier4PageBySlug(slug: string): Tier4Page | undefined {
  return TIER4_CURATED.find((p) => p.slug === slug);
}

/** Parse turn slug like "blog-post-into-5-linkedin-posts" -> { sourceSlug, number, targetSlug }. */
function parseTier4Slug(slug: string): { sourceSlug: string; number: number; targetSlug: string } | null {
  const m = slug.match(/^(.+)-into-(\d+)-(.+)-posts$/);
  if (!m) return null;
  const [, sourceSlug, numStr, targetSlug] = m;
  const number = parseInt(numStr!, 10);
  if (!Number.isFinite(number) || number < 1) return null;
  return { sourceSlug, number, targetSlug };
}

/** Build a Tier4 page from slug so every /turn/[slug] has unique copy (no generic fallback for parseable slugs). */
function buildTier4PageFromSlug(slug: string): Tier4Page | null {
  const parsed = parseTier4Slug(slug);
  if (!parsed) return null;
  const { sourceSlug, number, targetSlug } = parsed;
  const source = getSourceBySlug(sourceSlug);
  const target = getTargetBySlug(targetSlug);
  if (!source || !target || (source.slug as string) === (target.slug as string)) return null;
  const s = source.label.toLowerCase();
  const t = target.label.toLowerCase();
  const h1 = `Turn one ${source.label} into ${number} ${target.label} posts`;
  const title = `${h1} | Silho AI`;
  const description = `Turn one ${source.label} into ${number} ${target.label} posts. Paste once, get ${number} platform-native ${target.label} posts. One click.`;
  const body = `One ${s} can become ${number} ${t} posts. Paste your ${s}, select ${target.label}, and get ${number} platform-native posts in one click. Voice Lock keeps your tone.`;
  const cta = number === 1 ? `Turn your ${source.label} into ${target.label}` : `Get ${number} ${target.label} posts`;
  return {
    slug,
    source: source.slug,
    sourceLabel: source.label,
    target: target.slug,
    targetLabel: target.label,
    number,
    title,
    description,
    h1,
    body,
    cta,
    faqs: getFaqsForTier4Page(source.label, target.label, number),
  };
}

/** Fallback so /turn/[slug] always has content at runtime (no 404). Only for unparseable slugs. */
function buildTier4PageFallback(slug: string): Tier4Page {
  const human = slug.replace(/-/g, ' ');
  return {
    slug,
    source: 'blog-post',
    sourceLabel: 'Blog post',
    target: 'twitter',
    targetLabel: 'Twitter/X',
    number: 5,
    title: `Turn your content into more | ${human}`,
    description: `Turn your content into more. Repurpose in one click. Paste once, get platform-native output.`,
    h1: `Turn your content into more`,
    body: `Repurpose your content in one click. Paste your blog, thread, newsletter, or changelog—get platform-native posts for X, LinkedIn, Reddit, email, and more. Built for founders and indie hackers.`,
    cta: 'Repurpose now',
    faqs: getFaqsForTier4Page('Blog post', 'Twitter/X', 5),
  };
}

/** Always returns a Tier4-style page so /turn/[slug] never 404s. Prefer curated, then build from slug, then fallback. */
export function getTier4PageBySlugOrFallback(slug: string): Tier4Page {
  const exact = getTier4PageBySlug(slug);
  if (exact) return exact;
  const built = buildTier4PageFromSlug(slug);
  if (built) return built;
  return buildTier4PageFallback(slug);
}

export function getTier4Slugs(): string[] {
  return TIER4_CURATED.map((p) => p.slug);
}

// ─── SITEMAP & LEGACY ───────────────────────────────────────────────────────

/** All pSEO URLs for sitemap: repurpose, content-repurposing/for/[persona]/[use-case], turn */
export function getAllPSEOSlugs(): { path: string }[] {
  const repurpose = getRepurposeSlugs().map((slug) => ({ path: `/repurpose/${slug}` }));
  const tier3 = getTier3Slugs().map(({ persona, useCase }) => ({
    path: `/content-repurposing/for/${persona}/${useCase}`,
  }));
  const tier4 = getTier4Slugs().map((slug) => ({ path: `/turn/${slug}` }));
  return [...repurpose, ...tier3, ...tier4];
}

/** @deprecated Use getRepurposePages / getRepurposePageBySlug / getRepurposeSlugs */
export const getPSEOPages = getRepurposePages;
export const getPSEOPageBySlug = getRepurposePageBySlug;
export const getPSEOSlugs = getRepurposeSlugs;
export const getRelatedSlugs = getRelatedRepurposeSlugs;
