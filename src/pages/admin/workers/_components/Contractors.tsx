import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  fetchContractors,
  Contractor,
  PaginatedContractorsResponse
} from "../../../../utils/jsonDataService";
import PaginationComponent from "./Pagination";
import Modals from "./Modal";
import { toast } from "sonner";
import SkeletonLoader from "./SkeletonLoader";
import AddContractorModal from "../_pages/_contractors/AddContractorModal";

// ...existing code...

const Contractors = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [selectedContractor, setSelectedContractor] =
    useState<Contractor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<PaginatedContractorsResponse>({
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
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${BASE_URL}${contractorId}/`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
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
  if (error)
    return <p className="text-red-600">Error: {(error as Error).message}</p>;

  const contractors = data?.results?.contractor || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="flex justify-between items-center mb-6">
        <div
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:text-white hover:bg-blue-400 transition duration-300"
        >
          Add Contractor
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
                Years of Experience
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Active
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contractors.map((contractor) => (
              <tr
                key={contractor.id}
                className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                onClick={() => handleRowClick(contractor)}
              >
                <td className="px-6 py-4 text-sm text-neutral-700">{`${contractor.first_name} ${contractor.last_name}`}</td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {contractor.email}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {contractor.craft_specialty}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {contractor.years_of_experience}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {contractor.is_still_active ? (
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

      <AddContractorModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      <Modals
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedWorker={selectedContractor}
        handleDelete={handleDelete}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        confirmDelete={confirmDelete}
        workerType="contractor"
        isDeleting={deleteContractorMutation.isPending}
      />
    </div>
  );
};

export default Contractors;
