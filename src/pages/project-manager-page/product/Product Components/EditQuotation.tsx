import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "@/pages/shop/Modal";
import SearchablePaginatedMultiSelectDropdown from './SearchablePaginatedMultiSelectDropdown';

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

const EditQuotation: React.FC = () => {
  const { productId, quotationId } = useParams();
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/product/${productId}/`,
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
            "https://backend.kidsdesigncompany.com/api/contractors/",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              },
            }
          ),
          fetch(
            "https://backend.kidsdesigncompany.com/api/salary-workers/",
            {
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

  useEffect(() => {
    if (quotationId) {
      const fetchQuotation = async () => {
        try {
          const response = await fetch(
            `https://backend.kidsdesigncompany.com/api/product/${productId}/quotation/${quotationId}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch quotation");
          const data = await response.json();
          setDepartment(data.department);
          setQuotationItems(data.quotation || [{ name: "", quantity: 0 }]);
          setSelectedContractors(data.contractor.map((c: any) => c.id) || []);
          setSelectedWorkers(data.salary_worker.map((w: any) => w.id) || []);
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchQuotation();
    }
  }, [productId, quotationId]);

  const addQuotationItem = () => {
    setQuotationItems([...quotationItems, { name: "", quantity: 0 }]);
  };

  const removeQuotationItem = (index: number) => {
    setQuotationItems(quotationItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const quotationData: QuotationData = {
      department,
      quotation: quotationItems.filter((item) => item.name.trim() !== ""),
      contractor: selectedContractors,
      salary_worker: selectedWorkers,
    };

    try {
      const url = `https://backend.kidsdesigncompany.com/api/product/${productId}/quotation/${
        quotationId ? `${quotationId}/` : ""
      }`;
      const method = quotationId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(quotationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save quotation");
      }

      // Fetch updated product data
      const productResponse = await fetch(
        `https://backend.kidsdesigncompany.com/api/product/${productId}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!productResponse.ok) {
        throw new Error("Failed to fetch updated product data");
      }

      const updatedProductData = await productResponse.json();

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: `Quotation ${quotationId ? "updated" : "added"} successfully!`,
        type: "success",
      });

      // Navigate back to product list with state to open product details modal
      setTimeout(() => {
        navigate("/project-manager/main", {
          state: {
            from: "editQuotation", // Mark that we're coming from editQuotation
            productData: updatedProductData, // Pass the updated product data
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to save quotation",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
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
                  from: "editQuotation",
                  productData: product,
                },
              })
            }
            className="mr-4 text-gray-20 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-gray-20">
            {quotationId ? "Edit" : "Add"} Quotation for {product?.name}
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
                  className="mt-1 flex-1 rounded-md border border-gray-300 px-3 py-2"
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
                  className="mt-1 w-24 rounded-md border border-gray-300 px-3 py-2"
                  min="0"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeQuotationItem(index)}
                  className="mt-1 p-2 text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuotationItem}
              className="mt-2 text-blue-400 hover:text-blue-500"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" />
              Add Item
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contractors
            </label>
            <SearchablePaginatedMultiSelectDropdown
              endpoint="https://backend.kidsdesigncompany.com/api/contractors/"
              label="Contractors"
              selectedValues={selectedContractors}
              onChange={setSelectedContractors}
              resultsKey="results.contractor"
              dataMapper={(data) => (Array.isArray(data) ? data.map((c) => ({ id: c.id, name: `${c.first_name} ${c.last_name}` })) : [])}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary Workers
            </label>
            <SearchablePaginatedMultiSelectDropdown
              endpoint="https://backend.kidsdesigncompany.com/api/salary-workers/"
              label="Salary Workers"
              selectedValues={selectedWorkers}
              onChange={setSelectedWorkers}
              resultsKey="results.workers"
              dataMapper={(data) => (Array.isArray(data) ? data.map((w) => ({ id: w.id, name: `${w.first_name} ${w.last_name}` })) : [])}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Quotation"}
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

export default EditQuotation;
