import { JOBS } from "@/data/jobs";

export function AgentFleet() {
  return (
    <section id="agent-fleet" className="agent-fleet">
      <div className="fleet-heading">
        <p className="eyebrow">A fleet at work</p>
        <h2>Each agent gets a computer and a clear job.</h2>
        <p>
          The seller stays in control. The agents open the tools, prepare the
          drafts, and leave each result ready to check.
        </p>
      </div>
      <div className="fleet-grid">
        {JOBS.map((job) => (
          <a key={job.id} className="fleet-desk" href={`#${job.id}`}>
            <header>
              <span
                className="fleet-agent-mark"
                style={{ background: job.agent.color }}
                aria-hidden
              >
                {String(job.number).padStart(2, "0")}
              </span>
              <p>
                <strong>{job.agent.name}</strong>
                <small>Working now</small>
              </p>
              <span className="fleet-status" aria-label="Working" />
            </header>
            <div className="fleet-computer" aria-label={`${job.agent.name} computer`}>
              <div className="fleet-computer-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="fleet-computer-body">
                <nav aria-label={`${job.agent.name} open tools`}>
                  {job.agent.tools.map((tool, index) => (
                    <span key={tool} className={index === 1 ? "is-active" : ""}>
                      {tool}
                    </span>
                  ))}
                </nav>
                <div className="fleet-screen">
                  <span className="fleet-screen-kicker">Current work</span>
                  <strong>{job.agent.activity}</strong>
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
            <footer>
              <span>Starts when</span>
              {job.trigger}
            </footer>
          </a>
        ))}
      </div>
    </section>
  );
}
