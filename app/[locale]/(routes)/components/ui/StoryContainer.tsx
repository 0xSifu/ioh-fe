
import StoryHeading from "@/components/ui/story-heading";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface ContainerProps {
  title: string;
  description: string;
  activeTab: 'newStory' | 'timeline';
  handleTabChange: (tab: 'newStory' | 'timeline') => void;
  children: React.ReactNode;
}

const StoryContainer = ({ title, description, activeTab, handleTabChange, children }: ContainerProps) => {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6 border-l h-full overflow-hidden">
          <StoryHeading title={title} description={description}>
            <div className="w-full max-w-2xl mx-auto flex justify-around bg-gray-100 p-2 rounded">
              <button
                onClick={() => handleTabChange('newStory')}
                className={`p-2 w-full text-center ${
                  activeTab === 'newStory' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                } rounded transition`}
              >
                New Story
              </button>
              <button
                onClick={() => handleTabChange('timeline')}
                className={`p-2 w-full text-center ${
                  activeTab === 'timeline' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                } rounded transition`}
              >
                Timeline
              </button>
            </div>
          </StoryHeading>
          <Separator />
          <div className="text-sm h-full overflow-auto pb-32 space-y-5">
            {children}
          </div>
        </div>
      );
};

export default StoryContainer;
