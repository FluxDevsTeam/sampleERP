import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/pages/shop/Modal";
import SearchablePaginatedDropdown from "../../raw-materials/Raw Materials Component/SearchablePaginatedDropdown";

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
    item: "", // Changed from material to item
    quantity: "",
    cost_price: "",
  });

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const handleDropdownChange = async (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If the item is selected, fetch its details and prefill cost_price
    if (name === "item" && value) {
      try {
        const response = await fetch(`https://backend.kidsdesigncompany.com/api/raw-materials/${value}/`, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            cost_price: data.price ? data.price.toString() : ""
          }));
        }
      } catch (error) {
        console.error("Error fetching raw material details:", error);
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

    const payload = {
      item: parseInt(formData.item), // Changed from material to item
      quantity: parseFloat(formData.quantity),
      cost_price: parseFloat(formData.cost_price),
    };

    console.log('Submitting payload:', payload);

    try {
      const response = await fetch(
        "https://backend.kidsdesigncompany.com/api/add-raw-materials/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      // Log raw response text if not OK
      if (!response.ok) {
        const text = await response.text();
        console.error("Raw response:", text);
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          throw new Error("Server returned non-JSON response: " + text.slice(0, 100));
        }
        throw new Error(errorData.detail || errorData.item || "Failed to add raw material");
      }

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Raw material added successfully!",
        type: "success"
      });
    } catch (error) {
      console.error("Error adding raw material:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to add raw material",
        type: "error"
      });
    } finally {
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/store-keeper/record-rm-added")}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-500">Add Raw Material</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <SearchablePaginatedDropdown
              endpoint="https://backend.kidsdesigncompany.com/api/raw-materials/"
              label="Raw Material"
              name="item"
              resultsKey="results.items"
              value={materialSearch}
              onChange={handleDropdownChange}
              onSearchChange={setMaterialSearch}
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
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              step="0.01" // Allow decimal inputs
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cost Price
            </label>
            <input
              type="number"
              name="cost_price"
              value={formData.cost_price}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              step="0.01"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitLoading}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                submitLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitLoading ? "Adding..." : "Add Raw Material"}
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