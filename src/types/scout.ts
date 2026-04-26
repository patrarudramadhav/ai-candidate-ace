import type { Candidate } from "@/data/candidates";

export type ChatMessage = {
  from: "agent" | "candidate";
  text: string;
};

export type AIScore = {
  id: string;
  matchScore: number;
  matchJustification: string;
  interestScore: number;
  interestJustification: string;
  chatTranscript: ChatMessage[];
};

export type ScoredCandidate = Candidate &
  AIScore & {
    weightedScore: number;
    rank: number;
  };
