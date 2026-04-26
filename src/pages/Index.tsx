import { useMemo, useState } from "react";
import { Sparkles, Download, Loader2, Users, FileText, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CANDIDATES } from "@/data/candidates";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreBadge } from "@/components/talent/ScoreBadge";
import { AnalysisDialog } from "@/components/talent/AnalysisDialog";
import type { AIScore, ScoredCandidate } from "@/types/scout";
import { downloadCSV, toCSV } from "@/lib/csv";

const SAMPLE_JD = `Senior Full-Stack Engineer — Series B fintech (remote, India)
We are hiring a senior engineer to lead our payments platform team.
Must-have: TypeScript, React, Node.js, PostgreSQL, 5+ years experience.
Nice-to-have: Go, Kubernetes, fintech background, distributed systems.
You will own architecture decisions, mentor 3 engineers, and ship to millions of users.`;

const Index = () => {
  const { toast } = useToast();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScoredCandidate[] | null>(null);
  const [selected, setSelected] = useState<ScoredCandidate | null>(null);

  const sortedResults = useMemo(() => {
    if (!results) return null;
    const ranked = [...results].sort((a, b) => b.weightedScore - a.weightedScore);
    return ranked.map((c, i) => ({ ...c, rank: i + 1 }));
  }, [results]);

  async function handleScout() {
    if (jd.trim().length < 20) {
      toast({
        title: "Add a Job Description",
        description: "Please paste a JD of at least 20 characters.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("scout-candidates", {
        body: { jobDescription: jd, candidates: CANDIDATES },
      });
      if (error) {
        const status = (error as { context?: { status?: number } }).context?.status;
        if (status === 429) {
          toast({ title: "Rate limited", description: "Please wait a moment and try again.", variant: "destructive" });
        } else if (status === 402) {
          toast({
            title: "AI credits exhausted",
            description: "Add credits in Settings → Workspace → Usage.",
            variant: "destructive",
          });
        } else {
          toast({ title: "Scouting failed", description: error.message, variant: "destructive" });
        }
        return;
      }
      const ai = (data?.results ?? []) as AIScore[];
      const merged: ScoredCandidate[] = CANDIDATES.map((c) => {
        const score = ai.find((s) => s.id === c.id);
        const matchScore = score?.matchScore ?? 0;
        const interestScore = score?.interestScore ?? 0;
        return {
          ...c,
          matchScore,
          matchJustification: score?.matchJustification ?? "No analysis returned.",
          interestScore,
          interestJustification: score?.interestJustification ?? "No analysis returned.",
          chatTranscript: score?.chatTranscript ?? [],
          skillBreakdown: score?.skillBreakdown ?? [],
          weightedScore: matchScore * 0.6 + interestScore * 0.4,
          rank: 0,
        };
      });
      setResults(merged);
      toast({
        title: "Shortlist ready",
        description: `Scored ${merged.length} candidates against your JD.`,
      });
    } catch (e) {
      toast({
        title: "Unexpected error",
        description: e instanceof Error ? e.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    if (!sortedResults) return;
    const rows = sortedResults.map((c) => ({
      Rank: c.rank,
      Name: c.name,
      "Current Role": c.currentRole,
      "Years Experience": c.yearsExperience,
      Seniority: c.seniority,
      Location: c.location,
      Skills: c.skills.join("; "),
      "Match Score": c.matchScore,
      "Match Justification": c.matchJustification,
      "Interest Score": c.interestScore,
      "Interest Justification": c.interestJustification,
      "Weighted Score": c.weightedScore.toFixed(1),
      "Chat Transcript": c.chatTranscript
        .map((m) => `${m.from === "agent" ? "Agent" : c.name.split(" ")[0]}: ${m.text}`)
        .join(" | "),
    }));
    const date = new Date().toISOString().slice(0, 10);
    downloadCSV(`talent-shortlist-${date}.csv`, toCSV(rows));
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="border-b border-border text-primary-foreground"
        style={{ background: "var(--gradient-header)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Talent Scout AI</h1>
              <p className="text-xs text-primary-foreground/70">AI-powered candidate discovery</p>
            </div>
          </div>
          <span className="hidden rounded-md border border-primary-foreground/20 px-2.5 py-1 text-xs text-primary-foreground/80 sm:inline-block">
            Deccan AI Catalyst
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* JD Input */}
        <section
          className="rounded-xl border bg-card p-5 sm:p-6"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Job Description</h2>
          </div>
          <Textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder={SAMPLE_JD}
            rows={9}
            className="resize-none text-sm leading-relaxed"
          />
          <div className="mt-3 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{jd.length} chars</span>
              <button
                type="button"
                onClick={() => setJd(SAMPLE_JD)}
                className="text-primary hover:underline"
              >
                Use sample JD
              </button>
            </div>
            <Button
              onClick={handleScout}
              disabled={loading}
              size="lg"
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing candidates…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Scout Candidates
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Candidate pool preview */}
        {!sortedResults && (
          <section className="mt-6 rounded-xl border bg-card p-5 sm:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Candidate Pool ({CANDIDATES.length})
              </h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {CANDIDATES.map((c) => (
                <li key={c.id} className="rounded-lg border bg-background/50 p-3">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.currentRole}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.yearsExperience} yrs · {c.seniority} · {c.location}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Results */}
        {sortedResults && (
          <section
            className="mt-6 rounded-xl border bg-card"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold text-foreground">
                  Ranked Shortlist
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {sortedResults.length} candidates · weighted = match × 0.6 + interest × 0.4
                  </span>
                </h2>
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14 text-center">Rank</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead className="hidden md:table-cell">Current Role</TableHead>
                    <TableHead className="text-center">Match</TableHead>
                    <TableHead className="text-center">Interest</TableHead>
                    <TableHead className="text-center">Weighted</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedResults.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold ${
                            c.rank === 1
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          #{c.rank}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{c.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{c.currentRole}</div>
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {c.currentRole}
                      </TableCell>
                      <TableCell className="text-center">
                        <ScoreBadge score={c.matchScore} />
                      </TableCell>
                      <TableCell className="text-center">
                        <ScoreBadge score={c.interestScore} />
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-semibold text-foreground">
                          {c.weightedScore.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => setSelected(c)}>
                          Analysis
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Built for Deccan AI Catalyst · Talent Scout AI Agent
        </footer>
      </main>

      <AnalysisDialog candidate={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
};

export default Index;
