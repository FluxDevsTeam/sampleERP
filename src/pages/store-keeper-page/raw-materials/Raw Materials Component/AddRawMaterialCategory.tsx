import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/pages/shop/Modal";

const AddRawMaterialCategory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const [formData, setFormData] = useState({
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      setTimeout(() => {
        setModalConfig({
          isOpen: true,
          title: "Success",
          message: "Item category added successfully!",
          type: "success",
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to add category",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      setFormData({ name: "" });
      const params = new URLSearchParams(location.search);
      const returnTo = params.get("returnTo");
      const id = params.get("id");
      if (returnTo === "add") {
        navigate("/store-keeper/add-raw-material");
      } else if (returnTo === "edit" && id) {
        navigate(`/store-keeper/edit-raw-material/${id}`);
      } else {
        navigate(`/store-keeper/raw-materials`);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/store-keeper/raw-materials")}
            className="mr-4 text-gray-20 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-20">Add New Item Category</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600"
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default AddRawMaterialCategory;