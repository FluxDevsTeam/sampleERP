import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import Modal from "@/pages/shop/Modal";
import SearchablePaginatedDropdown from "../../raw-materials/Raw Materials Component/SearchablePaginatedDropdown";

interface RawMaterial {
  id: number;
  name: string;
  unit: string;
}

interface Product {
  id: number;
  name: string;
  selling_price: string;
  progress: number;
}

interface RemovedItem {
  id: number;
  raw_material: RawMaterial;
  name: string;
  quantity: string;
  price: string;
  product_its_used: Product;
  date: string;
}

const EditRemovedItem: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [initialDataLoading, setInitialDataLoading] = useState(true);

  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    date: "",
  });


  const [productSearch, setProductSearch] = useState("");
  const [materialDetails, setMaterialDetails] = useState<{ quantity: number; price: number } | null>(null);
  const [originalQuantity, setOriginalQuantity] = useState<number>(0);
  const [rawMaterialId, setRawMaterialId] = useState<string>("");

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate("/store-keeper/removed");
    }
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // If the product changes, fetch its raw material details if available
    if (name === "product" && value) {
      // Fetch the product to get its raw material id
      fetch(`https://backend.kidsdesigncompany.com/api/product/${value}/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      })
        .then(res => res.ok ? res.json() : null)
        .then(productData => {
          if (productData && productData.raw_material) {
            setRawMaterialId(productData.raw_material.id?.toString() || "");
            // Fetch raw material details
            fetch(`https://backend.kidsdesigncompany.com/api/raw-materials/${productData.raw_material.id}/`, {
              headers: {
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              },
            })
              .then(rmRes => rmRes.ok ? rmRes.json() : null)
              .then(rmData => {
                if (rmData) {
                  setMaterialDetails({
                    quantity: Number(rmData.quantity) || 0,
                    price: Number(rmData.price) || 0,
                  });
                }
              });
          } else {
            setMaterialDetails(null);
          }
        });
    }
  };

  // Helper functions for date format conversion
  function yyyyMMddToDdMonthYyyy(isoDate: string) {
    if (!isoDate) return "";
    const [yyyy, mm, dd] = isoDate.split("-");
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = months[parseInt(mm, 10) - 1];
    return `${dd}-${monthName}-${yyyy}`;
  }

  function ddMmYyToYyyyMmDd(ddmmyy: string) {
    if (!ddmmyy) return "";
    const [dd, mm, yy] = ddmmyy.split("-");
    return `20${yy}-${mm}-${dd}`;
  }

  useEffect(() => {
    const fetchItem = async () => {
      setInitialDataLoading(true);
      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/removed/${id}/`, {
            method: "GET",
            headers: {
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) throw new Error("Failed to fetch item");
          const data: RemovedItem = await response.json();

        // Set form data with existing values
        setFormData({
          product: data.product_its_used?.id?.toString() || "",
          quantity: data.quantity || "",
          date: data.date ? data.date.slice(0, 10) : "",
        });
        setRawMaterialId(data.raw_material?.id?.toString() || "");

        // Set search text for dropdowns
        setProductSearch(data.product_its_used?.name || "");
        setOriginalQuantity(Number(data.quantity) || 0);

        // Fetch raw material details for initial display
        if (data.raw_material?.id) {
          try {
            const rmRes = await fetch(`https://backend.kidsdesigncompany.com/api/raw-materials/${data.raw_material.id}/`, {
              headers: {
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              },
            });
            if (rmRes.ok) {
              const rmData = await rmRes.json();
              setMaterialDetails({
                quantity: Number(rmData.quantity) || 0,
                price: Number(rmData.price) || 0,
              });
            }
          } catch {}
        }
      } catch (error) {
        console.error("Error:", error);
        setModalConfig({
          isOpen: true,
          title: "Error",
          message: "Failed to load item data.",
          type: "error",
        });
      } finally {
        setInitialDataLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  useEffect(() => {
    // Fetch user role from local storage or context
    const role = localStorage.getItem("user_role"); // Assuming role is stored here
    setUserRole(role);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestBody = {
        product: parseInt(formData.product),
        quantity: parseFloat(formData.quantity),
        date: formData.date,
      };

      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/removed/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update item. Please check your inputs.");
      }

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item updated successfully!",
        type: "success",
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialDataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#4A90E2" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/store-keeper/removed")}
            className="mr-4 text-black-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-black-700">
            Edit Removed Item
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">


          <div>
            <SearchablePaginatedDropdown
              endpoint="https://backend.kidsdesigncompany.com/api/product/"
              label="Product"
              name="product"
              resultsKey="results"
              value={productSearch}
              onChange={handleDropdownChange}
              onSearchChange={setProductSearch}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              min={1}
              max={materialDetails ? materialDetails.quantity + originalQuantity : undefined}
              onChange={(e) => {
                let val = e.target.value;
                if (materialDetails && Number(val) > materialDetails.quantity + originalQuantity) {
                  val = (materialDetails.quantity + originalQuantity).toString();
                }
                setFormData({ ...formData, quantity: val });
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              disabled={!formData.product}
            />
            {materialDetails && (
              <div className="text-xs text-black mt-1">Max: {(materialDetails.quantity + originalQuantity).toLocaleString()}</div>
            )}
            {materialDetails && (
              <div className="mt-2 text-xs text-black">
                <div>Available Quantity: <span className="font-semibold">{(materialDetails.quantity + originalQuantity).toLocaleString()}</span></div>
                <div>Unit Price: <span className="font-semibold">₦{materialDetails.price.toLocaleString()}</span></div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
            {formData.date && (
              <div className="text-xs text-gray-500 mt-1">
                Selected date: {yyyyMMddToDdMonthYyyy(formData.date)}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("/store-keeper/removed")}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            {userRole === 'ceo' && (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Updating..." : "Update Item"}
                </button>
              </>
            )}
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

export default EditRemovedItem;