// src/components/EmptyState.jsx
import React from "react";
import { Link } from "react-router-dom";

export const EmptyState = ({
  icon = "📝",
  title = "Ma'lumot yo'q",
  description = "Hozircha hech narsa yo'q",
  actionText,
  actionLink,
  onAction,
  className = "",
}) => {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>

      {actionText && (actionLink || onAction) && (
        <div>
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
