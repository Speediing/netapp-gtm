export type HeroJobIcon =
  | "outbound"
  | "research"
  | "follow-up"
  | "deal-desk"
  | "pipeline"
  | "renewal"
  | "competitive"
  | "chief-of-staff";

export type HeroJob = {
  name: string;
  icon: HeroJobIcon;
  account: string;
  signal: string;
  work: string;
  result: string;
  user: string;
  bot: string;
};

export const HERO_JOBS: readonly HeroJob[] = [
  {
    name: "Sales Outbound",
    icon: "outbound",
    account: "Harbor Ridge Labs",
    signal: "New data platform roles posted",
    work: "I found the open roles, the storage team, and a public note about file growth. I drafted outreach for you to review. Nothing leaves the queue until you say so.",
    result: "Outreach drafts ready for review",
    user: "these drafts look good, send them",
    bot: "sending the ones you approved. the rest stay queued.",
  },
  {
    name: "Account Research",
    icon: "research",
    account: "Silverbrook Health",
    signal: "Public file storage project noted",
    work: "I collected public pages and approved account notes, then drafted a short brief with known facts and open questions for you to check.",
    result: "Account brief ready for review",
    user: "brief me before the call",
    bot: "draft is in your thread. i will keep the brief current.",
  },
  {
    name: "Call Follow-up",
    icon: "follow-up",
    account: "Maplewood Energy discovery",
    signal: "Customer call ended",
    work: "I organized the approved notes, listed open questions, and drafted a recap with owners and next steps. The recap stays a draft until you send it.",
    result: "Recap draft ready for review",
    user: "send the recap after I check it",
    bot: "parked as a draft. say when to send.",
  },
  {
    name: "Deal Desk",
    icon: "deal-desk",
    account: "Oakline Logistics",
    signal: "Security questionnaire received",
    work: "I pulled approved product, legal, and security answers, then drafted a response with source links. Open items stay marked for review.",
    result: "Questionnaire draft ready for review",
    user: "route the open items to legal",
    bot: "routed for review. the supported answers stay ready.",
  },
  {
    name: "Pipeline Health",
    icon: "pipeline",
    account: "Enterprise data pipeline",
    signal: "Open opportunities slowed down",
    work: "I reviewed recent activity and stage notes, then drafted the missing next step on each opportunity so you can check it before anyone is briefed.",
    result: "Recovery notes ready for review",
    user: "brief the account owners",
    bot: "briefs are ready as drafts. i will watch for movement.",
  },
  {
    name: "Renewal Risk",
    icon: "renewal",
    account: "Pinecrest Media",
    signal: "Support notes dropped on the account",
    work: "I compared recent support notes with the renewal window and drafted a recovery brief for the account team to review.",
    result: "Renewal brief ready for review",
    user: "share this with the account team",
    bot: "shared as a draft. i will flag new changes.",
  },
  {
    name: "Competitive Intel",
    icon: "competitive",
    account: "Riverbend Retail",
    signal: "Competitor named on the call",
    work: "I captured the concern from the notes, matched it to approved talk tracks, and drafted a response for this buyer.",
    result: "Competitive talk track ready for review",
    user: "add it to tomorrow's call brief",
    bot: "added to the brief. nothing was sent outside the team.",
  },
  {
    name: "Sales Chief of Staff",
    icon: "chief-of-staff",
    account: "Weekly operating review",
    signal: "Open decisions still need owners",
    work: "I gathered pipeline notes, forecast questions, and team commitments, then drafted the decisions that need attention this week.",
    result: "Leadership brief ready for review",
    user: "send it to the leadership team",
    bot: "draft is ready. i will start next week's tracker.",
  },
];
