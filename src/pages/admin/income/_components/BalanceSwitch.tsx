import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BalanceSwitchTable from './BalanceSwitchTable';
import AddBalanceSwitchModal from './AddBalanceSwitchModal';

const BalanceSwitch: React.FC = () => {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="mb-10, md:mb-4">
      {/* Button to open the Balance Switch Table Modal */}
      <Button
        onClick={() => setIsTableModalOpen(true)}
        className="bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md"
      >
        Balance
      </Button>

      {/* Balance Switch Table Modal */}
      <Dialog open={isTableModalOpen} onOpenChange={setIsTableModalOpen}>
        <DialogContent className=" h-[90vh] min-w-[91.666667%] max-h-[90vh] mx-auto p-4 sm:p-8 overflow-y-auto">
          <DialogHeader className="px-6">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-lg sm:text-xl">Balance Switch Records</DialogTitle>
                <DialogDescription className="text-sm">View and manage your balance switch records.</DialogDescription>
              </div>
              <Button
                onClick={() => {
                  setIsAddModalOpen(true);
                }}
                className="bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md"
              >
                Add New
              </Button>
            </div>
          </DialogHeader>

          <BalanceSwitchTable isTableModalOpen={isTableModalOpen} />
        </DialogContent>
      </Dialog>

      {/* Add Balance Switch Modal */}
      <AddBalanceSwitchModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </div>
  );
};

export default BalanceSwitch;