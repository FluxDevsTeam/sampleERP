import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../Modal";
import inventoryDataJson from "@/data/shop/inventory/inventory.json";

const EditItemPage: React.FC = () => {
  const userRole = localStorage.getItem("user_role");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (userRole !== "ceo") {
      navigate("/inventory");
    }
  }, [userRole, navigate]);

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

    const item = inventoryDataJson.items.find(
      (item) => item.id === Number(id)
    );
    if (item) {
      setFormData({
        name: item.name || "",
        category: item.inventory_category?.id?.toString() || "",
        stock: item.stock?.toString() || "",
        description: item.description || "",
        dimensions: item.dimensions || "",
        cost_price: item.cost_price?.toString() || "",
        selling_price: item.selling_price?.toString() || "",
        image: null,
      });
    }
  }, [id]);

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
      // Simulate updating item (non-persistent)
      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating item:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: `Failed to update item: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate("/inventory");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 ${
          modalConfig.isOpen ? "hidden" : ""
        }`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/inventory")}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-600">Edit Item</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dimensions
            </label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) =>
                setFormData({ ...formData, dimensions: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cost Price
            </label>
            <input
              type="number"
              value={formData.cost_price}
              onChange={(e) =>
                setFormData({ ...formData, cost_price: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Selling Price
            </label>
            <input
              type="number"
              value={formData.selling_price}
              onChange={(e) =>
                setFormData({ ...formData, selling_price: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Image (optional)
            </label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFormData({ ...formData, image: e.target.files[0] });
                }
              }}
              className="mt-1 block w-full"
              accept="image/*"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Item"}
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

export default EditItemPage;