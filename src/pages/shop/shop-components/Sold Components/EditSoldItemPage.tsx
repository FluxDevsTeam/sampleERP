import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import Modal from "../Modal";

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
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

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
          `https://kidsdesigncompany.pythonanywhere.com/api/sold/${id}/`
        );
        const data = await response.json();
        setFormData({
          quantity: data.quantity || "",
          customer: data.customer?.id.toString() || "",
          project: data.project?.id.toString() || "",
          logistics: data.logistics || "",
          item: data.item?.id.toString() || "",
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
          "https://kidsdesigncompany.pythonanywhere.com/api/customer/"
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
          "https://kidsdesigncompany.pythonanywhere.com/api/project/"
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
          "https://kidsdesigncompany.pythonanywhere.com/api/inventory-item/"
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
      };

      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/sold/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
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

  return (
    <div className="container mx-auto px-4 py-8">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item
            </label>
            <select
              value={formData.item}
              onChange={(e) =>
                setFormData({ ...formData, item: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select item</option>
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
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
              required
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customers
            </label>
            <select
              value={formData.customer}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer: e.target.value,
                  project: e.target.value ? "" : formData.project,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              disabled={!!formData.project}
            >
              <option value="">Pick customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            {formData.project && (
              <p className="mt-1 text-sm text-gray-500">
                * customer selection is disabled when a project is selected
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project
            </label>
            <select
              value={formData.project}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  project: e.target.value,
                  customer: e.target.value ? "" : formData.customer,
                  logistics: e.target.value ? "" : formData.logistics, // Clear logistics when project selected
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              disabled={!!formData.customer}
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {formData.customer && (
              <p className="mt-1 text-sm text-gray-500">
                * project selection is disabled when a customer is selected
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Logistics
            </label>
            <input
              type="number"
              value={formData.logistics}
              onChange={(e) =>
                setFormData({ ...formData, logistics: e.target.value })
              }
              disabled={!!formData.project}
              className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 ${
                formData.project ? "bg-gray-100" : ""
              }`}
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
              className={`px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
