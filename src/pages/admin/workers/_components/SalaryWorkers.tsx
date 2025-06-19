import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import PaginationComponent from "./Pagination";
import Modals from "./Modal";
import { toast } from "sonner";
import SkeletonLoader from "./SkeletonLoader";
import AddSalaryWorkerModal from "../_pages/_salaryWorkers/AddSalaryWorkersModal";

const BASE_URL = "https://backend.kidsdesigncompany.com/api/salary-workers/";

interface SalaryWorker {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  craft_specialty: string;
  years_of_experience: number;
  image: string | null;
  agreement_form_image: string | null;
  date_joined: string;
  date_left: string;
  guarantor_name: string;
  guarantor_phone_number: string;
  guarantor_address: string;
  created_at: string;
  updated_at: string;
  salary: string;
  is_still_active: boolean;
}

interface SalaryWorkersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    salary_workers_count: number;
    active_salary_workers_count: number;
    total_salary_workers_monthly_pay: number;
    total_paid: number;
    workers: SalaryWorker[];
  };
}

const fetchSalaryWorkers = async (page = 1): Promise<SalaryWorkersResponse> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${BASE_URL}?page=${page}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return response.data;
};

const SalaryWorkers = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [selectedWorker, setSelectedWorker] = useState<SalaryWorker | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["salary-workers", currentPage],
    queryFn: () => fetchSalaryWorkers(currentPage),
  });

  useEffect(() => {
    if (data?.count) {
      const itemsPerPage = 10;
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    }
  }, [data]);

  const deleteWorkerMutation = useMutation({
    mutationFn: async (workerId: number) => {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${BASE_URL}${workerId}/`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salary-workers"] });
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
      toast.success("Worker deleted successfully!");
    },
  });

  const handleRowClick = (worker: SalaryWorker) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedWorker?.id) {
      deleteWorkerMutation.mutate(selectedWorker.id);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  useEffect(() => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["salary-workers", nextPage],
        queryFn: () => fetchSalaryWorkers(nextPage),
      });
    }
  }, [currentPage, queryClient, totalPages]);

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return <p className="text-red-600">Error: {(error as Error).message}</p>;

  const workers = data?.results?.workers || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="flex justify-between items-center mb-6">
        <div
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:text-white hover:bg-blue-400  transition duration-300"
        >
          Add Worker
        </div>
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
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Craft Specialty
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Salary
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Active
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {workers.map((worker) => (
              <tr
                key={worker.id}
                className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                onClick={() => handleRowClick(worker)}
              >
                <td className="px-6 py-4 text-sm text-neutral-700">{`${worker.first_name} ${worker.last_name}`}</td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {worker.email}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {worker.craft_specialty}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  NGN {worker.salary}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {worker.is_still_active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      No
                    </span>
                  )}
                </td>
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
      <AddSalaryWorkerModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      <Modals
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedWorker={selectedWorker}
        handleDelete={handleDelete}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        confirmDelete={confirmDelete}
        workerType="salary-worker"
      />
    </div>
  );
};

export default SalaryWorkers;
