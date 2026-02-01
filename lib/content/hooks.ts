/**
 * Founder-focused thread hooks and angles (Hypefury-style viral hooks, tuned for founders).
 * Optional "Hook / angle" in New Repurpose shapes the first tweet or thread opening.
 */

export interface ThreadHook {
  value: string;
  label: string;
  description: string;
}

/** Curated hooks for founder updates, changelogs, and build-in-public content. */
export const THREAD_HOOKS: ThreadHook[] = [
  { value: '', label: 'Default (no specific hook)', description: 'Let the content lead.' },
  {
    value: 'ship',
    label: 'We just shipped',
    description: 'Lead with what you shipped. Best for changelogs and product updates.',
  },
  {
    value: 'lesson',
    label: 'Lesson learned',
    description: 'One clear lesson from building. Great for post-mortems and reflections.',
  },
  {
    value: 'number',
    label: 'Number / list',
    description: 'e.g. "5 things we learned launching X". Strong for threads.',
  },
  {
    value: 'story',
    label: 'Short story',
    description: 'Narrative opening. Good for founder journey or customer win.',
  },
  {
    value: 'hot_take',
    label: 'Hot take / opinion',
    description: 'Bold opinion that invites engagement. Use for thought leadership.',
  },
  {
    value: 'question',
    label: 'Question hook',
    description: 'Open with a question your audience cares about.',
  },
  {
    value: 'mistake',
    label: 'Mistake we made',
    description: 'Vulnerability hook. "We messed up. Here\'s what we learned."',
  },
  {
    value: 'before_after',
    label: 'Before → After',
    description: 'Transformation angle. "Before X we did Y. Now we do Z."',
  },
  {
    value: 'myth',
    label: 'Myth vs reality',
    description: 'Debunk a common belief. "Everyone says X. Reality: Y."',
  },
];

export function getThreadHookByValue(value: string): ThreadHook | undefined {
  if (!value) return THREAD_HOOKS[0];
  return THREAD_HOOKS.find((h) => h.value === value);
}

/** Prompt fragment for AI: how to use the hook for Twitter thread or single tweet. */
export function threadHookPromptFragment(hookValue: string): string {
  const hook = getThreadHookByValue(hookValue);
  if (!hook || !hook.value) return '';
  const instructions: Record<string, string> = {
    ship: 'Open the thread or tweet with what was just shipped (e.g. "We just shipped X" or "Shipped today:"). Keep it punchy and founder-voice.',
    lesson: 'Open with one clear lesson learned (e.g. "One lesson from building X:" or "What we learned:"). Make the lesson specific, not generic.',
    number: 'Use a number or list in the opening (e.g. "5 things we learned" or "3 changes we made"). First tweet should set up the list.',
    story: 'Open with a short narrative hook—one or two sentences that set up a story. Founder-voice, not corporate.',
    hot_take: 'Open with a bold, opinionated statement that invites engagement. Keep it founder-voice, not inflammatory.',
    question: 'Open with a question your audience would care about. The rest of the content should answer or explore it.',
    mistake: 'Open with the mistake or failure (e.g. "We messed up." or "Big mistake we made:"). Then share what you learned.',
    before_after: 'Open with a before/after contrast (e.g. "Before X we… Now we…"). One tweet for before, one for after, or thread it.',
    myth: 'Open by stating the myth or common belief, then subvert it (e.g. "Everyone says X. Here\'s what actually happened.").',
  };
  const inst = instructions[hook.value];
  return inst ? `\nThread/tweet hook: ${inst}` : '';
}
