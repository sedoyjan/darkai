import OpenAI from "openai";
import { get } from "lodash";

const API_KEY = process.env.OPENAI_API_KEY as string;

const openai = new OpenAI({
  apiKey: API_KEY,
});

export const getAiResponse = (
  assistantId: string,
  prompt: string,
  threadId?: string
): Promise<{
  data: string;
  threadId: string;
}> => {
  return new Promise(async (resolve, reject) => {
    console.log("Prompt:", prompt);

    const darkAIAssistant = await openai.beta.assistants.retrieve(assistantId);

    const myThread = threadId
      ? await openai.beta.threads.retrieve(threadId)
      : await openai.beta.threads.create();

    const currentThreadId = myThread.id;

    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: prompt,
    });

    const myRun = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: darkAIAssistant.id,
    });

    const checkRunStatus = async () => {
      let runStatus;

      while (myRun.status === "queued" || myRun.status === "in_progress") {
        runStatus = await openai.beta.threads.runs.retrieve(
          currentThreadId,
          myRun.id
        );

        if (runStatus.status === "completed") {
          const allMessages =
            await openai.beta.threads.messages.list(currentThreadId);

          const data = get(
            allMessages,
            "data[0].content[0].text.value",
            "No response generated"
          ) as string;

          resolve({ data, threadId: currentThreadId });
          break;
        } else if (
          runStatus.status === "queued" ||
          runStatus.status === "in_progress"
        ) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        } else {
          reject(new Error("DarkAI strategy generation failed"));
          break;
        }
      }
    };

    checkRunStatus();
  });
};
