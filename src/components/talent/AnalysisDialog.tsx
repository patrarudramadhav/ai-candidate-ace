import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScoreBadge } from "./ScoreBadge";
import type { ScoredCandidate, SkillInfluence } from "@/types/scout";
import { MessageCircle, Trophy, Check, Minus, X, Target } from "lucide-react";

type Props = {
  candidate: ScoredCandidate | null;
  onOpenChange: (open: boolean) => void;
};

const STATUS_META: Record<
  SkillInfluence["status"],
  { label: string; icon: typeof Check; barClass: string; iconClass: string; chipClass: string }
> = {
  match: {
    label: "Match",
    icon: Check,
    barClass: "bg-score-high",
    iconClass: "text-score-high",
    chipClass: "bg-score-high/10 text-score-high border-score-high/30",
  },
  partial: {
    label: "Partial",
    icon: Minus,
    barClass: "bg-score-mid",
    iconClass: "text-score-mid",
    chipClass: "bg-score-mid/10 text-score-mid border-score-mid/30",
  },
  missing: {
    label: "Missing",
    icon: X,
    barClass: "bg-score-low",
    iconClass: "text-score-low",
    chipClass: "bg-score-low/10 text-score-low border-score-low/30",
  },
};

function SkillBreakdownSection({ breakdown }: { breakdown: SkillInfluence[] }) {
  const sorted = [...breakdown].sort((a, b) => b.weight - a.weight);
  const maxWeight = Math.max(...sorted.map((s) => s.weight), 10);

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          JD Skill Influence
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            what drove the match score
          </span>
        </h3>
      </div>
      <ul className="space-y-3">
        {sorted.map((s, i) => {
          const meta = STATUS_META[s.status] ?? STATUS_META.missing;
          const Icon = meta.icon;
          const pct = Math.max(8, (s.weight / maxWeight) * 100);
          return (
            <li key={`${s.skill}-${i}`} className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${meta.chipClass}`}
                  >
                    <Icon className={`h-3 w-3 ${meta.iconClass}`} />
                  </span>
                  <span className="truncate text-sm font-medium text-foreground">
                    {s.skill}
                  </span>
                  <span
                    className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.chipClass}`}
                  >
                    {meta.label}
                  </span>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  weight {s.weight}/10
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full ${meta.barClass} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="pl-7 text-xs leading-relaxed text-muted-foreground">{s.reason}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AnalysisDialog({ candidate, onOpenChange }: Props) {
  return (
    <Dialog open={!!candidate} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {candidate && (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl">{candidate.name}</DialogTitle>
                  <DialogDescription className="text-sm">
                    {candidate.currentRole} · {candidate.yearsExperience} yrs · {candidate.location}
                  </DialogDescription>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Trophy className="h-3 w-3" /> Rank #{candidate.rank}
                  </span>
                  <span className="mt-0.5 text-lg font-semibold text-primary">
                    {candidate.weightedScore.toFixed(1)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Weighted
                  </span>
                </div>
              </div>
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
                <h3 className="text-sm font-semibold text-foreground">
                  Match Score{" "}
                  <span className="text-xs font-normal text-muted-foreground">(60% weight)</span>
                </h3>
                <ScoreBadge score={candidate.matchScore} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {candidate.matchJustification}
              </p>
            </section>

            {candidate.skillBreakdown && candidate.skillBreakdown.length > 0 && (
              <SkillBreakdownSection breakdown={candidate.skillBreakdown} />
            )}

            <section className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Interest Score{" "}
                  <span className="text-xs font-normal text-muted-foreground">(40% weight)</span>
                </h3>
                <ScoreBadge score={candidate.interestScore} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {candidate.interestJustification}
              </p>
            </section>

            <section className="rounded-lg border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Simulated Outreach Chat</h3>
              </div>
              {candidate.chatTranscript && candidate.chatTranscript.length > 0 ? (
                <div className="space-y-2">
                  {candidate.chatTranscript.map((m, i) => {
                    const isAgent = m.from === "agent";
                    return (
                      <div
                        key={i}
                        className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-snug ${
                            isAgent
                              ? "rounded-tl-sm bg-secondary text-secondary-foreground"
                              : "rounded-tr-sm bg-primary text-primary-foreground"
                          }`}
                        >
                          <div
                            className={`mb-0.5 text-[10px] font-medium uppercase tracking-wide ${
                              isAgent ? "text-muted-foreground" : "text-primary-foreground/80"
                            }`}
                          >
                            {isAgent ? "AI Agent" : candidate.name.split(" ")[0]}
                          </div>
                          {m.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No transcript available.</p>
              )}
            </section>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
