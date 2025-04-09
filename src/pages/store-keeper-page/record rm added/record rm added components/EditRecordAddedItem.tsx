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

const EditRecordRemovedItem: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [formData, setFormData] = useState({
    material: "",
    quantity: "",
    cost_price: "",
    date: "",
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `https://kidsdesigncompany.pythonanywhere.com/api/add-raw-materials/${id}/`
        );
        if (!response.ok) throw new Error("Failed to fetch item");
        const data = await response.json();
        setFormData({
          material: data.material?.id.toString() || "",
          quantity: data.quantity || "",
          cost_price: data.cost_price || "",
          date: data.date || "",
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchItem();
  }, [id]);

  const fetchRawMaterials = async () => {
    try {
      const response = await fetch(
        "https://kidsdesigncompany.pythonanywhere.com/api/raw-materials/"
      );
      if (!response.ok) throw new Error("Failed to fetch raw materials");
      const data = await response.json();
      setRawMaterials(data.results?.items || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/add-raw-materials/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            material: parseInt(formData.material),
            quantity: formData.quantity,
            cost_price: formData.cost_price,
            date: formData.date,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update item");

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item updated successfully",
        type: "success",
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to update item",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate("/store-keeper/record-removed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/store-keeper/record-removed")}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Raw Material Record
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Raw Material
            </label>
            <select
              value={formData.material}
              onChange={(e) =>
                setFormData({ ...formData, material: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Raw Material</option>
              {rawMaterials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
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
              Cost Price
            </label>
            <input
              type="number"
              value={formData.cost_price}
              onChange={(e) =>
                setFormData({ ...formData, cost_price: e.target.value })
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

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/store-keeper/record-removed")}
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
              {loading ? "Updating..." : "Update Record"}
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

export default EditRecordRemovedItem;
