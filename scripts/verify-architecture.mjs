import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

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
  "src/lib/startHeroTelemetry.ts",
  "src/lib/hero-telemetry.wgsl",
  "src/wgsl-env.d.ts",
];
const removedFiles = [
  "app",
  "lib",
  "proxy.ts",
  "src/components/QuoteWall.tsx",
  "src/components/HeardSlide.tsx",
  "src/data/quotes.ts",
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
  page.includes("Sean Middleton") &&
    page.includes("sean.middleton@cursor.com"),
  "footer must name Sean Middleton and his email",
);

const brand = read("src/components/BrandLockup.tsx");
check(
  brand.includes("/brand/netapp-wordmark.svg") &&
    brand.includes("/brand/spacexai.svg"),
  "lockup must pair the NetApp and SpaceXAI wordmarks",
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
