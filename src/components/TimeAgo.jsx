// src/components/TimeAgo.jsx
import React from "react";

export const TimeAgo = (dateString) => {
  const formattedDate = dateString.includes("T")
    ? dateString
    : dateString.replace(
        /(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})/,
        "$1-$2-$3T$4:$5:00"
      );

  const past = new Date(formattedDate);
  const now = new Date();

  if (isNaN(past)) return "Noto'g'ri vaqt formati";

  const diffInMs = now - past;
  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} kun oldin`;
  } else if (hours > 0) {
    return `${hours} soat oldin`;
  } else if (minutes > 0) {
    return `${minutes} daqiqa oldin`;
  } else {
    return `${seconds} soniya oldin`;
  }
};
