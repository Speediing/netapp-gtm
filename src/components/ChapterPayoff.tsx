import type { PayoffBeat } from "@/data/types";
import { ArtifactCard } from "./ArtifactCard";

export function ChapterPayoff({ beat }: { beat: PayoffBeat }) {
  return (
    <div className="chapter-payoff">
      <p className="payoff-label">
        <span>{beat.when}</span>
        {beat.label}
      </p>
      <ArtifactCard artifact={beat.artifact} />
    </div>
  );
}
