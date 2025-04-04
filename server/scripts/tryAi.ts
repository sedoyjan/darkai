import { generateDarkAIStrategy } from "../src/ai";

const main = async () => {
  try {
    const { data, threadId } = await generateDarkAIStrategy(
      "How to convince my boss for a raise?"
    );
    console.log("Generated Strategy:", data);
    console.log("Thread ID:", threadId);
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
