// src/utils/dateUtils.js

/**
 * Formats a Date object (or valid date string) into "DD-MM-YYYY" format
 * @param {Date | string} dateInput - The date to format
 * @returns {string} formatted date string like "13-09-2025"
 */
export function formatDate(dateInput) {
  if (!dateInput) return "";

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // month is zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
