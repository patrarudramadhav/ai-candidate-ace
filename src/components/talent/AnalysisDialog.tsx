import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScoreBadge } from "./ScoreBadge";
import type { ScoredCandidate } from "@/types/scout";

type Props = {
  candidate: ScoredCandidate | null;
  onOpenChange: (open: boolean) => void;
};

export function AnalysisDialog({ candidate, onOpenChange }: Props) {
  return (
    <Dialog open={!!candidate} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {candidate && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{candidate.name}</DialogTitle>
              <DialogDescription className="text-sm">
                {candidate.currentRole} · {candidate.yearsExperience} yrs · {candidate.location}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {candidate.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                >
                  {s}
                </span>
              ))}
            </div>

            <section className="mt-4 rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Match Score</h3>
                <ScoreBadge score={candidate.matchScore} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {candidate.matchJustification}
              </p>
            </section>

            <section className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Interest Score</h3>
                <ScoreBadge score={candidate.interestScore} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {candidate.interestJustification}
              </p>
            </section>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
