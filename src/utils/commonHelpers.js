// src/utils/commonHelpers.js
export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })} ${date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };
  