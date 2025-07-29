// src/components/NotificationContainer.jsx
import React from "react";
import { useAppContext } from "../context/AppContext";
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react";

export const NotificationContainer = () => {
  const { notifications, dispatch } = useAppContext();

  const removeNotification = (id) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getColors(
            notification.type
          )} rounded-lg p-4 shadow-lg max-w-sm animate-slide-in`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getIcon(notification.type)}
              <span className="text-sm font-medium">
                {notification.message}
              </span>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 hover:bg-black hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
