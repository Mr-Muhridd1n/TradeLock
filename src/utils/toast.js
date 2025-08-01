// src/utils/toast.js
import toast from "react-hot-toast";

export const showToast = {
  success: (message) =>
    toast.success(message, {
      duration: 3000,
      position: "top-center",
    }),

  error: (message) =>
    toast.error(message, {
      duration: 4000,
      position: "top-center",
    }),

  info: (message) =>
    toast(message, {
      duration: 3000,
      position: "top-center",
      icon: "ℹ️",
    }),

  loading: (message) =>
    toast.loading(message, {
      position: "top-center",
    }),

  promise: (promise, messages) =>
    toast.promise(promise, messages, {
      position: "top-center",
    }),
};
