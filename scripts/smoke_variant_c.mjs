import { chromium } from 'playwright';

// Usage:
//   node scripts/smoke_variant_c.mjs [url]
// Examples:
//   node scripts/smoke_variant_c.mjs http://localhost:5173/variant_c.html
//   node scripts/smoke_variant_c.mjs https://newdiscover.vercel.app/variant_c.html
const url = process.argv[2] || 'https://newdiscover.vercel.app/variant_c.html';

function parseWaysToPlay(text) {
  if (!text) return null;
  const m = String(text).match(/(\d+)\s+ways\s+to\s+play/i);
  return m ? Number(m[1]) : null;
}

async function getWays(page) {
  const txt = await page.locator('body').innerText();
  return parseWaysToPlay(txt);
}

async function clickSubscope(page, label) {
  // Buttons live in the sports sub-nav (#sub-nav-b)
  // First wait for the sub-nav to exist at all.
  const nav = page.locator('#sub-nav-b');
  await nav.waitFor({ state: 'visible', timeout: 60000 });

  // Then resolve the button by text.
  const btn = page
    .locator('#sub-nav-b button')
    .filter({ hasText: label })
    .first();

  // Occasionally the sub-nav renders but the button text may be reflowed with newlines;
  // ensure it's attached & visible before interacting.
  await btn.waitFor({ state: 'visible', timeout: 60000 });
  await btn.scrollIntoViewIfNeeded();
  await btn.click({ timeout: 60000 });

  // Allow filter pipeline and DOM updates
  await page.waitForTimeout(2000);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on('console', (msg) => {
  // Surface page errors/warnings in CI logs
  if (msg.type() === 'error') {
    console.error('[browser console error]', msg.text());
  }
});
page.on('pageerror', (err) => {
  console.error('[pageerror]', err);
});

await page.goto(url, { waitUntil: 'domcontentloaded' });

// Give client-side scripts time to load datasets and rerender.
await page.waitForTimeout(6000);

const baselineWays = await getWays(page);

// Validate Tournaments tab shows results
await clickSubscope(page, 'Tournaments');
const tournamentsWays = await getWays(page);

// Validate Court Rentals (Private Rentals) tab shows results
await clickSubscope(page, 'Court Rentals');
const rentalsWays = await getWays(page);

console.log(JSON.stringify({
  url,
  baselineWays,
  tournamentsWays,
  rentalsWays,
}, null, 2));

await browser.close();

function assertPositive(name, val) {
  if (val == null) {
    console.error(`Could not parse "ways to play" for ${name}.`);
    process.exit(2);
  }
  if (val <= 0) {
    console.error(`Expected > 0 ways to play for ${name}, got: ${val}`);
    process.exit(1);
  }
}

assertPositive('baseline', baselineWays);
assertPositive('tournaments', tournamentsWays);
assertPositive('court rentals', rentalsWays);
