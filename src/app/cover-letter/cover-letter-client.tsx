"use client";

import { useMemo, useRef } from "react";
import { useChatGPTCompletions, useLocalStorage } from "@/hooks";
import { coverLetterPropmt, resume } from "@/utils";
import { LoadingDots } from "./loading-dots";
import { Copy2Clipboard } from "./copy-clipboard-icon";

export function CoverLetterClient() {
  const [jobDescription, setJobDescription] = useLocalStorage("jobDescription", "");
  const [promptVal, setPropmpVal] = useLocalStorage("coverLetterPropmp", coverLetterPropmt);
  const [resumeVal, setResumeVal] = useLocalStorage("resume", resume);
  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const promptForModel = useMemo(() => {
    return `
  ${promptVal}

  <jobdescription>
  ${jobDescription}
  </jobdescription>

  <resume>
  ${resumeVal}
  </resume>
`;
  }, [promptVal, jobDescription, resumeVal]);

  const { isLoading, completionsError, generatedCL, triggerCompletions } =
    useChatGPTCompletions(promptForModel);

  async function startStreaming() {
    try {
      await triggerCompletions();
      scrollToBios();
    } catch (error) {
      console.error("Error geting ChapGPT response");
    }
  }
  console.log({ resume: resumeVal.length, jobDescription: jobDescription.length, prompt: promptVal.length });
  return (
    <>
      <label
        htmlFor="resume"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white self-start"
      >
        Your resume
      </label>
      <textarea
        id="resume"
        value={resumeVal}
        onChange={(e) => setResumeVal(e.currentTarget.value)}
        rows={4}
        className="block p-2.5 mb-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300
        focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Paste your resume in plain text..."
      ></textarea>

      <label
        htmlFor="jobDescription"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white self-start"
      >
        Job description
      </label>
      <textarea
        id="jobDescription"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.currentTarget.value)}
        rows={4}
        className="block p-2.5 mb-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Paste copied job description..."
      ></textarea>

      <label
        htmlFor="prompt"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white self-start"
      >
        Prompt
      </label>
      <textarea
        id="prompt"
        value={promptVal}
        onChange={(e) => setPropmpVal(e.currentTarget.value)}
        rows={4}
        className="block p-2.5 mb-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Start with default prompt..."
      ></textarea>

      {!isLoading && (
        <button
          className="bg-black rounded-md text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full disabled:cursor-not-allowed"
          onClick={startStreaming}
        >
          Generate your cover letter
        </button>
      )}
      {isLoading && (
        <button
          className="bg-black rounded-md text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
        >
          <LoadingDots />
        </button>
      )}

      <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
      {!completionsError && generatedCL ? (
        <div className="flex flex-col items-start w-full relative my-10 bg-white rounded-xl shadow-md p-4 hover:bg-gray-200 transition border border-gray-200">
          <Copy2Clipboard
            textToCopy={generatedCL}
            customClasses="self-end mb-4 transform-gpu hover:bg-sky-100 rounded-md active:scale-125 hover:text-emerald-300 text-sky-400"
          />
          <p>{generatedCL}</p>
        </div>
      ) : completionsError ? (
        <div className="flex flex-col items-start w-full relative my-10 bg-white rounded-xl shadow-md p-4 hover:bg-gray-200 transition border border-gray-200">
          <p className="px-6 py-4 bg-slate-100 rounded-md text-center text-lg text-red-600">
            Error Getting Response from Model
          </p>
        </div>
      ) : null}
    </>
  );
}
