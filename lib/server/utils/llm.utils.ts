import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateAnswer = async (
  question: string,
  context: string
) => {
  try {
    const prompt = `
You are an AI research assistant.

Use the provided context as your primary source of truth to answer the question.

Context:
${context}

Question:
${question}
`;

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

    return (
      completion.choices[0]?.message?.content ||
      "No response generated."
    );

  } catch (error: any) {
    console.error("Groq Error:", error);

    return "AI service is temporarily unavailable. Please try again later.";
  }
};