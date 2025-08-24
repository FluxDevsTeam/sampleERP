import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/pages/shop/Modal";
import SearchablePaginatedDropdown from "../../raw-materials/Raw Materials Component/SearchablePaginatedDropdown";
import rawMaterialsData from "@/data/store-keeper-page/raw-materials/raw-materials.json";
import productsData from "@/data/store-keeper-page/removed/products.json";

const AddRemovedItem: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    material: "",
    product: "",
    quantity: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [materialSearch, setMaterialSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [materialDetails, setMaterialDetails] = useState<{ quantity: number; price: number } | null>(null);

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "material" && value) {
      const material = rawMaterialsData.results.items.find(
        (m: any) => m.id.toString() === value
      );
      if (material) {
        setMaterialDetails({
          quantity: Number(material.quantity) || 0,
          price: Number(material.price) || 0,
        });
      } else {
        setMaterialDetails(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setTimeout(() => {
        setModalConfig({
          isOpen: true,
          title: "Success",
          message: "Item added successfully!",
          type: "success",
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to add item.",
        type: "error",
      });
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
            className="mr-4 text-black-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-black-500">Remove Item</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <SearchablePaginatedDropdown
              endpoint="/data/store-keeper-page/raw-materials/raw-materials.json"
              label="Item"
              name="material"
              resultsKey="results.items"
              value={materialSearch}
              onChange={handleDropdownChange}
              onSearchChange={setMaterialSearch}
            />
            {materialDetails && (
              <div className="mt-2 text-xs text-black">
                <div>Available Quantity: <span className="font-semibold">{materialDetails.quantity.toLocaleString()}</span></div>
                <div>Unit Price: <span className="font-semibold">₦{materialDetails.price.toLocaleString()}</span></div>
              </div>
            )}
          </div>

          <div>
            <SearchablePaginatedDropdown
              endpoint="/data/store-keeper-page/removed/products.json"
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
              min={1}
              max={materialDetails ? materialDetails.quantity : undefined}
              onChange={(e) => {
                let val = e.target.value;
                if (materialDetails && Number(val) > materialDetails.quantity) {
                  val = materialDetails.quantity.toString();
                }
                setFormData({ ...formData, quantity: val });
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              disabled={!formData.material}
            />
            {materialDetails && (
              <div className="text-xs text-black mt-1">Max: {materialDetails.quantity.toLocaleString()}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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