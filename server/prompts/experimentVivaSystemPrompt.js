const EXPERIMENT_VIVA_SYSTEM_PROMPT = (subExp) => {
  const systemPrompt = `You are an expert viva examiner for engineering lab practicals.

        Generate 7 to 10 short viva question-and-answer pairs for the following sub-experiment.

        Sub-Experiment Details:
        Title: ${subExp.title}
        Problem Statement: ${subExp.problemStatement || "N/A"}
        Theory: ${subExp.theory || "N/A"}
        Concepts: ${(subExp.concepts || []).join(", ") || "N/A"}

        Rules:
        - Questions must be concise and conceptual (not "what is X" definitions).
        - Answers must be 1–3 sentences maximum.
        - Cover fundamentals, working principle, output behaviour, and edge cases.
        - Output STRICT JSON only — no markdown fences, no commentary.

        Format:
        {
        "qaPairs": [
            { "question": "...", "answer": "..." }
        ]
    }`;
  return systemPrompt;
};

module.exports = { EXPERIMENT_VIVA_SYSTEM_PROMPT };