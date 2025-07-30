// src/utils/toast.js
import toast from "react-hot-toast";

export const showToast = {
  success: (message) =>
    toast.success(message, {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#10B981",
        color: "#fff",
        fontWeight: "500",
        borderRadius: "12px",
        padding: "12px 16px",
      },
    }),

  error: (message) =>
    toast.error(message, {
      duration: 4000,
      position: "top-center",
      style: {
        background: "#EF4444",
        color: "#fff",
        fontWeight: "500",
        borderRadius: "12px",
        padding: "12px 16px",
      },
    }),

  info: (message) =>
    toast(message, {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#3B82F6",
        color: "#fff",
        fontWeight: "500",
        borderRadius: "12px",
        padding: "12px 16px",
      },
    }),

  loading: (message) =>
    toast.loading(message, {
      position: "top-center",
      style: {
        background: "#6B7280",
        color: "#fff",
        fontWeight: "500",
        borderRadius: "12px",
        padding: "12px 16px",
      },
    }),
};
