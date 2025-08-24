import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import Modal from "@/pages/shop/Modal";
import SearchablePaginatedDropdown from "./SearchablePaginatedDropdown";
import rawMaterialsData from "@/data/store-keeper-page/raw-materials/raw-materials.json";

const EditRawMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    price: "",
    description: "",
    image: null as File | null,
    archived: "false",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchRawMaterial = () => {
      const data = rawMaterialsData.results.items.find(
        (item: any) => item.id.toString() === id
      );
      if (data) {
        setFormData({
          name: data.name || "",
          category: data.store_category?.id.toString() || "",
          unit: data.unit || "",
          price: data.price?.toString() || "",
          description: data.description || "",
          image: null,
          archived: data.archived?.toString() || "false",
        });
        setCategoryName(data.store_category?.name || "");
      } else {
        setShowErrorModal(true);
      }
    };
    fetchRawMaterial();
  }, [id]);

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
    setLoading(true);
    try {
      setTimeout(() => {
        setShowSuccessModal(true);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setShowErrorModal(true);
      setLoading(false);
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
    setLoading(true);
    setTimeout(() => {
      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item category deleted successfully!",
        type: "success",
      });
      setFormData((prev) => ({ ...prev, category: "" }));
      setCategoryName("");
      setLoading(false);
    }, 1000);
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#60A5FA" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="w-[95vw] max-w-2xl mx-auto px-4 pt-4 pb-20 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate('/store-keeper/raw-materials')} className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl font-bold" aria-label="Back">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-black">Edit Item</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-black uppercase mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 rounded w-full text-base font-bold text-black" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-black uppercase mb-1">Category</label>
            <SearchablePaginatedDropdown
              endpoint="/data/store-keeper-page/raw-materials/raw-materials-category.json"
              label=""
              name="category"
              resultsKey="results"
              value={categoryName}
              onChange={handleDropdownChange}
              onSearchChange={setCategoryName}
            />
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => navigate(`/store-keeper/raw-materials/add-category?returnTo=edit&id=${id}`)} className="px-3 py-2 text-xs sm:text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center font-medium shadow-sm">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                <span className="inline sm:hidden">Add</span>
                <span className="hidden sm:inline">Add Category</span>
              </button>
              <button type="button" onClick={handleDeleteCategory} disabled={!formData.category || loading} className="px-3 py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center font-medium shadow-sm">
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                <span className="inline sm:hidden">Delete</span>
                <span className="hidden sm:inline">Delete Category</span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-black uppercase mb-1">Unit</label>
            <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="border p-2 rounded w-full text-base font-bold text-black" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-black uppercase mb-1">Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="border p-2 rounded w-full text-base font-bold text-black" required />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-black uppercase mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 rounded w-full text-base font-bold text-black" rows={4} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-black uppercase mb-1">Archive Status</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input type="radio" name="archived" value="true" checked={formData.archived === "true"} onChange={handleChange} className="form-radio" />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="archived" value="false" checked={formData.archived === "false"} onChange={handleChange} className="form-radio" />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-black uppercase mb-1">Image (optional)</label>
          <input type="file" name="image" onChange={handleFileChange} className="mt-1 block w-full" accept="image/*" />
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="w-full py-2 px-4 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors text-sm" disabled={loading}>{loading ? "Updating..." : "Update"}</button>
          <button type="button" onClick={() => navigate('/store-keeper/raw-materials')} className="w-full py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors text-sm">Cancel</button>
        </div>
      </form>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate(
            `/store-keeper/raw-materials?openProduct=${id}&refresh=${Date.now()}`
          );
        }}
        title="Success!"
        message="Item updated successfully."
        type="success"
      />

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message="There was an error updating the item. Please try again."
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

export default EditRawMaterial;