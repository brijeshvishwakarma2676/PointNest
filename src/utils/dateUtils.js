/**
 * Formats a date string to "03 Apr" (Indian style)
 */
export const formatDate = (dateString) => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-IN", { month: "short" });
  return `${day} ${month}`;
};

/**
 * Formats a date string to "10:32 am" (Indian style)
 */
export const formatTime = (dateString) => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  return date
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

/**
 * Combined date and time (optional)
 */
export const formatFullDateTime = (dateString) => {
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
};
