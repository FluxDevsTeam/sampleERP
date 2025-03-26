import React, { useEffect, useState, JSX } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Whisper, Tooltip } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPlus,
  faTrash,
  faArrowLeft,
  faArrowRight,
  faXmark,
  faAnglesLeft,
  faAnglesRight,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Modal from "../shop/shop-components/Modal";

interface TableData {
  Product: string;
  "Linked Projects": string;
  Price: string;
  Details: JSX.Element;
  Progress: JSX.Element;
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
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
      //kidsdesigncompany.pythonanywhere.com/api/product/id/contractor/

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
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-400 h-2.5 rounded-full"
                style={{ width: `${item.progress}%` }}
              ></div>
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

  // WILL TALK ABOUT THIS WITH SAPS. RAW MATERIAL ISSUE

  // useEffect(() => {
  //     async function fetchStockInfo() {
  //       try {
  //         const response = await fetch(
  //           `https://kidsdesigncompany.pythonanywhere.com/api/product/7/raw-materials-used/`
  //         );

  //         if (!response.ok) {
  //           throw new Error("Failed to fetch raw materials");
  //         }

  //         const logData = await response.json();
  //         console.log("Raw Materials:", logData);
  //       } catch (error) {
  //         console.error("Error fetching raw materials:", error);
  //       }
  //     }
  //     fetchStockInfo();
  // }, []);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
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
        setShowModal(false);
        setConfirmDelete(false);
        fetchProducts(); // Refresh products
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

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    // if (modalConfig.type === "success") {
    //   window.location.reload();
    // }
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

      <div className={`overflow-x-auto pb-6 ${showModal ? "blur-sm" : ""}`}>
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
      <div className="flex justify-center items-center mb-28 gap-2">
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

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>

      {/*   PRODUCT DETAILS MODAL   */}
      {showModal && selectedProduct && (
        <div
          className={`fixed overflow-scroll inset-0 flex items-center justify-center z-[100] ${
            confirmDelete ? "blur-sm" : ""
          }`}
        >
          <div
            className="absolute overflow-scroll inset-0 bg-black opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="bg-white overflow-scroll rounded-lg p-6 max-h-[90vh] max-w-lg w-full mx-4 border-2 border-gray-800 shadow-lg relative z-[100]">
            {/* NAME */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-20">
                {selectedProduct.name}
              </h2>
              <button
                onClick={() => setShowModal(false)}
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
                {selectedProduct.selling_price}
              </p>

              {/* DIMENSIONS */}
              <p className="text-sm text-gray-20 mb-3">
                <span className="font-semibold">Dimensions:</span>{" "}
                {selectedProduct.dimensions} cm
              </p>

              {/* OVERHEAD COST */}
              <p className="text-sm text-gray-20 mb-3">
                <span className="font-semibold">Overhead cost:</span>{" "}
                {selectedProduct.overhead_cost}
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
              <ol className="text-sm text-gray-20 mb-3">
                <span
                  className="inline-block font-semibold text-blue-400 underline mb-1 cursor-pointer"
                  onClick={(e) => {
                    const listItems = e.currentTarget.nextElementSibling;
                    if (listItems) {
                      listItems.classList.toggle("hidden");
                    }
                  }}
                >
                  Linked Projects
                </span>
                <div className="hidden">
                  {selectedProduct.linked_project ? (
                    <>
                      <li className="mb-1">
                        <span className="font-semibold">Name: </span>
                        {selectedProduct.linked_project.name}
                      </li>
                      <li className="mb-1">
                        <span className="font-semibold">Balance: </span>
                        {selectedProduct.linked_project.balance}
                      </li>
                      <li className="mb-1">
                        <span className="font-semibold">Quantity: </span>
                        {selectedProduct.linked_project.paid}
                      </li>
                    </>
                  ) : (
                    <li className="italic text-gray-500">No linked projects</li>
                  )}
                </div>
              </ol>

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
                      {/* ... other calculation items ... */}
                    </>
                  ) : (
                    <li className="italic text-gray-500">
                      No calculations available
                    </li>
                  )}
                </div>
              </ol>

              {/* CONTRACTORS */}
              <ol className="text-sm text-gray-20 mb-3 list-decimal list-inside">
                <span
                  className="inline-block mb-1 font-semibold text-blue-400 underline cursor-pointer"
                  onClick={(e) => {
                    const listItems = e.currentTarget.nextElementSibling;
                    if (listItems) {
                      listItems.classList.toggle("hidden");
                    }
                  }}
                >
                  Contractors
                  <span className="ml-2">
                    <Whisper
                      onClick={() =>
                        navigate(
                          `/product/add-contractor/${selectedProduct.id}`
                        )
                      }
                      followCursor
                      speaker={<Tooltip>Add contractor</Tooltip>}
                    >
                      {<FontAwesomeIcon icon={faPlusCircle} />}
                    </Whisper>
                  </span>
                </span>
                <div className="hidden">
                  {selectedProduct.contractors &&
                  selectedProduct.contractors.length > 0 ? (
                    selectedProduct.contractors.map(
                      (contractFn: any, index: number) => (
                        <li key={index} className="flex justify-between mb-1">
                          <span>
                            {contractFn.linked_contractor?.first_name}{" "}
                            {contractFn.linked_contractor?.last_name} {"on "}
                            {contractFn.date}{" "}
                            <span className="font-semibold">Cost: </span>
                            {contractFn.cost || "-"}
                          </span>
                        </li>
                      )
                    )
                  ) : (
                    <p className="italic text-gray-500">
                      No contractors attached
                    </p>
                  )}
                </div>
              </ol>

              {/* WORKERS */}
              <ol className="text-sm text-gray-20 mb-3 list-decimal list-inside">
                <span
                
                  className="inline-block mb-1 font-semibold text-blue-400 underline cursor-pointer"
                  onClick={(e) => {
                    const listItems = e.currentTarget.nextElementSibling;
                    if (listItems) {
                      listItems.classList.toggle("hidden");
                    }
                  }}
                >
                  Workers
                  <span className="ml-2">
                    <Whisper
                      onClick={() =>
                        navigate(`/product/add-worker/${selectedProduct.id}`)
                      }
                      followCursor
                      speaker={<Tooltip>Add worker(s)</Tooltip>}
                    >
                      {<FontAwesomeIcon icon={faPlusCircle} />}
                    </Whisper>
                  </span>
                </span>
                <div className="hidden">
                  {selectedProduct.salary_workers &&
                  selectedProduct.salary_workers.length > 0 ? (
                    selectedProduct.salary_workers.map(
                      (worker: any, index: number) => (
                        <li key={index} className="flex justify-between mb-1">
                          <span>
                            {worker.linked_salary_worker?.first_name}{" "}
                            {worker.linked_salary_worker?.last_name} {"on "}
                            {worker.date || "-"}
                          </span>
                        </li>
                      )
                    )
                  ) : (
                    <p className="italic text-gray-500">No worker attached</p>
                  )}
                </div>
              </ol>
            </div>

            {/* EDIT AND DELETE ICONS */}
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
