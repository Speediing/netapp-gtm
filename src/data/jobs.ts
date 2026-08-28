import type {
  AccountArtifact,
  AnswerArtifact,
  BriefArtifact,
  GtmJob,
} from "./types";

export const CALL_FOLLOW_UP: BriefArtifact = {
  kind: "brief",
  title: "Customer follow-up",
  status: "Complete draft",
  sections: [
    {
      heading: "Meeting record",
      body: "Organized from approved notes and kept separate from assumptions.",
    },
    {
      heading: "Supported answers",
      body: "Each answer links to approved NetApp material. Items without support stay open.",
    },
    {
      heading: "Next meeting",
      body: "A draft agenda groups open questions, owners, and decisions for the seller to review.",
    },
  ],
};

export const SOURCED_RESPONSE: AnswerArtifact = {
  kind: "answer",
  title: "Sourced customer response",
  status: "Complete draft",
  checks: [
    {
      question: "Product fit",
      state: "Ready",
      source: "Approved NetApp product material",
    },
    {
      question: "Security detail",
      state: "Needs review",
      source: "Approved security guidance",
    },
    {
      question: "Account context",
      state: "Ready",
      source: "Approved account record",
    },
  ],
  reply: {
    to: "Customer team",
    subject: "Follow-up with source links",
    body: "I drafted the supported answers and linked each source. The open security item stays marked for review. Nothing will be sent until the account owner approves it.",
  },
};

export const ACCOUNT_BRIEF: AccountArtifact = {
  kind: "account",
  title: "Sourced account brief",
  account: "Sample account",
  status: "Complete draft",
  sources: [
    {
      label: "Public company pages",
      finding: "Current source links are collected for the seller to check.",
    },
    {
      label: "Approved account notes",
      finding: "Known context is separated from open questions.",
    },
    {
      label: "NetApp product material",
      finding: "Possible areas to explore are labeled as draft ideas.",
    },
  ],
  audiences: [
    {
      role: "Infrastructure leader",
      reason: "May own the data platform plan.",
    },
    {
      role: "Data platform lead",
      reason: "May know the current operating model.",
    },
    {
      role: "Procurement partner",
      reason: "May guide the review path.",
    },
  ],
  outreach: {
    subject: "A question for your data infrastructure plan",
    body: "I pulled a short brief from public and approved sources. It lists what is known, what still needs a call, and where NetApp may be relevant. Open to a short review?",
  },
};

export const JOBS: GtmJob[] = [
  {
    id: "call-follow-up",
    number: 1,
    title: "Turn a live call into the next draft",
    trigger: "A customer call starts",
    backgroundAction: "following approved notes and updating the open follow-up",
    outcome:
      "The seller leaves with a structured follow-up, source links, and open questions ready to review.",
    agent: {
      name: "Call agent",
      activity: "Organizing notes and building the follow-up",
      tools: ["Meeting notes", "NetApp docs", "Draft"],
      color: "#4f86c6",
    },
    storyboard: [
      {
        when: "Call begins",
        label: "The agent joins the approved meeting record.",
        scene: "call",
        visual: {
          kind: "live-call",
          title: "Sample customer call",
          people: [
            { initials: "AE", role: "Account executive" },
            { initials: "SE", role: "Solutions engineer" },
            { initials: "CL", role: "Customer lead" },
          ],
        },
      },
      {
        when: "During the call",
        label: "Requirements and open questions are organized as they appear.",
        scene: "notes",
        visual: {
          kind: "live-note",
          title: "Approved meeting notes",
          summary:
            "Requirements are grouped by topic. Unclear points stay marked as questions.",
          signals: ["Requirement", "Open question", "Next step"],
        },
      },
      {
        when: "Before the call ends",
        label: "The agent checks approved material and builds the follow-up.",
        scene: "sources",
        visual: {
          kind: "work-progress",
          app: "Source review",
          task: "Linking supported answers",
          status: "Draft in progress",
        },
      },
      {
        when: "Ready for review",
        label: "The completed follow-up stays open for the seller.",
        scene: "draft",
        artifact: CALL_FOLLOW_UP,
      },
    ],
    demo: {
      title: "Call agent",
      subtitle: "Meeting record to customer follow-up",
      participants: [
        { id: "you", name: "You", role: "you" },
        { id: "call", name: "Call agent", role: "bot", color: "#4f86c6" },
      ],
      messages: [
        {
          id: "m1",
          from: "call",
          kind: "routine",
          body: "A customer call started. I am following the approved meeting record and keeping assumptions out.",
        },
        {
          id: "m2",
          from: "call",
          kind: "text",
          body: "I grouped the requirements and marked the open questions. I am checking approved NetApp material next.",
        },
        {
          id: "m3",
          from: "call",
          kind: "text",
          body: "The source links are attached. Unsupported points remain open for the account team.",
        },
        {
          id: "m4",
          from: "call",
          kind: "draft",
          draftLabel: "Customer follow-up complete",
          artifact: CALL_FOLLOW_UP,
        },
      ],
    },
  },
  {
    id: "sourced-answer",
    number: 2,
    title: "Answer a customer question with sources",
    trigger: "A product or process question lands",
    backgroundAction: "checking approved sources and drafting a response",
    outcome:
      "The seller gets a sourced answer, while unsupported items stay with the right reviewer.",
    agent: {
      name: "Answer agent",
      activity: "Checking sources and preparing the reply",
      tools: ["Inbox", "Source library", "Draft"],
      color: "#d47668",
    },
    storyboard: [
      {
        when: "Request arrives",
        label: "The agent opens the request and separates each question.",
        scene: "notes",
        visual: {
          kind: "request-inbox",
          sender: "Customer team",
          subject: "Product and security follow-up",
          items: ["Product fit", "Security detail", "Account context"],
        },
      },
      {
        when: "Source check",
        label: "Approved product, security, and account sources are checked.",
        scene: "sources",
        visual: {
          kind: "source-review",
          sources: [
            { name: "NetApp product material", status: "Linked" },
            { name: "Security guidance", status: "Review needed" },
            { name: "Account record", status: "Linked" },
          ],
          state: "No unsupported answer added",
        },
      },
      {
        when: "Drafting",
        label: "Supported answers go into the reply. The open item stays marked.",
        scene: "draft",
        visual: {
          kind: "draft-ready",
          title: "Customer response",
          detail: "Source links beside each supported answer",
          status: "Waiting for review",
        },
      },
      {
        when: "Ready for review",
        label: "The completed response remains a draft.",
        scene: "send",
        artifact: SOURCED_RESPONSE,
      },
    ],
    demo: {
      title: "Answer agent",
      subtitle: "Customer request to sourced response",
      participants: [
        { id: "you", name: "You", role: "you" },
        {
          id: "answer",
          name: "Answer agent",
          role: "bot",
          color: "#d47668",
        },
      ],
      messages: [
        {
          id: "m1",
          from: "answer",
          kind: "routine",
          body: "A customer request arrived. I separated the questions and opened the approved source library.",
        },
        {
          id: "m2",
          from: "answer",
          kind: "text",
          body: "The product and account answers have sources. The security detail still needs review.",
        },
        {
          id: "m3",
          from: "answer",
          kind: "text",
          body: "I kept the open item visible and drafted only the supported response.",
        },
        {
          id: "m4",
          from: "answer",
          kind: "draft",
          draftLabel: "Sourced response complete",
          artifact: SOURCED_RESPONSE,
        },
      ],
    },
  },
  {
    id: "account-brief",
    number: 3,
    title: "Build an account brief before outreach",
    trigger: "A target account enters the list",
    backgroundAction: "collecting source links and drafting an account view",
    outcome:
      "The seller starts with checked sources, clear open questions, and outreach ready to edit.",
    agent: {
      name: "Account agent",
      activity: "Reading sources and preparing the account brief",
      tools: ["Public web", "Account notes", "Draft"],
      color: "#5d7d78",
    },
    storyboard: [
      {
        when: "Account selected",
        label: "The agent opens public and approved account sources.",
        scene: "research",
        visual: {
          kind: "account-research",
          account: "Sample account",
          sources: [
            "Public company pages",
            "Approved account notes",
            "NetApp product material",
          ],
          state: "Sources collected, claims not guessed",
        },
      },
      {
        when: "Evidence organized",
        label: "Known facts, draft ideas, and open questions stay separate.",
        scene: "notes",
        visual: {
          kind: "brief-building",
          sections: ["Known context", "Open questions", "Areas to explore"],
          status: "Source links attached",
        },
      },
      {
        when: "Outreach drafted",
        label: "The agent prepares role-based outreach and an account page.",
        scene: "draft",
        visual: {
          kind: "outreach-ready",
          audience: "Account team review",
          channels: ["Email", "Account page"],
          status: "Drafts only",
        },
      },
      {
        when: "Ready for review",
        label: "The completed account brief shows every source and open question.",
        scene: "send",
        artifact: ACCOUNT_BRIEF,
      },
    ],
    demo: {
      title: "Account agent",
      subtitle: "Source review to account brief",
      participants: [
        { id: "you", name: "You", role: "you" },
        {
          id: "account",
          name: "Account agent",
          role: "bot",
          color: "#5d7d78",
        },
      ],
      messages: [
        {
          id: "m1",
          from: "account",
          kind: "routine",
          body: "Sample account entered the list. I am collecting public and approved sources before I draft anything.",
        },
        {
          id: "m2",
          from: "account",
          kind: "text",
          body: "The source links are organized. Known context and open questions are in separate sections.",
        },
        {
          id: "m3",
          from: "account",
          kind: "text",
          body: "I drafted an account page and role-based outreach. Every possible product path is labeled for review.",
        },
        {
          id: "m4",
          from: "account",
          kind: "draft",
          draftLabel: "Account brief complete",
          artifact: ACCOUNT_BRIEF,
        },
      ],
    },
  },
];
