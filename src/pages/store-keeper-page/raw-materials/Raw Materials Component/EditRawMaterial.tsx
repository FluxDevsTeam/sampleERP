import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import Modal from "@/pages/shop/Modal";

const EditRawMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    price: "",
    description: "",
    image: null as File | null,
    archived: "false",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch raw material details
  useEffect(() => {
    const fetchRawMaterial = async () => {
      try {
        const response = await fetch(
          `https://kidsdesigncompany.pythonanywhere.com/api/raw-materials/${id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch raw material");
        const data = await response.json();
        setFormData({
          name: data.name || "",
          category: data.store_category?.id.toString() || "",
          quantity: data.quantity?.toString() || "",
          unit: data.unit || "",
          price: data.price?.toString() || "",
          description: data.description || "",
          image: null,
          archived: data.archived?.toString() || "false",
        });
      } catch (error) {
        console.error("Error fetching raw material:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `https://kidsdesigncompany.pythonanywhere.com/api/raw-materials-category/`,
          {
            method: "GET",
            headers: {
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchRawMaterial();
    fetchCategories();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/raw-materials/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update raw material");
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating raw material:", error);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#60A5FA" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 ${
          showSuccessModal || showErrorModal ? "hidden" : ""
        }`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/store-keeper/raw-materials")}
            className="mr-4 text-gray-20 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-20">Edit Raw Material</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select a category</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archive Status
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="archived"
                  value="true"
                  checked={formData.archived === "true"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="archived"
                  value="false"
                  checked={formData.archived === "false"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate(
            `/store-keeper/raw-materials?openProduct=${id}&refresh=${Date.now()}`
          );
        }}
        title="Success!"
        message="Raw material updated successfully."
        type="success"
      />

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message="There was an error updating the raw material. Please try again."
        type="error"
      />
    </div>
  );
};

export default EditRawMaterial;
