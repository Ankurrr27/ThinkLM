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

Use the provided context as your primary source of truth to answer the question.
If the question asks for explanations, details, definitions, or elaborations on concepts, skills, technologies, or terms mentioned in the context (for example, if the context lists a skill like 'Next.js' or a project using a tool, and the user asks what that tool/concept is), you should provide a detailed, helpful explanation using both the context and your general knowledge.

If the question is completely unrelated to the documents or context, you may still answer it using your general knowledge, but gently mention that the information was not found in the uploaded documents.

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
