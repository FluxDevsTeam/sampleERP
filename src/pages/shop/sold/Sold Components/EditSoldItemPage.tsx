import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import Modal from "../../Modal";
import SearchablePaginatedDropdown from "./SearchablePaginatedDropdown";
import soldDataJson from "@/data/shop/sold/sold.json";

interface Customer {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

interface InventoryItem {
  id: number;
  name: string;
}

const EditSoldItemPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    quantity: "",
    customer: "",
    project: "",
    logistics: "",
    item: "",
    date: "",
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [unavailableNames, setUnavailableNames] = useState({ item: "", customer: "", project: "" });
  const [selectedNames, setSelectedNames] = useState({ item: "", customer: "", project: "" });
  const [itemDetails, setItemDetails] = useState<{ quantity: number; price: number } | null>(null);
  const [originalQuantity, setOriginalQuantity] = useState<number>(0);

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate("/shop/sold");
    }
  };

  useEffect(() => {
    const fetchSoldItem = () => {
      try {
        const sale = soldDataJson.daily_data
          .flatMap((day) => day.entries)
          .find((entry) => entry.id === parseInt(id || "0"));
        if (sale) {
          setFormData({
            quantity: sale.quantity || "",
            customer: sale.sold_to?.id?.toString() || "",
            project: sale.linked_project?.id?.toString() || "",
            logistics: sale.logistics || "",
            item: sale.item_sold?.id?.toString() || "",
            date: sale.date ? sale.date.slice(0, 10) : "",
          });
          setSelectedNames({
            item: sale.item_sold?.name || "",
            customer: sale.sold_to?.name || "",
            project: sale.linked_project?.name || "",
          });
          setOriginalQuantity(Number(sale.quantity) || 0);
        } else {
          setError("Sale record not found");
        }
      } catch (error) {
        setError("Failed to load sale data");
        console.error("Error fetching sold item:", error);
      } finally {
        setInitialDataLoading(false);
      }
    };

    if (id) fetchSoldItem();
  }, [id]);

  useEffect(() => {
    if (formData.item) {
      try {
        const item = soldDataJson.items.find((i) => i.id === parseInt(formData.item));
        if (item) {
          setItemDetails({
            quantity: Number(item.stock) || 0,
            price: Number(item.selling_price) || 0,
          });
        } else {
          setItemDetails(null);
        }
      } catch {
        setItemDetails(null);
      }
    } else {
      setItemDetails(null);
    }
  }, [formData.item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestBody = {
        quantity: parseFloat(formData.quantity),
        item: formData.item ? parseInt(formData.item) : null,
        customer: formData.customer ? parseInt(formData.customer) : null,
        project: formData.project ? parseInt(formData.project) : null,
        logistics: formData.project ? null : parseFloat(formData.logistics) || null,
        date: formData.date,
      };

      // Simulate updating JSON (in reality, update soldDataJson or use localStorage)
      console.log("Simulated PATCH with data:", requestBody);
      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating item:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: `Failed to update item: ${error instanceof Error ? error.message : "Unknown error"}`,
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
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/shop/sold")}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Item</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <SearchablePaginatedDropdown
            endpoint="items"
            label="Item"
            name="item"
            onChange={(name, value) => setFormData({ ...formData, [name]: value })}
            resultsKey="items"
            selectedValue={formData.item}
            selectedName={selectedNames.item}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              required
              value={formData.quantity}
              onChange={(e) => {
                let val = e.target.value;
                const max = itemDetails ? itemDetails.quantity + originalQuantity : undefined;
                if (max !== undefined && Number(val) > max) {
                  val = max.toString();
                }
                setFormData({ ...formData, quantity: val });
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              disabled={!formData.item}
              min={1}
              max={itemDetails ? itemDetails.quantity + originalQuantity : undefined}
            />
            {itemDetails && (
              <div className="mt-2 text-xs text-black">
                <div>Available Quantity: <span className="font-semibold">{(itemDetails.quantity + originalQuantity).toLocaleString()}</span></div>
                <div>Unit Price: <span className="font-semibold">₦{itemDetails.price.toLocaleString()}</span></div>
              </div>
            )}
          </div>
          <SearchablePaginatedDropdown
            endpoint="customers"
            label="Customer"
            name="customer"
            onChange={(name, value) => setFormData({ ...formData, [name]: value, project: value ? "" : formData.project })}
            resultsKey="customers"
            selectedValue={formData.customer}
            selectedName={selectedNames.customer}
            disabled={!!formData.project}
          />
          {formData.project && (
            <p className="mt-1 text-sm text-gray-500">
              * Customer is disabled when a project is selected
            </p>
          )}
          <SearchablePaginatedDropdown
            endpoint="projects"
            label="Project"
            name="project"
            onChange={(name, value) => setFormData({ ...formData, [name]: value, customer: value ? "" : formData.customer, logistics: value ? "" : formData.logistics })}
            resultsKey="projects"
            selectedValue={formData.project}
            selectedName={selectedNames.project}
            disabled={!!formData.customer}
          />
          {formData.customer && (
            <p className="mt-1 text-sm text-gray-500">
              * Project is disabled when a customer is selected
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Logistics (optional)</label>
            <input
              type="number"
              value={formData.logistics}
              onChange={(e) => setFormData({ ...formData, logistics: e.target.value })}
              disabled={!!formData.project}
              className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 ${formData.project ? "bg-gray-100" : ""}`}
            />
            {formData.project && (
              <p className="mt-1 text-sm text-gray-500">
                * logistics is disabled when a project is selected
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Updating..." : "Update Item"}
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

export default EditSoldItemPage;