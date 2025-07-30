import { getTimeAgo } from "../utils/formatters";

export const TimeAgo = ({ date, className = "" }) => {
  return (
    <span className={`text-sm text-gray-500 ${className}`}>
      {getTimeAgo(date)}
    </span>
  );
};
