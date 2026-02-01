import { test, expect } from '@playwright/test';

const GENERIC_H1 = 'Content repurposing for founders building in public';
const REPURPOSE_SECTION_TITLES = ['Why manual repurposing fails', 'How Silho AI solves it', 'Example'];
const TIER3_SECTION_TITLES = ['The problem', 'How we solve it', 'How it works'];

const REPURPOSE_SLUGS = [
  'repurpose-podcast-to-reddit',
  'repurpose-youtube-video-to-youtube-shorts',
  'repurpose-blog-post-to-twitter',
  'repurpose-youtube-video-to-reddit',
  'repurpose-newsletter-to-twitter',
];

test.describe('Repurpose pSEO pages show unique content', () => {
  for (const slug of REPURPOSE_SLUGS) {
    test(`${slug} has unique h1 and repurpose section titles (not Tier 3 generic)`, async ({ page }) => {
      await page.goto(`/repurpose/${slug}`);
      await expect(page).toHaveURL(new RegExp(`/repurpose/${slug}`));

      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      const h1Text = await h1.textContent();
      expect(h1Text).not.toBe(GENERIC_H1);
      expect(h1Text?.toLowerCase()).toContain('turn'); // repurpose pages use "Turn your X into Y content"

      for (const title of REPURPOSE_SECTION_TITLES) {
        await expect(page.getByRole('heading', { name: title, level: 2 })).toBeVisible();
      }
      for (const title of TIER3_SECTION_TITLES) {
        await expect(page.getByRole('heading', { name: title, level: 2 })).not.toBeVisible();
      }
    });
  }

  test('each sampled repurpose page has different h1', async ({ page }) => {
    const h1s: string[] = [];
    for (const slug of REPURPOSE_SLUGS) {
      await page.goto(`/repurpose/${slug}`);
      const h1 = await page.locator('h1').first().textContent();
      if (h1) h1s.push(h1.trim());
    }
    const unique = new Set(h1s);
    expect(unique.size).toBe(REPURPOSE_SLUGS.length);
  });
});

test.describe('Tier 3 and Turn pSEO pages', () => {
  test('Tier 3 page /content-repurposing/for/founders/build-in-public returns 200 and has expected sections', async ({
    page,
  }) => {
    const res = await page.goto('/content-repurposing/for/founders/build-in-public');
    expect(res?.status()).toBe(200);
    await expect(page).toHaveURL(/\/content-repurposing\/for\/founders\/build-in-public/);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    expect(await h1.textContent()).toContain('Content repurposing');
    for (const title of TIER3_SECTION_TITLES) {
      await expect(page.getByRole('heading', { name: title, level: 2 })).toBeVisible();
    }
  });

  test('Turn page /turn/blog-post-into-5-linkedin-posts returns 200 and has unique h1', async ({ page }) => {
    const res = await page.goto('/turn/blog-post-into-5-linkedin-posts');
    expect(res?.status()).toBe(200);
    await expect(page).toHaveURL(/\/turn\/blog-post-into-5-linkedin-posts/);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const h1Text = await h1.textContent();
    expect(h1Text?.toLowerCase()).toContain('blog');
    expect(h1Text?.toLowerCase()).toContain('linkedin');
    expect(h1Text?.toLowerCase()).toContain('5');
  });
});
