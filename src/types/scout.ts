import type { Candidate } from "@/data/candidates";

export type AIScore = {
  id: string;
  matchScore: number;
  matchJustification: string;
  interestScore: number;
  interestJustification: string;
};

export type ScoredCandidate = Candidate & AIScore;
