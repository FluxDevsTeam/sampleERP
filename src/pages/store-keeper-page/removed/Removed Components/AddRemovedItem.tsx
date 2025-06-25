import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/pages/shop/Modal";
import SearchablePaginatedDropdown from "../../raw-materials/Raw Materials Component/SearchablePaginatedDropdown";

const AddRemovedItem: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    material: "",
    product: "",
    quantity: "",
  });
  const [materialSearch, setMaterialSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestBody = {
        item: parseInt(formData.material),
        product: parseInt(formData.product),
        quantity: parseFloat(formData.quantity),
      };

      const response = await fetch(
        "https://backend.kidsdesigncompany.com/api/removed/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add item. Please check your inputs.");
      }

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item added successfully!",
        type: "success",
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: error instanceof Error ? error.message : "An unknown error occurred.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate("/store-keeper/removed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/store-keeper/removed")}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-500">Add Removed Item</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <SearchablePaginatedDropdown
              endpoint="https://backend.kidsdesigncompany.com/api/raw-materials/"
              label="Raw Material"
              name="material"
              resultsKey="results.items"
              value={materialSearch}
              onChange={handleDropdownChange}
              onSearchChange={setMaterialSearch}
            />
          </div>

          <div>
            <SearchablePaginatedDropdown
              endpoint="https://backend.kidsdesigncompany.com/api/product/"
              label="Product"
              name="product"
              resultsKey="results"
              value={productSearch}
              onChange={handleDropdownChange}
              onSearchChange={setProductSearch}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>



          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("/store-keeper/removed")}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Adding..." : "Add Item"}
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

export default AddRemovedItem;
