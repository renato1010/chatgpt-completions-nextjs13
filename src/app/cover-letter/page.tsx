import { CoverLetterClient } from "./cover-letter-client";
export const metadata = {
  title: "ChatGPT Custom Cover Letter",
};

export default function CoverLetter() {
  return (
    <main className="flex max-w-screen-lg mx-auto min-h-screen flex-col items-center justify-start">
      <h2 className="text-4xl font-bold capitalize">cover letter generator</h2>
      <CoverLetterClient />
    </main>
  );
}
