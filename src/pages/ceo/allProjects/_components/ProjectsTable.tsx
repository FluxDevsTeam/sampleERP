import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdCancel } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import ProjectModals from './Modal';
import PaginationComponent from './Pagination';
import AddProjectModal from './AddProjectModal';

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
    other_productions: Array<{ id: number; name: string; cost: string | null }>;
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

const BASE_URL = 'https://backend.kidsdesigncompany.com/api';

const fetchProjects = async (page = 1, searchParams: URLSearchParams): Promise<PaginatedProjectsResponse> => {
  const params: Record<string, string | null> = {
    page: page.toString(),
    archived: searchParams.get('archived'),
    is_delivered: searchParams.get('is_delivered'),
    deadline: searchParams.get('deadline'),
    upcoming_deadline: searchParams.get('upcoming_deadline'),
    search: searchParams.get('search'),
    ordering: searchParams.get('ordering'),
  };

  // Filter out null values
  const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  const response = await axios.get(`${BASE_URL}/project/`, { params: filteredParams });
  return response.data;
};

const ProjectsTable = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, error, isLoading, refetch } = useQuery<PaginatedProjectsResponse>({
    queryKey: ['projects', currentPage, searchParams.toString()],
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
      await axios.delete(`${BASE_URL}/project/${projectId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
      toast.success("Project deleted successfully!");
    },
    onError: (error: Error) => {
      console.error('Error deleting project:', error);
      toast.error("Failed to delete project. Please try again.");
    }
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
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  if (isLoading) return (
    <div className="p-6 flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
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
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Add Project
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalProjectsCount)} of {totalProjectsCount} projects
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
              <th className="px-4 py-2 text-center">Total Product Selling Price</th>
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
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-lime-400 h-1 rounded-full"
                      style={{ width: `${project.products.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1">{project.products.progress || 0}%</p>
                </td>
                <td className="px-4 py-2 flex items-center justify-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {project.status === 'completed' || project.status === 'in progress' || project.status === 'delivered' ? (
                      <div className="w-3 h-1 bg-gray-300 border rounded-full flex items-center justify-start overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            project.status === 'completed' ? 'bg-blue-700' :
                            project.status === 'in progress' ? 'bg-neutral-700' :
                            project.status === 'delivered' ? 'bg-lime-700' : ''
                          }`}
                          style={{
                            width: project.status === 'completed' || project.status === 'delivered' ? '100%' : '50%',
                          }}
                        ></div>
                      </div>
                    ) : (
                      <span className="w-3 h-1 bg-red-400 border rounded-full"></span>
                    )}
                    <p className={`text-sm ${
                      project.status === 'completed' ? 'text-blue-700' :
                      project.status === 'in progress' ? 'text-neutral-700' :
                      project.status === 'delivered' ? 'text-lime-400' : 'text-red-400'
                    }`}>
                      {project.status}
                    </p>
                  </div>

                  {project.status === 'completed' || project.status === 'delivered' ? (
                    <span className={`w-10 h-1 ${
                      project.status === 'completed' ? 'bg-blue-700' : 'bg-lime-400'
                    } border rounded-full`}></span>
                  ) : project.status === 'in progress' ? (
                    <div className="w-10 h-1 bg-gray-300 rounded-full overflow-hidden">
                      <div className="bg-neutral-700 h-full rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  ) : (
                    <div className="text-red-400 flex space-x-1">
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

      <AddProjectModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleProjectAdded}
      />

      <ProjectModals
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedProject={selectedProject}
        handleDelete={handleDelete}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default ProjectsTable;