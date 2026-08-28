import type { GtmJob } from "@/data/types";
import { Storyboard } from "./Storyboard";
import { ChapterPayoff } from "./ChapterPayoff";
import { JobDemo } from "./JobDemo";

export function JobSection({ job }: { job: GtmJob }) {
  const [first, second, third, payoff] = job.storyboard;

  return (
    <section
      id={job.id}
      className="narrative report-section job"
      data-workflow={job.id}
    >
      <p className="section-number">
        {String(job.number).padStart(2, "0")}
      </p>
      <div>
        <div className="background-agent">
          <span className="background-agent-pulse" aria-hidden />
          <p>
            <strong>{job.agent.name} active</strong>
            <small>
              {job.trigger} → {job.backgroundAction}
            </small>
          </p>
        </div>
        <h2 className="job-title">{job.title}</h2>
        <p className="job-value">{job.outcome}</p>
        <Storyboard beats={[first, second, third]} />
        <ChapterPayoff beat={payoff} />
        <div className="job-live-demo">
          <div className="job-live-demo-head">
            <p className="eyebrow">Live agent workspace</p>
            <h3>Chat on the left. The agent&apos;s computer on the right.</h3>
            <p>
              Watch both sides move together. The final frame keeps the
              completed draft open for review.
            </p>
          </div>
          <JobDemo job={job} />
        </div>
      </div>
    </section>
  );
}
