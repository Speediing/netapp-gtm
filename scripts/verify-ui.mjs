import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.VERIFY_BASE_URL || "http://127.0.0.1:3000";
const password = process.env.SITE_PASSWORD?.trim();
const outputDirectory =
  process.env.VERIFY_SCREENSHOT_DIR || "/tmp/netapp-gtm-verification";
const homeUrl = new URL("/", baseUrl).href;

assert(password, "SITE_PASSWORD is required for the browser check.");
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
  headless: true,
});

async function signIn(page) {
  await page.goto(homeUrl, { waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).pathname, "/login");
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Open the site" }).click();
  await page.waitForURL(homeUrl, { waitUntil: "networkidle" });
}

async function inspectHero(page) {
  const image = page.locator(".hero-watercolor-image");
  const band = page.locator(".hero-paper-band");
  const lockup = page.locator(".brand-netapp").first();

  await image.waitFor({ state: "visible" });
  const imageState = await image.evaluate((element) => ({
    complete: element.complete,
    naturalWidth: element.naturalWidth,
    box: element.getBoundingClientRect().toJSON(),
  }));
  assert(
    imageState.complete &&
      imageState.naturalWidth >= 500 &&
      imageState.naturalHeight >= 250,
  );
  assert(imageState.box.height > 500);

  const bandState = await band.evaluate((element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    const hero = element.closest(".hero-watercolor")?.getBoundingClientRect();
    return {
      background: style.backgroundColor,
      width: box.width,
      pinnedGap: hero ? Math.abs(hero.bottom - box.bottom) : null,
    };
  });
  assert.notEqual(bandState.background, "rgba(0, 0, 0, 0)");
  assert(bandState.width > 300);
  assert(bandState.pinnedGap !== null && bandState.pinnedGap < 2);

  const lockupHeight = await lockup.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  assert(lockupHeight >= 15 && lockupHeight <= 18);

  return { imageState, bandState, lockupHeight };
}

async function inspectNoOverflow(page) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  assert(
    overflow.page <= overflow.viewport + 1,
    `Horizontal overflow detected. Page ${overflow.page}, viewport ${overflow.viewport}.`,
  );
  return overflow;
}

async function waitForFinalArtifact(page, workflowId, computerSelector) {
  const section = page.locator(`[data-workflow="${workflowId}"]`);
  const demo = section.locator(".job-live-demo");
  await demo.scrollIntoViewIfNeeded();
  await page.waitForFunction(
    (id) =>
      document
        .querySelector(`[data-workflow="${id}"] .demo-tools > button`)
        ?.textContent?.trim() === "Replay",
    workflowId,
    { timeout: 25000 },
  );

  const artifact = section.locator(
    `${computerSelector} [data-artifact-state="complete"]`,
  );
  await artifact.waitFor({ state: "visible" });
  return artifact.innerText();
}

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1,
});
const desktopPage = await desktop.newPage();
await signIn(desktopPage);
const desktopHero = await inspectHero(desktopPage);

assert.equal(await desktopPage.locator(".fleet-desk").count(), 3);
assert.equal(await desktopPage.locator(".fleet-computer").count(), 3);
assert.equal(await desktopPage.locator(".story-beat").count(), 9);
assert.equal(
  await desktopPage.locator(
    ".chapter-payoff [data-artifact-state='complete']",
  ).count(),
  3,
);

await desktopPage.screenshot({
  path: `${outputDirectory}/desktop-hero.png`,
  fullPage: false,
});

const artifactTitles = {};
for (const workflowId of [
  "call-follow-up",
  "sourced-answer",
  "account-brief",
]) {
  artifactTitles[workflowId] = await waitForFinalArtifact(
    desktopPage,
    workflowId,
    ".pc-desk",
  );
}

const split = await desktopPage
  .locator('[data-workflow="account-brief"]')
  .evaluate((section) => {
    const chat = section.querySelector(".gb-thread")?.getBoundingClientRect();
    const computer = section.querySelector(".pc-desk")?.getBoundingClientRect();
    return chat && computer
      ? {
          chatX: chat.x,
          chatWidth: chat.width,
          computerX: computer.x,
          computerWidth: computer.width,
        }
      : null;
  });
assert(split);
assert(split.chatX < split.computerX);
assert(split.chatWidth > 250 && split.computerWidth > 250);

await desktopPage
  .locator('[data-workflow="account-brief"] .job-live-demo')
  .screenshot({ path: `${outputDirectory}/desktop-workflow.png` });
await desktopPage.screenshot({
  path: `${outputDirectory}/desktop-page.png`,
  fullPage: true,
});

await desktopPage.locator(".site-footer").scrollIntoViewIfNeeded();
await desktopPage.getByText("Sean Middleton", { exact: true }).waitFor();
const desktopOverflow = await inspectNoOverflow(desktopPage);
await desktop.close();

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
});
const mobilePage = await mobile.newPage();
await signIn(mobilePage);
const mobileHero = await inspectHero(mobilePage);
await mobilePage.screenshot({
  path: `${outputDirectory}/mobile-hero.png`,
  fullPage: false,
});

const mobileSection = mobilePage.locator('[data-workflow="call-follow-up"]');
await mobileSection.locator(".job-live-demo").scrollIntoViewIfNeeded();
await mobilePage.waitForFunction(
  () =>
    document
      .querySelector(
        '[data-workflow="call-follow-up"] .demo-tools > button',
      )
      ?.textContent?.trim() === "Replay",
  undefined,
  { timeout: 25000 },
);
await mobileSection
  .getByRole("button", { name: "Show computer", exact: true })
  .click();
const mobileArtifact = mobileSection.locator(
  '.pc-phone [data-artifact-state="complete"]',
);
await mobileArtifact.waitFor({ state: "visible" });
assert((await mobileArtifact.innerText()).includes("Customer follow-up"));

await mobileSection
  .locator(".job-live-demo")
  .screenshot({ path: `${outputDirectory}/mobile-workflow.png` });
await mobilePage.screenshot({
  path: `${outputDirectory}/mobile-page.png`,
  fullPage: true,
});
const mobileOverflow = await inspectNoOverflow(mobilePage);
await mobile.close();
await browser.close();

console.log(
  JSON.stringify(
    {
      outputDirectory,
      desktopHero,
      mobileHero,
      split,
      artifactTitles,
      desktopOverflow,
      mobileOverflow,
    },
    null,
    2,
  ),
);
