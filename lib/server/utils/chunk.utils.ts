export const chunkText = (
  text: string,
  chunkSize = 1000,
  overlap = 200
) => {
  const chunks: string[] = [];

  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex =
      startIndex + chunkSize;

    const chunk =
      text.slice(startIndex, endIndex);

    chunks.push(chunk);

    startIndex +=
      chunkSize - overlap;
  }

  return chunks;
};