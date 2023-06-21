import { OpenAIStream, StreamingTextResponse } from "ai";
import { openai, CreateChatCompletionRequest } from "@/config";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI key");
}

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const { prompt } = (await req.json()) as { prompt?: string };
  if (!prompt) {
    return new Response("Prompt to model is required", { status: 400 });
  }

  const payload: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    // max_tokens: 200,
    stream: true,
    n: 1,
  };

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion(payload);

  // convert response into a friendly text-stream
  const stream = OpenAIStream(response);

  // response with the stream
  return new StreamingTextResponse(stream);
}
