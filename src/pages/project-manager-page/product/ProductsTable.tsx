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
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
// import { Accordion } from "rsuite";
import Modal from "@/pages/shop/Modal";
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
  // USER ROLE
  const [userRole, setUserRole] = useState<string | null>(null);

  const headers = userRole === "storekeeper" ? [
    "Product",
    "Linked Project",
    "Quantity",
    "Progress",
    "Task",
    "Quotation",
    "Details",
  ] : [
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

  // Derived safe pagination values to avoid runtime ReferenceErrors
  const safeTotalPages = Math.max(1, Math.ceil((totalCount || 0) / itemsPerPage));
  // Ensure current page is within [1, safeTotalPages]
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

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
    try {
      setLoading(true);
  // Import JSON as a module so Vite resolves it correctly during dev and build
  const mod = await import('@/data/project-manager-page/products/products.json');
  const data = (mod && (mod as any).default) ? (mod as any).default : mod;
      let items = Array.isArray(data.results) ? data.results.slice() : [];

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        items = items.filter((it: any) => (
          String(it.name || '').toLowerCase().includes(q) ||
          String(it.linked_project?.name || '').toLowerCase().includes(q)
        ));
      }

      if (selectedProject) {
        items = items.filter((it: any) => String(it.linked_project?.id || it.project || '').toLowerCase() === String(selectedProject).toLowerCase());
      }

      if (ordering === 'progress') {
        items.sort((a: any, b: any) => (Number(a.progress) || 0) - (Number(b.progress) || 0));
      } else if (ordering === '-progress') {
        items.sort((a: any, b: any) => (Number(b.progress) || 0) - (Number(a.progress) || 0));
      }

  const total = data.count ?? items.length;
      const start = (currentPage - 1) * itemsPerPage;
      const paged = items.slice(start, start + itemsPerPage);

      const updatedTableData: TableData[] = paged.map((item: any) => ({
        id: item.id,
        Product: (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200">
              <img src={item.images || '/public/1 (6).jpg'} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-semibold text-sm">{item.name}</div>
            </div>
          </div>
        ),
        "Linked Project": item.linked_project?.name || "-",
        "Selling price": `₦${Number(item.selling_price || 0).toLocaleString()}`,
        Quantity: item.quantity ?? '-',
        Progress: (
          <div className="w-full bg-gray-200 h-4 relative">
            <div
              className={`bg-blue-100 h-4`}
              style={{ width: `${item.progress}%` }}
            ></div>
            <div className="absolute inset-0 py-1 flex items-center justify-center">
              <span className={`text-blue-400 text-xs font-semibold`}>{item.progress}%</span>
            </div>
          </div>
        ),
        Task: (
          <button onClick={() => { setSelectedTasksProduct(item); setShowTasksModal(true); }} className="px-3 py-1 border-2 border-blue-400 text-blue-400 bg-white rounded hover:bg-blue-400 hover:text-white transition-colors">Task</button>
        ),
        Quotation: (
          <button onClick={() => { setSelectedProduct(item); setShowQuotationModal(true); }} className="px-3 py-1 border-2 border-blue-400 text-blue-400 bg-white rounded hover:bg-blue-400 hover:text-white transition-colors">Quotation</button>
        ),
        Details: (
          <button onClick={() => handleViewDetails(item)} className="px-3 py-1 border-2 border-blue-400 text-blue-400 bg-white rounded hover:bg-blue-400 hover:text-white transition-colors">Details</button>
        ),
      }));

      setTableData(updatedTableData);
      setTotalCount(total);
    } catch (error) {
      console.error('Error fetching products JSON:', error);
    } finally {
      setLoading(false);
    }
  };

  // ...fetchProductById is defined earlier; single definition kept to avoid redeclaration

  // View details helper used by table rows
  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetailsModal(true);
    setShowWorkersModal(false);
    setShowContractorsModal(false);
  };

  // Helper to format linked person names robustly
  const formatPersonName = (obj: any, linkedKey: string) => {
    if (!obj) return '-';
    const linked = obj[linkedKey];
    if (linked) {
      const first = linked.first_name || linked.firstName || linked.name || '';
      const last = linked.last_name || linked.lastName || '';
      const name = `${first} ${last}`.trim();
      if (name) return name;
      if (linked.name) return linked.name;
    }
    if (obj.name) return obj.name;
    if (obj.first_name || obj.last_name) return `${obj.first_name || ''} ${obj.last_name || ''}`.trim();
    return '-';
  };

  // currentItems: tableData already contains the current page (fetchProducts paginates),
  // but provide a stable variable here so JSX can reference it.
  const currentItems = tableData;

  // Confirm and delete product (local-only behavior when using static JSON)
  const confirmDeleteProduct = (id?: number) => {
    setConfirmDelete(true);
    if (id && !selectedProduct) {
      const found = tableData.find((t: any) => t.id === id);
      if (found) setSelectedProduct(found);
    }
  };

  const deleteProduct = async () => {
    // Local delete: remove from current tableData and refresh
    if (selectedProduct) {
      setTableData(prev => prev.filter(p => p.id !== selectedProduct.id));
      setShowProductDetailsModal(false);
      setConfirmDelete(false);
      setModalConfig({ isOpen: true, title: 'Success', message: 'Product deleted (local)', type: 'success' });
      // Try to refresh overall list
      await fetchProducts();
    }
  };

  // Close the success/error modal
  const handleCloseModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  // Confirm delete button handler used by confirmation modal
  const handleConfirmDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.disabled = true;
    setIsConfirmingDelete(true);
    try {
      await deleteProduct();
    } finally {
      setIsConfirmingDelete(false);
      setTimeout(() => { button.disabled = false; }, 300);
    }
  };

  // Quotation and contractor/worker handlers (local updates to selectedProduct)
  const deleteQuotation = async (id: number) => {
    if (!selectedProduct) return;
    const updated = { ...selectedProduct, quotation: (selectedProduct.quotation || []).filter((q: any) => q.id !== id) };
    setSelectedProduct(updated);
    setQuotation((prev: any[]) => prev.filter((q: any) => q.id !== id));
    setModalConfig({ isOpen: true, title: 'Success', message: 'Quotation removed (local)', type: 'success' });
  };

  // Load products on mount and when relevant filters change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, ordering, selectedProject]);

  // Tiny noop effect to reference some values that are intentionally present for future use
  // This prevents TypeScript from flagging them as 'declared but never used' while keeping
  // the file stable during the migration to static JSON. We'll remove or use them properly later.
  useEffect(() => {
    // reference variables to avoid unused warnings in CI/local lint
    void (dropdownOpen || projectDropdownCount || projectTotalPages || projectDropdownItems.length || modalLoading);
  }, [dropdownOpen, projectDropdownCount, projectTotalPages, projectDropdownItems.length, modalLoading]);

  const handleDeleteContractor = async (contractorId: number) => {
    if (!selectedProduct) return;
    const updated = { ...selectedProduct, contractors: (selectedProduct.contractors || []).filter((c: any) => c.id !== contractorId) };
    setSelectedProduct(updated);
    setModalConfig({ isOpen: true, title: 'Success', message: 'Contractor removed (local)', type: 'success' });
  };

  const handleEditContractor = (contractor: any) => {
    setEditingContractor(contractor);
    setShowEditContractorModal(true);
  };

  const saveEditedContractor = async () => {
    if (!editingContractor || !selectedProduct) return;
    const updatedContractors = (selectedProduct.contractors || []).map((c: any) => c.id === editingContractor.id ? editingContractor : c);
    setSelectedProduct({ ...selectedProduct, contractors: updatedContractors });
    setShowEditContractorModal(false);
    setModalConfig({ isOpen: true, title: 'Success', message: 'Contractor updated (local)', type: 'success' });
  };

  const handleDeleteWorker = async (workerId: number) => {
    if (!selectedProduct) return;
    const updated = { ...selectedProduct, salary_workers: (selectedProduct.salary_workers || []).filter((w: any) => w.id !== workerId) };
    setSelectedProduct(updated);
    setModalConfig({ isOpen: true, title: 'Success', message: 'Worker removed (local)', type: 'success' });
  };

  const handleEditWorker = (worker: any) => {
    setEditingWorker(worker);
    setShowEditWorkerModal(true);
  };

  const saveEditedWorker = async () => {
    if (!editingWorker || !selectedProduct) return;
    const updatedWorkers = (selectedProduct.salary_workers || []).map((w: any) => w.id === editingWorker.id ? editingWorker : w);
    setSelectedProduct({ ...selectedProduct, salary_workers: updatedWorkers });
    setShowEditWorkerModal(false);
    setModalConfig({ isOpen: true, title: 'Success', message: 'Worker updated (local)', type: 'success' });
  };

  // PROJECTS EFFECT
  useEffect(() => {
    // Load unique linked projects directly from the local products.json so we don't call an API
    const loadProjectsFromProducts = async () => {
      try {
        const mod = await import('@/data/project-manager-page/products/products.json');
        const data = (mod && (mod as any).default) ? (mod as any).default : mod;
        const items = Array.isArray(data.results) ? data.results : [];
        const unique = new Map<string, any>();
        items.forEach((it: any) => {
          const lp = it.linked_project;
          if (lp && lp.id != null) {
            const key = String(lp.id);
            if (!unique.has(key)) unique.set(key, lp);
          }
        });
  const arr = Array.from(unique.values()).sort((a: any, b: any) => String(a.name || '').localeCompare(String(b.name || '')));
  setProjects(arr);
  setProjectTotalPages(Math.max(1, Math.ceil(arr.length / PROJECTS_PER_PAGE)));
      } catch (error) {
        console.error('Failed to load projects from products.json', error);
        setProjects([]);
        setProjectTotalPages(1);
      }
    };
    loadProjectsFromProducts();
  }, [projectPage]);

  // Fetch projects for dropdown
  useEffect(() => {
    // Populate dropdown items from products.json (unique linked projects)
    (async () => {
      try {
        const mod = await import('@/data/project-manager-page/products/products.json');
        const data = (mod && (mod as any).default) ? (mod as any).default : mod;
        const items = Array.isArray(data.results) ? data.results : [];
        const unique = new Map<string, any>();
        items.forEach((it: any) => {
          const lp = it.linked_project;
          if (lp && lp.id != null) {
            const key = String(lp.id);
            if (!unique.has(key)) unique.set(key, lp);
          }
        });
  const arr = Array.from(unique.values()).sort((a: any, b: any) => String(a.name || '').localeCompare(String(b.name || '')));
  setProjectDropdownItems(arr);
        setProjectDropdownNext(null);
        setProjectDropdownPrev(null);
        setProjectDropdownCount(arr.length);
      } catch (err) {
        console.error('Failed to load projects from products.json', err);
        setProjectDropdownItems([]);
      }
    })();
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
              <div className="w-full bg-gray-200 h-4 relative">
                <div
                  className={`bg-blue-100 h-4`}
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
      const resp = await fetch('/src/data/project-manager-page/products/products.json', {
        headers: { 'Content-Type': 'application/json' }
      });
      if (!resp.ok) throw new Error('Failed to load products.json');
      const data = await resp.json();
      const found = (Array.isArray(data.results) ? data.results : []).find((p: any) => Number(p.id) === Number(id));
      return found || null;
    } catch (err) {
      console.error('fetchProductById error', err);
      return null;
    }
  };

  const [salaryWorkers, setSalaryWorkers] = useState<any[]>([]);

  // Fetch salary workers when modal opens
  useEffect(() => {
    // Use local product data when available to avoid network calls
    if (showWorkersModal && selectedProduct) {
      const localWorkers = Array.isArray(selectedProduct.salary_workers) ? selectedProduct.salary_workers : [];
      setSalaryWorkers(localWorkers);
    } else if (!showWorkersModal) {
      setSalaryWorkers([]);
    }
  }, [showWorkersModal, selectedProduct?.id]);

  // Populate quotation state from selectedProduct when quotation modal opens
  useEffect(() => {
    if (showQuotationModal && selectedProduct) {
      const q = selectedProduct.quotation ?? selectedProduct.quotations ?? [];
      setQuotation(Array.isArray(q) ? q : []);
    } else if (!showQuotationModal) {
      setQuotation([]);
    }
  }, [showQuotationModal, selectedProduct]);

  return (
    <div className="wrapper w-full mx-auto my-0 pt-2 mb-20 md:mb-4 ">
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
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Product
            </button>
        </div>
  </div>
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
                <select
                  value={selectedProject}
                  onChange={(e) => { setSelectedProject(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-300 rounded px-2 py-2 text-xs sm:text-sm"
                >
                  <option value="">All projects</option>
                  {projectDropdownItems.map((p: any) => (
                    <option key={p.id} value={String(p.id)}>{p.name}</option>
                  ))}
                </select>
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
            <table className="min-w-full bg-white shadow-md overflow-hidden">
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
            className="bg-white overflow-scroll rounded-2xl p-2  sm:p-10 max-h-[96vh] max-w-5xl w-full mx-2 md:mx-4 border border-gray-200 shadow-2xl relative z-[100]"
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
                    <div className={`w-full mb-6 grid grid-cols-2 ${userRole === "storekeeper" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3 lg:grid-cols-6"} gap-2 sm:gap-4 justify-center`}>
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
            <>
              <p className="text-blue-400 font-bold text-xs sm:text-sm mb-1">Profit</p>
              <p className="font-medium text-base sm:text-lg">₦ {Number(selectedProduct.calculations.profit).toLocaleString('en-NG')}</p>
            </>
          
                        </div>

                        <div className="bg-white rounded shadow border border-blue-100 flex flex-col items-center py-2 px-1 sm:py-4 sm:px-2">
            <>
              <p className="text-blue-400 font-bold text-xs sm:text-sm mb-1">Profit per item</p>
              <p className="font-medium text-base sm:text-lg">₦ {Number(selectedProduct.calculations.profit_per_item).toLocaleString('en-NG')}</p>
            </>
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
                    </div>
                  </>
                )}
                <div className="columns-1 lg:columns-2 gap-4 sm:gap-6 space-y-4 sm:space-y-6 [&>*]:break-inside-avoid-column mt-6">
                  {/* Details Card */}
                  <div className="bg-white rounded-xl border border-blue-100 max-sm:shadow lg:pe-10 p-4 mb-6 break-inside-avoid-column">
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
                          <span className="block text-sm sm:text-base font-bold text-black">{selectedProduct.overhead_cost || "No overhead cost added"}</span>
                        </div>
                        <div>
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Overhead Cost Base at Creation</span>
                          <span className="block text-sm sm:text-base font-bold text-black">₦ { parseFloat(selectedProduct.overhead_cost_base).toLocaleString('en-NG') || "-"}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Production Note</span>
                          <span className="block text-sm sm:text-base font-bold text-black">{selectedProduct.production_note || "-"}</span>
                        </div>
                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                        <div>
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Linked Project</span>
                          <span className="block text-sm sm:text-base font-bold text-black">{selectedProduct.linked_project?.name || "-"}</span>
                        </div>
                        <div>
                          <span className="block text-xs sm:text-sm font-bold text-blue-400 uppercase mb-1">Product Image</span>
                          {selectedProduct.images ? (
                            <button
                              className="text-blue-500 underline hover:text-blue-700 focus:outline-none text-sm sm:text-base"
                              onClick={() => setExpandedImage(selectedProduct.images)}
                            >
                              View Product Image
                            </button>
                          ) : (
                            <span className="text-gray-400 italic">No image</span>
                          )}
                      </div>
                    </div>
                  </div>
                  </div>
                  {/* Quotations Table */}
                  <div className="bg-white py-4 px-2 rounded-lg shadow-sm border border-gray-200 break-inside-avoid-column">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Quotations</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-blue-400 text-white">
                          <tr>
                            <th className="p-2 max-sm:text-xs text-left">Department</th>
                            <th className="p-2 max-sm:text-xs text-left">Workers</th>
                            <th className="p-2 max-sm:text-xs text-left">Items & Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProduct.quotation && selectedProduct.quotation.length > 0 ? (
                            selectedProduct.quotation.map((q: any, idx: number) => {
                              return (
                                <tr
                                  key={q.id || idx}
                                  className={(selectedProduct.quotation.length > 1 && idx !== selectedProduct.quotation.length - 1) ? "border-b-4 border-blue-400" : ""}
                                  style={{ verticalAlign: 'top' }}
                                >
                                  <td className="p-2 text-left max-sm:text-xs align-top">{q.department || '-'}</td>
                                  <td className="p-2 text-left align-top w-48">
                                    {(() => {
                                      const workers = [];
                                      if (Array.isArray(q.salary_worker) && q.salary_worker.length > 0) {
                                        workers.push(...q.salary_worker.map((w: any) => w.name));
                                      }
                                      if (Array.isArray(q.contractor) && q.contractor.length > 0) {
                                        workers.push(...q.contractor.map((c: any) => c.name));
                                      }
                                      return workers.length > 0 ? (
                                        <ul className="ml-2 max-sm:text-xs">
                                          {workers.map((name, i) => (
                                            <li key={i}>{name}</li>
                                          ))}
                                        </ul>
                                      ) : '-';
                                    })()}
                                  </td>
                                  <td className="p-2 text-left align-top w-72">
                                    {Array.isArray(q.quotation) && q.quotation.length > 0 ? (
                                      <table className="w-full">
                                        <tbody>
                                          {q.quotation.map((item: any, i: number) => (
                                            <tr key={i}>
                                              <td className="align-top pr-4 font-semibold break-words max-w-[180px] max-sm:text-xs">{item.name}</td>
                                              <td className="align-top text-blue-700 font-bold whitespace-nowrap max-sm:text-xs">{item.quantity}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    ) : <span className="text-gray-400 italic">No items</span>}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr><td colSpan={4} className="p-2 text-center text-gray-500">No quotations found</td></tr>
                          )}
                        </tbody>
                      </table>
                  </div>
                </div>
                  {/* Raw Materials Table */}
                  <div className="bg-white py-4 px-2 rounded-lg shadow-sm border border-gray-200 break-inside-avoid-column">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Raw Materials Used</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-blue-400 text-white">
                          <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Quantity</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProduct.raw_materials && selectedProduct.raw_materials.length > 0 ? (
                            selectedProduct.raw_materials.map((rm: any, idx: number) => (
                              <tr key={idx} className="border-b border-gray-200">
                                <td className="p-2 text-left">{rm.name || rm.raw_material?.name || '-'}</td>
                                <td className="p-2 text-left">{rm.quantity}</td>
                                <td className="p-2 text-left">₦{Number(rm.price).toLocaleString('en-NG')}</td>
                                <td className="p-2 text-left">{rm.date ? new Date(rm.date).toLocaleDateString('en-GB') : '-'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan={4} className="p-2 text-center text-gray-500">No raw materials found</td></tr>
                          )}
                        </tbody>
                        {selectedProduct.raw_materials && selectedProduct.raw_materials.length > 0 && (
                          <tfoot className="bg-gray-100">
                            <tr className="font-semibold">
                              <td className="p-2 text-left">Total</td>
                              <td className="p-2 text-left"></td>
                              <td className="p-2 text-left">
                                ₦{selectedProduct.raw_materials.reduce((sum: number, rm: any) => sum + (parseFloat(rm.price || '0') * (parseFloat(rm.quantity || '1'))), 0).toLocaleString('en-NG')}
                              </td>
                              <td className="p-2 text-left"></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                  {/* Expenses Table */}
                  <div className="bg-white py-4 px-2 rounded-lg shadow-sm border border-gray-200 break-inside-avoid-column">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Expenses</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-blue-400 text-white">
                          <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Amount</th>
                            <th className="p-2 text-left">Quantity</th>
                            <th className="p-2 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProduct.expensis && selectedProduct.expensis.length > 0 ? (
                            selectedProduct.expensis.map((expense: any, idx: number) => (
                              <tr key={idx} className="border-b border-gray-200">
                                <td className="p-2 text-left">{expense.name || '-'}</td>
                                <td className="p-2 text-left">₦{Number(expense.amount).toLocaleString('en-NG')}</td>
                                <td className="p-2 text-left">{expense.quantity || '-'}</td>
                                <td className="p-2 text-left">{expense.date ? new Date(expense.date).toLocaleDateString('en-GB') : '-'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan={4} className="p-2 text-center text-gray-500">No expenses found</td></tr>
                          )}
                        </tbody>
                        {selectedProduct.expensis && selectedProduct.expensis.length > 0 && (
                          <tfoot className="bg-gray-100">
                            <tr className="font-semibold">
                              <td className="p-2 text-left">Total</td>
                              <td className="p-2 text-left">
                                ₦{selectedProduct.expensis.reduce((sum: number, expense: any) => sum + parseFloat(expense.amount || '0'), 0).toLocaleString('en-NG')}
                              </td>
                              <td className="p-2 text-left"></td>
                              <td className="p-2 text-left"></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                  {/* Task Table with Progress rate inside */}
                  <div className="bg-white py-4 px-2 rounded-lg shadow-sm border border-gray-200 mt-6 w-full">
                    {/* Progress Bar inside Tasks Card */}
                    <div className="text-sm text-gray-20 mb-3 w-full">
                      <span className="font-bold">Progress rate:</span>
                      {!editingProgress ? (
                        <div className="flex items-center mt-1">
                          <div className="flex-grow">
                            <span className="text-xs text-gray-500">
                              {selectedProduct.progress}% complete
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${selectedProduct.progress}%` }}></div>
                            </div>
                          </div>
                            <button
                              onClick={() => {
                                setCurrentProgress(selectedProduct.progress);
                                setEditingProgress(true);
                              }}
                              className="ml-4 px-3 py-1 text-sm bg-blue-400 text-white rounded-lg"
                            >
                              Edit
                            </button>
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
                                        <input type="checkbox" checked={task?.checked} readOnly={userRole === "storekeeper"} onChange={e => { if (userRole !== "storekeeper") { e.stopPropagation(); handleTaskCompletionToggle(idx); } }} />
                                      </td>
                                    </tr>
                                    {Array.isArray(task.subtasks) && task.subtasks.length > 0 && task.subtasks.map((sub: any, subIdx: number) => (
                                      <tr key={sub.id || sub.title || `${idx}-${subIdx}`} className="border-b border-gray-100">
                                        <td className="p-2 pl-8 text-left text-blue-400">• {sub.title}</td>
                                        <td className="p-2 text-left">
                                          <input type="checkbox" checked={sub.checked} readOnly={userRole === "storekeeper"} onChange={e => { if (userRole !== "storekeeper") { e.stopPropagation(); handleTaskCompletionToggle(idx, subIdx); } }} />
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
                  {/* Salary Workers Table */}
                  <div className="bg-white py-4 px-2  rounded-lg shadow-sm border border-gray-200 break-inside-avoid-column">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Salary Workers</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-blue-400 text-white">
                          <tr>
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProduct.salary_workers && selectedProduct.salary_workers.length > 0 ? (
                            selectedProduct.salary_workers.map((sw: any, idx: number) => (
                              <tr key={idx} className="border-b border-gray-200">
                                <td className="p-2 text-left">{sw.date ? new Date(sw.date).toLocaleDateString('en-GB') : '-'}</td>
                                <td className="p-2 text-left">{sw.name ? `${sw.name}` : '-'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan={2} className="p-2 text-center text-gray-500">No salary workers found</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Contractors Table */}
                  <div className="bg-white py-4 px-2 rounded-lg shadow-sm border border-gray-200 break-inside-avoid-column">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Contractors</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-blue-400 text-white">
                          <tr>
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProduct.contractors && selectedProduct.contractors.length > 0 ? (
                            selectedProduct.contractors.map((c: any, idx: number) => (
                              <tr key={idx} className="border-b border-gray-200">
                                <td className="p-2 text-left">{c.date ? new Date(c.date).toLocaleDateString('en-GB') : '-'}</td>
                                <td className="p-2 text-left">{c.name ? `${c.name}` : '-'}</td>
                                <td className="p-2 text-left">₦{ parseFloat(c.cost).toLocaleString('en-NG') || '-'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan={3} className="p-2 text-center text-gray-500">No contractors found</td></tr>
                          )}
                        </tbody>
                        {selectedProduct.contractors && selectedProduct.contractors.length > 0 && (
                          <tfoot className="bg-gray-100">
                            <tr className="font-semibold">
                              <td className="p-2 text-left">Total</td>
                              <td className="p-2 text-left"></td>
                              <td className="p-2 text-left">
                                ₦{selectedProduct.contractors.reduce((sum: number, c: any) => sum + parseFloat(c.cost || '0'), 0).toLocaleString('en-NG')}
                              </td>
                              <td className="p-2 text-left"></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
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
                className="absolute top-2 sm:top-4 md:top-6 right-2 sm:right-4 md:right-8 text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
              >
                <FontAwesomeIcon icon={faXmark} size="2x" className="font-bold text-lg sm:text-2xl md:text-3xl text-gray-700 hover:text-red-500 transition-colors" />
              </button>
            </div>
            <div className="w-full">
              <div className="flex justify-start mb-4">
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
              </div>
              {selectedProduct?.contractors?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full mb-20 bg-white border rounded-lg shadow text-[10px] sm:text-[12px] md:text-sm">
                    <thead>
                      <tr className="bg-blue-400 text-white">
                        <th className="py-1 px-1 sm:px-2 text-left font-bold">Name</th>
                        <th className="py-1 px-1 sm:px-2 text-left font-bold">Date</th>
                        <th className="py-1 px-1 sm:px-2 text-left font-bold">Cost</th>
                          <th className="py-1 px-1 sm:px-2 text-left font-bold">Actions</th>
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
                          <td className="py-1 px-1 sm:px-2">{contractor.cost ? `₦${Number(contractor.cost).toLocaleString('en-NG')}` : "-"}</td>
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
              </div>

              {salaryWorkers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full mb-20 bg-white border rounded-lg shadow text-[10px] sm:text-[12px]">
                    <thead>
                      <tr className="bg-blue-400 text-white">
                        <th className="py-1 px-1 sm:px-2 text-left font-bold">Name</th>
                        <th className="py-1 px-1 sm:px-2 text-left font-bold">Date</th>
                          <th className="py-1 px-1 sm:px-2 text-left font-bold">Actions</th>
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
                  <button
                    onClick={() => navigate(`/project-manager/add-quotation/${selectedProduct.id}`)}
                    className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-lg bg-blue-400 rounded-lg text-white font-semibold hover:bg-blue-500 flex items-center gap-2 shadow"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Quotation
                  </button>
              </div>
              {quotation && quotation.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full mb-20 bg-white border rounded-lg shadow text-[10px] sm:text-[12px] md:text-sm">
                  <thead>
                    <tr className="bg-blue-400 text-white">
                      <th className="py-1 px-2 text-left font-bold">Department</th>
                        <th className="py-1 px-2 text-left font-bold hidden sm:table-cell">Project</th>
                      <th className="py-1 px-2 text-left font-bold">Workers</th>
                      <th className="py-1 px-2 text-left font-bold">Items & Quantity</th>
                        <th className="py-1 px-2 text-left font-bold">Actions</th>
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