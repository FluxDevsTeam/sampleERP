import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../../shop/shop-components/Modal";

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
          `https://kidsdesigncompany.pythonanywhere.com/api/product/${productId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        });
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

      // Navigate back after successful submission
      setTimeout(() => {
        navigate(-1);
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
    <div className="wrapper w-11/12 mx-auto my-0 pl-1 pt-2">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-blue-400"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Add Quotation for {product?.name}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Quotation Items
          </label>
          {quotationItems.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Item name"
                value={item.name}
                onChange={(e) => {
                  const newItems = [...quotationItems];
                  newItems[index].name = e.target.value;
                  setQuotationItems(newItems);
                }}
                className="flex-1 p-2 border rounded"
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
                className="w-24 p-2 border rounded"
                min="0"
                required
              />
              <button
                type="button"
                onClick={() => removeQuotationItem(index)}
                className="p-2 text-red-500"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuotationItem}
            className="text-blue-400"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Add Item
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Contractors</label>
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
            className="w-full p-2 border rounded"
          >
            <option value="">Choose contractors</option>
            {contractors.map((contractor) => (
              <option key={contractor.id} value={contractor.id}>
                {contractor.first_name} {contractor.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
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
            className="w-full p-2 border rounded"
          >
            <option value="">Choose workers</option>
            {workers.map((worker) => (
              <option key={worker.id} value={worker.id}>
                {worker.first_name} {worker.last_name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Submit Quotation
        </button>
      </form>

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
