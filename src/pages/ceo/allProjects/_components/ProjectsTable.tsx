import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdCancel } from 'react-icons/md';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import ProjectModals from './Modal';
import PaginationComponent from './Pagination';

// Define the type for a single product
interface Product {
  id: number;
  name: string;
  selling_price: string;
  progress: number;
}

// Define the type for sold items
interface SoldItem {
  id: number;
  quantity: string;
  cost_price: string;
  selling_price: string;
  total_price: number;
}

// Define the type for customer details
interface CustomerDetail {
  id: number;
  name: string;
}

// Define the type for calculations
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

// Define the type for a single project
interface Project {
  id: number;
  name: string;
  invoice_image: string | null;
  status: string;
  start_date: string;
  deadline: string | null;
  timeframe: string | null;
  date_delivered: string | null;
  all_items: Record<string, unknown>; // Use a more specific type if needed
  is_delivered: boolean;
  archived: boolean;
  customer_detail: CustomerDetail;
  products: {
    progress: number;
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
    expenses: unknown[]; // Use a more specific type if needed
  };
  other_productions: {
    total_cost: number;
    total_budget: number;
    other_productions: unknown[]; // Use a more specific type if needed
  };
  selling_price: string;
  logistics: string;
  service_charge: string;
  note: string | null;
  calculations: Calculations;
}

// Define the type for the API response
interface PaginatedProjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  all_time_projects_count: number;
  all_projects_count: number;
  completed_projects_count: number;
  ongoing_projects_count: number;
  average_progress: number;
  all_projects: Project[];
}

// Base URL for API requests
const BASE_URL = 'https://kidsdesigncompany.pythonanywhere.com/api';

// Fetch projects from the API with pagination
const fetchProjects = async (page = 1): Promise<PaginatedProjectsResponse> => {
  const response = await axios.get(`${BASE_URL}/project/?page=${page}`);
  return response.data;
};

const ProjectsTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [totalPages, setTotalPages] = useState(1);
  
  // State for modal and selected project
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Use React Query to fetch data with pagination
  const { data, error, isLoading } = useQuery({
    queryKey: ['projects', currentPage],
    queryFn: () => fetchProjects(currentPage),
  });

  // Update total pages when data is loaded
  useEffect(() => {
    if (data?.count) {
      const itemsPerPage = 10; // Adjust based on your API's pagination setup
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    }
  }, [data]);

  // Prefetch next page
  useEffect(() => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ['projects', nextPage],
        queryFn: () => fetchProjects(nextPage),
      });
    }
  }, [currentPage, queryClient, totalPages]);

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      await axios.delete(`${BASE_URL}/project/${projectId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
      toast.success("Project deleted successfully!");
    },
  });

  // Handle row click to show modal
  const handleRowClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = () => {
    if (selectedProject?.id) {
      navigate(`/ceo/edit-project/${selectedProject.id}`);
    }
  };

  // Handle delete button click
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    if (selectedProject?.id) {
      deleteProjectMutation.mutate(selectedProject.id);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  // Extract the projects from the data
  const projects = data?.all_projects || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/ceo/add-project"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Add Project
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-center">Progress</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Total Selling Price</th>
              <th className="px-4 py-2 text-center">Start Date</th>
              <th className="px-4 py-2 text-center">End Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr 
                key={project.id} 
                className="border hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                onClick={() => handleRowClick(project)}
              >
                <td className="px-4 py-2">
                  <p className="text-md font-bold">{project.name}</p>
                </td>
                <td className="px-4 py-2 text-sm text-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-lime-600 h-2.5 rounded-full"
                      style={{ width: `${project.products.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1">{project.products.progress}%</p>
                </td>
                <td className="px-4 py-2 flex items-center justify-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {project.status === 'completed' || project.status === 'in progress' || project.status === 'delivered' ? (
                      <div className="w-3 h-3 bg-gray-300 border rounded-full flex items-center justify-start overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            project.status === 'completed' ? 'bg-lime-600' :
                            project.status === 'in progress' ? 'bg-yellow-500' :
                            project.status === 'delivered' ? 'bg-blue-500' : ''
                          }`}
                          style={{
                            width: project.status === 'completed' || project.status === 'delivered' ? '100%' : '50%',
                          }}
                        ></div>
                      </div>
                    ) : (
                      <span className="w-3 h-3 bg-red-500 border rounded-full"></span>
                    )}
                    <p className={`text-sm ${
                      project.status === 'completed' ? 'text-lime-600' :
                      project.status === 'in progress' ? 'text-yellow-500' :
                      project.status === 'delivered' ? 'text-blue-500' : 'text-red-500'
                    }`}>
                      {project.status}
                    </p>
                  </div>

                  {project.status === 'completed' || project.status === 'delivered' ? (
                    <span className={`w-10 h-2 ${
                      project.status === 'completed' ? 'bg-lime-600' : 'bg-blue-500'
                    } border rounded-full`}></span>
                  ) : project.status === 'in progress' ? (
                    <div className="w-10 h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-full rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  ) : (
                    <div className="text-red-500 flex space-x-1">
                      <MdCancel />
                      <MdCancel />
                      <MdCancel />
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  ₦ {project.calculations.total_product_selling_price}
                </td>
                <td className="px-4 py-2 text-center">{project.start_date}</td>
                <td className="px-4 py-2 text-center">{project.deadline || "Not set"}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default ProjectsTable;