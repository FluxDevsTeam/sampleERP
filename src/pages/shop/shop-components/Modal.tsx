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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full border-2 border-black-100 mx-4">
        <div
          className={`text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 ${
            type === "success" ? "text-blue-400" : "text-red-600"
          }`}
        >
          {title}
        </div>
        <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">{message}</p>
        <div className="flex justify-end">
        <button
            onClick={onClose}
            className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
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
