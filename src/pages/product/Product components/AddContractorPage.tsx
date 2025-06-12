import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";

import Modal from "../../shop/shop-components/Modal";

interface Contractor {
  id: number;
  first_name: string;
  last_name: string;
}

const AddContractorPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [selectedContractor, setSelectedContractor] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await fetch(
          "https://kidsdesigncompany.pythonanywhere.com/api/contractors/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch contractors");
        const data = await response.json();
        console.log(data);

        setContractors(data.results.contractor);
      } catch (error) {
        console.error("Error fetching contractors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/product/${id}/contractor/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            contractor: selectedContractor,
            cost: cost,
            date: date,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add contractor");
      }

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Contractor added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding contractor:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to add contractor",
        type: "error",
      });
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      // Fetch updated product data before navigating
      const fetchUpdatedProduct = async () => {
        try {
          const response = await fetch(
            `https://kidsdesigncompany.pythonanywhere.com/api/product/${id}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch updated product");
          const updatedProduct = await response.json();

          navigate("/product/main", {
            state: {
              from: "addContractor",
              productData: updatedProduct, // Pass updated product data
            },
          });
        } catch (error) {
          console.error("Error fetching updated product:", error);
          navigate("/product/main");
        }
      };

      fetchUpdatedProduct();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#60A5FA"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mt-6 mx-auto p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/product/main")}
          className="mr-4 text-gray-20 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="text-2xl font-bold">Add Contractor(s)</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Select Contractor</label>
          <select
            value={selectedContractor}
            onChange={(e) => setSelectedContractor(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Choose a contractor</option>
            {contractors.map((contractor) => (
              <option key={contractor.id} value={contractor.id}>
                {contractor.first_name} {contractor.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Cost</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full border rounded p-2"
            required
            placeholder="Enter cost"
          />
        </div>

        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Contractor
        </button>
      </form>

      {/* Success/Error Modal */}
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

export default AddContractorPage;
