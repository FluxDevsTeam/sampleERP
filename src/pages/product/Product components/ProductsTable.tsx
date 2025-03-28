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
import Modal from "../../shop/shop-components/Modal";

interface TableData {
  Product: string;
  "Linked Projects": string;
  Price: string;
  Progress: JSX.Element;
  Details: JSX.Element;
  [key: string]: string | number | JSX.Element;
}

const ProductsTable: React.FC = () => {
  const headers = [
    "Product",
    "Linked Project",
    "Selling price",
    "Progress",
    "Details",
  ];
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showProductDetailsModal, setShowProductDetailsModal] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showContractorsModal, setShowContractorsModal] = useState(false);
  const [showWorkersModal, setShowWorkersModal] = useState(false);
  const [showEditContractorModal, setShowEditContractorModal] = useState(false);
  const [editingContractor, setEditingContractor] = useState<any | null>(null);
  const [showEditWorkerModal, setShowEditWorkerModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState<any | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showSketch, setShowSketch] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/product/`
      );

      https: if (!response.ok) {
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
        location.state?.from === "addContractor" || location.state?.from === "editProduct") &&
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
          `https://kidsdesigncompany.pythonanywhere.com/api/product/${selectedProduct.id}/`,
          {
            method: "DELETE",
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
        `https://kidsdesigncompany.pythonanywhere.com/api/product/${selectedProduct.id}/contractor/${contractorId}/`,
        {
          method: "DELETE",
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
        `https://kidsdesigncompany.pythonanywhere.com/api/product/${selectedProduct.id}/contractor/${editingContractor.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
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
        `https://kidsdesigncompany.pythonanywhere.com/api/product/${selectedProduct.id}/salary/${workerId}/`,
        {
          method: "DELETE",
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
        `https://kidsdesigncompany.pythonanywhere.com/api/product/${selectedProduct.id}/salary/${editingWorker.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
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
            ${showWorkersModal ? "hidden" : ""}`}
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

      {/* Contractors Modal */}
      {showContractorsModal && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] ${
            modalConfig.isOpen ? "hidden" : ""
          }`}
        >
          <div className="bg-white rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto border-2 border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg text-blue-400 font-bold">Contractors</h3>
              <button
                onClick={() => setShowContractorsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <button
              onClick={() =>
                navigate(`/product/add-contractor/${selectedProduct.id}`)
              }
              className="bg-blue-400 text-white p-1 px-[10px] mb-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
            </button>

            <div className="space-y-4">
              {selectedProduct.contractors &&
              selectedProduct.contractors.length > 0 ? (
                selectedProduct.contractors.map(
                  (contractor: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-md"
                    >
                      <div>
                        <p className="font-semibold text-gray-20">
                          {contractor.linked_contractor?.first_name}{" "}
                          {contractor.linked_contractor?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                           Date: {new Date(contractor.date).toLocaleDateString("en-GB")}
                        </p>
                        <p className="text-sm text-gray-500">
                          Cost: ₦{contractor.cost || "-"}
                        </p>
                      </div>
                      <div className="grid">
                        <button
                          onClick={() => handleDeleteContractor(contractor.id)}
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                          onClick={() => handleEditContractor(contractor)}
                          className="text-blue-400 hover:text-blue-600 p-2"
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </button>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="text-center italic text-gray-500">
                  No contractors attached
                </p>
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
          <div className="bg-white rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto border-2 border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg text-blue-400 font-bold">Workers</h3>
              <button
                onClick={() => setShowWorkersModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <button
              onClick={() => {
                navigate(`/product/add-worker/${selectedProduct.id}`, {
                  state: { from: "workersModal", returnTo: "workers" },
                });
              }}
              className="bg-blue-400 text-white p-1 px-[10px] mb-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
            </button>

            <div className="space-y-4">
              {selectedProduct?.salary_workers?.length > 0 ? (
                selectedProduct.salary_workers.map(
                  (worker: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-md"
                    >
                      <div>
                        <p className="font-semibold text-gray-20">
                          {worker.linked_salary_worker?.first_name}{" "}
                          {worker.linked_salary_worker?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {worker.date}
                        </p>
                      </div>
                      <div className="grid">
                        <button
                          onClick={() => handleDeleteWorker(worker.id)}
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                          onClick={() => handleEditWorker(worker)}
                          className="text-blue-400 hover:text-blue-600 p-2"
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </button>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="text-center italic text-gray-500">
                  No workers attached
                </p>
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
    </div>
  );
};

export default ProductsTable;
