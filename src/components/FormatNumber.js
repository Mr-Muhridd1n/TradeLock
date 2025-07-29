export const FormatNumber = (number) => {
  const numStr = String(number || 0);

  if (!numStr || numStr === "0") return "0";

  return numStr.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
