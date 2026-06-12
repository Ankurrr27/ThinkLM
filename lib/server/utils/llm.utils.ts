import { GoogleGenerativeAI } from "@google/generative-ai";
import { normalizeQuery, isGreeting } from "./query-normalizer";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Generate a crisp, document-grounded answer using Gemini Flash.
 * Answers are kept concise and strictly based on the provided context.
 */
export const generateAnswer = async (
  question: string,
  context: string
): Promise<string> => {
  try {
    const normalizedQuestion = normalizeQuery(question);

    if (isGreeting(normalizedQuestion)) {
      return "Hi! I'm your AI research assistant. Upload a PDF document and ask me anything about it!";
    }

    if (!context || context.trim().length < 50) {
      return "I couldn't find relevant information in the uploaded documents for your workspace. Please make sure you have uploaded a PDF and try asking a more specific question.";
    }

    const prompt = `You are ThinkLM, an intelligent research assistant that answers questions strictly based on the provided document context.

RULES:
1. Answer ONLY from the provided context. Do NOT invent or assume information.
2. Be crisp and concise — aim for 1–3 short paragraphs or a brief bullet list.
3. If the answer is clearly NOT in the context, respond exactly:
   "This information doesn't appear to be in the uploaded document."
4. Understand typos and informal phrasing — answer what the user meant.
5. Format structured data (lists, steps) using markdown bullets or numbering.
6. Never repeat the question back to the user.

DOCUMENT CONTEXT:
${context}

USER QUESTION:
${normalizedQuestion}

ANSWER:`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.15,
        maxOutputTokens: 400,
      },
    });

    const result = await model.generateContent(prompt);
    const answer = result.response.text().trim();

    return answer || "I was unable to generate a response. Please try again.";
  } catch (error: any) {
    console.error("Gemini LLM Error:", error);
    return "The AI service encountered an error. Please try again in a moment.";
  }
};