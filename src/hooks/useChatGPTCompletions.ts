import { useState } from "react";

function useChatGPTCompletions(promptForModel: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [completionsError, setcompletionsError] = useState<string | null>(null);
  const [generatedCL, setGenerateCL] = useState<string>("");


  async function triggerCompletions() {
    setGenerateCL("");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/chatgpt-completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptForModel,
        }),
      });
      if (!response.ok) {
        setcompletionsError("Error fetching model response");
      }

      // This data is a ReadableStream
      const data = response.body;

      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setGenerateCL((prev) => prev + chunkValue);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setcompletionsError("Error fetching model response");
    }
  }
  return { isLoading, completionsError, generatedCL, triggerCompletions };
}

export { useChatGPTCompletions };
