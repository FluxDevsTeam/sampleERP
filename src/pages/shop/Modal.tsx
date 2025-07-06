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
      <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 max-w-xs sm:max-w-sm w-full border-2 border-black-100 mx-2 sm:mx-4">
        <div
          className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 ${
            type === "success" ? "text-blue-400" : "text-red-600"
          }`}
        >
          {title}
        </div>
        <p className="text-gray-700 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base leading-relaxed">{message}</p>
        <div className="flex justify-end">
        <button
            onClick={onClose}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm md:text-base font-medium ${
              type === "success"
                ? "bg-blue-400 hover:bg-blue-600"
                : "bg-red-500 hover:bg-red-600"
            } text-white transition-colors duration-200`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
