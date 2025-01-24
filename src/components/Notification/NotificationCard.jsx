import React from "react";

const NotificationCard = ({ type = "info", message, onClose }) => {
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-md shadow-lg flex items-center space-x-4 ${
        typeStyles[type]
      }`}
    >
      <div>
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-lg font-bold focus:outline-none hover:opacity-75"
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationCard;
