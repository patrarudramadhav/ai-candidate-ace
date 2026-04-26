import type { Candidate } from "@/data/candidates";

export type ChatMessage = {
  from: "agent" | "candidate";
  text: string;
};

export type SkillInfluence = {
  skill: string;
  weight: number; // 1-10
  status: "match" | "partial" | "missing";
  reason: string;
};

export type AIScore = {
  id: string;
  matchScore: number;
  matchJustification: string;
  interestScore: number;
  interestJustification: string;
  chatTranscript: ChatMessage[];
  skillBreakdown: SkillInfluence[];
};

export type ScoredCandidate = Candidate &
  AIScore & {
    weightedScore: number;
    rank: number;
  };
