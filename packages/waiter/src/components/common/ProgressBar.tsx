import React from "react";

interface ProgressBarProps {
  percent: number; // Percentage of progress (0-100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => {
  return (
    <div className="relative w-full h-2 bg-gray-200 rounded-full">
      <div
        className="absolute top-0 left-0 h-full bg-green-400 rounded-full"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;