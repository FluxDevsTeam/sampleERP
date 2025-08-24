import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdCancel } from "react-icons/md";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProjectModals from "./Modal";
import PaginationComponent from "./Pagination";
import AddProjectModal from "./AddProjectModal";
import dayjs from "dayjs";
import { FaEdit, FaTrash } from "react-icons/fa";
import ProjectTaskManager from "./ProjectTaskManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark, faArrowLeft, faArrowRight, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import projectsData from "@/data/ceo/project/projects.json";

// Interface definitions remain the same
interface Product {
  id: number;
  name: string;
  selling_price: string;
  progress: number;
}

interface SoldItem {
  id: number;
  quantity: string;
  cost_price: string;
  selling_price: string;
  total_price: number;
  name?: string;
}

interface CustomerDetail {
  id: number;
  name: string;
}

interface Calculations {
  total_raw_material_cost: number;
  total_artisan_cost: number;
  total_overhead_cost: number;
  total_products_cost: number;
  total_product_selling_price: number;
  product_profit: number;
  total_cost_price_sold_items: number;
  total_selling_price_sold_items: number;
  shop_items_profit: number;
  money_left_for_expensis: number;
  money_left_for_expensis_with_logistics_and_service_charge: number;
  total_other_productions_budget: number;
  total_other_productions_cost: number;
  total_expensis: number;
  total_money_spent: number;
  total_paid: number;
  final_profit: number;
}

interface Task {
  title: string;
  checked: boolean;
  subtasks?: { title: string; checked: boolean }[];
}

interface Project {
  id: number;
  name: string;
  invoice_image: string | null;
  status: string;
  start_date: string;
  deadline: string | null;
  timeframe: number | null;
  date_delivered: string | null;
  all_items: Record<string, unknown> | null;
  is_delivered: boolean;
  archived: boolean;
  customer_detail: CustomerDetail;
  products: {
    progress: number | null;
    total_product_selling_price: number;
    total_production_cost: number;
    total_artisan_cost: number;
    total_overhead_cost: number;
    total_raw_material_cost: number;
    total_grand_total: number;
    total_profit: number;
    products: Product[];
  };
  sold_items: {
    total_cost_price_sold_items: number;
    total_selling_price_sold_items: number;
    sold_items: SoldItem[];
  };
  expenses: {
    total_expenses: number;
    expenses: Array<{ name: string; amount: string }>;
  };
  other_productions: {
    total_cost: number;
    total_budget: number;
    other_productions: Array<{ id: number; name: string; cost: string | null; budget: string | null }>;
  };
  selling_price: string;
  logistics: string;
  service_charge: string;
  note: string | null;
  calculations: Calculations;
  tasks?: Task[];
}

interface PaginatedProjectsResponse {
  all_time_projects_count: number;
  all_projects_count: number;
  completed_projects_count: number;
  ongoing_projects_count: number;
  average_progress: number;
  all_projects: Project[];
}

// Add getTimeRemainingInfo function
const getTimeRemainingInfo = (project: any) => {
  const { deadline, status, date_delivered, is_delivered } = project;
  if (status === "delivered" || status === "cancelled" || date_delivered || is_delivered) {
    return { text: "-", color: "" };
  }
  if (!deadline) {
    return { text: "N/A", color: "" };
  }
  const today = dayjs();
  const deadlineDate = dayjs(deadline);
  const days = deadlineDate.diff(today, "day");
  const dayText = Math.abs(days) === 1 ? "day" : "days";
  const color = days < 0 ? "text-red-500" : "";
  return { text: `${days} ${dayText}`, color };
};

// Rest of the code remains unchanged
const saveProjectsToJson = async (updatedProjects: Project[]) => {
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
  return updatedProjects;
};

const fetchProjects = async (
  page = 1,
  searchParams: URLSearchParams
): Promise<PaginatedProjectsResponse> => {
  let filteredProjects = projectsData.all_projects;

  // Apply filters based on searchParams
  const archived = searchParams.get("archived");
  const isDelivered = searchParams.get("is_delivered");
  const deadline = searchParams.get("deadline");
  const upcomingDeadline = searchParams.get("upcoming_deadline");
  const search = searchParams.get("search");
  const ordering = searchParams.get("ordering");

  if (archived) {
    filteredProjects = filteredProjects.filter((project) => project.archived.toString() === archived);
  }
  if (isDelivered) {
    filteredProjects = filteredProjects.filter((project) => project.is_delivered.toString() === isDelivered);
  }
  if (deadline === "true") {
    filteredProjects = filteredProjects.filter((project) => project.deadline && dayjs(project.deadline).isBefore(dayjs()));
  }
  if (upcomingDeadline === "true") {
    filteredProjects = filteredProjects.filter((project) => project.deadline && dayjs(project.deadline).isBefore(dayjs().add(14, "day")) && dayjs(project.deadline).isAfter(dayjs()));
  }
  if (search) {
    filteredProjects = filteredProjects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()) || project.customer_detail.name.toLowerCase().includes(search.toLowerCase()));
  }
  if (ordering) {
    filteredProjects = [...filteredProjects].sort((a, b) => {
      if (ordering === "-start_date") return dayjs(b.start_date).diff(dayjs(a.start_date));
      if (ordering === "start_date") return dayjs(a.start_date).diff(dayjs(b.start_date));
      if (ordering === "-deadline") return (b.deadline || "").localeCompare(a.deadline || "");
      if (ordering === "deadline") return (a.deadline || "").localeCompare(b.deadline || "");
      return 0;
    });
  }

  // Pagination
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const paginatedProjects = filteredProjects.slice(start, start + pageSize);

  return {
    all_time_projects_count: filteredProjects.length,
    all_projects_count: filteredProjects.length,
    completed_projects_count: filteredProjects.filter((p) => p.status === "completed").length,
    ongoing_projects_count: filteredProjects.filter((p) => p.status === "in progress").length,
    average_progress: filteredProjects.length ? Math.round(filteredProjects.reduce((sum, p) => sum + (p.products.progress || 0), 0) / filteredProjects.length) : 0,
    all_projects: paginatedProjects,
  };
};

const ProjectsTable = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [selectedTasksProject, setSelectedTasksProject] = useState<Project | null>(null);
  const [scrollToLastTaskTrigger, setScrollToLastTaskTrigger] = useState(0);
  const [detailsLoadingId, setDetailsLoadingId] = useState<number | null>(null);

  const { data, error, isLoading, refetch } = useQuery<PaginatedProjectsResponse>({
    queryKey: ["projects", currentPage, searchParams.toString()],
    queryFn: () => fetchProjects(currentPage, searchParams),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (data?.all_time_projects_count) {
      setTotalPages(Math.ceil(data.all_time_projects_count / 10));
    }
  }, [data?.all_time_projects_count]);

  const deleteProjectMutation = useMutation<void, Error, number>({
    mutationFn: async (projectId: number) => {
      const updatedProjects = projectsData.all_projects.filter((project) => project.id !== projectId);
      await saveProjectsToJson(updatedProjects);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
      toast.success("Project deleted successfully!");
    },
    onError: (error: Error) => {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    },
  });

  const handleProjectAdded = async () => {
    if (currentPage !== 1) {
      setSearchParams({ page: "1" });
    } else {
      await refetch();
    }
  };

  async function handleRowClick(project: Project) {
    setDetailsLoadingId(project.id);
    try {
      const selected = projectsData.all_projects.find((p) => p.id === project.id);
      if (!selected) throw new Error("Project not found");
      setSelectedProject(selected);
    } catch (err) {
      toast.error("Failed to fetch latest project data");
      setSelectedProject(project); // Fallback to stale data
    }
    setIsModalOpen(true);
    setDetailsLoadingId(null);
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProject?.id) {
      deleteProjectMutation.mutate(selectedProject.id);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const [orderBy, setOrderBy] = useState<string>(searchParams.get("ordering") || "-start_date");

  useEffect(() => {
    if (!showFilterDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropdown]);

  const userRole = typeof window !== "undefined" ? localStorage.getItem("user_role") : null;

  const handleViewRecords = (projectId: number) => {
    const basePath =
      userRole === "ceo"
        ? "/ceo"
        : userRole === "factory_manager"
        ? "/factory-manager"
        : userRole === "project_manager"
        ? "/project-manager"
        : userRole === "storekeeper"
        ? "/store-keeper"
        : userRole === "admin"
        ? "/admin"
        : "/ceo";

    navigate(`${basePath}/projects/${projectId}/records`);
  };

  const handleViewTasks = (project: Project) => {
    setSelectedTasksProject(project);
    setShowTasksModal(true);
  };

  if (isLoading)
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-500">
        Error: {(error as Error).message}
        <button
          onClick={() => refetch()}
          className="ml-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Retry
        </button>
      </div>
    );

  const projects = data?.all_projects || [];
  const totalProjectsCount = data?.all_time_projects_count || 0;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return (
    <div className="py-6 flex flex-col h-full bg-white">
      <div className="flex w-full justify-end mb-6">
        <div className="grid grid-cols-1 sm:flex sm:flex-row sm:flex-wrap gap-2 sm:gap-4 w-full justify-end">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-400 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-500 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "+ Add Project"}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown((prev) => !prev)}
                className="border p-2 rounded flex items-center whitespace-nowrap w-full justify-center text-sm"
              >
                {filterStatus ? `Status: ${filterStatus}` : "Filter by Status"}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {showFilterDropdown && (
                <div
                  ref={filterDropdownRef}
                  className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-10"
                  tabIndex={-1}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setShowFilterDropdown(false);
                    }
                  }}
                >
                  <div className="p-4">
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <span>Archived:</span>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="archived-filter"
                            checked={searchParams.get("archived") === "true"}
                            onChange={() => {
                              const params = new URLSearchParams(searchParams);
                              params.set("archived", "true");
                              params.set("page", "1");
                              setSearchParams(params);
                            }}
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="archived-filter"
                            checked={searchParams.get("archived") === "false"}
                            onChange={() => {
                              const params = new URLSearchParams(searchParams);
                              params.set("archived", "false");
                              params.set("page", "1");
                              setSearchParams(params);
                            }}
                          />
                          <span>No</span>
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Delivered:</span>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="delivered-filter"
                            checked={searchParams.get("is_delivered") === "true"}
                            onChange={() => {
                              const params = new URLSearchParams(searchParams);
                              params.set("is_delivered", "true");
                              params.set("page", "1");
                              setSearchParams(params);
                            }}
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="delivered-filter"
                            checked={searchParams.get("is_delivered") === "false"}
                            onChange={() => {
                              const params = new URLSearchParams(searchParams);
                              params.set("is_delivered", "false");
                              params.set("page", "1");
                              setSearchParams(params);
                            }}
                          />
                          <span>No</span>
                        </label>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span>Order by:</span>
                        <select
                          className="border rounded px-2 py-1"
                          value={orderBy}
                          onChange={(e) => {
                            setOrderBy(e.target.value);
                            const params = new URLSearchParams(searchParams);
                            params.set("ordering", e.target.value);
                            params.set("page", "1");
                            setSearchParams(params);
                          }}
                        >
                          <option value="-start_date">Newest</option>
                          <option value="start_date">Oldest</option>
                          <option value="-deadline">Latest Deadline</option>
                          <option value="deadline">Earliest Deadline</option>
                        </select>
                      </div>
                      <label className="flex items-center cursor-pointer mb-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                          checked={searchParams.get("deadline") === "true"}
                          onChange={() => {
                            const params = new URLSearchParams(searchParams);
                            if (params.get("deadline") === "true") {
                              params.delete("deadline");
                            } else {
                              params.set("deadline", "true");
                            }
                            params.set("page", "1");
                            setSearchParams(params);
                          }}
                        />
                        Past Deadline
                      </label>
                      <label className="flex items-center cursor-pointer mb-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                          checked={searchParams.get("upcoming_deadline") === "true"}
                          onChange={() => {
                            const params = new URLSearchParams(searchParams);
                            if (params.get("upcoming_deadline") === "true") {
                              params.delete("upcoming_deadline");
                            } else {
                              params.set("upcoming_deadline", "true");
                            }
                            params.set("page", "1");
                            setSearchParams(params);
                          }}
                        />
                        Deadline within 2 Weeks
                      </label>
                      <button
                        type="button"
                        className="mt-4 w-full bg-blue-400 text-white rounded py-2 hover:bg-blue-300"
                        onClick={() => {
                          const params = new URLSearchParams(searchParams);
                          params.delete("archived");
                          params.delete("is_delivered");
                          params.delete("deadline");
                          params.delete("upcoming_deadline");
                          params.set("page", "1");
                          setSearchParams(params);
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-row">
 Caves             <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search projects..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm w-full sm:w-48"
                value={searchParams.get("search") || ""}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  params.set("search", e.target.value);
                  params.set("page", "1");
                  setSearchParams(params);
                }}
              />
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", "1");
                  setSearchParams(params);
                }}
                className="px-2 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors text-xs sm:text-sm"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
              {searchParams.get("search") && (
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("search");
                    params.set("page", "1");
                    setSearchParams(params);
                  }}
                  className="sm:w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow hover:bg-red-100 hover:text-red-500 hover:scale-110 transition-all duration-200"
                  aria-label="Clear search"
                >
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M16 3v4M8 3v4M3 7h18" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">No projects found</h2>
              <p className="text-gray-500 mb-6 text-center max-w-xs">
                All your projects will show up here. Add a new project to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full lg:min-w-[1100px] bg-white shadow-md rounded-lg text-xs sm:text-sm">
                <thead>
                  <tr className="bg-blue-400 text-white">
                    <th className="py-2 md:py-4 text-center font-bold">Project Name</th>
                    <th className="py-2 md:py-4 text-center font-bold">Status</th>
                    <th className="py-2 md:py-4 text-center font-bold hidden sm:table-cell">Progress</th>
                    <th className="py-2 md:py-4 text-center font-bold hidden lg:table-cell">Start Date</th>
                    <th className="py-2 md:py-4 text-center font-bold hidden lg:table-cell">Deadline</th>
                    <th className="py-2 md:py-4 text-center font-bold hidden lg:table-cell">Date Delivered</th>
                    <th className="py-2 md:py-4 text-center font-bold hidden sm:table-cell">Timeframe</th>
                    <th className="py-2 md:py-4 text-center font-bold">Time Rem.</th>
                    <th className="py-2 md:py-4 text-center font-bold hidden sm:table-cell">Tasks</th>
                    <th className="py-2 md:py-4 text-center font-bold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map((project) => {
                    const timeRemainingInfo = getTimeRemainingInfo(project);
                    return (
                      <tr key={project.id} className="cursor-pointer hover:bg-gray-50">
                        <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-center text-gray-700 w-auto sm:w-auto">
                          {project.name}
                        </td>
                        <td className="py-2 md:py-5 px-0 sm:px-4 border-b border-gray-200 text-sm md:text-sm text-center text-gray-700 w-auto md:w-auto">
                          <span
                            className={`px-2 max-sm:px-1 inline-flex text-[11px] py-1 sm:text-xs leading-5 font-semibold rounded ${
                              project.status === "in progress"
                                ? " text-yellow-600"
                                : project.status === "completed"
                                ? " text-green-200"
                                : project.status === "delivered"
                                ? " text-green-300"
                                : project.status === "cancelled"
                                ? " text-red-600"
                                : ""
                            }`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-center text-gray-700 hidden sm:table-cell">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-lime-600 h-1 rounded-full"
                              style={{ width: `${project.products.progress || 0}%` }}
                            ></div>
                          </div>
                          <p className="text-xs sm:text-sm mt-1">{project.products.progress || 0}%</p>
                        </td>
                        <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-center text-gray-700 hidden lg:table-cell">
                          {project.start_date}
                        </td>
                        <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-center text-gray-700 hidden lg:table-cell">
                          {project.deadline || "Not set"}
                        </td>
                        <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-center text-gray-700 hidden lg:table-cell">
                          {project.date_delivered || "-"}
                        </td>
                        <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-center text-gray-700 hidden sm:table-cell">
                          {project.timeframe || "-"}
                        </td>
                        <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-center text-gray-700 w-auto sm:w-auto">
                          <span className={timeRemainingInfo.color}>{timeRemainingInfo.text}</span>
                        </td>
                        <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-center hidden sm:table-cell">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTasks(project);
                              setScrollToLastTaskTrigger((prev) => prev + 1);
                            }}
                            className="px-1 sm:px-2 py-1 text-blue-400 border border-blue-300 rounded hover:bg-blue-50 text-xs sm:text-sm"
                          >
                            Tasks
                          </button>
                        </td>
                        <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-center">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              await handleRowClick(project);
                            }}
                            className="px-2 sm:px-3 py-1 text-blue-400 border-2 border-blue-400 rounded text-xs sm:text-sm flex items-center justify-center"
                            disabled={detailsLoadingId === project.id}
                          >
                            {detailsLoadingId === project.id ? (
                              <span className="flex items-center gap-1 px-2">
                                <svg
                                  className="animate-spin h-4 w-4 text-blue-400"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                  />
                                </svg>
                              </span>
                            ) : (
                              "Details"
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={!hasPreviousPage}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span className="mx-4 text-md">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={!hasNextPage}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>

      <ProjectModals
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedProject={selectedProject}
        handleDelete={handleDelete}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        confirmDelete={confirmDelete}
        handleViewTasks={handleViewTasks}
      />

      <AddProjectModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleProjectAdded}
      />

      {showTasksModal && selectedTasksProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-3xl min-h-[600px] w-full relative shadow-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold p-2 rounded-full bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 z-10"
              style={{ lineHeight: 1 }}
              onClick={() => {
                setShowTasksModal(false);
                refetch();
              }}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Tasks for {selectedTasksProject.name}</h2>
            <ProjectTaskManager
              project={selectedTasksProject}
              onUpdate={(updatedTasks) => {
                setSelectedTasksProject((prev: any) => ({ ...prev, tasks: updatedTasks }));
              }}
              scrollToLastTaskTrigger={scrollToLastTaskTrigger}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;