import type { Artifact } from "@/data/types";

export function ArtifactCard({ artifact }: { artifact: Artifact }) {
  if (artifact.kind === "brief") {
    return (
      <article className="art art-complete" data-artifact-state="complete">
        <header className="art-complete-header">
          <p className="art-kicker">Follow-up draft</p>
          <span>{artifact.status}</span>
        </header>
        <h3 className="art-title">{artifact.title}</h3>
        {artifact.sections.map((section) => (
          <section key={section.heading} className="art-block">
            <p className="art-label">{section.heading}</p>
            <p>{section.body}</p>
          </section>
        ))}
      </article>
    );
  }

  if (artifact.kind === "answer") {
    return (
      <article className="art art-complete" data-artifact-state="complete">
        <header className="art-complete-header">
          <p className="art-kicker">Response draft</p>
          <span>{artifact.status}</span>
        </header>
        <h3 className="art-title">{artifact.title}</h3>
        <ul className="answer-checks">
          {artifact.checks.map((check) => (
            <li key={check.question}>
              <p>
                <strong>{check.question}</strong>
                <span className={check.state === "Ready" ? "is-ready" : ""}>
                  {check.state}
                </span>
              </p>
              <small>{check.source}</small>
            </li>
          ))}
        </ul>
        <div className="art-reply">
          <p className="art-label">Draft reply</p>
          <p className="mail-row">
            <span>To</span>
            {artifact.reply.to}
          </p>
          <p className="mail-row">
            <span>Subject</span>
            {artifact.reply.subject}
          </p>
          <p>{artifact.reply.body}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="art art-complete" data-artifact-state="complete">
      <header className="art-complete-header">
        <p className="art-kicker">Account brief</p>
        <span>{artifact.status}</span>
      </header>
      <h3 className="art-title">
        {artifact.account}. {artifact.title}
      </h3>
      <div className="account-brief-grid">
        <section>
          <p className="art-label">Sources</p>
          {artifact.sources.map((source) => (
            <p key={source.label} className="account-brief-row">
              <strong>{source.label}</strong>
              <span>{source.finding}</span>
            </p>
          ))}
        </section>
        <section>
          <p className="art-label">Roles to check</p>
          {artifact.audiences.map((audience) => (
            <p key={audience.role} className="account-brief-row">
              <strong>{audience.role}</strong>
              <span>{audience.reason}</span>
            </p>
          ))}
        </section>
      </div>
      <div className="art-reply">
        <p className="art-label">Outreach draft</p>
        <p className="mail-row">
          <span>Subject</span>
          {artifact.outreach.subject}
        </p>
        <p>{artifact.outreach.body}</p>
      </div>
    </article>
  );
}
