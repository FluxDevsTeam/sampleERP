import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../Modal";

const EditItemPage: React.FC = () => {
  const userRole = localStorage.getItem("user_role");
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== "ceo") {
      navigate("/shop/inventory");
    }
  }, [userRole, navigate]);

  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [nextCategoriesUrl, setNextCategoriesUrl] = useState<string | null>(null);
  const [prevCategoriesUrl, setPrevCategoriesUrl] = useState<string | null>(null);
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

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate("/shop/inventory");
      const fetchUpdatedProduct = async () => {
        try {
          const response = await fetch(
            `https://backend.kidsdesigncompany.com/api/inventory-item/${id}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Iyegs... Failed to fetch updated product data");
          }
          const updatedData = await response.json();

          navigate("/shop/inventory", {
            state: {
              from: "editItem",
              productData: updatedData,
            },
          });
        } catch (error) {
          navigate("/shop/inventory");
        }
      };
      fetchUpdatedProduct();
    }
  };

  const fetchCategories = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (data.results) {
        setCategories(data.results);
        setNextCategoriesUrl(data.next);
        setPrevCategoriesUrl(data.previous);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories(
      "https://backend.kidsdesigncompany.com/api/inventory-item-category/"
    );
  }, []);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/inventory-item/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const itemData = await response.json();

        setFormData({
          name: itemData.name || "",
          category: itemData.category?.toString() || "",
          stock: itemData.stock || "",
          description: itemData.description || "",
          dimensions: itemData.dimensions || "",
          cost_price: itemData.cost_price || "",
          selling_price: itemData.selling_price || "",
          image: null,
        });
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    if (id) {
      fetchItemData();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Send all form data values
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image" && value !== "" && value !== null) {
          // Skip empty values, null values and image
          formDataToSend.append(key, value.toString());
        }
      });

      // Only append image if a new one is selected
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
      <div
        className={`max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 ${
          modalConfig.isOpen ? "hidden" : ""
        }`}
      >
        <div className={`flex items-center mb-6`}>
          <button
            onClick={() => navigate("/shop/inventory")}
            className="mr-4 text-gray-20 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-20">Edit Item</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`space-y-6 ${modalConfig.isOpen ? "hidden" : ""}`}
        >
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
              name="category"
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
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={() =>
                  prevCategoriesUrl && fetchCategories(prevCategoriesUrl)
                }
                disabled={!prevCategoriesUrl}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  nextCategoriesUrl && fetchCategories(nextCategoriesUrl)
                }
                disabled={!nextCategoriesUrl}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
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
