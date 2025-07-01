import React, { useEffect, useState, JSX } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPlus,
  faTrash,
  faArrowLeft,
  faXmark,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
// import { Accordion } from "rsuite";
import Modal from "../../shop/shop-components/Modal";
import axios from "axios";

interface TableData {
  Product: string;
  "Linked Project": string;
  "Selling price": string;
  Quantity: string | number;
  Progress: JSX.Element;
  Details: JSX.Element;
  Tasks: JSX.Element;
  [key: string]: string | number | JSX.Element;
}

const ProductsTable: React.FC = () => {
  const headers = [
    "Product",
    "Linked Project",
    "Selling price",
    "Quantity",
    "Progress",
    "Tasks",
    "Details",
  ];
  // TABLE DATA
  const [tableData, setTableData] = useState<TableData[]>([]);

  // LOADING
  const [loading, setLoading] = useState<boolean>(true);

  // MODAL STATES
  const [showProductDetailsModal, setShowProductDetailsModal] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // CONTRACTOR MODAL
  const [showContractorsModal, setShowContractorsModal] = useState(false);
  const [editingContractor, setEditingContractor] = useState<any | null>(null);
  const [showEditContractorModal, setShowEditContractorModal] = useState(false);

  // WORKER MODAL
  const [showWorkersModal, setShowWorkersModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState<any | null>(null);
  const [showEditWorkerModal, setShowEditWorkerModal] = useState(false);

  // QUOTATION MODAL
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotation, setQuotation] = useState<any | null>([]);
  const location = useLocation();
  const navigate = useNavigate();

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // SUCCESS AND ERROR MODAL
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  // SKETCH AND IMAGE
  const [showSketch, setShowSketch] = useState(false);
  const [showImage, setShowImage] = useState(false);

  // RAW MATERIALS Usdc
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);

  // TASKS MODAL
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [selectedTasksProduct, setSelectedTasksProduct] = useState<any | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/product/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      // console.log("API Response:", data);
      console.log(data);

      const updatedTableData: TableData[] = data.results.map((item: any) => {
        return {
          Product: (
            <div className="items-center">
              <p
                className="cursor-pointer"
                onClick={(e) => {
                  const parentDiv = e.currentTarget.parentElement;
                  const buttons = parentDiv?.querySelectorAll("button");
                  buttons?.forEach((button) => {
                    button.classList.toggle("hidden");
                  });
                }}
              >
                {item.name}
              </p>
              <button
                onClick={() =>
                  navigate(`/product/add-contractor/${selectedProduct.id}`)
                }
                className="hidden my-2 border-blue-400 border-[2px] px-2 rounded-lg"
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-blue-400 text-xs mr-1"
                />
                <span>contractor</span>
              </button>{" "}
              <br />
              <button
                onClick={() =>
                  navigate(`/product/add-worker/${selectedProduct.id}`)
                }
                className="hidden border-blue-400 border-[2px] px-2 rounded-lg"
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-blue-400 text-xs mr-1"
                />
                <span>worker</span>
              </button>
            </div>
          ),
          "Linked Project": item.linked_project?.name || "-",
          "Selling price": `₦${item.selling_price}`,
          Quantity: item.quantity || "-",
          Tasks: (
            <button
              onClick={() => handleViewTasks(item)}
              className="px-2 py-1 text-blue-500 border border-blue-400 rounded hover:bg-blue-50"
            >
              View Tasks
            </button>
          ),
          Details: (
            <button
              onClick={() => handleViewDetails(item)}
              className="px-3 py-1 text-blue-400 border-2 border-blue-400 rounded"
            >
              View
            </button>
          ),
          Progress: (
            <div className="w-full bg-gray-200 rounded-full h-3 relative">
              <div
                className="bg-blue-400 h-3 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                style={{ width: `${item.progress}%` }}
              >
                <span className="text-[10px]">{item.progress}%</span>
              </div>
            </div>
          ),
        };
      });

      setTableData(updatedTableData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (showProductDetailsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showProductDetailsModal]);

  useEffect(() => {
    // Check for returning from add contractor or add worker with updated product data
    if (
      (location.state?.from === "addWorker" ||
        location.state?.from === "addContractor" ||
        location.state?.from === "editProduct") &&
      location.state?.productData
    ) {
      setSelectedProduct(location.state.productData); // Set the updated product
      setShowProductDetailsModal(true); // Show the product modal
      setShowWorkersModal(false); // Ensure workers modal doesn't open
      setShowContractorsModal(false); // Ensure contractors modal doesn't open
      // setIsReturnedFromAdd(true);
      // Clean up location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch quotation
  useEffect(() => {
    const fetchQuotation = async () => {
      if (!selectedProduct?.id) return;

      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/product/${selectedProduct?.id}/quotation/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quotation data");
        }

        const quotationData = await response.json();
        console.log(quotationData);
        setQuotation(quotationData.results);
      } catch (error) {
        console.error("Error fetching quotation data:", error);
        // setQuotation([]);
      }
    };

    fetchQuotation();
  }, [selectedProduct?.id]);

  useEffect(() => {
    const fetchRawMaterials = async () => {
      if (!selectedProduct?.id) return;

      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/product/${selectedProduct.id}/raw-materials-used/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch raw materials");
        }

        const data = await response.json();
        setRawMaterials(data || []);
      } catch (error) {
        console.error("Error fetching raw materials:", error);
      }
    };

    fetchRawMaterials();
  }, [selectedProduct?.id]);

  const deleteQuotation = async (id: number) => {
    const url = `https://backend.kidsdesigncompany.com/api/product/${selectedProduct?.id}/quotation/${id}/`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete quotation");
      }

      setQuotation((prevQuotation: any[]) =>
        prevQuotation.filter((item) => item.id !== id)
      );

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Quotation deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting quotation:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to delete quotation",
        type: "error",
      });
    }
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetailsModal(true);
    setShowWorkersModal(false);
  };

  // DELETING PRODUCT
  const deleteProduct = async () => {
    if (selectedProduct) {
      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/product/${selectedProduct.id}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        setModalConfig({
          isOpen: true,
          title: "Success",
          message: "Product deleted successfully!",
          type: "success",
        });
        setShowProductDetailsModal(false);
        setConfirmDelete(false);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        setModalConfig({
          isOpen: true,
          title: "Error",
          message: "Failed to delete product",
          type: "error",
        });
      }
    }
  };

  // DELEETING CONTRACTOR
  const handleDeleteContractor = async (contractorId: number) => {
    if (!confirm("Are you sure you want to remove this contractor?")) return;

    try {
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/product/${selectedProduct.id}/contractor/${contractorId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete contractor");
      }

      // Refresh product details
      const updatedProduct = {
        ...selectedProduct,
        contractors: selectedProduct.contractors.filter(
          (c: any) => c.id !== contractorId
        ),
      };
      setSelectedProduct(updatedProduct);

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Contractor removed successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting contractor:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to remove contractor",
        type: "error",
      });
    }
  };

  const handleEditContractor = (contractor: any) => {
    setEditingContractor(contractor);
    setShowEditContractorModal(true);
  };

  const saveEditedContractor = async () => {
    if (!editingContractor) return;

    try {
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/product/${selectedProduct.id}/contractor/${editingContractor.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(editingContractor),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update contractor");
      }

      const updatedContractor = await response.json();
      const updatedProduct = {
        ...selectedProduct,
        contractors: selectedProduct.contractors.map((contractor: any) =>
          contractor.id === updatedContractor.id
            ? updatedContractor
            : contractor
        ),
      };
      setSelectedProduct(updatedProduct);

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Contractor updated successfully!",
        type: "success",
      });
      setShowEditContractorModal(false);
    } catch (error) {
      console.error("Error updating contractor:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to update contractor",
        type: "error",
      });
    }
  };

  // DELETING WORKER
  const handleDeleteWorker = async (workerId: number) => {
    if (!confirm("Are you sure you want to remove this worker?")) return;

    try {
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/product/${selectedProduct.id}/salary/${workerId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete worker");
      }

      // Refresh product details
      const updatedProduct = {
        ...selectedProduct,
        salary_workers: selectedProduct.salary_workers.filter(
          (worker: any) => worker.id !== workerId
        ),
      };
      setSelectedProduct(updatedProduct);

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Worker removed successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting worker:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to remove worker",
        type: "error",
      });
    }
  };

  const handleEditWorker = (worker: any) => {
    setEditingWorker(worker);
    setShowEditWorkerModal(true);
  };

  const saveEditedWorker = async () => {
    if (!editingWorker) return;

    try {
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/product/${selectedProduct.id}/salary/${editingWorker.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(editingWorker),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update worker");
      }

      const updatedWorker = await response.json();
      const updatedProduct = {
        ...selectedProduct,
        salary_workers: selectedProduct.salary_workers.map((worker: any) =>
          worker.id === updatedWorker.id ? updatedWorker : worker
        ),
      };
      setSelectedProduct(updatedProduct);

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Worker updated successfully!",
        type: "success",
      });
      setShowEditWorkerModal(false);
    } catch (error) {
      console.error("Error updating worker:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to update worker",
        type: "error",
      });
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const confirmDeleteProduct = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = e.currentTarget;
    button.disabled = true;
    setTimeout(() => {
      button.disabled = false;
    }, 3000);

    await deleteProduct();
  };

  const handleViewTasks = (product: any) => {
    setSelectedTasksProduct(product);
    setShowTasksModal(true);
  };

  return (
    <div className="wrapper w-11/12 mx-auto my-0 pl-1 pt-2">
      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
        className="font-semibold py-5 mt-2"
      >
        Products Management
      </h1>

      <div
        className={`overflow-x-auto pb-6 ${
          showProductDetailsModal ? "blur-sm" : ""
        }`}
      >
        {loading ? (
          <div className="h-full flex items-center w-1/5 mx-auto">
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
        ) : (
          <div>
            <button
              onClick={() => navigate("/product/add-product")}
              className="mb-4 px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon className="pr-2" icon={faPlus} />
              Add Product
            </button>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-400 text-white">
                  {headers.map((header: string) => (
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
                {currentItems.map((row, index) => (
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

      {/* Pagination Controls */}
      <div
        className={`flex justify-center items-center mb-28 gap-2
         ${showContractorsModal ? "hidden" : ""} 
         ${showWorkersModal ? "hidden" : ""} `}
      >
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <span className="mx-4">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button onClick={() => handlePageChange(currentPage + 1)}>
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>

      {/*   PRODUCT DETAILS MODAL   */}
      {showProductDetailsModal && selectedProduct && (
        <div
          className={`fixed overflow-scroll inset-0 flex items-center justify-center z-[100] 
            ${confirmDelete ? "blur-sm" : ""}
            ${showContractorsModal ? "hidden" : ""} 
            ${showWorkersModal ? "hidden" : ""}
            ${showQuotationModal ? "hidden" : ""}`}
        >
          <div
            className="absolute overflow-scroll inset-0 bg-black opacity-50"
            onClick={() => setShowProductDetailsModal(false)}
          ></div>
          <div className="bg-white overflow-scroll rounded-lg p-6 max-h-[90vh] max-w-lg w-full mx-4 border-2 border-gray-800 shadow-lg relative z-[100]">
            {/* NAME */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-20">
                {selectedProduct.name}
              </h2>
              <button
                onClick={() => setShowProductDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div>
              {/* PROGRESS BAR */}
              <p className="text-sm text-gray-20 mb-3">
                <span className="font-semibold">Progress rate:</span>{" "}
                <span className="text-xs text-gray-500 mt-1">
                  {selectedProduct.progress}% complete
                </span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-blue-400 h-2.5 rounded-full"
                    style={{ width: `${selectedProduct.progress}%` }}
                  ></div>
                </div>
              </p>

              {/* SKETCH VIEW */}
              <button
                onClick={() => setShowSketch(!showSketch)}
                className="mb-2 border-[1.4px] border-gray-20 rounded-md text-blue-400 block text-xs px-1"
              >
                View sketch
              </button>
              {showSketch && selectedProduct.sketch && (
                <img
                  onClick={() => setShowSketch(!showSketch)}
                  className="mb-6"
                  src={selectedProduct.sketch}
                  alt={`${selectedProduct.name} sketch`}
                />
              )}

              {/* IMAGE VIEW */}
              <button
                onClick={() => setShowImage(!showImage)}
                className="mb-2 border-[1.4px] border-gray-20 rounded-md text-blue-400 block text-xs px-1"
              >
                View image
              </button>
              {showImage && selectedProduct.images && (
                <img
                  onClick={() => setShowImage(!showImage)}
                  className="mb-6"
                  src={selectedProduct.images}
                  alt={`${selectedProduct.name} image`}
                />
              )}
              {/* other prodict details */}
              <div>
                {/* COLOUR */}
                <p className="text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Colour:</span>{" "}
                  {selectedProduct.colour || "No colour available"}
                </p>

                {/* DESIGN */}
                <p className="text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Design:</span>{" "}
                  {selectedProduct.design || "No design added"}
                </p>

                {/* SELLINg PRICE */}
                <p className="text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Selling price:</span> ₦
                  {selectedProduct.selling_price || "No selling price added"}
                </p>

                {/* DIMENSIONS */}
                <p className="text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Dimensions:</span>{" "}
                  {`${selectedProduct.dimensions}${" "}cm` ||
                    "no dimensions added"}
                </p>

                {/* OVERHEAD COST */}
                <p className="text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Overhead cost:</span>{" "}
                  {selectedProduct.overhead_cost || "no overhead cost added"}
                </p>

                {/* Overhead cost base at creation:*/}
                <p className="text-sm text-gray-20 mb-3">
                  <span className="font-semibold">
                    Overhead cost base at creation:
                  </span>{" "}
                  {selectedProduct.overhead_cost_base_at_creation}
                </p>

                {/* PRODUCTION NOTE */}
                <p className="text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Production note:</span>{" "}
                  {selectedProduct.production_note}
                </p>

                {/* LINKED PROJECTS */}
                <p className="text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Linked Project:</span>{" "}
                  {selectedProduct.linked_project.name}
                </p>

                {/* CALCULATIONS */}
                <ol className="text-sm text-gray-20 mb-3">
                  <span
                    className="inline-block mb-1 font-semibold text-blue-400 underline cursor-pointer"
                    onClick={(e) => {
                      const listItems = e.currentTarget.nextElementSibling;
                      if (listItems) {
                        listItems.classList.toggle("hidden");
                      }
                    }}
                  >
                    Calculations
                  </span>
                  <div className="hidden">
                    {selectedProduct.calculations ? (
                      <>
                        <li className="mb-1">
                          <span className="font-semibold">Profit: </span>
                          {selectedProduct.calculations.profit}
                        </li>
                        <li className="mb-1">
                          <span className="font-semibold">
                            Profit per item:{" "}
                          </span>
                          {selectedProduct.calculations.profit_per_item}
                        </li>
                        <li className="mb-1">
                          <span className="font-semibold">Quantity: </span>
                          {selectedProduct.calculations.quantity}
                        </li>
                        <li className="mb-1">
                          <span className="font-semibold">
                            Total overhead Cost:{" "}
                          </span>
                          {selectedProduct.calculations.total_overhead_cost}
                        </li>
                        <li className="mb-1">
                          <span className="font-semibold">
                            Total per item:{" "}
                          </span>
                          {selectedProduct.calculations.total_per_item}
                        </li>
                        <li className="mb-1">
                          <span className="font-semibold">
                            Total production cost:{" "}
                          </span>
                          {selectedProduct.calculations.total_production_cost}
                        </li>
                        <li className="mb-1">
                          <span className="font-semibold">
                            Total raw material cost:{" "}
                          </span>
                          {selectedProduct.calculations.total_raw_material_cost}
                        </li>
                      </>
                    ) : (
                      <li className="italic text-gray-500">
                        No calculations available
                      </li>
                    )}
                  </div>
                </ol>

                <ol className="text-sm text-gray-20 mb-3">
                  <span
                    className="inline-block mb-1 font-semibold text-blue-400 underline cursor-pointer"
                    onClick={(e) => {
                      const listItems = e.currentTarget.nextElementSibling;
                      if (listItems) {
                        listItems.classList.toggle("hidden");
                      }
                    }}
                  >
                    Raw materials (qty)
                  </span>
                  <div className="hidden">
                    {rawMaterials.length > 0 ? (
                      rawMaterials.map((material, index) => (
                        <li key={index} className="mb-1">
                          <span className="font-semibold">
                            {" "}
                            {material.material_name} -{" "}
                            <span className="font-normal">
                              {material.total_quantity}
                            </span>
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="italic text-gray-500">
                        No raw materials available
                      </li>
                    )}
                  </div>
                </ol>
              </div>
              {/* CONTRACTORS */}
              <p className="text-sm text-gray-20 mb-3">
                <span
                  className="inline-block mb-1 font-semibold text-blue-400 underline cursor-pointer"
                  onClick={() => setShowContractorsModal(true)}
                >
                  Contractors
                </span>
              </p>

              {/* WORRKERS */}
              <p className="text-sm text-gray-20 mb-3">
                <span
                  className="inline-block mb-1 font-semibold text-blue-400 underline cursor-pointer"
                  onClick={() => setShowWorkersModal(true)}
                >
                  Workers
                </span>
              </p>

              {/* QUOTATION */}
              <p className="text-sm text-gray-20 mb-3">
                <span
                  className="inline-block mb-1 font-semibold text-blue-400 underline cursor-pointer"
                  onClick={() => setShowQuotationModal(true)}
                >
                  Quotation
                </span>
              </p>
            </div>

            {/* Product detail EDIT AND DELETE ICONS */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    navigate(`/product/edit-product/${selectedProduct.id}`)
                  }
                  className="p-2 pr-3 text-blue-400 rounded-lg border-2 border-blue-400 font-bold"
                >
                  <FontAwesomeIcon
                    className="mr-1 text-xs text-blue-400"
                    icon={faPencil}
                  />
                  <span>Update</span>
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  className="p-2 pr-3 text-red-400 rounded-lg border-2 border-red-400 font-bold"
                >
                  <FontAwesomeIcon
                    className="mr-1 text-xs text-red-400"
                    icon={faTrash}
                  />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* contractors modal */}
      {showContractorsModal && selectedProduct && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] ${
            modalConfig.isOpen ? "hidden" : ""
          } ${showEditContractorModal ? "blur-sm" : ""}`}
        >
          <div className="bg-white rounded-2xl p-20 w-[60%] max-h-[98vh] overflow-y-auto border-2 border-blue-400 shadow-2xl flex flex-col items-center relative">
            <div className="flex flex-col items-center w-full mb-6">
              <h3 className="text-2xl pb-10 font-bold text-blue-400 text-center">Contractors for <span className="font-extrabold text-3xl">{selectedProduct.name}</span></h3>
              <button
                onClick={() => setShowContractorsModal(false)}
                className="absolute top-6 right-8 text-gray-500 hover:text-gray-700 text-3xl font-bold"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="w-full">
              <div className="flex justify-start mb-4">
                <button
                  onClick={() => {
                    navigate(`/product/add-contractor/${selectedProduct.id}`, {
                      state: { from: "contractorsModal", returnTo: "contractors" },
                    });
                  }}
                  className="px-4 py-2 text-lg bg-blue-400 rounded-lg text-white font-semibold hover:bg-blue-500 flex items-center gap-2 shadow"
                >
                  <FontAwesomeIcon icon={faPlus} /> Add Contractor
                </button>
              </div>

              {selectedProduct?.contractors?.length > 0 ? (
                <table className="min-w-full mb-20 bg-white border rounded-lg shadow text-[12px]">
                  <thead>
                    <tr className="bg-blue-100 text-blue-700">
                      <th className="py-1 px-2 text-left font-bold">#</th>
                      <th className="py-1 px-2 text-left font-bold">Name</th>
                      <th className="py-1 px-2 text-left font-bold">Date</th>
                      <th className="py-1 px-2 text-left font-bold">Cost</th>
                      <th className="py-1 px-2 text-left font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.contractors.map((contractor: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-1 px-2">{index + 1}</td>
                        <td className="py-1 px-2">
                          {contractor.linked_contractor?.first_name} {contractor.linked_contractor?.last_name}
                        </td>
                        <td className="py-1 px-2">
                          {new Date(contractor.date).toLocaleDateString("en-GB")}
                        </td>
                        <td className="py-1 px-2">₦{contractor.cost || "-"}</td>
                        <td className="py-1 px-2">
                          <button
                            onClick={() => handleEditContractor(contractor)}
                            className="p-1 px-2 text-blue-400 rounded border border-blue-400 font-bold mr-2 text-xs"
                          >
                            <FontAwesomeIcon className="text-xs text-blue-400" icon={faPencil} />
                          </button>
                          <button
                            onClick={() => handleDeleteContractor(contractor.id)}
                            className="p-1 px-2 text-red-400 rounded border border-red-400 font-bold text-xs"
                          >
                            <FontAwesomeIcon className="text-xs text-red-400" icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <p className="italic text-gray-500 mb-4">No contractors attached</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* workers modal */}
      {showWorkersModal && selectedProduct && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] ${
            modalConfig.isOpen ? "hidden" : ""
          } ${showEditWorkerModal ? "blur-sm" : ""}`}
        >
          <div className="bg-white rounded-2xl p-20 w-[60%] max-h-[98vh] overflow-y-auto border-2 border-blue-400 shadow-2xl flex flex-col items-center relative">
            <div className="flex flex-col items-center w-full mb-6">
              <h3 className="text-2xl pb-10 font-bold text-blue-400 text-center">Salary Workers for <span className="font-extrabold text-3xl">{selectedProduct.name}</span></h3>
              <button
                onClick={() => setShowWorkersModal(false)}
                className="absolute top-6 right-8 text-gray-500 hover:text-gray-700 text-3xl font-bold"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="w-full">
              <div className="flex justify-start mb-4">
                <button
                  onClick={() => {
                    navigate(`/product/add-worker/${selectedProduct.id}`, {
                      state: { from: "workersModal", returnTo: "workers" },
                    });
                  }}
                  className="px-4 py-2 text-lg bg-green-400 rounded-lg text-white font-semibold hover:bg-green-500 flex items-center gap-2 shadow"
                >
                  <FontAwesomeIcon icon={faPlus} /> Add Worker
                </button>
              </div>

              {selectedProduct?.salary_workers?.length > 0 ? (
                <table className="min-w-full mb-20 bg-white border rounded-lg shadow text-[12px]">
                  <thead>
                    <tr className="bg-green-100 text-green-700">
                      <th className="py-1 px-2 text-left font-bold">#</th>
                      <th className="py-1 px-2 text-left font-bold">Name</th>
                      <th className="py-1 px-2 text-left font-bold">Date</th>
                      <th className="py-1 px-2 text-left font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.salary_workers.map((worker: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-1 px-2">{index + 1}</td>
                        <td className="py-1 px-2">
                          {worker.linked_salary_worker?.first_name} {worker.linked_salary_worker?.last_name}
                        </td>
                        <td className="py-1 px-2">
                          {new Date(worker.date).toLocaleDateString("en-GB")}
                        </td>
                        <td className="py-1 px-2">
                          <button
                            onClick={() => handleEditWorker(worker)}
                            className="p-1 px-2 text-blue-400 rounded border border-blue-400 font-bold mr-2 text-xs"
                          >
                            <FontAwesomeIcon className="text-xs text-blue-400" icon={faPencil} />
                          </button>
                          <button
                            onClick={() => handleDeleteWorker(worker.id)}
                            className="p-1 px-2 text-red-400 rounded border border-red-400 font-bold text-xs"
                          >
                            <FontAwesomeIcon className="text-xs text-red-400" icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <p className="italic text-gray-500 mb-4">No workers attached</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Contractor Modal */}
      {showEditContractorModal && editingContractor && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] ${
            modalConfig.isOpen ? "hidden" : ""
          }`}
        >
          <div className="bg-white rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto border-2 border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base text-blue-400 font-bold">
                Edit Contractor
              </h3>
              <button
                onClick={() => setShowEditContractorModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {editingContractor.linked_contractor?.first_name || ""}{" "}
                  {editingContractor.linked_contractor?.last_name || ""}
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Cost
                </label>
                <input
                  type="number"
                  value={editingContractor.cost || ""}
                  onChange={(e) =>
                    setEditingContractor({
                      ...editingContractor,
                      cost: e.target.value,
                    })
                  }
                  className="mt-1 py-2 pl-3 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={editingContractor.date || ""}
                  onChange={(e) =>
                    setEditingContractor({
                      ...editingContractor,
                      date: e.target.value,
                    })
                  }
                  className="mt-1 py-2 pl-3 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowEditContractorModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedContractor}
                className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Worker Modal */}
      {showEditWorkerModal && editingWorker && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] ${
            modalConfig.isOpen ? "hidden" : ""
          }`}
        >
          <div className="bg-white rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto border-2 border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg text-blue-400 font-bold">Update date</h3>
              <button
                onClick={() => setShowEditWorkerModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {editingWorker.linked_salary_worker?.first_name || ""}
                  {editingWorker.linked_salary_worker?.last_name || ""}
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={editingWorker.date || ""}
                  onChange={(e) =>
                    setEditingWorker({
                      ...editingWorker,
                      date: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 pl-3"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowEditWorkerModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedWorker}
                className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUOTATION MODAL */}
      {showQuotationModal && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] ${
            modalConfig.isOpen ? "hidden" : ""
          }`}
        >
          <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto border-2 border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg text-blue-400 font-bold">
                Quotation for {selectedProduct.name}
                <button
                  onClick={() =>
                    navigate(`/product/add-quotation/${selectedProduct.id}`)
                  }
                  className="ml-3 px-2 py-1 text-sm bg-blue-400 rounded-md text-white"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </h3>
              <button
                onClick={() => setShowQuotationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            {quotation && quotation.length > 0 ? (
              <div>
                {quotation.map((item: any, index: number) => (
                  <div key={index} className="mb-2">
                    <div className="mt-2">
                      <p
                        onClick={(e) => {
                          const nextSibling =
                            e.currentTarget.nextElementSibling;
                          if (nextSibling) {
                            nextSibling.classList.toggle("hidden");
                          }
                          if (nextSibling?.classList.contains("hidden")) {
                            e.currentTarget.classList.add("mb-2");
                          } else {
                            e.currentTarget.classList.remove("mb-2");
                          }
                        }}
                        className="font-semibold mb-2 underline cursor-pointer"
                      >
                        Quotation
                      </p>

                      <div className="hidden mb-2">
                        {item.quotation?.length > 0 ? (
                          item.quotation.map(
                            (
                              quotationFn: { name: string; quantity: number },
                              index: number
                            ) => (
                              <span key={index} className="inline-block w-full">
                                <span className="font-black">*</span>{" "}
                                {quotationFn.name}: {quotationFn.quantity}
                              </span>
                            )
                          )
                        ) : (
                          <p className="text-sm text-gray-500">
                            No quotation available
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold">
                      Department:{" "}
                      <span className="font-normal text-blue-700">
                        {item.department || "-"}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Project name:{" "}
                      <span className="font-normal text-blue-700">
                        {item.project_name || "-"}
                      </span>
                    </p>

                    {/* WORKERS */}
                    <div className="mt-2">
                      <p
                        onClick={(e) => {
                          const nextSibling =
                            e.currentTarget.nextElementSibling;
                          if (nextSibling) {
                            nextSibling.classList.toggle("hidden");
                          }
                          if (nextSibling?.classList.contains("hidden")) {
                            e.currentTarget.classList.add("mb-2");
                          } else {
                            e.currentTarget.classList.remove("mb-2");
                          }
                        }}
                        className="font-semibold underline cursor-pointer"
                      >
                        Workers
                      </p>

                      <div className="hidden mb-2">
                        {item.salary_worker?.length > 0 ? (
                          item.salary_worker.map((workerFn: any) => (
                            <li
                              key={workerFn.name}
                              className="text-sm text-gray-500"
                            >
                              {workerFn.name || "-"}
                            </li>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No workers available
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CONTRACTORS */}
                    <div className="mt-2">
                      <p
                        onClick={(e) => {
                          const nextSibling =
                            e.currentTarget.nextElementSibling;
                          if (nextSibling) {
                            nextSibling.classList.toggle("hidden");
                          }
                          if (nextSibling?.classList.contains("hidden")) {
                            e.currentTarget.classList.add("mb-2");
                          } else {
                            e.currentTarget.classList.remove("mb-2");
                          }
                        }}
                        className="font-semibold underline cursor-pointer"
                      >
                        Contractors
                      </p>
                      <div className="hidden mb-2">
                        {item.contractor?.length > 0 ? (
                          item.contractor.map((workerFn: any) => (
                            <li
                              key={workerFn.name}
                              className="text-sm text-gray-500"
                            >
                              {workerFn.name || "-"}
                            </li>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No contractors available
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-6">
                      <button
                        onClick={() =>
                          navigate(
                            `/product/edit-quotation/${selectedProduct.id}/${item.id}`
                          )
                        }
                        className="p-1 px-3 text-blue-400 rounded-lg border-2 border-blue-400 font-bold"
                      >
                        <FontAwesomeIcon
                          className="text-xs text-blue-400"
                          icon={faPencil}
                        />
                        {/* <span>Update</span> */}
                      </button>
                      <button
                        onClick={() => deleteQuotation(item.id)}
                        className="p-1 px-3 text-red-400 rounded-lg border-2 border-red-400 font-bold"
                      >
                        <FontAwesomeIcon
                          className="text-xs text-red-400"
                          icon={faTrash}
                        />
                        {/* <span>Delete</span> */}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic text-gray-500">
                No quotation items available
              </p>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center">
              <h3 className="text-lg mb-4 font-medium">Confirm Deletion</h3>
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => setConfirmDelete(false)}
                className="cursor-pointer"
              />
            </div>
            <p>Are you sure you want to delete this product?</p>
            <div className="space-y-3 mt-4">
              <button
                onClick={handleConfirmDelete}
                className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-full py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />

      {/* Tasks Modal */}
      {showTasksModal && selectedTasksProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowTasksModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Tasks for {selectedTasksProduct.name}</h2>
            <TaskManager
              product={selectedTasksProduct}
              onUpdate={(updatedTasks) => {
                setSelectedTasksProduct((prev: any) => ({ ...prev, tasks: updatedTasks }));
                // Optionally, update the main table if needed
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- TaskManager component ---
const TaskManager: React.FC<{ product: any; onUpdate: (tasks: any[]) => void }> = ({ product, onUpdate }) => {
  const [tasks, setTasks] = React.useState<any[]>(product.tasks || []);
  const [isSaving, setIsSaving] = React.useState(false);

  // Add Task
  const handleAddTask = () => {
    setTasks((prev) => [...prev, { title: "", checked: false, subtasks: [] }]);
  };
  // Edit Task
  const handleTaskChange = (idx: number, field: "title" | "checked", value: any) => {
    setTasks((prev) => prev.map((task, i) => i === idx ? { ...task, [field]: value } : task));
  };
  // Delete Task
  const handleRemoveTask = (idx: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== idx));
  };
  // Add Subtask
  const handleAddSubtask = (taskIdx: number) => {
    setTasks((prev) => prev.map((task, i) =>
      i === taskIdx ? { ...task, subtasks: [...(task.subtasks || []), { title: "", checked: false }] } : task
    ));
  };
  // Edit Subtask
  const handleSubtaskChange = (taskIdx: number, subIdx: number, field: "title" | "checked", value: any) => {
    setTasks((prev) => prev.map((task, i) =>
      i === taskIdx
        ? { ...task, subtasks: (task.subtasks || []).map((sub: any, j: number) => j === subIdx ? { ...sub, [field]: value } : sub) }
        : task
    ));
  };
  // Delete Subtask
  const handleRemoveSubtask = (taskIdx: number, subIdx: number) => {
    setTasks((prev) => prev.map((task, i) =>
      i === taskIdx ? { ...task, subtasks: (task.subtasks || []).filter((_: any, j: number) => j !== subIdx) } : task
    ));
  };
  // Save to backend
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `https://backend.kidsdesigncompany.com/api/product/${product.id}/`,
        { tasks: JSON.stringify(tasks) },
        { headers: { Authorization: `JWT ${token}` } }
      );
      onUpdate(tasks);
    } catch (err) {
      alert("Failed to save tasks");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-lg">Task List</span>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAddTask}
        >
          + Add Task
        </button>
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {tasks.length === 0 && <div className="text-gray-400 text-center">No tasks yet.</div>}
        {tasks.map((task, idx) => (
          <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={task.checked}
                onChange={e => handleTaskChange(idx, "checked", e.target.checked)}
                className="accent-blue-500 w-4 h-4"
              />
              <input
                className="font-semibold text-base border-b-2 border-blue-200 focus:border-blue-500 outline-none bg-transparent flex-1 px-2 py-1"
                value={task.title}
                placeholder="Task title"
                onChange={e => handleTaskChange(idx, "title", e.target.value)}
              />
              <button
                className="ml-2 px-2 py-1 bg-red-400 text-white rounded text-xs hover:bg-red-500"
                onClick={() => handleRemoveTask(idx)}
              >
                Delete
              </button>
            </div>
            <div className="ml-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Subtasks</span>
                <button
                  className="px-2 py-1 bg-blue-400 text-white rounded text-xs hover:bg-blue-500"
                  onClick={() => handleAddSubtask(idx)}
                >
                  + Add Subtask
                </button>
              </div>
              {(task.subtasks || []).length === 0 && <div className="text-gray-300 text-xs">No subtasks</div>}
              {(task.subtasks || []).map((sub: any, subIdx: number) => (
                <div key={subIdx} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={sub.checked}
                    onChange={e => handleSubtaskChange(idx, subIdx, "checked", e.target.checked)}
                    className="accent-blue-400 w-4 h-4"
                  />
                  <input
                    className="text-sm border-b border-blue-100 focus:border-blue-400 outline-none bg-transparent flex-1 px-2 py-1"
                    value={sub.title}
                    placeholder="Subtask title"
                    onChange={e => handleSubtaskChange(idx, subIdx, "title", e.target.value)}
                  />
                  <button
                    className="ml-2 px-2 py-1 bg-red-200 text-red-700 rounded text-xs hover:bg-red-300"
                    onClick={() => handleRemoveSubtask(idx, subIdx)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-60"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProductsTable;
