"use client";

import { useEffect, useRef } from "react";
import type { GtmJob } from "@/data/types";
import { useDemoPlayback } from "@/hooks/useDemoPlayback";
import { GrokBotWindow } from "./GrokBotWindow";

export function JobDemo({ job }: { job: GtmJob }) {
  const playback = useDemoPlayback(job.demo);
  const rootRef = useRef<HTMLDivElement>(null);
  const setInView = playback.setInView;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.22 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [setInView]);

  return (
    <div className="job-demo" ref={rootRef}>
      <GrokBotWindow job={job} playback={playback} />
    </div>
  );
}
