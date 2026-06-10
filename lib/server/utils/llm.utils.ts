import { GoogleGenerativeAI } from "@google/generative-ai";

let model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

const getModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  if (!model) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
  }

  return model;
};

export const generateAnswer =
  async (
    question: string,
    context: string
  ) => {
    const prompt = `
You are an AI research assistant.

Answer ONLY from the provided context.

If the answer is not in the context,
say:
"I could not find that information in the uploaded documents."

Context:
${context}

Question:
${question}
`;

    const result =
      await getModel().generateContent(
        prompt
      );

    return result.response.text();
  };
