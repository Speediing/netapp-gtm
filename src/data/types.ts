export type JobId =
  | "call-follow-up"
  | "sourced-answer"
  | "account-brief";

export type Participant = {
  id: string;
  name: string;
  role: "you" | "bot";
  color?: string;
};

export type StoryScene =
  | "call"
  | "notes"
  | "sources"
  | "draft"
  | "research"
  | "send";

export type StoryVisual =
  | {
      kind: "live-call";
      title: string;
      people: { initials: string; role: string }[];
    }
  | {
      kind: "live-note";
      title: string;
      summary: string;
      signals: string[];
    }
  | {
      kind: "work-progress";
      app: string;
      task: string;
      status: string;
    }
  | {
      kind: "request-inbox";
      sender: string;
      subject: string;
      items: string[];
    }
  | {
      kind: "source-review";
      sources: { name: string; status: string }[];
      state: string;
    }
  | {
      kind: "draft-ready";
      title: string;
      detail: string;
      status: string;
    }
  | {
      kind: "account-research";
      account: string;
      sources: string[];
      state: string;
    }
  | {
      kind: "brief-building";
      sections: string[];
      status: string;
    }
  | {
      kind: "outreach-ready";
      audience: string;
      channels: string[];
      status: string;
    };

export type BriefArtifact = {
  kind: "brief";
  title: string;
  status: "Complete draft";
  sections: { heading: string; body: string }[];
};

export type AnswerArtifact = {
  kind: "answer";
  title: string;
  status: "Complete draft";
  checks: {
    question: string;
    state: "Ready" | "Needs review";
    source: string;
  }[];
  reply: {
    to: string;
    subject: string;
    body: string;
  };
};

export type AccountArtifact = {
  kind: "account";
  title: string;
  account: string;
  status: "Complete draft";
  sources: { label: string; finding: string }[];
  audiences: { role: string; reason: string }[];
  outreach: {
    subject: string;
    body: string;
  };
};

export type Artifact = BriefArtifact | AnswerArtifact | AccountArtifact;

export type StoryBeat = {
  label: string;
  scene: StoryScene;
  when: string;
  visual: StoryVisual;
};

export type PayoffBeat = {
  label: string;
  scene: StoryScene;
  when: string;
  artifact: Artifact;
};

export type StorySequence = readonly [
  StoryBeat,
  StoryBeat,
  StoryBeat,
  PayoffBeat,
];

export type BasicMessage = {
  id: string;
  from: string;
  kind: "text" | "routine";
  body: string;
  delayMs?: number;
};

export type DraftMessage = {
  id: string;
  from: string;
  kind: "draft";
  draftLabel: string;
  body?: string;
  artifact: Artifact;
  delayMs?: number;
};

export type DemoMessage = BasicMessage | DraftMessage;

export type DemoThread = {
  title: string;
  subtitle: string;
  participants: Participant[];
  messages: readonly [
    BasicMessage,
    BasicMessage,
    BasicMessage,
    DraftMessage,
  ];
};

export type FleetAgent = {
  name: string;
  activity: string;
  tools: readonly [string, string, string];
  color: string;
};

export type GtmJob = {
  id: JobId;
  number: 1 | 2 | 3;
  title: string;
  trigger: string;
  backgroundAction: string;
  outcome: string;
  storyboard: StorySequence;
  agent: FleetAgent;
  demo: DemoThread;
};
