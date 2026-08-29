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
  const lockup = page.locator(".brand-netapp").first();

  await image.waitFor({ state: "visible" });
  await page.waitForFunction(
    () => {
      const element = document.querySelector(".hero-watercolor-image");
      return (
        element instanceof HTMLImageElement &&
        element.complete &&
        element.naturalWidth > 0
      );
    },
    undefined,
    { timeout: 10000 },
  );
  const imageState = await image.evaluate((element) => ({
    complete: element.complete,
    naturalWidth: element.naturalWidth,
    naturalHeight: element.naturalHeight,
    box: element.getBoundingClientRect().toJSON(),
  }));
  assert(
    imageState.complete &&
      imageState.naturalWidth > 0 &&
      imageState.naturalHeight > 0,
  );
  assert(imageState.box.height > 500);

  const lockupHeight = await lockup.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  assert(lockupHeight >= 15 && lockupHeight <= 18);

  return { imageState, lockupHeight };
}

function readHeroThread(page) {
  return page.evaluate(() => {
    const header = document.querySelector(".hero-phone-header strong");
    const metas = [
      ...document.querySelectorAll(".hero-phone-work-meta"),
    ].map((element) => element.textContent ?? "");
    const thread = document.querySelector(".hero-phone-thread");
    return {
      agent: header?.textContent ?? "",
      account: metas[0] ?? "",
      signal: metas[1] ?? "",
      thread: thread?.textContent ?? "",
    };
  });
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

const desktopPills = desktopPage.locator(".hero-phone-jobs button");
assert.equal(await desktopPills.count(), 8);

const desktopLayout = await desktopPage.locator(".hero").evaluate((hero) => {
  const copy = hero.querySelector(".hero-copy")?.getBoundingClientRect();
  const pills = hero.querySelector(".hero-phone-jobs")?.getBoundingClientRect();
  const phone = hero.querySelector(".hero-phone")?.getBoundingClientRect();
  return copy && pills && phone
    ? {
        copyX: copy.x,
        copyRight: copy.right,
        pillsX: pills.x,
        phoneX: phone.x,
        phoneRight: phone.right,
      }
    : null;
});
assert(desktopLayout);
assert(desktopLayout.copyX < desktopLayout.phoneX);
assert(desktopLayout.pillsX < desktopLayout.phoneX);
assert(desktopLayout.copyRight <= desktopLayout.phoneX + 8);

const beforeJob = await readHeroThread(desktopPage);
assert.equal(await desktopPills.nth(0).getAttribute("aria-pressed"), "true");
await desktopPills.nth(1).click();
assert.equal(await desktopPills.nth(1).getAttribute("aria-pressed"), "true");
assert.equal(await desktopPills.nth(0).getAttribute("aria-pressed"), "false");
const afterJob = await readHeroThread(desktopPage);
assert.notEqual(afterJob.agent, beforeJob.agent);
assert.notEqual(afterJob.account, beforeJob.account);
assert.notEqual(afterJob.signal, beforeJob.signal);
assert.notEqual(afterJob.thread, beforeJob.thread);

await desktopPage.locator(".report-hero").scrollIntoViewIfNeeded();
await desktopPage.locator(".report-hero").screenshot({
  path: `${outputDirectory}/desktop-hero.png`,
});

assert.equal(await desktopPage.locator(".fleet-desk").count(), 3);
assert.equal(await desktopPage.locator(".fleet-computer").count(), 3);
assert.equal(await desktopPage.locator(".story-beat").count(), 9);
assert.equal(await desktopPage.locator(".quote-row").count(), 6);
assert.equal(await desktopPage.locator(".quote-source[href^='https://x.com/']").count(), 6);
assert.equal(
  await desktopPage.locator(
    ".chapter-payoff [data-artifact-state='complete']",
  ).count(),
  3,
);

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

const mobilePills = mobilePage.locator(".hero-phone-jobs button");
assert.equal(await mobilePills.count(), 8);

const mobileLayout = await mobilePage.locator(".hero").evaluate((hero) => {
  const copy = hero.querySelector(".hero-copy")?.getBoundingClientRect();
  const phone = hero.querySelector(".hero-phone")?.getBoundingClientRect();
  const header = hero.querySelector(".hero-phone-header");
  const thread = hero.querySelector(".hero-phone-thread");
  const composer = hero.querySelector(".hero-phone-composer");
  const pills = [...hero.querySelectorAll(".hero-phone-jobs button")].map(
    (button) => {
      const box = button.getBoundingClientRect();
      return { width: box.width, height: box.height };
    },
  );
  return copy && phone
    ? {
        copyBottom: copy.bottom,
        phoneTop: phone.top,
        phoneWidth: phone.width,
        phoneRight: phone.right,
        viewport: window.innerWidth,
        hasHeader: Boolean(header),
        hasThread: Boolean(thread),
        hasComposer: Boolean(composer),
        pills,
      }
    : null;
});
assert(mobileLayout);
assert(mobileLayout.copyBottom <= mobileLayout.phoneTop + 1);
assert(mobileLayout.phoneWidth <= 390);
assert(mobileLayout.phoneRight <= mobileLayout.viewport + 1);
assert(mobileLayout.hasHeader && mobileLayout.hasThread && mobileLayout.hasComposer);
assert.equal(mobileLayout.pills.length, 8);
for (const pill of mobileLayout.pills) {
  assert(pill.width > 20 && pill.height > 16);
}
await mobilePills.nth(2).scrollIntoViewIfNeeded();
await mobilePills.nth(2).click();
assert.equal(await mobilePills.nth(2).getAttribute("aria-pressed"), "true");

await mobilePage.locator(".report-hero").scrollIntoViewIfNeeded();
await mobilePage.locator(".report-hero").screenshot({
  path: `${outputDirectory}/mobile-hero.png`,
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
      desktopLayout,
      afterJob,
      mobileHero,
      mobileLayout,
      split,
      artifactTitles,
      desktopOverflow,
      mobileOverflow,
    },
    null,
    2,
  ),
);
