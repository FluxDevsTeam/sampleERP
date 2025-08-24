import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/pages/shop/Modal";
import SearchablePaginatedDropdown from "../../raw-materials/Raw Materials Component/SearchablePaginatedDropdown";
import rawMaterialsData from "@/data/store-keeper-page/raw-materials/raw-materials.json";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "error";
}

const AddToRM: React.FC = () => {
  const navigate = useNavigate();
  const [materialSearch, setMaterialSearch] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    item: "",
    quantity: "",
    cost_price: "",
  });

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const [costPriceEditable, setCostPriceEditable] = useState(false);

  const handleDropdownChange = async (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "item" && value) {
      const material = rawMaterialsData.results.items.find(
        (m: any) => m.id.toString() === value
      );
      if (material) {
        setFormData(prev => ({
          ...prev,
          cost_price: material.price ? material.price.toString() : ""
        }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      setTimeout(() => {
        setModalConfig({
          isOpen: true,
          title: "Success",
          message: "Item added successfully!",
          type: "success"
        });
        setSubmitLoading(false);
      }, 1000);
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to add item",
        type: "error"
      });
      setSubmitLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
    if (modalConfig.type === "success") {
      navigate("/store-keeper/record-rm-added");
    }
  };

  return (
    <div className="min-h-auto flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/store-keeper/record-rm-added")}
            className="mr-4 text-black-400 hover:text-blue-400 focus:outline-none"
            aria-label="Back"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-black-800">Add Item</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <SearchablePaginatedDropdown
              endpoint="/data/store-keeper-page/raw-materials/raw-materials.json"
              label="Item"
              name="item"
              resultsKey="results.items"
              value={materialSearch}
              onChange={handleDropdownChange}
              onSearchChange={setMaterialSearch}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              required
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Price</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="cost_price"
                value={formData.cost_price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                required
                step="0.01"
                readOnly={!costPriceEditable}
              />
              <button
                type="button"
                onClick={() => setCostPriceEditable((prev) => !prev)}
                className={`px-2 py-1 text-xs rounded border ${costPriceEditable ? 'border-gray-400 text-gray-600' : 'border-blue-400 text-blue-400'} hover:bg-blue-50 transition-colors`}
              >
                {costPriceEditable ? 'Lock' : 'Edit'}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitLoading}
              className={`px-4 py-2 border-2 border-blue-400 text-blue-400 rounded-lg font-semibold transition-colors duration-150 hover:bg-blue-400 hover:text-white focus:ring-2 focus:ring-blue-200 ${
                submitLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitLoading ? "Adding..." : "Add Item"}
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

export default AddToRM;