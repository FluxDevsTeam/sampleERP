import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SearchablePaginatedDropdown from "./SearchablePaginatedDropdown";

const Modal = ({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border-t-4 ${
          type === "success" ? "border-green-500" : "border-red-500"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-4 ${
            type === "success" ? "text-blue-600" : "text-red-600"
          }`}
        >
          {type === "success" ? "Success!" : "Error"}
        </h2>
        <p className="mb-6">
          {type === "success"
            ? "Sale has been successfully recorded."
            : "There was an error recording the sale. Please try again."}
        </p>
        <button
          onClick={onClose}
          className={`w-full py-2 px-4 text-white rounded ${
            type === "success"
              ? "bg-blue-600 hover:bg-blue-20"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {type === "success" ? "Continue" : "Close"}
        </button>
      </div>
    </div>
  );
};

const AddNewSoldItemPage = () => {
  const navigate = useNavigate();
  const [saleType, setSaleType] = useState<"customer" | "project">("customer");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "",
    customer: "",
    project: "",
    item: "",
    logistics: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    console.log(`handleDropdownChange called with: name=${name}, value=${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormData({
      quantity: "",
      customer: "",
      project: "",
      item: "",
      logistics: "",
    });
  }, [saleType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare submit data based on sale type
    const submitData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => {
        if (saleType === "project" && ["customer", "logistics"].includes(key)) {
          return [key, null];
        }
        if (saleType === "customer" && key === "project") {
          return [key, null];
        }
        return [key, value || null];
      })
    );

    try {
      console.log("Data being sent to POST request:", submitData);
      const response = await fetch(
        "https://backend.kidsdesigncompany.com/api/sold/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(submitData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to record sale");
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error recording sale:", error);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/shop/sold")}
          className="mr-4 text-gray-20 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="text-2xl font-bold text-gray-20">Record Sale</h1>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Sale Type:</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="customer"
              checked={saleType === "customer"}
              onChange={(e) =>
                setSaleType(e.target.value as "customer" | "project")
              }
              className="mr-2"
            />
            Customer Sale
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="project"
              checked={saleType === "project"}
              onChange={(e) =>
                setSaleType(e.target.value as "customer" | "project")
              }
              className="mr-2"
            />
            Project Sale
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <SearchablePaginatedDropdown
          endpoint="https://backend.kidsdesigncompany.com/api/inventory-item/"
          label="Item"
          name="item"
          onChange={handleDropdownChange}
          resultsKey="results.items"
        />
        <div>
          <label className="block mb-1">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* CUSTOMER SALE TYPE */}
        {saleType === "customer" && (
          <>
            <SearchablePaginatedDropdown
              endpoint="https://backend.kidsdesigncompany.com/api/customer/"
              label="Customer"
              name="customer"
              onChange={handleDropdownChange}
              resultsKey="results.all_customers"
            />

            <div>
              <label className="block mb-1">Logistics:</label>
              <input
                type="number"
                name="logistics"
                value={formData.logistics}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </>
        )}

        {/* PROJECT SALE TYPE */}
        {saleType === "project" && (
          <SearchablePaginatedDropdown
            endpoint="https://backend.kidsdesigncompany.com/api/project/"
            label="Project"
            name="project"
            onChange={handleDropdownChange}
            resultsKey="all_projects"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/shop/sold");
        }}
        type="success"
      />

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        type="error"
      />
    </div>
  );
};

export default AddNewSoldItemPage;
