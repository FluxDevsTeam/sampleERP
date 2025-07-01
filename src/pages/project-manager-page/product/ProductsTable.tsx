import React, { useEffect, useState, JSX, useRef } from "react";
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
  faSearch,
  faArrowUp,
  faArrowDown,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/pages/AuthPages/AuthContext";
// import { Accordion } from "rsuite";
import Modal from "@/pages/shop/Modal";
import SearchablePaginatedProjectDropdown from "./SearchablePaginatedProjectDropdown";
import DashboardCard from "../../factory-manager-page/dashboard/DashboardCard";

interface TableData {
  id: number;
  Product: string;
  "Linked Project": string;
  "Selling price": string;
  Quantity: string | number;
  Progress: JSX.Element;
  Details: JSX.Element;
  Quotation: JSX.Element;
  [key: string]: string | number | JSX.Element;
}

const ProductsTable: React.FC = () => {
  const { user } = useAuth();
  const headers = [
    "Product",
    "Linked Project",
    "Selling price",
    "Quantity",
    "Progress",
    "Details",
    "Quotation",
  ];
  // TABLE DATA
  const [tableData, setTableData] = useState<TableData[]>([]);

  // LOADING
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isDeletingContractor, setIsDeletingContractor] = useState(false);
  const [isDeletingWorker, setIsDeletingWorker] = useState(false);
  const [isDeletingQuotation, setIsDeletingQuotation] = useState(false);
  const [isSavingContractor, setIsSavingContractor] = useState(false);
  const [isSavingWorker, setIsSavingWorker] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // USER ROLE
  const [userRole, setUserRole] = useState<string | null>(null);

  // SEARCH
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ordering, setOrdering] = useState<string>("");

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

    const [editingProgress, setEditingProgress] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  // RAW MATERIALS Usdc
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);

  // PROJECT FILTER STATE
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [projectPage, setProjectPage] = useState(1);
  const [projectTotalPages, setProjectTotalPages] = useState(1);
  const PROJECTS_PER_PAGE = 10;

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectDropdownPage, setProjectDropdownPage] = useState(1);
  const [projectDropdownNext, setProjectDropdownNext] = useState<string | null>(null);
  const [projectDropdownPrev, setProjectDropdownPrev] = useState<string | null>(null);
  const [projectDropdownItems, setProjectDropdownItems] = useState<any[]>([]);
  const [projectDropdownCount, setProjectDropdownCount] = useState(0);
  const PROJECTS_DROPDOWN_PAGE_SIZE = 10;

  // Add state for expanded image at the top of the component
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Get user role on component mount
  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
  }, []);

  const handleUpdateProgress = async () => {
    if (!selectedProduct) return;
    setIsUpdatingProgress(true);
    try {
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/product/${selectedProduct.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ progress: currentProgress }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      const updatedProduct = await response.json();

      // Update the table data locally without re-fetching everything
      setTableData((prevTableData) =>
        prevTableData.map((product) =>
          product.id === updatedProduct.id
            ? { ...product, progress: updatedProduct.progress }
            : product
        )
      );

      // Update the selected product in the modal
      setSelectedProduct(updatedProduct);
      // Re-fetch to ensure consistency, can be optimized later
      fetchProducts(); 
      setEditingProgress(false);
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const fetchProducts = async () => {
    let url = `https://backend.kidsdesigncompany.com/api/product/`;
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    if (ordering) {
      params.append('ordering', ordering);
    }
    if (selectedProject) {
      params.append('project', selectedProject);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    try {
      setLoading(true);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log(data);

      const updatedTableData: TableData[] = data.results.map((item: any) => {
        return {
          id: item.id,
        
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
                  navigate(
                    `/project-manager/add-contractor/${item.id}`
                  )
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
                  navigate(`/project-manager/add-worker/${item.id}`)
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
          "Selling price": `₦${Number(item.selling_price).toLocaleString()}`,
          Quantity: item.quantity || "-",
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
                className={`bg-blue-400 h-3 rounded-full`}
                style={{ width: `${item.progress}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-green-200 text-xs font-semibold ${item.progress > 59 ? "text-white" : ""}`}>{item.progress}%</span>
              </div>
            </div>
          ),
          Quotation: (
            <button
              onClick={() => {
                setSelectedProduct(item);
                setShowQuotationModal(true);
              }}
              className="px-3 py-1 text-green-400 border-2 border-green-400 rounded hover:bg-green-50"
            >
              Quotation
            </button>
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
  }, [searchQuery, ordering, selectedProject]);

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
    // Check for returning from add contractor or add worker or addQuotation with updated product data
    if (
      (location.state?.from === "addWorker" ||
        location.state?.from === "addContractor" ||
        location.state?.from === "addQuotation" ||
        location.state?.from === "editQuotation" ||
        location.state?.from === "editProduct") &&
      location.state?.productData
    ) {
      setSelectedProduct(location.state.productData); // Set the updated product
      setShowProductDetailsModal(true); // Show the product modal
      setShowWorkersModal(false); // Ensure workers modal doesn't open
      setShowContractorsModal(false); // Ensure contractors modal doesn't open
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
          `https://backend.kidsdesigncompany.com/api/product/${selectedProduct?.id}/quotation/`, {
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
    setIsDeletingQuotation(true);
    try {
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/product/${selectedProduct?.id}/quotation/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

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
    } finally {
      setIsDeletingQuotation(false);
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
      setIsDeletingProduct(true);
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
      } finally {
        setIsDeletingProduct(false);
      }
    }
  };

  // DELEETING CONTRACTOR
  const handleDeleteContractor = async (contractorId: number) => {
    setIsDeletingContractor(true);
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
    } finally {
      setIsDeletingContractor(false);
    }
  };

  const handleEditContractor = (contractor: any) => {
    setEditingContractor(contractor);
    setShowEditContractorModal(true);
  };

  const saveEditedContractor = async () => {
    if (!editingContractor) return;
    setIsSavingContractor(true);
    try {
      const { date: contractorDate, ...restContractor } = editingContractor || {};
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/product/${selectedProduct.id}/contractor/${editingContractor.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(restContractor),
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
    } finally {
      setIsSavingContractor(false);
    }
  };

  // DELETING WORKER
  const handleDeleteWorker = async (workerId: number) => {
    setIsDeletingWorker(true);
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
    } finally {
      setIsDeletingWorker(false);
    }
  };

  const handleEditWorker = (worker: any) => {
    setEditingWorker(worker);
    setShowEditWorkerModal(true);
  };

  const saveEditedWorker = async () => {
    if (!editingWorker) return;
    setIsSavingWorker(true);
    try {
      const { date: workerDate, ...restWorker } = editingWorker || {};
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/product/${selectedProduct.id}/salary/${editingWorker.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(restWorker),
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
    } finally {
      setIsSavingWorker(false);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const confirmDeleteProduct = (id: number) => {
    setSelectedProduct({ id });
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsConfirmingDelete(true);
    try {
      await deleteProduct();
    } finally {
      setIsConfirmingDelete(false);
    }
  };

  // Fetch projects with pagination
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/project/?page=${projectPage}&page_size=${PROJECTS_PER_PAGE}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data.all_projects || data.results || []);
        setProjectTotalPages(Math.ceil((data.count || (data.all_projects?.length ?? 0)) / PROJECTS_PER_PAGE));
      } catch (error) {
        setProjects([]);
        setProjectTotalPages(1);
      }
    };
    fetchProjects();
  }, [projectPage]);

  // Fetch projects for dropdown
  useEffect(() => {
    let url = `https://backend.kidsdesigncompany.com/api/project/?ordering=-start_date&page=${projectDropdownPage}&page_size=${PROJECTS_DROPDOWN_PAGE_SIZE}`;
    if (projectSearch) url += `&search=${encodeURIComponent(projectSearch)}`;
    fetch(url, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("accessToken")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const projects = data.all_projects || data.results || [];
        setProjectDropdownItems(Array.isArray(projects) ? projects : []);
        setProjectDropdownNext(data.next);
        setProjectDropdownPrev(data.previous);
        setProjectDropdownCount(data.count || (projects.length ?? 0));
      });
  }, [projectDropdownPage, projectSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          showProductDetailsModal || showQuotationModal ? "blur-sm" : ""
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => setSearchQuery(searchTerm)}
                  className="ml-2 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
              <div className="flex items-center space-x-4">
                {/* Sort by Dropdown */}
                {/* Project Filter Dropdown */}
                <div className="w-56">
                  <SearchablePaginatedProjectDropdown
                    endpoint="https://backend.kidsdesigncompany.com/api/project/?ordering=-start_date"
                    onChange={(value) => {
                      setSelectedProject(value);
                      setCurrentPage(1);
                    }}
                    selectedValue={selectedProject}
                    selectedName={projects.find((p) => String(p.id) === selectedProject)?.name || ""}
                  />
                </div>
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                  <option value="">Sort by</option>
                  <option value="progress">Progress ▲</option>
                  <option value="-progress">Progress ▼</option>
                </select>
                <button
                  onClick={() => navigate("/project-manager/add-product")}
                  className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  style={{ display: (user?.role === 'ceo' || user?.role === 'project_manager' || user?.role === 'factory_manager') ? 'inline-flex' : 'none' }}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Product
                </button>
              </div>
            </div>
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
          <div className="bg-white overflow-scroll rounded-2xl p-10 max-h-[90vh] max-w-5xl w-full mx-4 border-2 border-blue-400 shadow-2xl relative z-[100]">
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

            {/* Calculation Cards */}
            {selectedProduct.calculations && (
              <>
                <div className="w-full mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  <DashboardCard title="Total raw material cost" value={Number(selectedProduct.calculations.total_raw_material_cost) || 0} currency="₦" />
                  <DashboardCard title="Total production cost" value={Number(selectedProduct.calculations.total_production_cost) || 0} currency="₦" />
                  <DashboardCard title="Total overhead Cost" value={Number(selectedProduct.calculations.total_overhead_cost) || 0} currency="₦" />
                  <DashboardCard title="Quantity" value={Number(selectedProduct.calculations.quantity) || 0} />
                  <DashboardCard title="Profit" value={Number(selectedProduct.calculations.profit) || 0} currency="₦" />
                  <DashboardCard title="Profit per item" value={Number(selectedProduct.calculations.profit_per_item) || 0} currency="₦" />
                      </div>
                {/* Action Buttons Row */}
                <div className="flex gap-4 justify-end mb-8">
                      <button
                    onClick={() => setShowContractorsModal(true)}
                    className="px-4 py-2 bg-blue-400 text-white rounded-lg font-semibold shadow hover:bg-blue-500 transition-colors"
                  >
                    View Contractors
                      </button>
                        <button
                    onClick={() => setShowWorkersModal(true)}
                    className="px-4 py-2 bg-blue-400 text-white rounded-lg font-semibold shadow hover:bg-blue-500 transition-colors"
                        >
                    View Salary Workers
                        </button>
                        <button
                    onClick={() => setShowQuotationModal(true)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold shadow hover:bg-purple-600 transition-colors"
                        >
                    View Quotation
                        </button>
                      </div>
              </>
            )}
            <div className="flex flex-col md:flex-row gap-8">
              {/* LEFT: Details */}
              <div className="flex-1">
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
                  {selectedProduct.linked_project?.name}
                </p>
                </div>
              </div>
              {/* RIGHT: Progress and Images */}
              <div className="flex flex-col items-center md:w-1/3 w-full">
                {/* Progress Bar */}
                <div className="text-sm text-gray-20 mb-3 w-full">
                  <span className="font-bold">Progress rate:</span>
                  {!editingProgress ? (
                    <div className="flex items-center mt-1">
                      <div className="flex-grow">
                        <span className="text-xs text-gray-500">
                          {selectedProduct.progress}% complete
                  </span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div
                            className="bg-blue-400 h-2.5 rounded-full"
                            style={{ width: `${selectedProduct.progress}%` }}
                          ></div>
                  </div>
                      </div>
                      {userRole !== "shopkeeper" && userRole !== "storekeeper" && (
                        <button
                          onClick={() => {
                            setCurrentProgress(selectedProduct.progress);
                            setEditingProgress(true);
                          }}
                          className="ml-4 px-3 py-1 text-sm bg-blue-400 text-white rounded-lg"
                        >
                          Edit
                        </button>
                    )}
                  </div>
                  ) : (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-black-600">
                          Set Progress: {currentProgress}%
                        </label>
                        <div>
                          <button
                            onClick={handleUpdateProgress}
                            disabled={isUpdatingProgress}
                            className={`px-3 py-1 text-sm bg-blue-400 text-white rounded-lg mr-2 ${
                              isUpdatingProgress ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            {isUpdatingProgress ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingProgress(false)}
                            className="px-3 py-1 text-sm bg-gray-300 text-black rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentProgress}
                        onChange={(e) =>
                          setCurrentProgress(Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                {/* Thumbnails for Sketch and Image */}
                <div className="flex gap-4 mb-4">
                  {selectedProduct.sketch && (
                    <img
                      src={selectedProduct.sketch}
                      alt={`${selectedProduct.name} sketch`}
                      className="w-24 h-24 object-cover rounded shadow cursor-pointer border border-gray-200 hover:scale-105 transition-transform"
                      onClick={() => setExpandedImage(selectedProduct.sketch)}
                    />
                  )}
                  {selectedProduct.images && (
                    <img
                      src={selectedProduct.images}
                      alt={`${selectedProduct.name} image`}
                      className="w-24 h-24 object-cover rounded shadow cursor-pointer border border-gray-200 hover:scale-105 transition-transform"
                      onClick={() => setExpandedImage(selectedProduct.images)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Product detail EDIT AND DELETE ICONS */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex space-x-2">
                {user?.role === 'ceo' && (
                  <>
                    <button
                      onClick={() =>
                        navigate(
                          `/project-manager/edit-product/${selectedProduct.id}`
                        )
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
                      onClick={() => confirmDeleteProduct(selectedProduct.id)}
                      className="p-2 pr-3 text-red-400 rounded-lg border-2 border-red-400 font-bold"
                    >
                      <FontAwesomeIcon
                        className="mr-1 text-xs text-red-400"
                        icon={faTrash}
                      />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Image Overlay */}
      {expandedImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-80" onClick={() => setExpandedImage(null)}>
          <img src={expandedImage} alt="Expanded" className="max-w-3xl max-h-[90vh] rounded-lg shadow-2xl border-4 border-white" />
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
                {user?.role !== 'storekeeper' && (
                  <button
                    onClick={() => {
                      navigate(`/project-manager/add-contractor/${selectedProduct.id}`, {
                        state: { from: "contractorsModal", returnTo: "contractors" },
                      });
                    }}
                    className="px-4 py-2 text-lg bg-blue-400 rounded-lg text-white font-semibold hover:bg-blue-500 flex items-center gap-2 shadow"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Contractor
                  </button>
                )}
              </div>

              {selectedProduct?.contractors?.length > 0 ? (
                <table className="min-w-full mb-20 bg-white border rounded-lg shadow text-[12px]">
                  <thead>
                    <tr className="bg-blue-400 text-white">
                      {/* <th className="py-1 px-2 text-left font-bold">#</th> */}
                      <th className="py-1 px-2 text-left font-bold">Name</th>
                      <th className="py-1 px-2 text-left font-bold">Date</th>
                      <th className="py-1 px-2 text-left font-bold">Cost</th>
                      {user?.role === 'ceo' && (
                        <th className="py-1 px-2 text-left font-bold">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.contractors.map((contractor: any, index: number) => (
                      <tr key={index} className="border-b">
                        {/* <td className="py-1 px-2">{index + 1}</td> */}
                        <td className="py-1 px-2">
                          {contractor.linked_contractor?.first_name} {contractor.linked_contractor?.last_name}
                        </td>
                        <td className="py-1 px-2">
                          {new Date(contractor.date).toLocaleDateString("en-GB")}
                        </td>
                        <td className="py-1 px-2">₦{contractor.cost || "-"}</td>
                        {user?.role === 'ceo' && (
                          <td className="py-1 px-2">
                            <button
                              onClick={() => handleEditContractor(contractor)}
                              className="p-1 px-2 text-blue-400 rounded border border-blue-400 font-bold mr-2 text-xs"
                            >
                              <FontAwesomeIcon className="text-xs text-blue-400" icon={faPencil} />
                            </button>
                            <button
                              onClick={() => handleDeleteContractor(contractor.id)}
                              disabled={isDeletingContractor}
                              className={`p-1 px-2 text-red-400 rounded border border-red-400 font-bold text-xs ${
                                isDeletingContractor ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              {isDeletingContractor ? "Deleting..." : (
                                <FontAwesomeIcon className="text-xs text-red-400" icon={faTrash} />
                              )}
                            </button>
                          </td>
                        )}
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
                {user?.role !== 'storekeeper' && (
                  <button
                    onClick={() => {
                      navigate(`/project-manager/add-worker/${selectedProduct.id}`, {
                        state: { from: "workersModal", returnTo: "workers" },
                      });
                    }}
                    className="px-4 py-2 text-lg bg-blue-400 rounded-lg text-white font-semibold hover:bg-blue-500 flex items-center gap-2 shadow"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Worker
                  </button>
                )}
              </div>

              {selectedProduct?.salary_workers?.length > 0 ? (
                <table className="min-w-full mb-20 bg-white border rounded-lg shadow text-[12px]">
                  <thead>
                    <tr className="bg-blue-400 text-white">
                      {/* <th className="py-1 px-2 text-left font-bold">#</th> */}
                      <th className="py-1 px-2 text-left font-bold">Name</th>
                      <th className="py-1 px-2 text-left font-bold">Date</th>
                      {user?.role === 'ceo' && (
                        <th className="py-1 px-2 text-left font-bold">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.salary_workers.map((worker: any, index: number) => (
                      <tr key={index} className="border-b">
                        {/* <td className="py-1 px-2">{index + 1}</td> */}
                        <td className="py-1 px-2">
                          {worker.linked_salary_worker?.first_name} {worker.linked_salary_worker?.last_name}
                        </td>
                        <td className="py-1 px-2">
                          {new Date(worker.date).toLocaleDateString("en-GB")}
                        </td>
                        {user?.role === 'ceo' && (
                          <td className="py-1 px-2">
                            <button
                              onClick={() => handleEditWorker(worker)}
                              className="p-1 px-2 text-blue-400 rounded border border-blue-400 font-bold mr-2 text-xs"
                            >
                              <FontAwesomeIcon className="text-xs text-blue-400" icon={faPencil} />
                            </button>
                            <button
                              onClick={() => handleDeleteWorker(worker.id)}
                              disabled={isDeletingWorker}
                              className={`p-1 px-2 text-red-400 rounded border border-red-400 font-bold text-xs ${
                                isDeletingWorker ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              {isDeletingWorker ? "Deleting..." : (
                                <FontAwesomeIcon className="text-xs text-red-400" icon={faTrash} />
                              )}
                            </button>
                          </td>
                        )}
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
                disabled={isSavingContractor}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                  isSavingContractor ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSavingContractor ? "Saving..." : "Save Changes"}
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
                disabled={isSavingWorker}
                className={`px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 ${
                  isSavingWorker ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSavingWorker ? "Saving..." : "Save"}
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
          <div className="bg-white rounded-2xl p-20 w-[60%] max-h-[98vh] overflow-y-auto border-2 border-blue-400 shadow-2xl flex flex-col items-center relative">
            <div className="flex flex-col items-center w-full mb-6">
              <h3 className="text-2xl pb-10 font-bold text-blue-400 text-center">Quotations for <span className="font-extrabold text-3xl">{selectedProduct.name}</span></h3>
                <button
                onClick={() => setShowQuotationModal(false)}
                className="absolute top-6 right-8 text-gray-500 hover:text-gray-700 text-3xl font-bold"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            {/* Department, Project, Workers, Contractors as table columns */}
            <div className="w-full">
              <div className="flex justify-start mb-4">
                {user?.role !== 'storekeeper' && (
                  <button
                    onClick={() => navigate(`/project-manager/add-quotation/${selectedProduct.id}`)}
                    className="px-4 py-2 text-lg bg-blue-400 rounded-lg text-white font-semibold hover:bg-blue-500 flex items-center gap-2 shadow"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Quotation
                  </button>
                )}
              </div>
              {quotation && quotation.length > 0 ? (
                <table className="min-w-full mb-20 bg-white border rounded-lg shadow text-[12px]">
                  <thead>
                    <tr className="bg-blue-400 text-white">
                      {/* <th className="py-1 px-2 text-left font-bold">#</th> */}
                      <th className="py-1 px-2 text-left font-bold">Department</th>
                      <th className="py-1 px-2 text-left font-bold">Project</th>
                      <th className="py-1 px-2 text-left font-bold">Workers</th>
                      <th className="py-1 px-2 text-left font-bold">Contractors</th>
                      <th className="py-1 px-2 text-left font-bold">Items</th>
                      {user?.role === 'ceo' && (
                        <th className="py-1 px-2 text-left font-bold">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.map((item: any, index: number) => (
                      <tr key={index} className="border-b">
                        {/* <td className="py-1 px-2">{index + 1}</td> */}
                        <td className="py-1 px-2">{item.department || '-'}</td>
                        <td className="py-1 px-2">{item.project_name || '-'}</td>
                        <td className="py-1 px-2">{item.salary_worker?.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {item.salary_worker.map((w: any, i: number) => (
                              <span key={i}>{w.name}</span>
                            ))}
                      </div>
                        ) : '-'}</td>
                        <td className="py-1 px-2">{item.contractor?.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {item.contractor.map((c: any, i: number) => (
                              <span key={i}>{c.name}</span>
                            ))}
                    </div>
                        ) : '-'}</td>
                        <td className="py-1 px-2">
                          {item.quotation?.length > 0 ? (
                            <ul className="list-disc ml-4">
                              {item.quotation.map((q: any, i: number) => (
                                <li key={i}>{q.name}: {q.quantity}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400 italic">No items</span>
                          )}
                        </td>
                      {user?.role === 'ceo' && (
                          <td className="py-1 px-2">
                          <button
                              onClick={() => navigate(`/project-manager/edit-quotation/${selectedProduct.id}/${item.id}`)}
                              className="p-1 px-2 text-blue-400 rounded border border-blue-400 font-bold mr-2 text-xs"
                            >
                              <FontAwesomeIcon className="text-xs text-blue-400" icon={faPencil} />
                          </button>
                          <button
                            onClick={() => deleteQuotation(item.id)}
                            disabled={isDeletingQuotation}
                            className={`p-1 px-2 text-red-400 rounded border border-red-400 font-bold text-xs ${
                              isDeletingQuotation ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            {isDeletingQuotation ? "Deleting..." : (
                              <FontAwesomeIcon className="text-xs text-red-400" icon={faTrash} />
                            )}
                          </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <p className="italic text-gray-500 mb-4">No quotation items available</p>
                </div>
              )}
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
                disabled={isConfirmingDelete || isDeletingProduct}
                className={`w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 ${
                  isConfirmingDelete || isDeletingProduct ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isConfirmingDelete || isDeletingProduct ? "Deleting..." : "Delete"}
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