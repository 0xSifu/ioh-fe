import React from "react";

interface StoryHeadingProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const StoryHeading = ({ title, description, children }: StoryHeadingProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {children && <div className="flex-grow">{children}</div>}
    </div>
  );
};

export default StoryHeading;
