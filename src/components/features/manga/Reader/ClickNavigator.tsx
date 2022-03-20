import React from "react";

interface ClickNavigatorProps {
  onLeft: () => void;
  onRight: () => void;
}

const ClickNavigator: React.FC<ClickNavigatorProps> = ({ onLeft, onRight }) => {
  return (
    <div className="absolute inset-0 hidden md:flex justify-between w-full h-full">
      <div className="w-2/5 h-full" onClick={onLeft} />
      <div className="w-2/5 h-full" onClick={onRight} />
    </div>
  );
};

export default React.memo(ClickNavigator);
