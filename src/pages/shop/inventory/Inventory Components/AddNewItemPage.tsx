import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Whisper, Tooltip } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Modal from "../../Modal";
import inventoryDataJson from "@/data/shop/inventory/inventory.json";

const AddItemPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    description: "",
    dimensions: "",
    cost_price: "",
    selling_price: "",
    image: null as File | null,
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    setCategories(inventoryDataJson.categories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.name ||
        !formData.category ||
        !formData.stock ||
        !formData.dimensions ||
        !formData.cost_price ||
        !formData.selling_price
      ) {
        throw new Error("All required fields must be filled");
      }
      // Simulate adding item (non-persistent)
      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding item:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to add item",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate(`/inventory`);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-8 pb-20">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/inventory")}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-600">Add New Item</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Whisper
                followCursor
                speaker={
                  <Tooltip className="text-red-500">
                    Can't find the category you are looking for? Click to add new
                    category
                  </Tooltip>
                }
              >
                <button
                  type="button"
                  className="text-gray-600 border-2 border-gray-500 rounded-md mt-2 mr-2 p-2"
                  onClick={() => navigate("/inventory/add-new-category")}
                >
                  Add category
                </button>
              </Whisper>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dimensions
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.dimensions}
                onChange={(e) =>
                  setFormData({ ...formData, dimensions: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cost Price
              </label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.cost_price}
                onChange={(e) =>
                  setFormData({ ...formData, cost_price: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Selling Price
              </label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.selling_price}
                onChange={(e) =>
                  setFormData({ ...formData, selling_price: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setFormData({ ...formData, image: e.target.files[0] });
                }
              }}
              className="mt-1 block w-full"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600 ${
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

export default AddItemPage;