import Image from "next/image";
import { AgentFleet } from "@/components/RosterChart";
import { HeroDemo } from "@/components/HeroDemo";
import { HeroTelemetry } from "@/components/HeroTelemetry";
import { JobSection } from "@/components/JobSection";
import { QuoteWall } from "@/components/QuoteWall";
import { SiteNav } from "@/components/SiteNav";
import { JOBS } from "@/data/jobs";

export default function HomePage() {
  return (
    <main id="top">
      <section className="hero-watercolor">
        <Image
          className="hero-watercolor-image"
          src="/brand/netapp-watercolor-header.jpg"
          alt=""
          width={1280}
          height={720}
          sizes="100vw"
          priority
        />
        <HeroTelemetry />
        <SiteNav />
      </section>

      <div className="report">
        <div className="report-hero">
          <section className="hero">
            <HeroDemo />
          </section>
        </div>

        <section className="usecase-framing">
          <p className="eyebrow">Three working examples</p>
          <h2>
            The agent does the computer work. The seller keeps the final say.
          </h2>
          <p>
            Each example shows the trigger, the work in progress, and the
            completed draft.
          </p>
        </section>

        <AgentFleet />

        <div id="jobs">
          {JOBS.map((job) => (
            <JobSection key={job.id} job={job} />
          ))}
        </div>

        <QuoteWall />
      </div>

      <footer className="site-footer">
        <div>
          <p className="footer-title">NetApp x SpaceXAI</p>
          <p>Private GTM working session</p>
        </div>
        <address className="footer-contact">
          <p>Your Cursor account executive</p>
          <strong>Sean Middleton</strong>
          <a href="mailto:sean.middleton@cursor.com">
            sean.middleton@cursor.com
          </a>
        </address>
      </footer>
    </main>
  );
}
