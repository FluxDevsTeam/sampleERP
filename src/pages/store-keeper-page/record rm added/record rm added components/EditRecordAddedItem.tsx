import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import Modal from "@/pages/shop/Modal";
import recordRMAddedData from "@/data/store-keeper-page/record-rm-added/record-rm-added.json";
import rawMaterialsData from "@/data/store-keeper-page/raw-materials/raw-materials.json";

interface RawMaterial {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  price: number;
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
  const [materialDetails, setMaterialDetails] = useState<{ quantity: number; price: number } | null>(null);
  const [originalQuantity, setOriginalQuantity] = useState<number>(0);

  useEffect(() => {
    const fetchItem = () => {
      const dailyData = recordRMAddedData.daily_data;
      let entry;
      for (const day of dailyData) {
        entry = day.entries.find((e) => e.id.toString() === id);
        if (entry) break;
      }
      if (entry) {
        setFormData({
          material: entry.material?.id.toString() || "",
          quantity: entry.quantity || "",
          cost_price: entry.cost_price || "",
          date: entry.date ? entry.date.slice(0, 10) : "",
        });
        setOriginalQuantity(Number(entry.quantity) || 0);
        const material = rawMaterialsData.results.items.find(
          (m: any) => m.id.toString() === entry.material?.id.toString()
        );
        if (material) {
          setMaterialDetails({
            quantity: Number(material.quantity) || 0,
            price: Number(material.price) || 0,
          });
        }
      } else {
        setModalConfig({
          isOpen: true,
          title: "Error",
          message: "Item not found",
          type: "error",
        });
      }
    };

    fetchItem();
    setRawMaterials(rawMaterialsData.results.items);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setTimeout(() => {
        setModalConfig({
          isOpen: true,
          title: "Success",
          message: "Item updated successfully",
          type: "success",
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to update item",
        type: "error",
      });
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
          <h1 className="text-2xl font-bold text-black-800">Edit Item Record</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-700">Item</label>
            <h3 className="mt-1 text-lg font-semibold text-gray-500">
              {rawMaterials.find((material) => material.id.toString() === formData.material)?.name || ""}
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              min={1}
              max={materialDetails ? materialDetails.quantity + originalQuantity : undefined}
              onChange={(e) => {
                let val = e.target.value;
                if (materialDetails && Number(val) > materialDetails.quantity + originalQuantity) {
                  val = (materialDetails.quantity + originalQuantity).toString();
                }
                setFormData({ ...formData, quantity: val });
              }}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              required
              disabled={!formData.material}
            />
            {materialDetails && (
              <div className="text-xs text-black mt-1">Max: {(materialDetails.quantity + originalQuantity).toLocaleString()}</div>
            )}
            {materialDetails && (
              <div className="mt-2 text-xs text-black">
                <div>Available Quantity: <span className="font-semibold">{(materialDetails.quantity + originalQuantity).toLocaleString()}</span></div>
                <div>Unit Price: <span className="font-semibold">₦{materialDetails.price.toLocaleString()}</span></div>
              </div>
            )}
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