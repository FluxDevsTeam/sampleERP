import React, { useEffect, useState, JSX } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Whisper, Tooltip } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// Add interface for product details
interface ProductDetails {
  name: string;
  category: string;
  id: number;
  image: string;
  description: string;
  dimensions: string;
  costPrice: number;
  sellingPrice: number;
  totalPrice: number;
  profitPerItem: number;
  archived: boolean;
}

interface TableProps {
  headers: string[];
}

interface TableData {
  Product: string;
  Category: string;
  "Stock Status": number;
  Details: JSX.Element;
  [key: string]: string | number | JSX.Element;
}

const DashboardTable: React.FC<TableProps> = ({ headers }) => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null
  );
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const response = await fetch(
        "https://kidsdesigncompany.pythonanywhere.com/api/inventory-item/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const logData = await response.json();
      console.log("API Response:", logData);

      if (logData.results && Array.isArray(logData.results)) {
        const updatedTableData: TableData[] = logData.results.map(
          (item: any) => {
            // console.log("Processing item:", item);
            return {
              Product: item.name || "N/A",
              Category: item.inventory_category?.name || "N/A",
              "Stock Status": item.stock || 0,
              Details: (
                <button
                  onClick={() =>
                    handleViewDetails({
                      name: item.name,
                      category: item.inventory_category?.name || "",
                      id: item.id,
                      image: item.image,
                      description: item.description,
                      dimensions: item.dimensions,
                      costPrice: item.cost_price,
                      sellingPrice: item.selling_price,
                      totalPrice: item.total_price,
                      profitPerItem: item.profit_per_item,
                      archived: item.archived,
                    })
                  }
                  className="px-3 py-1 text-blue-400 border-2 border-blue-400 rounded"
                >
                  View
                </button>
              ),
            };
          }
        );

        console.log(updatedTableData);
        setTableData(updatedTableData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleViewDetails = (product: ProductDetails) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-16">
        {loading ? (
          <div className="w-1/5 mx-auto">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="black"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <div>
            <button
              onClick={() => navigate("/shop/add-item")}
              className="mb-4 px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon className="pr-2" icon={faPlus} />
              Add Item
            </button>
            <button className="mb-4 px-4 py-2 bg-blue-400 text-white rounded">
              <FontAwesomeIcon className="pr-2" icon={faXmark} />
              Remove Item
            </button>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-400 text-white">
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="py-4 px-4 text-left text-sm font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {headers.map((header) => (
                      <td
                        key={`${index}-${header}`}
                        className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700"
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-100">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border-2 border-gray-800 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-20">
                {selectedProduct.name}{" "}
                <span className="font-normal">/ {selectedProduct.id}</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>
            <Whisper
              followCursor
              speaker={<Tooltip>Click for full view</Tooltip>}
            >
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="block w-1/5 h-auto mb-2 cursor-pointer"
                onClick={() => setShowImagePreview(true)}
              />
            </Whisper>
            <div className="space-y-2"></div>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Category:</span>{" "}
              {selectedProduct.category}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Description:</span>{" "}
              {selectedProduct.description}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Dimensions:</span>{" "}
              {selectedProduct.dimensions}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Cost Price:</span> $
              {selectedProduct.costPrice}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Selling Price:</span> $
              {selectedProduct.sellingPrice}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Total Price:</span> $
              {selectedProduct.totalPrice}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Profit per item:</span> $
              {selectedProduct.profitPerItem}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Archived:</span>{" "}
              {selectedProduct.archived ? "Yes" : "No"}
            </p>
            <p className="text-xs text-red-600">
              Take note of product id -{" "}
              <span className="font-bold">{selectedProduct.id}</span>
            </p>

            <button className="pt-2 pr-3 p-2 text-blue-400 rounded-lg border-2 border-blue-400 mt-4 font-bold">
              <FontAwesomeIcon className="pr-1 text-blue-400" icon={faPencil} />
              Edit details
            </button>
          </div>
        </div>
      )}

      {showImagePreview && selectedProduct && (
        <div
          className="fixed inset-0 bg-opacity-90 flex items-center justify-center z-[200]"
          onClick={() => setShowImagePreview(false)}
        >
          <div className="relative max-w-4xl mx-4 rounded-lg shadow-lg">
            <img
              className="max-h-[70vh] w-auto object-contain"
              src={selectedProduct.image}
              alt="product image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTable;
