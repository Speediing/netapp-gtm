import type { JobId } from "./types";

export type SiteKind =
  | "meeting"
  | "inbox"
  | "sources"
  | "research"
  | "workspace"
  | "artifact";

export type ChromeTab = {
  id: string;
  host: string;
  label: string;
};

export type ComputerBeat = {
  pill: string;
  host: string;
  path?: string;
  title: string;
  site: SiteKind;
  tabs: ChromeTab[];
};

const meeting = { id: "meeting", host: "granola.app", label: "Notes" };
const docs = { id: "docs", host: "docs.google.com", label: "Docs" };
const gmail = { id: "gmail", host: "mail.google.com", label: "Gmail" };
const sources = {
  id: "sources",
  host: "www.netapp.com",
  label: "Sources",
};
const research = { id: "research", host: "www.google.com", label: "Research" };

export const SCREENS: Record<JobId, Record<string, ComputerBeat>> = {
  "call-follow-up": {
    m1: {
      pill: "Opening approved meeting notes",
      host: "granola.app",
      path: "/notes/sample-call",
      title: "Sample customer call",
      site: "meeting",
      tabs: [meeting, sources, docs],
    },
    m2: {
      pill: "Organizing requirements and questions",
      host: "granola.app",
      path: "/notes/sample-call",
      title: "Meeting record",
      site: "meeting",
      tabs: [meeting, sources, docs],
    },
    m3: {
      pill: "Linking approved source material",
      host: "www.netapp.com",
      path: "/products/",
      title: "Approved source review",
      site: "sources",
      tabs: [meeting, sources, docs],
    },
    m4: {
      pill: "Completed follow-up open for review",
      host: "docs.google.com",
      path: "/document/d/customer-follow-up",
      title: "Customer follow-up",
      site: "artifact",
      tabs: [meeting, sources, docs],
    },
  },
  "sourced-answer": {
    m1: {
      pill: "Opening the customer request",
      host: "mail.google.com",
      path: "/mail/u/0/#inbox",
      title: "Customer request",
      site: "inbox",
      tabs: [gmail, sources, docs],
    },
    m2: {
      pill: "Checking approved sources",
      host: "www.netapp.com",
      path: "/products/",
      title: "Source library",
      site: "sources",
      tabs: [gmail, sources, docs],
    },
    m3: {
      pill: "Drafting supported answers",
      host: "docs.google.com",
      path: "/document/d/sourced-response",
      title: "Response workspace",
      site: "workspace",
      tabs: [gmail, sources, docs],
    },
    m4: {
      pill: "Completed response open for review",
      host: "docs.google.com",
      path: "/document/d/sourced-response",
      title: "Sourced customer response",
      site: "artifact",
      tabs: [gmail, sources, docs],
    },
  },
  "account-brief": {
    m1: {
      pill: "Collecting public and approved sources",
      host: "www.google.com",
      path: "/search?q=sample+account",
      title: "Account research",
      site: "research",
      tabs: [research, sources, docs],
    },
    m2: {
      pill: "Separating known context from questions",
      host: "docs.google.com",
      path: "/document/d/account-research",
      title: "Account research",
      site: "research",
      tabs: [research, sources, docs],
    },
    m3: {
      pill: "Drafting the account view",
      host: "docs.google.com",
      path: "/document/d/account-brief",
      title: "Account brief workspace",
      site: "workspace",
      tabs: [research, sources, docs],
    },
    m4: {
      pill: "Completed account brief open for review",
      host: "docs.google.com",
      path: "/document/d/account-brief",
      title: "Sourced account brief",
      site: "artifact",
      tabs: [research, sources, docs],
    },
  },
};

export function beatFor(
  jobId: JobId,
  messageId: string | undefined,
): ComputerBeat | undefined {
  if (!messageId) return undefined;
  return SCREENS[jobId]?.[messageId];
}
