"use client";

import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

export default function StoryBox() {
  const { toast } = useToast();
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;
  const userId = session?.user?.id;
  
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    setIsLoading(true);
  
    if (!accessToken) {
      toast({ description: "User is not authenticated" });
      setIsLoading(false);
      return;
    }
  
    try {
      const requestBody = {
        userId: userId,
        content: input,
        media: file ? [file] : [""],
      };
  
      const response = await fetch('http://localhost:8002/api/v1/story', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      toast({
        description: "Story posted successfully!",
        title: "Success",
      });
      
      setInput('');
      setFile(null);

    } catch (error) {
      toast({ description: `Error posting story: ${error}` });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex items-start w-2/3 mx-auto mt-20">
      <form onSubmit={handleSubmit} className="w-full px-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            className="w-full border border-gray-300 rounded p-2 shadow-xl"
            value={input}
            placeholder="Write your stories ..."
            onChange={handleInputChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <FiUpload size={24} className="text-blue-500 hover:text-blue-700" />
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <button
          type="submit"
          className={`mt-2 p-2 bg-blue-500 text-white rounded shadow-xl ${
            isLoading ? "cursor-wait" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
