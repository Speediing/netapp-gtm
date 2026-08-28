import type { StoryBeat, StoryVisual } from "@/data/types";

function LiveVisual({ visual }: { visual: StoryVisual }) {
  switch (visual.kind) {
    case "live-call":
      return (
        <div className="story-ui story-call-ui">
          <header className="story-ui-bar">
            <span className="story-ui-dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <strong>{visual.title}</strong>
            <span className="story-live">Live</span>
          </header>
          <div className="story-call-people">
            {visual.people.map((person, index) => (
              <div
                key={person.initials}
                className={index === 1 ? "is-speaking" : undefined}
              >
                <span>{person.initials}</span>
                <small>{person.role}</small>
              </div>
            ))}
          </div>
          <footer>
            <span className="story-wave" aria-hidden>
              ||||||||||||
            </span>
            Meeting record connected
          </footer>
        </div>
      );
    case "live-note":
      return (
        <div className="story-ui story-transcript-ui">
          <header className="story-ui-bar">
            <strong>{visual.title}</strong>
            <span>Organizing</span>
          </header>
          <p className="story-note-summary">{visual.summary}</p>
          <footer>
            {visual.signals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </footer>
        </div>
      );
    case "work-progress":
      return (
        <div className="story-ui story-deck-ui">
          <header className="story-ui-bar">
            <strong>{visual.app}</strong>
            <span>Working</span>
          </header>
          <div className="story-mini-slide">
            <small>Current task</small>
            <strong>{visual.task}</strong>
            <span>Open questions remain visible</span>
          </div>
          <footer>{visual.status}</footer>
        </div>
      );
    case "request-inbox":
      return (
        <div className="story-ui story-email-ui">
          <header className="story-ui-bar">
            <strong>Inbox</strong>
            <span>New request</span>
          </header>
          <div className="story-email-body">
            <span className="story-avatar">CT</span>
            <p>
              <strong>{visual.sender}</strong>
              <small>{visual.subject}</small>
            </p>
          </div>
          <footer className="story-request-items">
            {visual.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </footer>
        </div>
      );
    case "source-review":
      return (
        <div className="story-ui story-answers-ui">
          <header className="story-ui-bar">
            <strong>Approved source review</strong>
            <span>{visual.state}</span>
          </header>
          <ul>
            {visual.sources.map((source) => (
              <li key={source.name}>
                <span aria-hidden>✓</span>
                <p>
                  <strong>{source.name}</strong>
                  <small>{source.status}</small>
                </p>
              </li>
            ))}
          </ul>
        </div>
      );
    case "draft-ready":
      return (
        <div className="story-ui story-reply-ui">
          <header className="story-ui-bar">
            <strong>{visual.title}</strong>
            <span>Not sent</span>
          </header>
          <div className="story-reply-fields">
            <p>
              <span>Draft</span>
              {visual.detail}
            </p>
            <i />
            <i />
            <i />
          </div>
          <footer>{visual.status}</footer>
        </div>
      );
    case "account-research":
      return (
        <div className="story-ui story-research-ui">
          <header className="story-ui-bar">
            <strong>{visual.account}</strong>
            <span>Researching</span>
          </header>
          <div className="story-source-orbit">
            <strong>{visual.state}</strong>
            {visual.sources.map((source) => (
              <span key={source}>{source}</span>
            ))}
          </div>
          <footer>Only linked sources enter the brief</footer>
        </div>
      );
    case "brief-building":
      return (
        <div className="story-ui story-why-ui">
          <header className="story-ui-bar">
            <strong>Account brief</strong>
            <span>{visual.status}</span>
          </header>
          <ol>
            {visual.sections.map((section, index) => (
              <li key={section}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{section}</strong>
              </li>
            ))}
          </ol>
        </div>
      );
    case "outreach-ready":
      return (
        <div className="story-ui story-outreach-ui">
          <header className="story-ui-bar">
            <strong>{visual.audience}</strong>
          </header>
          <div>
            {visual.channels.map((channel, index) => (
              <p key={channel}>
                <span>{index + 1}</span>
                <strong>{channel}</strong>
                <small>Ready to edit</small>
              </p>
            ))}
          </div>
          <footer>{visual.status}</footer>
        </div>
      );
  }
}

export function Storyboard({ beats }: { beats: StoryBeat[] }) {
  return (
    <ol className="storyboard is-live-flow">
      {beats.map((beat) => (
        <li
          key={`${beat.when}-${beat.label}`}
          className="story-beat has-visual"
        >
          <LiveVisual visual={beat.visual} />
          <p className="story-when">{beat.when}</p>
          <p className="story-line">{beat.label}</p>
        </li>
      ))}
    </ol>
  );
}
