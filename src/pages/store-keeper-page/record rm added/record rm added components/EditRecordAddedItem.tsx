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
          `https://backend.kidsdesigncompany.com/api/add-raw-materials/${id}/`, {
            method: "GET",
            headers: {
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            }
          }
        );
        if (!response.ok) throw new Error("Failed to fetch item");
        const data = await response.json();
        setFormData({
          material: data.material?.id.toString() || "",
          quantity: data.quantity || "",
          cost_price: data.cost_price || "",
          date: data.date ? data.date.slice(0, 10) : "",
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
        "https://backend.kidsdesigncompany.com/api/raw-materials/", {
          method: "GET",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
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
        `https://backend.kidsdesigncompany.com/api/add-raw-materials/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: formData.quantity,
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
          <h1 className="text-2xl font-bold text-black-800">Edit Raw Material Record</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-700">Raw Material</label>
            <h3 className="mt-1 text-lg font-semibold text-gray-500">
              {rawMaterials.find((material) => material.id.toString() === formData.material)?.name || ""}
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/store-keeper/record-rm-added")}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold transition-colors hover:bg-gray-300 hover:text-black focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border-2 border-blue-400 text-blue-400 rounded-lg font-semibold transition-colors hover:bg-blue-400 hover:text-white focus:ring-2 focus:ring-blue-200 ${
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
