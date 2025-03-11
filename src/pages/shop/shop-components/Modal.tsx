import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full border-2 border-black-100">
        <div
          className={`text-2xl font-bold mb-4 ${
            type === "success" ? "text-blue-400" : "text-red-600"
          }`}
        >
          {title}
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
        <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              type === "success"
                ? "bg-blue-400 hover:bg-blue-600"
                : "bg-red-500 hover:bg-red-600"
            } text-white`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
