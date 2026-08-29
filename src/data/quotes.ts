type Quote = {
  name: string;
  handle: string;
  date: string;
  avatar: string;
  quote: string;
  source: string;
};

export const QUOTES = [
  {
    name: "Naval",
    handle: "@naval",
    date: "2026-08-20",
    avatar: "/avatars/naval.jpg",
    quote:
      "Grok Bot is just cool. 😎\nOf course an agent should be persistent.\nOf course it should have its own computer.\nAll that remains is for it to be embodied…",
    source: "https://x.com/naval/status/2090497355649008059",
  },
  {
    name: "Austen Allred",
    handle: "@Austen",
    date: "2026-08-12",
    avatar: "/avatars/austen.jpg",
    quote:
      "Maybe it's just because it's new and shiny but I'm obsessed with with Grok Bot.\nThe form factor is so fun, especially when combined with text to speech. You can FLY.\nAutomations just work, cross-bot messaging works perfectly (I do most everything through my \"chief of staff\").",
    source: "https://x.com/Austen/status/2087685264617406963",
  },
  {
    name: "Alex Finn",
    handle: "@AlexFinn",
    date: "2026-08-17",
    avatar: "/avatars/alexfinn.jpg",
    quote:
      "Grok Bot is the best AI agent right now\nIt gives you an army of agents that can do work for you around the clock 24/7\nIf you set it up correctly, you gain super powers\nIn this video I cover setting up Grok Bot, use cases, plugins, and what makes Grok Bot so good:",
    source: "https://x.com/AlexFinn/status/2089505950470459659",
  },
  {
    name: "Lenny Rachitsky",
    handle: "@lennysan",
    date: "2026-08-11",
    avatar: "/avatars/lennysan.jpg",
    quote:
      "I got early access to Grok Bot and I'm hooked.\nI haven't been this excited about a new AI product in a while.\nIt's like OpenClaw, but super easy, reliable, and less scary to use. I think this will be a huge new product line for Cursor/Grok/SpaceX.\nI've already found so many ways to use it that have meaningfully made my life better:\n1. Matchmaking people looking for jobs with companies who are hiring (see below)\n2. Auto-replying to support emails (saves me hours!)\n3. Scanning my credit card statements and finding recurring subscriptions to cancel\n4. Sending me (really good!) briefs for upcoming podcast guests\nSee below for my actual set of agents that I've been using and chat with daily.\nGreat work on this team Grok Bot.\n(I'm not an investor in this, nor do I have any ties to this product/company. I'm just a fan!)",
    source: "https://x.com/lennysan/status/2087241423792087518",
  },
  {
    name: "Gergely Orosz",
    handle: "@GergelyOrosz",
    date: "2026-08-20",
    avatar: "/avatars/gergelyorosz.jpg",
    quote:
      "I continue be surprised how Grok Bot is very good by doing so many things right (not innovating!) Commecting several Gmail accounts / Slack accounts etc is one of these.\nAnd yes no other *managed* agent (eg Codex, Claude Cowork) supports this which is just strange. Like, why?",
    source: "https://x.com/GergelyOrosz/status/2090353329771631080",
  },
  {
    name: "Yun-Ta Tsai",
    handle: "@yunta_tsai",
    date: "2026-08-12",
    avatar: "/avatars/yunta_tsai.jpg",
    quote:
      "Grok Bot was able to a) go through the calendars and find out anything I need to make reservations for beforehand that I haven’t done yet, b) determine the best time to make reservations, and c) navigate the reservations on a website.\nWhile I was walking in the parking lot before getting to my cars, I was talking to it in mixed Chinese and English.\nColor me impressed.",
    source: "https://x.com/yunta_tsai/status/2087415205756391461",
  },
] as const satisfies readonly Quote[];
