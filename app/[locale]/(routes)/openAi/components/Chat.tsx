"use client";

import { toast } from "react-hot-toast";
import { useCompletion } from "ai/react";

export default function AiHelpCenter() {
  const { completion, input, isLoading, handleInputChange, handleSubmit } = useCompletion({
    onFinish: () => {
      toast.success("Successfully generated completion!");
    },
  });

  return (
    <div className="mx-auto w-full h-full p-20 flex flex-col items-center justify-center gap-5 overflow-auto">
      <div className="flex items-start w-2/3">
        <form onSubmit={handleSubmit} className="w-full px-10 flex flex-col gap-2">
          <input
            className="w-full border border-gray-300 rounded p-2 shadow-xl"
            value={input}
            placeholder="Write your question ..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className={`mt-2 p-2 bg-blue-500 text-white rounded shadow-xl ${
              isLoading ? 'cursor-wait' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>
      <div className="h-full w-2/3 px-10">
        <div className="my-6">{completion}</div>
      </div>
    </div>
  );
}
