import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const root = process.cwd();
const failures = [];
const requiredFiles = [
  "src/app/(protected)/layout.tsx",
  "src/app/(public)/login/page.tsx",
  "src/app/api/media/[...path]/route.ts",
  "src/components/Storyboard.tsx",
  "src/components/JobDemo.tsx",
  "src/components/GrokBotWindow.tsx",
  "src/components/BotComputer.tsx",
  "src/components/HeroTelemetry.tsx",
  "src/components/HeroDemo.tsx",
  "src/components/QuoteWall.tsx",
  "src/data/hero-jobs.ts",
  "src/data/quotes.ts",
  "src/lib/startHeroTelemetry.ts",
  "src/lib/hero-telemetry.wgsl",
  "src/wgsl-env.d.ts",
];
const removedFiles = [
  "app",
  "lib",
  "proxy.ts",
  "src/components/HeardSlide.tsx",
];
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".wgsl",
  ".yml",
  ".yaml",
]);
const forbidden = [
  {
    label: "prior customer name",
    expression: new RegExp(`\\b${["data", "dog"].join("")}\\b`, "i"),
  },
  {
    label: "prior reference customer",
    expression: new RegExp(`\\b${["sea", "gate"].join("")}\\b`, "i"),
  },
  {
    label: "source account fixture",
    expression: new RegExp(`\\b${["ac", "me"].join("")}\\b`, "i"),
  },
  {
    label: "source product fixture",
    expression: new RegExp(`\\b${["bits", " ai"].join("")}\\b`, "i"),
  },
  {
    label: "source product fixture",
    expression: new RegExp(`\\b${["cloud", " siem"].join("")}\\b`, "i"),
  },
  {
    label: "source product fixture",
    expression: new RegExp(`\\b${["a", "pm"].join("")}\\b`, "i"),
  },
  {
    label: "source product fixture",
    expression: new RegExp(`\\b${["r", "um"].join("")}\\b`, "i"),
  },
  {
    label: "source incident fixture",
    expression: new RegExp(`\\b${["sev", "-2"].join("")}\\b`, "i"),
  },
  {
    label: "source person fixture",
    expression: new RegExp(
      `\\b(?:${[
        ["pri", "ya"].join(""),
        ["jor", "dan"].join(""),
        ["chris", " okonkwo"].join(""),
        ["made", "line"].join(""),
        ["kri", "sta"].join(""),
      ].join("|")})\\b`,
      "i",
    ),
  },
  {
    label: "source account owner",
    expression: new RegExp(["jason", "wiker"].join(""), "i"),
  },
  {
    label: "source password",
    expression: new RegExp(["land", "2", "expand"].join(""), "i"),
  },
  {
    label: "retired accent color",
    expression: new RegExp(["#", "632", "ca6"].join(""), "i"),
  },
  {
    label: "retired accent color",
    expression: new RegExp(["#", "4c1", "d82"].join(""), "i"),
  },
  {
    label: "source watercolor filename",
    expression: new RegExp(
      `watercolor-(?:${["pad", "orbit", "room", "deal", "attach"].join("|")})`,
      "i",
    ),
  },
  {
    label: "source slide asset",
    expression: new RegExp(["where", "-cursor-fits"].join(""), "i"),
  },
  {
    label: "omitted section",
    expression: new RegExp(["what", " we ", "heard"].join(""), "i"),
  },
  {
    label: "em dash",
    expression: /\u2014/,
  },
  {
    label: "en dash",
    expression: /\u2013/,
  },
];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

for (const file of requiredFiles) {
  check(existsSync(join(root, file)), `missing required architecture file: ${file}`);
}

for (const file of removedFiles) {
  check(!existsSync(join(root, file)), `obsolete file still exists: ${file}`);
}

const packageJson = JSON.parse(read("package.json"));
check(packageJson.name === "netapp-gtm", "package name must be netapp-gtm");
check(packageJson.dependencies?.next === "15.5.24", "Next must stay at 15.5.24");
check(packageJson.dependencies?.geist === "^1.7.2", "Geist must stay at ^1.7.2");
check(packageJson.dependencies?.vgpu === "^0.3.1", "vGPU must stay at ^0.3.1");
check(
  !packageJson.dependencies?.["lucide-react"] &&
    !packageJson.devDependencies?.["lucide-react"],
  "lucide-react must not be added",
);

const nextConfig = read("next.config.ts");
for (const token of ["vgpu", "@vgpu/wgsl/loader-webpack", "*.wgsl"]) {
  check(nextConfig.includes(token), `Next config lost ${token}`);
}

const protectedLayout = read("src/app/(protected)/layout.tsx");
check(
  protectedLayout.includes("requireSiteAccess"),
  "protected layout must call requireSiteAccess",
);

const mediaRoute = read("src/app/api/media/[...path]/route.ts");
check(
  mediaRoute.includes("isValidSession") &&
    mediaRoute.includes('join(process.cwd(), "private", "media")'),
  "media route must keep session validation and private media root",
);

const page = read("src/app/(protected)/page.tsx");
check(page.includes("<HeroTelemetry"), "protected page must render HeroTelemetry");
check(
  page.includes("netapp-watercolor-header.jpg"),
  "protected page must use the approved NetApp watercolor",
);
check(
  page.includes('from "@/components/HeroDemo"') && page.includes("<HeroDemo"),
  "protected page must import and render HeroDemo",
);
check(!page.includes("hero-copy"), "protected page must not contain hero-copy");
check(
  !page.includes("A proactive agent for every NetApp seller") &&
    !page.includes("The agents that work while your reps sell.") &&
    !page.includes("Work triggers it, not another prompt."),
  "protected page must not duplicate hero copy",
);
check(
  page.includes("Sean Middleton") &&
    page.includes("sean.middleton@cursor.com"),
  "footer must name Sean Middleton and his email",
);
check(page.includes("<QuoteWall"), "protected page must keep the quote wall");

const heroJobsPath = "src/data/hero-jobs.ts";
const heroDemoPath = "src/components/HeroDemo.tsx";
check(existsSync(join(root, heroJobsPath)), `missing ${heroJobsPath}`);
check(existsSync(join(root, heroDemoPath)), `missing ${heroDemoPath}`);

const heroJobsSource = read(heroJobsPath);
const heroJobsAst = ts.createSourceFile(
  heroJobsPath,
  heroJobsSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);
const iconKinds = [
  "outbound",
  "research",
  "follow-up",
  "deal-desk",
  "pipeline",
  "renewal",
  "competitive",
  "chief-of-staff",
];
const requiredJobKeys = [
  "name",
  "icon",
  "account",
  "signal",
  "work",
  "result",
  "user",
  "bot",
];

function unwrapHeroJobsInitializer(node) {
  let current = node;
  while (current) {
    const isAssertion =
      ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isParenthesizedExpression(current) ||
      (typeof ts.isTypeAssertionExpression === "function" &&
        ts.isTypeAssertionExpression(current));
    if (!isAssertion) break;
    current = current.expression;
  }
  return current;
}

let heroJobsInitializer;
heroJobsAst.forEachChild(function visit(node) {
  if (ts.isVariableStatement(node)) {
    for (const declaration of node.declarationList.declarations) {
      if (declaration.name.getText(heroJobsAst) === "HERO_JOBS") {
        heroJobsInitializer = unwrapHeroJobsInitializer(declaration.initializer);
      }
    }
  }
  ts.forEachChild(node, visit);
});

check(
  heroJobsInitializer && ts.isArrayLiteralExpression(heroJobsInitializer),
  "HERO_JOBS must be an array literal",
);
if (heroJobsInitializer && ts.isArrayLiteralExpression(heroJobsInitializer)) {
  check(
    heroJobsInitializer.elements.length === 8,
    "HERO_JOBS must have exactly eight records",
  );
  const seenIcons = [];
  for (const element of heroJobsInitializer.elements) {
    check(
      ts.isObjectLiteralExpression(element),
      "each HERO_JOBS record must be an object literal",
    );
    if (!ts.isObjectLiteralExpression(element)) continue;
    const keys = new Set();
    for (const property of element.properties) {
      if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) {
        continue;
      }
      keys.add(property.name.text);
      if (property.name.text === "icon" && ts.isStringLiteral(property.initializer)) {
        seenIcons.push(property.initializer.text);
      }
    }
    for (const key of requiredJobKeys) {
      check(keys.has(key), `HERO_JOBS record missing ${key}`);
    }
  }
  check(
    seenIcons.length === 8 && iconKinds.every((kind) => seenIcons.includes(kind)),
    "HERO_JOBS must include one record for each job icon",
  );
}

const heroDemo = read(heroDemoPath);
check(heroDemo.includes('"use client"'), "HeroDemo must be a client component");
check(
  heroDemo.includes("export function HeroDemo"),
  "HeroDemo must export function HeroDemo",
);
check(
  heroDemo.includes('from "@/data/hero-jobs"') && heroDemo.includes("HERO_JOBS"),
  "HeroDemo must import HERO_JOBS",
);
check(heroDemo.includes("HERO_JOBS.map"), "HeroDemo must map HERO_JOBS");
check(heroDemo.includes('className="hero-copy"'), "HeroDemo must own hero-copy");
check(heroDemo.includes('className="eyebrow"'), "HeroDemo must own the eyebrow");
check(heroDemo.includes("<h1>"), "HeroDemo must own the headline");
check(heroDemo.includes('className="hero-intro"'), "HeroDemo must own the intro");
check(
  heroDemo.includes('className="hero-phone-jobs"'),
  "HeroDemo must own the pills",
);
check(heroDemo.includes('className="hero-phone"'), "HeroDemo must own the phone");
check(
  /className="hero-phone-thread"[\s\S]*key=\{job\.name\}|key=\{job\.name\}[\s\S]*className="hero-phone-thread"/.test(
    heroDemo,
  ),
  "hero thread must be keyed by job.name",
);

const css = read("src/app/globals.css");
const requiredCss = [
  ".report-hero",
  ".hero",
  ".hero-copy",
  ".hero-phone-jobs",
  ".hero-phone-jobs button",
  ".hero-phone-jobs button:hover",
  ".hero-phone-jobs button.is-active",
  ".hero-phone-jobs button span",
  ".hero-phone-jobs button span svg",
  ".hero-bot-demo",
  ".hero-bot-demo:after",
  ".hero-bot-demo:before",
  ".hero-phone",
  ".hero-phone:after",
  ".hero-phone-notch",
  ".hero-phone-header",
  ".hero-phone-header > span",
  ".hero-phone-header svg",
  ".hero-phone-header .hero-phone-back",
  ".hero-phone-header .hero-phone-agent",
  ".hero-phone-header .hero-phone-agent svg",
  ".hero-phone-header .hero-phone-desktop",
  ".hero-phone-header p",
  ".hero-phone-header strong",
  ".hero-phone-header small",
  ".hero-phone-header small span",
  ".hero-phone-thread",
  ".hero-phone-work",
  ".hero-phone-work p",
  ".hero-phone-work-label",
  ".hero-phone-work-meta",
  ".hero-phone-work-meta span",
  ".hero-phone-work .hero-phone-work-copy",
  ".hero-phone-work > strong",
  ".hero-phone-message",
  ".hero-phone-message.is-user",
  ".hero-phone-message.is-bot",
  ".hero-phone-composer",
  ".hero-phone-composer > span:first-child",
  ".hero-phone-composer p",
  ".hero-phone-composer > span:last-child",
  ".hero-phone-composer svg",
  "@keyframes hero-demo-enter",
  "@keyframes hero-phone-work",
  "@keyframes hero-phone-message",
  "@keyframes hero-phone-reply",
  "@keyframes agent-pulse",
  "grid-template-columns: minmax(0, 1fr) minmax(17rem, 22rem)",
  "@media (max-width: 800px)",
  "@media (max-width: 640px)",
  "@media (prefers-reduced-motion: reduce)",
];
const compactCss = css.replace(/\s+/g, " ");
for (const token of requiredCss) {
  const compactToken = token.replace(/\s+/g, " ");
  check(
    css.includes(token) || compactCss.includes(compactToken),
    `globals.css missing ${token}`,
  );
}
check(
  /@media \(max-width:\s*800px\)[\s\S]*\.hero-bot-demo[\s\S]*justify-self:\s*center/.test(
    css,
  ),
  "800px hero must center the phone column",
);
check(
  /@media \(max-width:\s*800px\)[\s\S]*\.hero[\s\S]*grid-template-columns:\s*1fr/.test(
    css,
  ),
  "800px hero must stack copy above the phone",
);
check(
  /@media \(max-width:\s*640px\)[\s\S]*\.hero-phone[\s\S]*max-width:/.test(css),
  "640px hero must keep the phone within the viewport",
);
check(
  /prefers-reduced-motion:\s*reduce[\s\S]*\.hero-bot-demo[\s\S]*animation:\s*none/.test(
    css,
  ),
  "hero reduced-motion must disable phone animations",
);

const brand = read("src/components/BrandLockup.tsx");
check(
  brand.includes("/brand/netapp-wordmark.svg") &&
    brand.includes("/brand/spacexai.svg"),
  "lockup must pair the NetApp and SpaceXAI wordmarks",
);

const quoteWall = read("src/components/QuoteWall.tsx");
check(
  quoteWall.includes("QUOTES.map") &&
    quoteWall.includes('className="quote-thread"') &&
    quoteWall.includes('className="quote-row"'),
  "quote wall must render the sourced quote registry",
);

const chain = {
  "src/components/JobSection.tsx": ["Storyboard", "JobDemo"],
  "src/components/JobDemo.tsx": ["GrokBotWindow"],
  "src/components/GrokBotWindow.tsx": ["BotComputer"],
};
for (const [file, tokens] of Object.entries(chain)) {
  const source = read(file);
  for (const token of tokens) {
    check(source.includes(token), `${file} must keep ${token} in the scene chain`);
  }
}

const shader = read("src/lib/startHeroTelemetry.ts");
check(
  shader.includes('from "vgpu"') && shader.includes("frameLoop"),
  "hero telemetry must keep the vGPU frame loop",
);

const auth = read("src/lib/auth.ts");
check(
  auth.includes("process.env.SITE_PASSWORD"),
  "auth must read SITE_PASSWORD from the environment",
);
check(
  !auth.includes('|| "') && !auth.includes('?? "'),
  "auth must not include a password fallback",
);

const wordmarkPath = join(root, "public/brand/netapp-wordmark.svg");
if (existsSync(wordmarkPath)) {
  const digest = createHash("sha256")
    .update(readFileSync(wordmarkPath))
    .digest("hex");
  check(
    digest === "2c0b02a5117ab6c5dd833a4a2bc1e9bd025e9b065a6f03626902e8bb2438d1ff",
    "NetApp wordmark does not match the approved official asset",
  );
} else {
  failures.push("missing official NetApp wordmark");
}

const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
  cwd: root,
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);
const secret = process.env.SITE_PASSWORD?.trim();

for (const file of trackedFiles) {
  for (const rule of forbidden) {
    if (rule.expression.test(file)) {
      failures.push(`${file}: filename contains ${rule.label}`);
    }
  }

  if (!textExtensions.has(extname(file).toLowerCase())) continue;
  const source = read(file);
  for (const rule of forbidden) {
    if (rule.expression.test(source)) {
      failures.push(`${file}: contains ${rule.label}`);
    }
  }
  if (secret && source.includes(secret)) {
    failures.push(`${file}: contains SITE_PASSWORD value`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Architecture and residue checks passed.");
