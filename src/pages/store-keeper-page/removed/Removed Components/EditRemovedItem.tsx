import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import Modal from "@/pages/shop/Modal";
import SearchablePaginatedDropdown from "../../raw-materials/Raw Materials Component/SearchablePaginatedDropdown";
import removedData from "@/data/store-keeper-page/removed/removed.json";
import productsData from "@/data/store-keeper-page/removed/products.json";
import rawMaterialsData from "@/data/store-keeper-page/raw-materials/raw-materials.json";

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
    if (name === "product" && value) {
      const product = productsData.results.find(
        (p: any) => p.id.toString() === value
      );
      if (product && product.raw_material) {
        setRawMaterialId(product.raw_material.id?.toString() || "");
        const material = rawMaterialsData.results.items.find(
          (m: any) => m.id.toString() === product.raw_material.id.toString()
        );
        if (material) {
          setMaterialDetails({
            quantity: Number(material.quantity) || 0,
            price: Number(material.price) || 0,
          });
        } else {
          setMaterialDetails(null);
        }
      } else {
        setMaterialDetails(null);
      }
    }
  };

  useEffect(() => {
    const fetchItem = () => {
      setInitialDataLoading(true);
      const dailyData = removedData.daily_data;
      let entry: RemovedItem | undefined;
      for (const day of dailyData) {
        entry = day.entries.find((e: any) => e.id.toString() === id);
        if (entry) break;
      }
      if (entry) {
        setFormData({
          product: entry.product_its_used?.id?.toString() || "",
          quantity: entry.quantity || "",
          date: entry.date ? entry.date.slice(0, 10) : "",
        });
        setRawMaterialId(entry.raw_material?.id?.toString() || "");
        setProductSearch(entry.product_its_used?.name || "");
        setOriginalQuantity(Number(entry.quantity) || 0);
        const material = rawMaterialsData.results.items.find(
          (m: any) => m.id.toString() === entry.raw_material?.id.toString()
        );
        if (material) {
          setMaterialDetails({
            quantity: Number(material.quantity) || 0,
            price: Number(material.price) || 0,
          });
        } else {
          setMaterialDetails(null);
        }
      } else {
        setModalConfig({
          isOpen: true,
          title: "Error",
          message: "Item not found.",
          type: "error",
        });
      }
      setInitialDataLoading(false);
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setTimeout(() => {
        setModalConfig({
          isOpen: true,
          title: "Success",
          message: "Item updated successfully!",
          type: "success",
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to update item.",
        type: "error",
      });
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
              endpoint="/data/store-keeper-page/removed/products.json"
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
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("/store-keeper/removed")}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
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

export default EditRemovedItem;