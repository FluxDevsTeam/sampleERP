import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import Modal from "@/pages/shop/Modal";

interface RawMaterial {
  id: number;
  name: string;
  unit: string;
}

interface Product {
  id: number;
  name: string;
  selling_price: string;
  progress: number;
}

interface RemovedItem {
  id: number;
  raw_material: RawMaterial;
  name: string;
  quantity: string;
  price: string;
  product_its_used: Product;
  date: string;
}

const EditRemovedItem: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [rawMaterial, setRawMaterial] = useState<any>(null);
  const [products, setProducts] = useState<[]>([]);
  const [formData, setFormData] = useState({
    raw_material: "",
    product: "",
    quantity: "",
    date: "",
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [itemData, setItemData] = useState<RemovedItem | null>(null);

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate("/store-keeper/removed");
    }
  };

  const fetchRM = async () => {
    try {
      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/raw-materials/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch raw material data");
      }
      const data = await response.json();
      setRawMaterial(data);
    } catch (error) {
      console.error("Error fetching raw material data:", error);
    } finally {
      setInitialDataLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/product/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }
      const data = await response.json();
      // Set products array from results
      setProducts(data.results || []);
      console.log("products: ", data.results);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRM();
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `https://kidsdesigncompany.pythonanywhere.com/api/removed/${id}/`
        );
        if (!response.ok) throw new Error("Failed to fetch item");
        const data: RemovedItem = await response.json();
        setItemData(data);

        // Set form data with existing values
        setFormData({
          raw_material: data.raw_material?.id?.toString() || "",
          product: data.product_its_used?.id?.toString() || "",
          quantity: data.quantity || "",
          date: data.date || "",
        });
      } catch (error) {
        console.error("Error:", error);
        setModalConfig({
          isOpen: true,
          title: "Error",
          message: "Failed to load item data",
          type: "error",
        });
      }
    };

    if (id) fetchItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestBody = {
        raw_material: parseInt(formData.raw_material),
        product_its_used: parseInt(formData.product),
        quantity: parseFloat(formData.quantity),
        date: formData.date,
      };

      console.log("Sending request:", requestBody);

      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/removed/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.detail || "Failed to update item");
      }

      const responseData = await response.json();
      console.log("Success response:", responseData);

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
        message:
          error instanceof Error ? error.message : "Failed to update item",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update form state for product selection
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      product: e.target.value,
    });
  };

  if (initialDataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#60A5FA" height={50} width={50} />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Removed Item
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Raw Material
            </label>
            <select
              value={formData.raw_material}
              onChange={(e) =>
                setFormData({ ...formData, raw_material: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Raw Material</option>
              {rawMaterial.results.items.map((rm: RawMaterial) => (
                <option key={rm.id} value={rm.id}>
                  {rm.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product
            </label>
            <select
              value={formData.product}
              onChange={handleProductChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Product</option>
              {Array.isArray(products) &&
                products.map((product: any) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
            </select>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
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

export default EditRemovedItem;
