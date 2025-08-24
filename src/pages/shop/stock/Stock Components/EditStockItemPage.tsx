import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import Modal from "../../Modal";
import stockData from "../../../../data/shop/stock/stockData.json";

const EditStockItemPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    quantity: "",
    date: "",
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [itemDetails, setItemDetails] = useState<{ quantity: number; price: number } | null>(null);
  const [originalQuantity, setOriginalQuantity] = useState<number>(0);

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate("/shop/stock");
    }
  };

  useEffect(() => {
    const fetchStockItem = () => {
      try {
        const stockItem = stockData.daily_data
          .flatMap(day => day.entries)
          .find(entry => entry.id === Number(id));
        
        if (!stockItem) {
          throw new Error("Stock item not found");
        }

        setFormData({
          quantity: stockItem.quantity || "",
          date: stockItem.date ? stockItem.date.slice(0, 10) : "",
        });
        setOriginalQuantity(Number(stockItem.quantity) || 0);

        const inventoryItem = stockData.inventory_items.find(item => item.id === stockItem.inventory_item.id);
        if (inventoryItem) {
          setItemDetails({
            quantity: Number(inventoryItem.quantity) || 0,
            price: Number(inventoryItem.cost_price) || 0,
          });
        }
      } catch (error) {
        setError("Failed to load stock data");
        console.error("Error fetching stock item:", error);
      } finally {
        setInitialDataLoading(false);
      }
    };
    if (id) fetchStockItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestBody = {
        quantity: parseFloat(formData.quantity),
        date: formData.date,
      };

      // Simulate update (log to console)
      console.log("Updating stock item:", requestBody);
      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Stock updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: `Failed to add stock: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialDataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#60A5FA" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="min-h-auto flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/shop/stock")}
            className="mr-4 text-black-400 hover:text-blue-400 focus:outline-none"
            aria-label="Back"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-black">Edit Stock</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              required
              value={formData.quantity}
              min={1}
              max={itemDetails ? itemDetails.quantity + originalQuantity : undefined}
              onChange={(e) => {
                let val = e.target.value;
                if (itemDetails && Number(val) > itemDetails.quantity + originalQuantity) {
                  val = (itemDetails.quantity + originalQuantity).toString();
                }
                setFormData({ ...formData, quantity: val });
              }}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              disabled={!itemDetails}
            />
            {itemDetails && (
              <div className="text-xs text-black mt-1">Max: {(itemDetails.quantity + originalQuantity).toLocaleString()}</div>
            )}
            {itemDetails && (
              <div className="mt-2 text-xs text-black">
                <div>Available Quantity: <span className="font-semibold">{(itemDetails.quantity + originalQuantity).toLocaleString()}</span></div>
                <div>Unit Price: <span className="font-semibold">₦{itemDetails.price.toLocaleString()}</span></div>
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border-2 border-blue-400 text-blue-400 rounded-lg font-semibold transition-colors duration-150 hover:bg-blue-400 hover:text-white focus:ring-2 focus:ring-blue-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Stock"}
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

export default EditStockItemPage;