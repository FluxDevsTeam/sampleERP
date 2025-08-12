import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBalanceSwitches, deleteBalanceSwitch, BalanceSwitch } from '../_api/balanceSwitchService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import EditBalanceSwitchModal from './EditBalanceSwitchModal';

interface BalanceSwitchTableProps {
  isTableModalOpen: boolean;
}

const BalanceSwitchTable: React.FC<BalanceSwitchTableProps> = ({ isTableModalOpen }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSwitch, setSelectedSwitch] = useState<BalanceSwitch | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const currentUserRole = localStorage.getItem('user_role');
  const isCeo = currentUserRole === 'ceo';

  const { data, isLoading, error } = useQuery({
    queryKey: ['balance-switches', currentPage],
    queryFn: () => fetchBalanceSwitches(currentPage),
    keepPreviousData: true,
  });

  const deleteSwitchMutation = useMutation({
    mutationFn: (id: number) => deleteBalanceSwitch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance-switches'] });
      setIsDeleteDialogOpen(false);
      setIsViewModalOpen(false);
      setSelectedSwitch(null);
      toast.success('Balance switch deleted successfully!');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete balance switch. Please try again.');
    },
  });

  const formatNumber = (n: number | string | undefined | null) => {
    if (n === undefined || n === null || n === '') return '0';
    const num = typeof n === 'string' ? parseFloat(n) : n;
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-NG');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) return (
    <div className="animate-pulse space-y-4 p-4 bg-white rounded-lg shadow-md">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="grid grid-cols-5 gap-4 mt-4">
        <div className="h-8 bg-gray-200 rounded col-span-1"></div>
        <div className="h-8 bg-gray-200 rounded col-span-1"></div>
        <div className="h-8 bg-gray-200 rounded col-span-1"></div>
        <div className="h-8 bg-gray-200 rounded col-span-1"></div>
        <div className="h-8 bg-gray-200 rounded col-span-1"></div>
      </div>
      <div className="space-y-3 mt-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4">
            <div className="h-6 bg-gray-200 rounded col-span-1"></div>
            <div className="h-6 bg-gray-200 rounded col-span-1"></div>
            <div className="h-6 bg-gray-200 rounded col-span-1"></div>
            <div className="h-6 bg-gray-200 rounded col-span-1"></div>
            <div className="h-6 bg-gray-200 rounded col-span-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
  if (error) return <p className="text-red-600">Error: {(error as Error).message}</p>;

  return (
    <div className={`relative ${!data?.results?.length ? 'min-h-[300px]' : ''}`}>
      <div className={`overflow-x-auto pb-8 ${isViewModalOpen || isEditModalOpen || isDeleteDialogOpen ? 'blur-md' : ''}`} style={{ maxWidth: '100%' }}>
        {(!data?.results || data.results.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-8 bg-white rounded-lg border border-gray-200 shadow-sm mb-10 m-2">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4">
              <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-teal-400 mb-2">No balance switches found</h2>
            <p className="text-gray-500 mb-6 text-center max-w-md px-4">All your balance switch records will show up here. Add a new balance switch to get started.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-auto mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">Date</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">From</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">To</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">Amount</th>
                    <th className="px-1 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 w-[64px] sm:w-auto">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.results.map((balanceSwitch) => (
                    <tr key={balanceSwitch.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{formatDate(balanceSwitch.switch_date)}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{balanceSwitch.from_method}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{balanceSwitch.to_method}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap">₦ {formatNumber(balanceSwitch.amount)}</td>
                      <td className="px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        <button
                          onClick={() => {
                            setSelectedSwitch(balanceSwitch);
                            setIsViewModalOpen(true);
                          }}
                          className="px-2 sm:px-2 py-1 text-blue-400 border-2 border-blue-400 rounded text-xs sm:text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {(data?.next || data?.previous || data?.count > 0) && (
          <div className="flex justify-center items-center mt-6 mb-4 gap-2">
            <Button
              onClick={() => setCurrentPage(1)}
              disabled={!data?.previous}
              className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M8.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Button>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={!data?.previous}
              className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Button>

            <span className="mx-4 text-sm font-medium">
              Page {currentPage} of {Math.ceil((data?.count || 0) / 10) || 1}
            </span>

            <Button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!data?.next}
              className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Button>
            <Button
              onClick={() => setCurrentPage(Math.ceil((data?.count || 0) / 10))}
              disabled={!data?.next}
              className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M11.293 15.707a1 1 0 010-1.414L15.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Balance Switch Details</DialogTitle>
            <DialogDescription className="text-sm">View details for the selected balance switch.</DialogDescription>
          </DialogHeader>

          {selectedSwitch && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">From</span>
                <span className="text-base font-bold text-black">{selectedSwitch.from_method}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">To</span>
                <span className="text-base font-bold text-black">{selectedSwitch.to_method}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Amount</span>
                <span className="text-base font-bold text-black">₦ {formatNumber(selectedSwitch.amount)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Date</span>
                <span className="text-base font-bold text-black">{formatDate(selectedSwitch.switch_date)}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="w-full text-sm">
                Close
              </Button>
              {isCeo && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsEditModalOpen(true);
                  }}
                  className="w-full text-sm"
                >
                  Edit
                </Button>
              )}
              {isCeo && (
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={deleteSwitchMutation.isPending}
                  className="w-full text-sm"
                >
                  Delete
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {selectedSwitch && isEditModalOpen && (
        <EditBalanceSwitchModal
          balanceSwitch={selectedSwitch}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['balance-switches'] });
            setIsEditModalOpen(false);
            setSelectedSwitch(null);
            toast.success('Balance switch updated successfully!');
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. It will permanently delete the balance switch.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedSwitch) {
                  deleteSwitchMutation.mutate(selectedSwitch.id);
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BalanceSwitchTable;