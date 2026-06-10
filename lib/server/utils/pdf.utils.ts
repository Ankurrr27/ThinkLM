import { createRequire } from "node:module";
import { GoogleGenerativeAI } from "@google/generative-ai";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractTextFromPDF =
  async (dataBuffer: Buffer) => {
    let text = "";
    try {
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text || "";
    } catch (err) {
      console.error("Standard PDF parse failed, falling back to Gemini:", err);
    }

    if (text.trim().length < 100 && process.env.GEMINI_API_KEY) {
      try {
        console.log("Extracted text is very short. Using Gemini for OCR and layout parsing...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const response = await model.generateContent([
          {
            inlineData: {
              data: dataBuffer.toString("base64"),
              mimeType: "application/pdf"
            }
          },
          "Please extract all text from this PDF document. If it is a scanned document or has images/charts containing text, perform OCR to extract all of the text. Maintain the reading order and layout as much as possible. Do not add any summary or commentary, just output the extracted text."
        ]);

        const geminiText = response.response.text();
        if (geminiText && geminiText.trim().length > text.trim().length) {
          console.log(`Successfully extracted ${geminiText.length} characters using Gemini.`);
          return geminiText;
        }
      } catch (geminiErr) {
        console.error("Gemini PDF parsing failed:", geminiErr);
      }
    }

    return text;
  };