import type { DemoMessage } from "@/data/types";
import type { ComputerBeat } from "@/data/screens";
import { ArtifactCard } from "./ArtifactCard";

export function SiteScreen({
  beat,
  message,
  account,
  sent,
}: {
  beat: ComputerBeat;
  message?: DemoMessage;
  account: string;
  sent: boolean;
}) {
  if (beat.site === "artifact" && message?.kind === "draft") {
    return (
      <div className="site site-artifact">
        {sent ? <p className="site-approved">Approved by the seller</p> : null}
        <ArtifactCard artifact={message.artifact} />
      </div>
    );
  }

  if (beat.site === "meeting") {
    return <MeetingScreen account={account} />;
  }

  if (beat.site === "inbox") {
    return <InboxScreen account={account} />;
  }

  if (beat.site === "sources") {
    return <SourcesScreen />;
  }

  if (beat.site === "research") {
    return <ResearchScreen account={account} />;
  }

  return <WorkspaceScreen title={beat.title} />;
}

function MeetingScreen({ account }: { account: string }) {
  return (
    <div className="site site-notes">
      <header>
        <strong>Meeting record</strong>
        <span>Connected</span>
      </header>
      <p className="site-time">{account}. Approved notes only.</p>
      <ul className="site-work-list">
        <li>
          <span>Requirement</span>
          <strong>Captured from the meeting record</strong>
        </li>
        <li>
          <span>Open question</span>
          <strong>Marked for account team review</strong>
        </li>
        <li>
          <span>Source path</span>
          <strong>Approved material linked beside the answer</strong>
        </li>
        <li>
          <span>Next step</span>
          <strong>Draft only until the seller approves it</strong>
        </li>
      </ul>
    </div>
  );
}

function InboxScreen({ account }: { account: string }) {
  return (
    <div className="site site-inbox">
      <header>
        <strong>Inbox</strong>
        <span>New customer request</span>
      </header>
      <article className="inbox-card">
        <p>
          <span>From</span>
          {account} team
        </p>
        <p>
          <span>Subject</span>
          Product and security follow-up
        </p>
        <ul>
          <li>Product fit</li>
          <li>Security detail</li>
          <li>Account context</li>
        </ul>
      </article>
    </div>
  );
}

function SourcesScreen() {
  const sources = [
    ["NetApp product material", "Linked"],
    ["Approved security guidance", "Review needed"],
    ["Approved account record", "Linked"],
  ];

  return (
    <div className="site site-sources">
      <header>
        <strong>Source review</strong>
        <span>No unsupported answer added</span>
      </header>
      <ul className="source-list">
        {sources.map(([name, state]) => (
          <li key={name}>
            <span className={state === "Linked" ? "is-linked" : ""} />
            <p>
              <strong>{name}</strong>
              <small>{state}</small>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResearchScreen({ account }: { account: string }) {
  return (
    <div className="site site-research">
      <header>
        <strong>{account}</strong>
        <span>Research workspace</span>
      </header>
      <p className="site-time">Known context and open questions stay separate.</p>
      <ul className="site-work-list">
        <li>
          <span>Public sources</span>
          <strong>Links collected for review</strong>
        </li>
        <li>
          <span>Account notes</span>
          <strong>Approved context only</strong>
        </li>
        <li>
          <span>Product material</span>
          <strong>Possible paths labeled as draft ideas</strong>
        </li>
      </ul>
    </div>
  );
}

function WorkspaceScreen({ title }: { title: string }) {
  return (
    <div className="site site-workspace">
      <header>
        <strong>{title}</strong>
        <span>Drafting</span>
      </header>
      <div className="workspace-page">
        <span />
        <span />
        <span />
        <span />
        <p>Sources attached. Open items remain visible.</p>
      </div>
    </div>
  );
}
