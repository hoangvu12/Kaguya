import React from "react";

interface InfoItemProps {
  title: string;
  value?: string | number;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, value }) => {
  return value ? (
    <div className="text-gray-400">
      <p className="font-semibold">{title}</p>
      <p>{value}</p>
    </div>
  ) : null;
};

export default InfoItem;
