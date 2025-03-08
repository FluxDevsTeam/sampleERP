import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface Customer {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
}

const AddNewSoldItemPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [item, setItem] = useState<Item[]>([]);
  const [saleType, setSaleType] = useState<"customer" | "project" | null>(null);

  const [formData, setFormData] = useState({
    item: "",
    quantity: "",
    customer: "",
    project: "",
    logistics: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, projectsRes, itemRes] = await Promise.all([
          fetch("https://kidsdesigncompany.pythonanywhere.com/api/customer/"),
          fetch("https://kidsdesigncompany.pythonanywhere.com/api/project/"),
          fetch("https://kidsdesigncompany.pythonanywhere.com/api/inventory-item/"),
        ]);

        const customersData = await customersRes.json();
        const projectsData = await projectsRes.json();
        const itemData = await itemRes.json();

        setCustomers(customersData.results.all_customers || []);
        setProjects(projectsData.results || []);
        setItem(itemData.results || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSaleTypeChange = (type: "customer" | "project") => {
    setSaleType(type);
    // Reset the other field when changing type
    setFormData((prev) => ({
      ...prev,
      customer: type === "project" ? "" : prev.customer,
      project: type === "customer" ? "" : prev.project,
      logistics: type === "project" ? "" : prev.logistics,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://kidsdesigncompany.pythonanywhere.com/api/sold/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to add sold item");

      alert("Sale recorded successfully!");
      navigate("/shop/sold");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to record sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/shop/sold")}
            className="mr-4 text-gray-20 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-20">Record New Sale</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sale Type
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-2"
                value={saleType || ""}
                onChange={(e) =>
                  handleSaleTypeChange(e.target.value as "customer" | "project")
                }
              >
                <option value="">Select sale type</option>
                <option value="customer">Customer</option>
                <option value="project">Project</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item
              </label>

              <select
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.item}
                onChange={(e) =>
                  setFormData({ ...formData, item: e.target.value })
                }
              >
                <option value="">Select item</option>
                {item.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Common fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
            </div>

            {saleType === "customer" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer
                  </label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={formData.customer}
                    onChange={(e) =>
                      setFormData({ ...formData, customer: e.target.value })
                    }
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logistics
                  </label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={formData.logistics}
                    onChange={(e) =>
                      setFormData({ ...formData, logistics: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {saleType === "project" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project
                </label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.project}
                  onChange={(e) =>
                    setFormData({ ...formData, project: e.target.value })
                  }
                >
                  <option value="">Select project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Recording..." : "Record Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewSoldItemPage;
