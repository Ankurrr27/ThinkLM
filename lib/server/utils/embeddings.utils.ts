let extractor: any = null;

export const getEmbedding = async (
  text: string
) => {

  if (!extractor) {

    const transformers =
      await import(
        "@xenova/transformers"
      );

    extractor =
      await transformers.pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
  }

  const output = await extractor(
    text,
    {
      pooling: "mean",
      normalize: true,
    }
  );

  return Array.from(output.data);
};