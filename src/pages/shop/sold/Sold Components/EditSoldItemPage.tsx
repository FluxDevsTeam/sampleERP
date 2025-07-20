import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import Modal from "../../Modal";
import SearchablePaginatedDropdown from "./SearchablePaginatedDropdown";

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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
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
  // Add state to store the names for unavailable values
  const [unavailableNames, setUnavailableNames] = useState({ item: '', customer: '', project: '' });
  // Add state for selected names
  const [selectedNames, setSelectedNames] = useState({ item: '', customer: '', project: '' });
  // Add state for item details (stock and price)
  const [itemDetails, setItemDetails] = useState<{ quantity: number; price: number } | null>(null);
  const [originalQuantity, setOriginalQuantity] = useState<number>(0);

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate("/shop/sold");
    }
  };

  useEffect(() => {
    const fetchSoldItem = async () => {
      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/sold/${id}/`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        setFormData({
          quantity: data.quantity || "",
          customer: data.sold_to?.id?.toString() || "",
          project: data.linked_project?.id?.toString() || "",
          logistics: data.logistics || "",
          item: data.item_sold?.id?.toString() || "",
          date: data.date ? data.date.slice(0, 10) : "",
        });
        setSelectedNames({
          item: data.item_sold?.name || '',
          customer: data.sold_to?.name || '',
          project: data.linked_project?.name || '',
        });
        setOriginalQuantity(Number(data.quantity) || 0);
        console.log('Fetched sold item:', data);
        console.log('Set formData:', {
          quantity: data.quantity || "",
          customer: data.sold_to?.id?.toString() || "",
          project: data.linked_project?.id?.toString() || "",
          logistics: data.logistics || "",
          item: data.item_sold?.id?.toString() || "",
          date: data.date ? data.date.slice(0, 10) : "",
        });
        console.log('Set selectedNames:', {
          item: data.item_sold?.name || '',
          customer: data.sold_to?.name || '',
          project: data.linked_project?.name || '',
        });
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
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/customer/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        setCustomers(data.results.all_customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/project/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        setProjects(data.all_projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/inventory-item/",{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);

        setInventoryItems(data.results.items);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };
    fetchInventoryItems();
  }, []);

  useEffect(() => {
    // Fetch item details when item changes
    const fetchItemDetails = async () => {
      if (formData.item) {
        try {
          const response = await fetch(`https://backend.kidsdesigncompany.com/api/inventory-item/${formData.item}/`, {
            headers: {
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setItemDetails({
              quantity: Number(data.stock) || 0,
              price: Number(data.selling_price) || 0,
            });
          } else {
            setItemDetails(null);
          }
        } catch (e) {
          setItemDetails(null);
        }
      } else {
        setItemDetails(null);
      }
    };
    fetchItemDetails();
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
        logistics: formData.project
          ? null
          : parseFloat(formData.logistics) || null, // Set logistics to null if project exists
        date: formData.date,
      };

      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/sold/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update item");
      }

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
        message: `Failed to update item: ${
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

  // Add a debug log before rendering
  console.log('Rendering EditSoldItemPage with formData:', formData, 'selectedNames:', selectedNames);

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/shop/sold")}
            className="mr-4 text-gray-20 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-20">Edit Item</h1>
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
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <SearchablePaginatedDropdown
            endpoint="https://backend.kidsdesigncompany.com/api/inventory-item/"
            label="Item"
            name="item"
            onChange={(name, value) => setFormData({ ...formData, [name]: value })}
            resultsKey="results.items"
            selectedValue={formData.item}
            selectedName={selectedNames.item}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              required
              value={formData.quantity}
              onChange={e => {
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
            endpoint="https://backend.kidsdesigncompany.com/api/customer/"
            label="Customer"
            name="customer"
            onChange={(name, value) => setFormData({ ...formData, [name]: value, project: value ? '' : formData.project })}
            resultsKey="results.all_customers"
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
            endpoint="https://backend.kidsdesigncompany.com/api/project/"
            label="Project"
            name="project"
            onChange={(name, value) => setFormData({ ...formData, [name]: value, customer: value ? '' : formData.customer, logistics: value ? '' : formData.logistics })}
            resultsKey="all_projects"
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
              onChange={e => setFormData({ ...formData, logistics: e.target.value })}
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
