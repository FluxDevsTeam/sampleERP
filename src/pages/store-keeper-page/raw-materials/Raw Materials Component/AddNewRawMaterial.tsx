import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../shop/Modal";
import SearchablePaginatedDropdown from "./SearchablePaginatedDropdown";
import { deleteRawMaterialCategory } from "./rawMaterialCategoryOperations";

const AddNewRawMaterial = () => {
  const navigate = useNavigate();
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
  const [categorySearch, setCategorySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
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
    setSubmitLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await fetch(
        "https://backend.kidsdesigncompany.com/api/raw-materials/",
        {
          method: "POST",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add raw material");
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding raw material:", error);
      setShowErrorModal(true);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!formData.category) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Please select a category to delete",
        type: "error",
      });
      return;
    }

    await deleteRawMaterialCategory(
      formData.category,
      setLoading,
      setModalConfig,
      () => {
        setFormData(prev => ({ ...prev, category: "" }));
        setCategorySearch("");
      }
    );
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div
        className={`max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 ${
          showSuccessModal || showErrorModal ? "hidden" : ""
        }`}
      >
        <div className="flex items-center mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/store-keeper/raw-materials")}
            className="mr-3 sm:mr-4 text-gray-20 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-20">Add Raw Material</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                <button
                  type="button"
                  onClick={() => navigate("/store-keeper/raw-materials/add-category")}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center font-medium shadow-sm"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1 sm:mr-2" />
                  Add Category
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  disabled={!formData.category || loading}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center font-medium shadow-sm"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1 sm:mr-2" />
                  Delete Category
                </button>
              </div>
            </div>
            <SearchablePaginatedDropdown
              endpoint="https://backend.kidsdesigncompany.com/api/raw-materials-category/"
              label=""
              name="category"
              resultsKey="results"
              value={categorySearch}
              onChange={handleDropdownChange}
              onSearchChange={setCategorySearch}
            />
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base"
              required
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base"
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base"
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
                <span className="ml-2 text-sm sm:text-base">Yes</span>
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
                <span className="ml-2 text-sm sm:text-base">No</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image (optional)
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm sm:text-base"
              accept="image/*"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitLoading}
              className={`px-3 sm:px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 text-sm sm:text-base ${
                submitLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitLoading ? "Adding..." : "Add Raw Material"}
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/store-keeper/raw-materials");
        }}
        title="Success!"
        message="Raw material added successfully."
        type="success"
      />

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message="There was an error adding the raw material. Please try again."
        type="error"
      />

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

export default AddNewRawMaterial;
