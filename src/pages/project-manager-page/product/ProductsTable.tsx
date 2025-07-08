import React, { useEffect, useState, JSX, useRef, useLayoutEffect } from "react";
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
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/pages/AuthPages/AuthContext";
// import { Accordion } from "rsuite";
import Modal from "@/pages/shop/Modal";
import SearchablePaginatedProjectDropdown from "./SearchablePaginatedProjectDropdown";
import DashboardCard from "../../factory-manager-page/dashboard/DashboardCard";
import ProductTaskManager from "./Product Components/ProductTaskManager";

interface TableData {
  id: number;
  Product: string;
  "Linked Project": string;
  "Selling price": string;
  Quantity: string | number;
  Progress: JSX.Element;
  Details: JSX.Element;
  Task: JSX.Element;
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
    "Task",
    "Quotation",
    "Details",
  ];
  // TABLE DATA
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Add missing state for setShowTasksModal
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [selectedTasksProduct, setSelectedTasksProduct] = useState<any | null>(null);

  // Add local state for tasks in the ProductsTable component
  const [localTasks, setLocalTasks] = useState<any[]>([]);

  // Add scrollToLastTaskTrigger state
  const [scrollToLastTaskTrigger, setScrollToLastTaskTrigger] = useState(0);

  // Add ref for modal scrollable content and scroll position
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const modalScrollTopRef = useRef(0);

  // Add modal loading state
  const [modalLoading, setModalLoading] = useState(false);

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
    let url = `https://backend.kidsdesigncompany.com/api/product/?page=${currentPage}&page_size=${itemsPerPage}`;
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
      url += `&${params.toString()}`;
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
      const updatedTableData: TableData[] = data.results.map((item: any) => ({
        id: item.id,
        Product: (
          <div className="items-center">
            <p>{item.name}</p>
          </div>
        ),
        "Linked Project": item.linked_project?.name || "-",
        "Selling price": `₦${Number(item.selling_price).toLocaleString()}`,
        Quantity: item.quantity || "-",
        Progress: (
          <div className="w-full bg-gray-200 h-4 relative">
            <div
              className={`bg-blue-100 h-4`}
              style={{ width: `${item.progress}%` }}
            ></div>
            <div className="absolute inset-0 py-1 flex items-center justify-center">
              <span className={`text-green-200 text-xs font-semibold ${item.progress > 59 ? "text-white" : ""}`}>{item.progress}%</span>
            </div>
          </div>
        ),
        Task: (
          <button
            onClick={async () => {
              setShowProductDetailsModal(false);
              setSelectedProduct(null);
              setShowTasksModal(true);
              setModalLoading(true);
              const latest = await fetchProductById(item.id);
              if (latest) {
                setSelectedTasksProduct(latest);
              }
              setModalLoading(false);
              setScrollToLastTaskTrigger((prev) => prev + 1);
            }}
            className="px-3 py-1 border-2 border-blue-400 text-blue-400 bg-white rounded hover:bg-blue-400 hover:text-white transition-colors"
          >
            Task
          </button>
        ),
        Quotation: (
          <button
            onClick={() => {
              setSelectedProduct(item);
              setShowQuotationModal(true);
            }}
            className="px-3 py-1 border-2 border-blue-400 text-blue-400 bg-white rounded hover:bg-blue-400 hover:text-white transition-colors"
          >
            Quotation
          </button>
        ),
        Details: (
          <button
            onClick={() => handleViewDetails(item)}
            className="px-3 py-1 border-2 border-blue-400 text-blue-400 bg-white rounded hover:bg-blue-400 hover:text-white transition-colors"
          >
            View
          </button>
        ),
      }));
      setTableData(updatedTableData);
      setTotalCount(data.count);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery, ordering, selectedProject]);

  const currentItems = tableData;
  // Clamp currentPage and totalPages
  const safeTotalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);

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

  const handleViewDetails = async (product: any) => {
    setShowProductDetailsModal(true);
    setModalLoading(true);
    setSelectedProduct(null);
    const latest = await fetchProductById(product.id);
    if (latest) {
      setSelectedProduct(latest);
    }
    setModalLoading(false);
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

  // Sync localTasks with selectedProduct.tasks when product detail modal opens
  useEffect(() => {
    if (showProductDetailsModal && selectedProduct) {
      let loadedTasks = selectedProduct.tasks;
      if (typeof loadedTasks === 'string') {
        try {
          loadedTasks = JSON.parse(loadedTasks);
        } catch {
          loadedTasks = [];
        }
      }
      setLocalTasks(Array.isArray(loadedTasks) ? loadedTasks : []);
    }
  }, [showProductDetailsModal, selectedProduct]);

  // Handler for toggling task/subtask completion
  const handleTaskCompletionToggle = async (taskIdx: number, subIdx?: number) => {
    if (!selectedProduct) return;
    // Record scroll position before update
    if (modalContentRef.current) {
      modalScrollTopRef.current = modalContentRef.current.scrollTop;
    }
    const updatedTasks = [...localTasks];
    if (typeof subIdx === 'number') {
      if (updatedTasks[taskIdx].subtasks && updatedTasks[taskIdx].subtasks[subIdx]) {
        updatedTasks[taskIdx].subtasks[subIdx].checked = !updatedTasks[taskIdx].subtasks[subIdx].checked;
        // After toggling, check if all subtasks are checked
        const allChecked = updatedTasks[taskIdx].subtasks.every((sub: any) => sub.checked);
        updatedTasks[taskIdx].checked = allChecked;
      }
    } else {
      updatedTasks[taskIdx].checked = !updatedTasks[taskIdx].checked;
      // If toggling the main task, also toggle all subtasks to match
      if (updatedTasks[taskIdx].subtasks && Array.isArray(updatedTasks[taskIdx].subtasks)) {
        updatedTasks[taskIdx].subtasks = updatedTasks[taskIdx].subtasks.map((sub: any) => ({
          ...sub,
          checked: updatedTasks[taskIdx].checked
        }));
      }
    }
    setLocalTasks(updatedTasks); // Update local state for immediate UI feedback
    // Calculate progress
    let total = 0;
    for (const task of updatedTasks) {
      if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
        const completed = task.subtasks.filter((sub: any) => sub.checked).length;
        total += completed / task.subtasks.length;
      } else {
        total += task.checked ? 1 : 0;
      }
    }
    const progress = updatedTasks.length > 0 ? Math.round((total / updatedTasks.length) * 100) : 0;
    // Send PATCH to backend
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://backend.kidsdesigncompany.com/api/product/${selectedProduct.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`
        },
        body: JSON.stringify({ tasks: JSON.stringify(updatedTasks), progress })
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        syncProductState(updatedProduct);
      } else {
        alert('Failed to update task completion');
      }
    } catch (err) {
      alert('Failed to update task completion');
    }
  };

  const syncProductState = (updatedProduct: any) => {
    setSelectedProduct((prev: any) => prev && prev.id === updatedProduct.id ? { ...prev, ...updatedProduct } : prev);
    setSelectedTasksProduct((prev: any) => prev && prev.id === updatedProduct.id ? { ...prev, ...updatedProduct } : prev);
    if (selectedProduct && selectedProduct.id === updatedProduct.id) {
      setLocalTasks(updatedProduct.tasks);
    }
    setTableData((prevTableData) =>
      prevTableData.map((product) =>
        product.id === updatedProduct.id
          ? { ...product, Progress: (
              <div className="w-full bg-gray-200 rounded-full h-3 relative">
                <div
                  className={`bg-blue-400 h-3 rounded-full`}
                  style={{ width: `${updatedProduct.progress}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-green-200 text-xs font-semibold ${updatedProduct.progress > 59 ? "text-white" : ""}`}>{updatedProduct.progress}%</span>
                </div>
              </div>
            ) }
          : product
      )
    );
  };

  // Restore scroll position after localTasks changes
  useLayoutEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = modalScrollTopRef.current;
    }
  }, [localTasks]);

  // Add a helper to fetch a single product by id
  const fetchProductById = async (id: number) => {
    try {
      const response = await fetch(`https://backend.kidsdesigncompany.com/api/product/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const [salaryWorkers, setSalaryWorkers] = useState<any[]>([]);

  // Fetch salary workers when modal opens
  useEffect(() => {
    if (showWorkersModal && selectedProduct?.id) {
      const fetchSalaryWorkers = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch(`https://backend.kidsdesigncompany.com/api/product/${selectedProduct.id}/salary/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
          });
          if (!response.ok) throw new Error("Failed to fetch salary workers");
          const data = await response.json();
          setSalaryWorkers(data.results || []);
        } catch (err) {
          setSalaryWorkers([]);
        }
      };
      fetchSalaryWorkers();
    } else if (!showWorkersModal) {
      setSalaryWorkers([]);
    }
  }, [showWorkersModal, selectedProduct?.id]);

  return (
    <div className="wrapper w-11/12 mx-auto my-0 pl-1 pt-2">
      {/* Blur only the background content when showTasksModal is true */}
      <div className={showTasksModal ? "blur-sm" : ""}>
      {/* Heading and Add Product button in grid */}
      <div className="grid grid-cols-2 items-center mb-4 gap-2">
      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-0 mt-2 text-left"
      >
          <span className="block sm:hidden">Products</span>
          <span className="hidden sm:block">Products Management</span>
      </h1>
        <div className="flex justify-end w-full">
          <button
            onClick={() => navigate("/project-manager/add-product")}
            className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap w-full sm:w-auto"
            style={{ display: (user?.role === 'ceo' || user?.role === 'project_manager' || user?.role === 'factory_manager') ? 'inline-flex' : 'none' }}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Product
          </button>
          </div>
      </div>
      {/* Responsive search and filter controls right-aligned in grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center mb-4">
        <div></div>
        <div className="flex justify-end w-full">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Search input and buttons */}
            <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm w-full sm:w-48"
                />
                <button
                  onClick={() => setSearchQuery(searchTerm)}
                className="px-2 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors text-xs sm:text-sm"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSearchQuery("");
                      }}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow hover:bg-red-100 hover:text-red-500 hover:scale-110 transition-all duration-200"
                      aria-label="Clear search"
                    >
                      <FontAwesomeIcon icon={faXmark} size="lg" />
                    </button>
                  )}
              </div>
            {/* Project dropdown and sort dropdown */}
            <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
              <div className="flex-[5_5_0%] w-full sm:w-56">
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
                  {selectedProject && (
                    <button
                      onClick={() => {
                        setSelectedProject("");
                        setCurrentPage(1);
                      }}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
                    >
                      Clear
                    </button>
                  )}
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                className="flex-[3_3_0%] w-full sm:w-auto bg-white border border-gray-300 text-black text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                  <option value="">Sort by</option>
                  <option value="progress">Progress ▲</option>
                  <option value="-progress">Progress ▼</option>
                </select>
              </div>
            </div>
        </div>
      </div>

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
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-400 text-white">
                  {headers.map((header: string) => {
                    // Hide Selling price, Linked Project, and Quotation on <lg
                    if (["Selling price", "Linked Project", "Quotation"].includes(header)) {
                      return (
                        <th
                          key={header}
                          className="py-2 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold hidden lg:table-cell"
                        >
                          {header}
                        </th>
                      );
                    }
                    // Only show these columns on mobile
                    if (["Product", "Progress", "Task", "Details"].includes(header)) {
                      return (
                    <th
                      key={header}
                      className="py-2 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold"
                    >
                      {header}
                    </th>
                      );
                    }
                    // Hide these columns on mobile
                    return (
                      <th
                        key={header}
                        className="py-2 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell"
                      >
                        {header}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length} className="p-0">
                      <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                          {/* SVG icon for box/product */}
                          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path d="M16 3v4M8 3v4M3 7h18" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">No products found</h2>
                        <p className="text-gray-500 mb-6 text-center max-w-xs">All your products will show up here. Add a new product to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      {headers.map((header) => {
                        // Hide Selling price, Linked Project, and Quotation on <lg
                        if (["Selling price", "Linked Project", "Quotation"].includes(header)) {
                          return (
                            <td
                              key={`${index}-${header}`}
                              className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 hidden lg:table-cell"
                            >
                              {row[header]}
                            </td>
                          );
                        }
                        // Only show these columns on mobile
                        if (["Product", "Progress", "Task", "Details"].includes(header)) {
                          return (
                        <td
                          key={`${index}-${header}`}
                          className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700"
                        >
                          {row[header]}
                        </td>
                          );
                        }
                        // Hide these columns on mobile
                        return (
                          <td
                            key={`${index}-${header}`}
                            className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 hidden sm:table-cell"
                          >
                            {row[header]}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div
        className={`flex justify-center items-center mb-28 gap-1 sm:gap-2
         ${showContractorsModal ? "hidden" : ""} 
         ${showWorkersModal ? "hidden" : ""}`}
      >
        <button
          onClick={() => safeCurrentPage > 1 && setCurrentPage(1)}
          disabled={safeCurrentPage === 1 || safeTotalPages === 1}
          className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button
          onClick={() => safeCurrentPage > 1 && setCurrentPage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1 || safeTotalPages === 1}
          className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span className="mx-2 sm:mx-4 text-xs sm:text-sm">
          Page {safeCurrentPage} of {safeTotalPages}
        </span>
        <button
          onClick={() => safeCurrentPage < safeTotalPages && setCurrentPage(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages || safeTotalPages === 1}
          className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button
          onClick={() => safeCurrentPage < safeTotalPages && setCurrentPage(safeTotalPages)}
          disabled={safeCurrentPage === safeTotalPages || safeTotalPages === 1}
          className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>
      </div>
      {/* Render all modals outside the blurred content so they stay sharp */}
      {showProductDetailsModal && (
        <div
          className={`fixed overflow-scroll inset-0 flex items-center justify-center z-[100] 
            ${confirmDelete ? "blur-sm" : ""}
            ${showContractorsModal ? "hidden" : ""} 
            ${showWorkersModal ? "hidden" : ""}
            ${showQuotationModal ? "hidden" : ""}`}
        >
          <div
            ref={modalContentRef}
            className="bg-white overflow-scroll rounded-2xl p-4 sm:p-10 max-h-[90vh] max-w-5xl w-[95vw] sm:w-full mx-4 border border-gray-200 shadow-2xl relative z-[100]"
          >
            {modalLoading || !selectedProduct ? (
              <div className="flex flex-col items-center justify-center h-96">
                <ThreeDots visible={true} height="80" width="80" color="#60A5FA" radius="9" ariaLabel="three-dots-loading" />
              </div>
            ) : (
              <>
                {/* NAME */}
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-20">
                    {selectedProduct.name}
                  </h2>
                  <button
                    onClick={() => setShowProductDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none text-lg sm:text-xl"
                  >
                    <FontAwesomeIcon icon={faXmark} size="2x" className="font-bold text-2xl text-gray-700 hover:text-red-500 transition-colors" />
                  </button>
                </div>

                {/* Calculation Cards */}
                {selectedProduct.calculations && (
                  <>
                    <div className="w-full mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 justify-center">
                        <div className="bg-white rounded shadow border border-blue-100 flex flex-col items-center py-2 px-1 sm:py-4 sm:px-2">
                          <p className="text-blue-400 font-bold text-xs sm:text-sm mb-1">Raw material cost</p>
                          <p className="font-medium text-sm md:text-base lg:text-lg">₦ {Number(selectedProduct.calculations.total_raw_material_cost).toLocaleString('en-NG')}</p>
                        </div>
                        <div className="bg-white rounded shadow border border-blue-100 flex flex-col items-center py-2 px-1 sm:py-4 sm:px-2">
                          <p className="text-blue-400 font-bold text-xs sm:text-sm mb-1">Production cost</p>
                          <p className="font-medium text-base sm:text-lg">₦ {Number(selectedProduct.calculations.total_production_cost).toLocaleString('en-NG')}</p>
                        </div>
                        <div className="bg-white rounded shadow border border-blue-100 flex flex-col items-center py-2 px-1 sm:py-4 sm:px-2">
                          <p className="text-blue-400 font-bold text-xs sm:text-sm mb-1">Overhead Cost</p>
                          <p className="font-medium text-base sm:text-lg">₦ {Number(selectedProduct.calculations.total_overhead_cost).toLocaleString('en-NG')}</p>
                        </div>
                        <div className="bg-white rounded shadow border border-blue-100 flex flex-col items-center py-2 px-1 sm:py-4 sm:px-2">
                          <p className="text-blue-400 font-bold text-xs sm:text-sm mb-1">Quantity</p>
                          <p className="font-medium text-base sm:text-lg">{Number(selectedProduct.calculations.quantity).toLocaleString('en-NG')}</p>
                        </div>
                        <div className="bg-white rounded shadow border border-blue-100 flex flex-col items-center py-2 px-1 sm:py-4 sm:px-2">
                          <p className="text-blue-400 font-bold text-xs sm:text-sm mb-1">Profit</p>
                          <p className="font-medium text-base sm:text-lg">₦ {Number(selectedProduct.calculations.profit).toLocaleString('en-NG')}</p>
                        </div>
                        <div className="bg-white rounded shadow border border-blue-100 flex flex-col items-center py-2 px-1 sm:py-4 sm:px-2">
                          <p className="text-blue-400 font-bold text-xs sm:text-sm mb-1">Profit per item</p>
                          <p className="font-medium text-base sm:text-lg">₦ {Number(selectedProduct.calculations.profit_per_item).toLocaleString('en-NG')}</p>
                        </div>
                    </div>
                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3 justify-end mb-6 sm:mb-8 max-sm:justify-center overflow-x-auto">
                      <button
                        onClick={() => {
                          setShowProductDetailsModal(false);
                          setSelectedProduct(null);
                          setSelectedTasksProduct(selectedProduct);
                          setShowTasksModal(true);
                        }}
                        className="px-2 sm:px-4 py-1 sm:py-2 border-2 border-blue-400 text-blue-400 bg-white rounded-lg font-semibold shadow hover:bg-blue-400 hover:text-white transition-colors text-xs sm:text-sm"
                      >
                        Task
                      </button>
                      <button
                        onClick={() => setShowContractorsModal(true)}
                        className="px-2 sm:px-4 py-1 sm:py-2 border-2 border-blue-400 text-blue-400 bg-white rounded-lg font-semibold shadow hover:bg-blue-400 hover:text-white transition-colors text-xs sm:text-sm"
                      >
                        View Contractors
                      </button>
                      <button
                        onClick={() => setShowWorkersModal(true)}
                        className="px-2 sm:px-4 py-1 sm:py-2 border-2 border-blue-400 text-blue-400 bg-white rounded-lg font-semibold shadow hover:bg-blue-400 hover:text-white transition-colors text-xs sm:text-sm"
                      >
                        View Salary Workers
                      </button>
                      <button
                        onClick={() => setShowQuotationModal(true)}
                        className="px-2 sm:px-4 py-1 sm:py-2 border-2 border-blue-400 text-blue-400 bg-white rounded-lg font-semibold shadow hover:bg-blue-400 hover:text-white transition-colors text-xs sm:text-sm"
                      >
                        View Quotation
                      </button>
                      {user?.role === 'ceo' && (
                        <>
                          <button
                            onClick={() =>
                              navigate(
                                `/project-manager/edit-product/${selectedProduct.id}`
                              )
                            }
                            className="p-1 sm:p-2 pr-2 sm:pr-3 text-blue-400 rounded-lg border-2 border-blue-400 font-bold text-xs sm:text-sm"
                          >
                            <FontAwesomeIcon
                              className="mr-1 text-xs text-blue-400"
                              icon={faPencil}
                            />
                            <span>Update</span>
                          </button>
                          <button
                            onClick={() => confirmDeleteProduct(selectedProduct.id)}
                            className="p-1 sm:p-2 pr-2 sm:pr-3 text-red-400 rounded-lg border-2 border-red-400 font-bold text-xs sm:text-sm"
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
                  </>
                )}
                <div className="flex flex-col-reverse md:flex-row gap-1">
                  {/* LEFT: Details */}
                  <div className="flex-1">
                    <div className="bg-white rounded-xl border border-blue-100 md:border-0 max-sm:shadow lg:pe-10 p-4 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <div>
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Colour</span>
                          <span className="block text-sm sm:text-base font-bold text-black">{selectedProduct.colour || "No colour available"}</span>
                        </div>
                        <div>
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Design</span>
                          <span className="block text-sm sm:text-base font-bold text-black">{selectedProduct.design || "No design added"}</span>
                        </div>
                        <div>
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Selling Price</span>
                          <span className="block text-sm sm:text-base font-bold text-black">₦ {selectedProduct.selling_price || "No selling price added"}</span>
                        </div>
                        <div>
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Dimensions</span>
                          <span className="block text-sm sm:text-base font-bold text-black">{selectedProduct.dimensions ? `${selectedProduct.dimensions} cm` : "No dimensions added"}</span>
                        </div>
                        <div>
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Overhead Cost</span>
                          <span className="block text-sm sm:text-base font-bold text-black">₦ {selectedProduct.overhead_cost || "No overhead cost added"}</span>
                        </div>
                        <div>
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Overhead Cost Base at Creation</span>
                          <span className="block text-sm sm:text-base font-bold text-black">{selectedProduct.overhead_cost_base_at_creation || "-"}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Production Note</span>
                          <span className="block text-sm sm:text-base font-bold text-black">{selectedProduct.production_note || "-"}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Linked Project</span>
                          <span className="block text-sm sm:text-base font-bold text-black">{selectedProduct.linked_project?.name || "-"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* RIGHT: Progress and Images */}
                  <div className="flex flex-col items-center md:w-1/2 w-full">
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
                            onChange={(e) => setCurrentProgress(Number(e.target.value))}
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
                    {/* Task Table under Progress rate */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6 w-full">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-semibold text-gray-700">Tasks</h4>
                        <button
                          onClick={() => {
                            setShowProductDetailsModal(false);
                            setSelectedProduct(null);
                            setSelectedTasksProduct(selectedProduct);
                            setShowTasksModal(true);
                          }}
                          className="px-3 py-1 bg-blue-400 text-white rounded text-xs hover:bg-blue-500 transition-colors"
                          disabled={!selectedProduct}
                        >
                          + Task
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-blue-400 text-white">
                            <tr>
                              <th className="p-2 text-left">Task</th>
                              <th className="p-2 text-left">Completed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(localTasks) && localTasks.length > 0 ? (
                              localTasks.map((task: any, idx: number) => (
                                task ? (
                                  <React.Fragment key={task.id || task.title || idx}>
                                    <tr className="border-b border-gray-200">
                                      <td className="p-2 text-left font-medium">{task?.title}</td>
                                      <td className="p-2 text-left">
                                        <input type="checkbox" checked={task?.checked} onChange={e => { e.stopPropagation(); handleTaskCompletionToggle(idx); }} />
                                      </td>
                                    </tr>
                                    {Array.isArray(task.subtasks) && task.subtasks.length > 0 && task.subtasks.map((sub: any, subIdx: number) => (
                                      <tr key={sub.id || sub.title || `${idx}-${subIdx}`} className="border-b border-gray-100">
                                        <td className="p-2 pl-8 text-left text-black-600">• {sub.title}</td>
                                        <td className="p-2 text-left">
                                          <input type="checkbox" checked={sub.checked} onChange={e => { e.stopPropagation(); handleTaskCompletionToggle(idx, subIdx); }} />
                                        </td>
                                      </tr>
                                    ))}
                                  </React.Fragment>
                                ) : null
                              ))
                            ) : (
                              <tr>
                                <td className="p-2 text-left" colSpan={2}>No tasks found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
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
              </>
            )}
          </div>
        </div>
      )}

      {/* Expanded Image Overlay */}
      {expandedImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-80" onClick={() => setExpandedImage(null)}>
          <img src={expandedImage} alt="Expanded" className="max-w-full max-h-[80vh] w-auto h-auto rounded-lg shadow-2xl border-4 border-white object-contain" />
        </div>
      )}

      {/* contractors modal */}
      {showContractorsModal && selectedProduct && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] ${
            modalConfig.isOpen ? "hidden" : ""
          } ${showEditContractorModal ? "blur-sm" : ""}`}
        >
          <div className="bg-white rounded-2xl p-2 sm:p-6 md:p-10 w-[98vw] sm:w-[90vw] md:w-[60vw] max-w-2xl max-h-[98vh] min-h-[350px] sm:min-h-[400px] md:min-h-[500px] overflow-y-auto border-2 border-blue-400 shadow-2xl flex flex-col items-center relative">
            <div className="flex flex-col items-center w-full mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg md:text-2xl pb-4 sm:pb-6 md:pb-10 font-bold text-blue-400 text-center">Contractors for <span className="font-extrabold text-lg sm:text-xl md:text-3xl">{selectedProduct.name}</span></h3>
              <button
                onClick={() => setShowContractorsModal(false)}
                className="absolute top-2 sm:top-4 md:top-6 right-2 sm:right-4 md:right-8 text-gray-500 hover:text-gray-700 text-lg sm:text-xl md:text-3xl font-bold"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} size="2x" className="font-bold text-lg sm:text-2xl md:text-3xl text-gray-700 hover:text-red-500 transition-colors" />
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
                    className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-lg bg-blue-400 rounded-lg text-white font-semibold hover:bg-blue-500 flex items-center gap-2 shadow"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Contractor
                  </button>
                )}
              </div>
              {selectedProduct?.contractors?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full mb-20 bg-white border rounded-lg shadow text-[10px] sm:text-[12px] md:text-sm">
                    <thead>
                      <tr className="bg-blue-400 text-white">
                        <th className="py-1 px-1 sm:px-2 text-left font-bold">Name</th>
                        <th className="py-1 px-1 sm:px-2 text-left font-bold">Date</th>
                        <th className="py-1 px-1 sm:px-2 text-left font-bold">Cost</th>
                        {user?.role === 'ceo' && (
                          <th className="py-1 px-1 sm:px-2 text-left font-bold">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.contractors.map((contractor: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-1 px-1 sm:px-2">
                            {contractor.linked_contractor?.first_name} {contractor.linked_contractor?.last_name}
                          </td>
                          <td className="py-1 px-1 sm:px-2">
                            {new Date(contractor.date).toLocaleDateString("en-GB")}
                          </td>
                          <td className="py-1 px-1 sm:px-2">₦{contractor.cost || "-"}</td>
                          {user?.role === 'ceo' && (
                            <td className="py-1 px-1 sm:px-2">
                              <button
                                onClick={() => handleEditContractor(contractor)}
                                className="p-1 px-1 sm:px-2 text-blue-400 rounded border border-blue-400 font-bold mr-1 sm:mr-2 text-xs"
                              >
                                <FontAwesomeIcon className="text-xs text-blue-400" icon={faPencil} />
                              </button>
                              <button
                                onClick={() => handleDeleteContractor(contractor.id)}
                                disabled={isDeletingContractor}
                                className={`p-1 px-1 sm:px-2 text-red-400 rounded border border-red-400 font-bold text-xs ${
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
                </div>
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
          <div className="bg-white rounded-2xl p-4 sm:p-20 w-[95vw] sm:w-[60%] max-h-[98vh] min-h-[350px] sm:min-h-[400px] md:min-h-[500px] overflow-y-auto border-2 border-blue-400 shadow-2xl flex flex-col items-center relative">
            <div className="flex flex-col items-center w-full mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-2xl pb-6 sm:pb-10 font-bold text-blue-400 text-center">Salary Workers for <span className="font-extrabold text-xl sm:text-3xl">{selectedProduct.name}</span></h3>
              <button
                onClick={() => setShowWorkersModal(false)}
                className="absolute top-4 sm:top-6 right-4 sm:right-8 text-gray-500 hover:text-gray-700 text-xl sm:text-3xl font-bold"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} size="2x" className="font-bold text-2xl text-gray-700 hover:text-red-500 transition-colors" />
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
                    className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-lg bg-blue-400 rounded-lg text-white font-semibold hover:bg-blue-500 flex items-center gap-2 shadow"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Worker
                  </button>
                )}
              </div>

              {salaryWorkers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full mb-20 bg-white border rounded-lg shadow text-[10px] sm:text-[12px]">
                    <thead>
                      <tr className="bg-blue-400 text-white">
                        <th className="py-1 px-1 sm:px-2 text-left font-bold">Name</th>
                        <th className="py-1 px-1 sm:px-2 text-left font-bold">Date</th>
                        {user?.role === 'ceo' && (
                          <th className="py-1 px-1 sm:px-2 text-left font-bold">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {salaryWorkers.map((worker: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-1 px-1 sm:px-2">
                            {worker.linked_salary_worker?.first_name} {worker.linked_salary_worker?.last_name}
                          </td>
                          <td className="py-1 px-1 sm:px-2">
                            {new Date(worker.date).toLocaleDateString("en-GB")}
                          </td>
                          {user?.role === 'ceo' && (
                            <td className="py-1 px-1 sm:px-2">
                              <button
                                onClick={() => handleEditWorker(worker)}
                                className="p-1 px-1 sm:px-2 text-blue-400 rounded border border-blue-400 font-bold mr-1 sm:mr-2 text-xs"
                              >
                                <FontAwesomeIcon className="text-xs text-blue-400" icon={faPencil} />
                              </button>
                              <button
                                onClick={() => handleDeleteWorker(worker.id)}
                                disabled={isDeletingWorker}
                                className={`p-1 px-1 sm:px-2 text-red-400 rounded border border-red-400 font-bold text-xs ${
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
                </div>
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
                <FontAwesomeIcon icon={faXmark} size="2x" className="font-bold text-2xl text-gray-700 hover:text-red-500 transition-colors" />
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
                <FontAwesomeIcon icon={faXmark} size="2x" className="font-bold text-2xl text-gray-700 hover:text-red-500 transition-colors" />
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
          <div className="bg-white rounded-2xl p-2 sm:p-6 md:p-10 w-[98vw] sm:w-[90vw] md:w-[60vw] max-w-2xl max-h-[98vh] min-h-[350px] sm:min-h-[400px] md:min-h-[500px] overflow-y-auto border-2 border-blue-400 shadow-2xl flex flex-col items-center relative">
            <div className="flex flex-col items-center w-full mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg md:text-2xl pb-4 sm:pb-6 md:pb-10 font-bold text-blue-400 text-center">Quotations for <span className="font-extrabold text-lg sm:text-xl md:text-3xl">{selectedProduct.name}</span></h3>
                <button
                onClick={() => setShowQuotationModal(false)}
                className="absolute top-2 sm:top-4 md:top-6 right-2 sm:right-4 md:right-8 text-gray-500 hover:text-gray-700 text-lg sm:text-xl md:text-3xl font-bold"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} size="2x" className="font-bold text-lg sm:text-2xl md:text-3xl text-gray-700 hover:text-red-500 transition-colors" />
                </button>
              </div>
            <div className="w-full">
              <div className="flex justify-start mb-4">
                {user?.role !== 'storekeeper' && (
                  <button
                    onClick={() => navigate(`/project-manager/add-quotation/${selectedProduct.id}`)}
                    className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-lg bg-blue-400 rounded-lg text-white font-semibold hover:bg-blue-500 flex items-center gap-2 shadow"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Quotation
                  </button>
                )}
              </div>
              {quotation && quotation.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full mb-20 bg-white border rounded-lg shadow text-[10px] sm:text-[12px] md:text-sm">
                  <thead>
                    <tr className="bg-blue-400 text-white">
                      <th className="py-1 px-2 text-left font-bold">Department</th>
                        <th className="py-1 px-2 text-left font-bold hidden sm:table-cell">Project</th>
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
                        <td className="py-1 px-2">{item.department || '-'}</td>
                          <td className="py-1 px-2 hidden sm:table-cell">{item.project_name || '-'}</td>
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
                </div>
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

      {/* Task Modal rendered outside the blurred content so it stays sharp */}
      {showTasksModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black bg-opacity-30" onClick={() => setShowTasksModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl min-h-[400px] w-full relative shadow-xl border-2 border-blue-400" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowTasksModal(false)}>
              <FontAwesomeIcon icon={faXmark} size="2x" className="font-bold text-2xl text-gray-700 hover:text-red-500 transition-colors" />
            </button>
            {modalLoading || !selectedTasksProduct ? (
              <div className="flex flex-col items-center justify-center h-60">
                <ThreeDots visible={true} height="80" width="80" color="#60A5FA" radius="9" ariaLabel="three-dots-loading" />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Tasks for {selectedTasksProduct.name}</h2>
                <ProductTaskManager
                  product={selectedTasksProduct}
                  onUpdate={() => {}}
                  onProductUpdate={syncProductState}
                  scrollToLastTaskTrigger={scrollToLastTaskTrigger}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;