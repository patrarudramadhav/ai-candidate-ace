// Talent Scout AI — scoring edge function
// Calls Lovable AI Gateway (Gemini) with tool-calling for structured output.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Candidate = {
  id: string;
  name: string;
  currentRole: string;
  yearsExperience: number;
  seniority: string;
  location: string;
  skills: string[];
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return json({ error: "LOVABLE_API_KEY is not configured" }, 500);
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.jobDescription !== "string" || !Array.isArray(body.candidates)) {
      return json({ error: "Invalid request: expected { jobDescription, candidates[] }" }, 400);
    }

    const jobDescription: string = body.jobDescription.trim();
    const candidates: Candidate[] = body.candidates;

    if (jobDescription.length < 20) {
      return json({ error: "Job description is too short. Provide at least 20 characters." }, 400);
    }
    if (candidates.length === 0 || candidates.length > 25) {
      return json({ error: "Provide between 1 and 25 candidates." }, 400);
    }

    const systemPrompt = `You are an experienced recruiter scoring candidates against a Job Description across diverse domains (technology, finance, social sector, traditional arts, etc.).
Score conservatively and ground every justification in the actual candidate data and JD.

For EACH candidate return:
- matchScore (0-100): how well their skills, seniority, and experience align with the JD. A traditional artist scored against a software JD should get a very low matchScore — be honest.
- matchJustification: exactly 2 sentences. State what aligns, then what's missing or weaker.
- chatTranscript: a SIMULATED outreach chat with EXACTLY 4 messages alternating: agent, candidate, agent, candidate.
    * Message 1 (agent): warm intro mentioning the specific role from the JD and why this candidate caught your eye (reference one of their actual skills or current role).
    * Message 2 (candidate): a realistic, in-character reply about their current situation. Tone must reflect their seniority and domain — a Staff engineer at a top firm sounds different from a junior, a traditional artist sounds different from a fintech analyst.
    * Message 3 (agent): a focused follow-up about availability, compensation expectations, or interest level.
    * Message 4 (candidate): a candid response that reveals how open (or not) they are to moving.
  Keep each message under 220 characters. Make it feel like a real DM, not corporate jargon.
- interestScore (0-100): derive this DIRECTLY from the simulated chatTranscript you just wrote. If the candidate's replies sound dismissive, busy, or happy where they are → low score. If they sound curious, available, or actively looking → high score. Mid/junior candidates and those in misaligned domains for the JD typically score lower on interest because the role isn't relevant to them.
- interestJustification: exactly 2 sentences explaining the interest score, citing specific phrasing or signals from the simulated chat.

Return one entry per candidate via the score_candidates tool. Do not skip anyone.`;

    const userPrompt = `JOB DESCRIPTION:
"""
${jobDescription}
"""

CANDIDATES (JSON):
${JSON.stringify(candidates, null, 2)}`;

    const tool = {
      type: "function",
      function: {
        name: "score_candidates",
        description: "Return scoring and a simulated outreach chat for every candidate.",
        parameters: {
          type: "object",
          properties: {
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  matchScore: { type: "number", minimum: 0, maximum: 100 },
                  matchJustification: { type: "string" },
                  interestScore: { type: "number", minimum: 0, maximum: 100 },
                  interestJustification: { type: "string" },
                  chatTranscript: {
                    type: "array",
                    minItems: 4,
                    maxItems: 4,
                    items: {
                      type: "object",
                      properties: {
                        from: { type: "string", enum: ["agent", "candidate"] },
                        text: { type: "string" },
                      },
                      required: ["from", "text"],
                      additionalProperties: false,
                    },
                  },
                },
                required: [
                  "id",
                  "matchScore",
                  "matchJustification",
                  "interestScore",
                  "interestJustification",
                  "chatTranscript",
                ],
                additionalProperties: false,
              },
            },
          },
          required: ["results"],
          additionalProperties: false,
        },
      },
    };

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "score_candidates" } },
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return json({ error: "Rate limit reached. Please wait a moment and try again." }, 429);
      }
      if (aiRes.status === 402) {
        return json(
          { error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." },
          402,
        );
      }
      const text = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, text);
      return json({ error: "AI gateway error" }, 500);
    }

    const data = await aiRes.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in AI response:", JSON.stringify(data));
      return json({ error: "AI did not return structured results." }, 500);
    }

    let parsed: { results: unknown };
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse tool args:", e, toolCall.function.arguments);
      return json({ error: "Failed to parse AI response." }, 500);
    }

    return json({ results: parsed.results }, 200);
  } catch (e) {
    console.error("scout-candidates error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
