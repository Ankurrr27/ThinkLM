/**
 * PDF text extraction using Gemini API.
 *
 * pdf-parse uses native Node.js filesystem modules that break in Vercel
 * serverless environments. We now extract text exclusively via the Gemini
 * Files API / inline-data approach so this works on Vercel (and locally).
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const extractTextFromPDF = async (
  dataBuffer: Buffer
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    {
      inlineData: {
        data: dataBuffer.toString("base64"),
        mimeType: "application/pdf",
      },
    },
    `Extract ALL text from this PDF document exactly as written.
If the PDF contains scanned pages or images with text, perform OCR on them.
Preserve reading order and paragraph breaks.
Do NOT add summaries, commentary, or formatting — output only the raw extracted text.`,
  ]);

  const text = result.response.text().trim();

  if (!text || text.length < 20) {
    throw new Error(
      "Could not extract readable text from this PDF. The file may be empty, password-protected, or contain only non-textual content."
    );
  }

  return text;
};