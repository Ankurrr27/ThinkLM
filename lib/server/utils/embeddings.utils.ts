let extractor: any = null;

export const getEmbedding = async (text: string) => {
  try {
    console.log("Loading embedding model");

    if (!extractor) {
      const transformers =
        await import("@xenova/transformers");

      console.log("Transformers imported");

      extractor =
        await transformers.pipeline(
          "feature-extraction",
          "Xenova/all-MiniLM-L6-v2"
        );

      console.log("Pipeline created");
    }

    const output = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);

  } catch (err) {
    console.error("EMBEDDING ERROR:", err);
    throw err;
  }
};