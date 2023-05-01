import { OpenAIStream, OpenAIStreamPayload } from "@/utils";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI key");
}

export const runtime = "edge";
// type HandlerReq = Request & { prompt?: string };

export async function POST(req: Request): Promise<Response> {
  const { prompt } = (await req.json()) as { prompt?: string };
  if (!prompt) {
    return new Response("Prompt to model is required", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
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

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
