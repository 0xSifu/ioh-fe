"use client";

import StoryContainer from "../components/ui/StoryContainer";
import StoryBox from "./components/StoryBox";
import Timeline from "./components/TimelineBox";
import { Suspense, useState } from "react";

const StoryPage = () => {
  const [activeTab, setActiveTab] = useState<'newStory' | 'timeline'>('newStory');

  const handleTabChange = (tab: 'newStory' | 'timeline') => {
    setActiveTab(tab);
  };

  return (
    <StoryContainer
      title="Stories"
      description="Post your stories here"
      activeTab={activeTab}
      handleTabChange={handleTabChange}
    >
      <Suspense fallback={<p className="text-gray-600">Loading...</p>}>
        {activeTab === 'newStory' && <StoryBox />}
        {activeTab === 'timeline' && <Timeline />}
      </Suspense>
    </StoryContainer>
  );
};

export default StoryPage;
