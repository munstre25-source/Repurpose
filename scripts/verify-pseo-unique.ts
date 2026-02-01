import { getRepurposePageBySlug, getRepurposeSlugs } from '../lib/pseo/config';

const slugs = getRepurposeSlugs();
const h1s = new Set<string>();
const intros = new Set<string>();
let dupH1 = 0,
  dupIntro = 0;

for (const slug of slugs) {
  const page = getRepurposePageBySlug(slug);
  if (h1s.has(page.h1)) dupH1++;
  if (intros.has(page.intro)) dupIntro++;
  h1s.add(page.h1);
  intros.add(page.intro);
}

console.log('Slugs:', slugs.length, '| Unique h1:', h1s.size, '| Unique intro:', intros.size);
if (dupH1 || dupIntro) {
  console.error('Duplicates: h1', dupH1, 'intro', dupIntro);
  process.exit(1);
}
console.log('OK: all pages have unique h1 and intro.');
