import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";

const EditItemPage: React.FC = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [formData, setFormData] = useState({
    name: location.state?.productData?.name || "",
    category: location.state?.productData?.category || "",
    stock: location.state?.productData?.stock || "",
    description: location.state?.productData?.description || "",
    dimensions: location.state?.productData?.dimensions || "",
    cost_price: location.state?.productData?.costPrice || "",
    selling_price: location.state?.productData?.sellingPrice || "",
    image: null as File | null,
  });

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate("/shop/inventory");
    }
  };

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/inventory-item-category/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          } }
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Only append fields that have changed
      if (formData.name !== location.state?.productData?.name) {
        formDataToSend.append("name", formData.name);
      }
      if (formData.category !== location.state?.productData?.category) {
        formDataToSend.append("category", formData.category);
      }
      if (formData.stock !== location.state?.productData?.stock) {
        formDataToSend.append("stock", formData.stock);
      }
      if (formData.description !== location.state?.productData?.description) {
        formDataToSend.append("description", formData.description);
      }
      if (formData.dimensions !== location.state?.productData?.dimensions) {
        formDataToSend.append("dimensions", formData.dimensions);
      }
      if (formData.cost_price !== location.state?.productData?.costPrice) {
        formDataToSend.append("cost_price", formData.cost_price);
      }
      if (
        formData.selling_price !== location.state?.productData?.sellingPrice
      ) {
        formDataToSend.append("selling_price", formData.selling_price);
      }
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/inventory-item/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update item");
      }

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/shop/dashboard")}
            className="mr-4 text-gray-20 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-20">Edit Item</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
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

          {/* Category */}
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

          {/* Other fields... */}
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
