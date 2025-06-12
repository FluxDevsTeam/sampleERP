import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "@/pages/shop/Modal";

interface QuotationItem {
  name: string;
  quantity: number;
}

interface Contractor {
  id: number;
  first_name: string;
  last_name: string;
}

interface Worker {
  id: number;
  first_name: string;
  last_name: string;
}

interface QuotationData {
  department: string;
  quotation: QuotationItem[];
  contractor: number[];
  salary_worker: number[];
}

const AddQuotation: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const [department, setDepartment] = useState("");
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([
    { name: "", quantity: 0 },
  ]);
  const [selectedContractors, setSelectedContractors] = useState<number[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([]);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://kidsdesigncompany.pythonanywhere.com/api/product/${productId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchWorkersAndContractors = async () => {
      try {
        const [contractorsRes, workersRes] = await Promise.all([
          fetch(
            "https://kidsdesigncompany.pythonanywhere.com/api/contractors/", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              },
            }
          ),
          fetch(
            "https://kidsdesigncompany.pythonanywhere.com/api/salary-workers/", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              },
            }
          ),
        ]);

        if (!contractorsRes.ok || !workersRes.ok) {
          throw new Error("Failed to fetch workers or contractors");
        }

        const contractorsData = await contractorsRes.json();
        const workersData = await workersRes.json();

        setContractors(contractorsData.results.contractor);
        setWorkers(workersData.results.workers);
      } catch (error) {
        console.error("Error:", error);
        setContractors([]);
        setWorkers([]);
      }
    };

    fetchWorkersAndContractors();
  }, []);

  const addQuotationItem = () => {
    setQuotationItems([...quotationItems, { name: "", quantity: 0 }]);
  };

  const removeQuotationItem = (index: number) => {
    setQuotationItems(quotationItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create the properly structured data
    const quotationData: QuotationData = {
      department,
      quotation: quotationItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      contractor: selectedContractors,
      salary_worker: selectedWorkers,
    };

    try {
      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/product/${productId}/quotation/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(quotationData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add quotation");
      }

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Quotation added successfully!",
        type: "success",
      });

      // Clear form data after successful submission
      setDepartment("");
      setQuotationItems([{ name: "", quantity: 0 }]);
      setSelectedContractors([]);
      setSelectedWorkers([]);

      // Navigate back to products table with state to open product details
      setTimeout(() => {
        navigate("/project-manager/main", {
          state: {
            from: "addQuotation",
            productData: product,
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to add quotation",
        type: "error",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 ${
          modalConfig.isOpen ? "hidden" : ""
        }`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() =>
              navigate("/project-manager/main", {
                state: {
                  from: "addQuotation",
                  productData: product,
                },
              })
            }
            className="mr-4 text-gray-20 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-20">
            Add Quotation for {product?.name}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`space-y-6 ${modalConfig.isOpen ? "hidden" : ""}`}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quotation Items
            </label>
            {quotationItems.map((item, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...quotationItems];
                    newItems[index].name = e.target.value;
                    setQuotationItems(newItems);
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity === 0 ? "" : item.quantity}
                  onChange={(e) => {
                    const newItems = [...quotationItems];
                    newItems[index].quantity =
                      e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                    setQuotationItems(newItems);
                  }}
                  className="w-24 rounded-md border border-gray-300 px-3 py-2"
                  min="0"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeQuotationItem(index)}
                  className="px-3 text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuotationItem}
              className="mt-2 text-blue-400 hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" />
              Add Item
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contractors
            </label>
            <select
              multiple
              value={selectedContractors.map(String)}
              onChange={(e) =>
                setSelectedContractors(
                  Array.from(e.target.selectedOptions, (option) =>
                    Number(option.value)
                  )
                )
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              {contractors.map((contractor) => (
                <option key={contractor.id} value={contractor.id}>
                  {contractor.first_name} {contractor.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary Workers
            </label>
            <select
              multiple
              value={selectedWorkers.map(String)}
              onChange={(e) =>
                setSelectedWorkers(
                  Array.from(e.target.selectedOptions, (option) =>
                    Number(option.value)
                  )
                )
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.first_name} {worker.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
            >
              Submit Quotation
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default AddQuotation;
