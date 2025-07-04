import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdCancel } from "react-icons/md";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import ProjectModals from "./Modal";
import PaginationComponent from "./Pagination";
import AddProjectModal from "./AddProjectModal";
import dayjs from "dayjs";
import { FaEdit, FaTrash } from "react-icons/fa";
import ProjectTaskManager from "./ProjectTaskManager";

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
    total_project_selling_price: number;
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
}

interface PaginatedProjectsResponse {
  all_time_projects_count: number;
  all_projects_count: number;
  completed_projects_count: number;
  ongoing_projects_count: number;
  average_progress: number;
  all_projects: Project[];
}

const BASE_URL = "https://backend.kidsdesigncompany.com/api";

const getTimeRemainingInfo = (project: Project) => {
  const { deadline, status, date_delivered, is_delivered } = project;

  if (
    status === "delivered" ||
    status === "cancelled" ||
    date_delivered ||
    is_delivered
  ) {
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

const fetchProjects = async (
  page = 1,
  searchParams: URLSearchParams
): Promise<PaginatedProjectsResponse> => {
  const token = localStorage.getItem("accessToken");
  const params: Record<string, string | null> = {
    page: page.toString(),
    archived: searchParams.get("archived"),
    is_delivered: searchParams.get("is_delivered"),
    deadline: searchParams.get("deadline"),
    upcoming_deadline: searchParams.get("upcoming_deadline"),
    search: searchParams.get("search"),
    ordering: searchParams.get("ordering"),
  };

  // Filter out null values
  const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  const response = await axios.get(`${BASE_URL}/project/?ordering=-start_date`, {
    params: filteredParams,
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return response.data;
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

  const { data, error, isLoading, refetch } =
    useQuery<PaginatedProjectsResponse>({
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
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${BASE_URL}/project/${projectId}/`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
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

  const handleRowClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

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
  const [filterStatus, setFilterStatus] = useState('');
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const [orderBy, setOrderBy] = useState<string>(searchParams.get('ordering') || '-start_date');

  useEffect(() => {
    if (!showFilterDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown]);

  const userRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;

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
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-x-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Add Project'}
          </button>
          {/* Filter by Status Dropdown */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowFilterDropdown(prev => !prev)}
              className="border p-2 rounded flex items-center whitespace-nowrap"
            >
              {filterStatus ? `Status: ${filterStatus}` : 'Filter by Status'}
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
                onBlur={e => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setShowFilterDropdown(false);
                  }
                }}
              >
                <div className="p-4">
                  {/* Boolean checkboxes with tri-state for archived and is_delivered */}
                  <div className="flex flex-col gap-2 mt-2">
                    {/* Archived filter as radio group */}
                    <div className="flex items-center gap-2">
                      <span>Archived:</span>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="archived-filter"
                          checked={searchParams.get('archived') === 'true'}
                          onChange={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('archived', 'true');
                            params.set('page', '1');
                            setSearchParams(params);
                          }}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="archived-filter"
                          checked={searchParams.get('archived') === 'false'}
                          onChange={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('archived', 'false');
                            params.set('page', '1');
                            setSearchParams(params);
                          }}
                        />
                        <span>No</span>
                      </label>
                    </div>
                    {/* Delivered filter as radio group */}
                    <div className="flex items-center gap-2">
                      <span>Delivered:</span>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="delivered-filter"
                          checked={searchParams.get('is_delivered') === 'true'}
                          onChange={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('is_delivered', 'true');
                            params.set('page', '1');
                            setSearchParams(params);
                          }}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="delivered-filter"
                          checked={searchParams.get('is_delivered') === 'false'}
                          onChange={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('is_delivered', 'false');
                            params.set('page', '1');
                            setSearchParams(params);
                          }}
                        />
                        <span>No</span>
                      </label>
                    </div>
                    {/* Order By Dropdown */}
                    <div className="flex items-center gap-2 mt-2">
                      <span>Order by:</span>
                      <select
                        className="border rounded px-2 py-1"
                        value={orderBy}
                        onChange={e => {
                          setOrderBy(e.target.value);
                          const params = new URLSearchParams(searchParams);
                          params.set('ordering', e.target.value);
                          params.set('page', '1');
                          setSearchParams(params);
                        }}
                      >
                        <option value="-start_date">Newest</option>
                        <option value="start_date">Oldest</option>
                        <option value="-deadline">Latest Deadline</option>
                        <option value="deadline">Earliest Deadline</option>
                      </select>
                    </div>
                    {/* Past Deadline */}
                    <label className="flex items-center cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                        checked={searchParams.get('deadline') === 'true'}
                        onChange={() => {
                          const params = new URLSearchParams(searchParams);
                          if (params.get('deadline') === 'true') {
                            params.delete('deadline');
                          } else {
                            params.set('deadline', 'true');
                          }
                          params.set('page', '1');
                          setSearchParams(params);
                        }}
                      />
                      Past Deadline
                    </label>
                    {/* Deadline within 2 Weeks */}
                    <label className="flex items-center cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                        checked={searchParams.get('upcoming_deadline') === 'true'}
                        onChange={() => {
                          const params = new URLSearchParams(searchParams);
                          if (params.get('upcoming_deadline') === 'true') {
                            params.delete('upcoming_deadline');
                          } else {
                            params.set('upcoming_deadline', 'true');
                          }
                          params.set('page', '1');
                          setSearchParams(params);
                        }}
                      />
                      Deadline within 2 Weeks
                    </label>
                    {/* Clear button */}
                    <button
                      type="button"
                      className="mt-4 w-full bg-blue-400 text-white rounded py-2 hover:bg-blue-300"
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.delete('archived');
                        params.delete('is_delivered');
                        params.delete('deadline');
                        params.delete('upcoming_deadline');
                        params.set('page', '1');
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
        <div className="flex items-center gap-x-4 w-full justify-end">
          {/* Search Bar */}
          <div className="flex items-center gap-x-2 max-w-sm w-full">
            <input
              type="text"
              placeholder="Search for projects by name..."
              className="border p-2 rounded w-full"
              value={searchParams.get('search') || ''}
              onChange={e => {
                const params = new URLSearchParams(searchParams);
                params.set('search', e.target.value);
                params.set('page', '1');
                setSearchParams(params);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', '1');
                  setSearchParams(params);
                }
              }}
            />
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('page', '1');
                setSearchParams(params);
              }}
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete('search');
                params.set('page', '1');
                setSearchParams(params);
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Clearing...' : 'Clear'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto pb-6">
          {projects.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold">Project Name</th>
                  {/* <th className="py-3 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold">Customer</th> */}
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold">Status</th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold">Progress</th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold">Start Date</th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold">Deadline</th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold">Date Delivered</th>
                  <th className="py-3 sm:py-4 px-1 w-16 text-left text-xs sm:text-sm font-semibold">Timeframe</th>
                  <th className="py-3 sm:py-4 px-1 w-20 text-left text-xs sm:text-sm font-semibold">Time Remaining</th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold">Tasks</th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => {
                  const timeRemainingInfo = getTimeRemainingInfo(project);
                  return (
                  <tr
                    key={project.id}
                      className="cursor-pointer hover:bg-gray-50 md:table-row flex flex-col md:flex-row"
                  >
                      <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-left text-gray-700">
                        <span className="font-semibold md:hidden">
                          Project Name:{" "}
                        </span>
                        {project.name}
                      </td>
                      {/* <td className="py-5 px-4 border-b border-gray-200 text-sm text-left text-gray-700">
                        <span className="font-semibold md:hidden">
                          Customer: {" "}
                        </span>
                        <span
                          title={project.customer_detail.name}
                          style={{ display: 'inline-block', maxWidth: '120px', verticalAlign: 'bottom', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {project.customer_detail.name.length > 10
                            ? project.customer_detail.name.slice(0, 10) + '...'
                            : project.customer_detail.name}
                        </span>
                      </td> */}
                      <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-left text-gray-700">
                        <span className="font-semibold md:hidden">
                          Status:{" "}
                        </span>
                        <span
                          className={`px-1 sm:px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            project.status === "in progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : project.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : project.status === "delivered"
                              ? "bg-green-400 text-white"
                              : project.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : ""
                          }`}
                        >
                          {project.status}
                        </span>
                    </td>
                    <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-center text-gray-700">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                            className="bg-lime-600 h-1 rounded-full"
                            style={{
                              width: `${project.products.progress || 0}%`,
                            }}
                        ></div>
                      </div>
                      <p className="text-xs sm:text-sm mt-1">
                        {project.products.progress || 0}%
                      </p>
                    </td>
                      <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-left text-gray-700">
                        <span className="font-semibold md:hidden">
                          Start Date:{" "}
                        </span>
                        {project.start_date}
                      </td>
                      <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-left text-gray-700">
                        <span className="font-semibold md:hidden">
                          Deadline:{" "}
                        </span>
                        {project.deadline || "Not set"}
                      </td>
                      <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-left text-gray-700">
                        <span className="font-semibold md:hidden">
                          Date Delivered:{" "}
                        </span>
                        {project.date_delivered
                          ? new Date(project.date_delivered).toLocaleDateString()
                          : "N/A"}
                    </td>
                      <td className="py-3 sm:py-5 px-1 w-16 border-b border-gray-200 text-xs sm:text-sm text-left text-gray-700">
                        <span className="font-semibold md:hidden">
                          Timeframe: {' '}
                        </span>
                        {project.timeframe
                          ? `${project.timeframe} ${
                              project.timeframe === 1 ? "day" : "days"
                            }`
                          : "N/A"}
                    </td>
                      <td
                        className={`py-3 sm:py-5 px-1 w-20 border-b border-gray-200 text-xs sm:text-sm text-left ${timeRemainingInfo.color}`}
                      >
                        <span className="font-semibold md:hidden">
                          Time Remaining: {' '}
                        </span>
                        {timeRemainingInfo.text}
                      </td>
                      <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-center">
                        <button
                          onClick={e => { 
                            e.stopPropagation(); 
                            handleViewTasks(project); 
                            setScrollToLastTaskTrigger(prev => prev + 1);
                          }}
                          className="px-1 sm:px-2 py-1 text-blue-400 border border-blue-300 rounded hover:bg-blue-50 text-xs sm:text-sm"
                        >
                          Tasks
                        </button>
                      </td>
                      <td className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-left text-gray-700">
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(project);
                          }}
                        className="px-2 sm:px-3 py-1 text-blue-400 border-2 border-blue-400 rounded text-xs sm:text-sm"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                  );
                })}
            </tbody>
          </table>
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <p className="text-gray-500 text-lg">No projects found.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          handlePageChange={handlePageChange}
        />
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
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
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
                // Optionally, update the main table if needed
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
