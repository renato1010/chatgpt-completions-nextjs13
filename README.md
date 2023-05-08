This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ChatGPT completions endpoint

### Generate a cover letter from job description and resume

The goal is reach [OpenAI chat completion endpoint](https://platform.openai.com/docs/api-reference/chat/create) to generate a cover letter  
based on a job description(random, copy/paste) and a text-only version of a resume

For that it's required an API key and will be saved as `env var` at `.env.local` file at root

at `env.local`:

```.text
OPENAI_API_KEY=api-key-from-openai
OPENAI_ORGANIZATION_ID=openai-org-id
```

We're using Next.js App Router, so the starting point '/' segment only shows some icons to current  
and future utilities.

**Cover letter**: at [cover-letter](src/app/cover-letter/page.tsx) segment we have;

1. A server component that only sets metadata(title)
2. Render a [client component](src/app/cover-letter/cover-letter-client.tsx) that takes text for  
   fields resume,jobdescription,prompt; have as utility a defaults for resume and prompt.  
   [custom hooks](src/hooks/use-localstorage.ts) for keeping those text inputs at localstorage
3. When clicks the _Generate your cover letter_ button, the triggerCompletions function is invocated
4. and the async function triggerCompletions from custom hook **useChatGPTCompletions** is invoked
5. Route handler at `src/app/api/chatgpt-completions/route.ts` is called and passed the prompt text as POST body
6. This route handler is configured as Edge Function () see: [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge) it's great because  
   it starts with almost zero cold start and is capable to response with **streams**  
   at the client the "streams chunks" are added to component state and it visualy looks like chatgpt text response.

<div align="center">
   <h3>Cover Letter Page diagram</h3>
   <img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/le00p9p.png" width="800" alt="use another key">
</div>
<br>
<br>
   
<h3>Screencast</h3>
![cover letter screencast](https://losormorpino-public-media.s3.us-east-2.amazonaws.com/mm00gw4.mov)
