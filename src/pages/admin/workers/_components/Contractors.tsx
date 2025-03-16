import  { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import PaginationComponent from "./Pagination";
import Modals from "./Modal";
import { toast } from "sonner";
import SkeletonLoader from "./SkeletonLoader";

const BASE_URL = "https://kidsdesigncompany.pythonanywhere.com/api/contractors/";

interface Contractor {
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
  is_still_active: boolean;
}

interface ContractorsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    all_contractors_count: number;
    all_active_contractors_count: number;
    total_contractors_monthly_pay: number;
    total_contractors_weekly_pay: number;
    contractor: Contractor[];
  };
}

const fetchContractors = async (page = 1): Promise<ContractorsResponse> => {
  const response = await axios.get(`${BASE_URL}?page=${page}`);
  return response.data;
};

const Contractors = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["contractors", currentPage],
    queryFn: () => fetchContractors(currentPage),
  });

  useEffect(() => {
    if (data?.count) {
      const itemsPerPage = 10;
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    }
  }, [data]);

  const deleteContractorMutation = useMutation({
    mutationFn: async (contractorId: number) => {
      await axios.delete(`${BASE_URL}${contractorId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractors"] });
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
      toast.success("Contractor deleted successfully!");
    },
  });

  const handleRowClick = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedContractor?.id) {
      navigate(`/admin/edit-contractor/${selectedContractor.id}`);
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedContractor?.id) {
      deleteContractorMutation.mutate(selectedContractor.id);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  useEffect(() => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["contractors", nextPage],
        queryFn: () => fetchContractors(nextPage),
      });
    }
  }, [currentPage, queryClient, totalPages]);

  if (isLoading) return <SkeletonLoader />;
  if (error) return <p>Error: {(error as Error).message}</p>;

  const contractors = data?.results?.contractor || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/admin/add-contractor"
          className="bg-neutral-900 text-white px-4 py-2 rounded-md inline-block"
        >
          Add Contractor
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Craft Specialty</th>
              <th className="border px-4 py-2">Years of Experience</th>
              <th className="border px-4 py-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {contractors.map((contractor) => (
              <tr
                key={contractor.id}
                className="text-center border hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(contractor)}
              >
                <td className="border px-4 py-2">{`${contractor.first_name} ${contractor.last_name}`}</td>
                <td className="border px-4 py-2">{contractor.email}</td>
                <td className="border px-4 py-2">{contractor.craft_specialty}</td>
                <td className="border px-4 py-2">{contractor.years_of_experience}</td>
                <td className="border px-4 py-2">{contractor.is_still_active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          handlePageChange={handlePageChange}
        />
      </div>

      {/* Importing Modals Component */}
      <Modals
  isModalOpen={isModalOpen}
  setIsModalOpen={setIsModalOpen}
  selectedWorker={selectedContractor}
  handleEdit={handleEdit}
  handleDelete={handleDelete}
  isDeleteDialogOpen={isDeleteDialogOpen}
  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
  confirmDelete={confirmDelete}
  workerType="contractor" // Pass worker type
/>
    </div>
  );
};

export default Contractors;