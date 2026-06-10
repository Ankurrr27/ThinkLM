import fs from "fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractTextFromPDF =
  async (filePath: string) => {
    const dataBuffer =
      fs.readFileSync(filePath);

    const pdfData =
      await pdfParse(dataBuffer);

    return pdfData.text;
  };