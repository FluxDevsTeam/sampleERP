import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import EditProjectModal from "./EditProjectModal"; 


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


interface ProjectModalsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedProject: Project | null;
  handleDelete: () => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
}

const ProjectModals: React.FC<ProjectModalsProps> = ({
  isModalOpen,
  setIsModalOpen,
  selectedProject,
  handleDelete,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  confirmDelete,
}) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;

  const handleViewOtherProductionRecords = () => {
    if (selectedProject?.id) {
      navigate(`/ceo/projects/${selectedProject.id}/records`);
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              View details for the selected project.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              {/* Left Column: Basic Info, Note, Invoice, Products, Sold Items */}
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Name:</span>
                  <span className="col-span-2">{selectedProject.name}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Customer:</span>
                  <span className="col-span-2">{selectedProject.customer_detail.name}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Status:</span>
                  <span className="col-span-2 capitalize">{selectedProject.status}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Selling Price:</span>
                  <span className="col-span-2">₦{selectedProject.selling_price}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Production Cost:</span>
                  <span className="col-span-2">₦{selectedProject.products.total_production_cost}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Logistics:</span>
                  <span className="col-span-2">₦{selectedProject.logistics}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Service Charge:</span>
                  <span className="col-span-2">₦{selectedProject.service_charge}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Start Date:</span>
                  <span className="col-span-2">{selectedProject.start_date}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Deadline:</span>
                  <span className="col-span-2">{selectedProject.deadline || "Not set"}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Date Delivered:</span>
                  <span className="col-span-2">{selectedProject.date_delivered || "Not set"}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Timeframe (days):</span>
                  <span className="col-span-2">{selectedProject.timeframe ?? "-"}</span>
                </div>
                {/* Invoice Image */}
                {selectedProject.invoice_image && (
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium">Invoice Image:</span>
                    <span className="col-span-2">
                      <img
                        src={selectedProject.invoice_image}
                        alt="Invoice"
                        className="max-h-32 rounded shadow cursor-pointer hover:opacity-80"
                        onClick={() => setShowImageModal(true)}
                      />
                    </span>
                  </div>
                )}
                {/* Note */}
                {selectedProject.note && (
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium">Note:</span>
                    <span className="col-span-2">{selectedProject.note}</span>
                  </div>
                )}
                {/* Products */}
                <div>
                  <span className="font-semibold block mb-1 text-blue-900">Products:</span>
                  {selectedProject.products?.products?.length ? (
                    <table className="w-full text-sm border mb-2">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className="p-1 border text-blue-900">Name</th>
                          <th className="p-1 border text-blue-900">Selling Price</th>
                          <th className="p-1 border text-blue-900">Progress (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProject.products.products.map((prod) => (
                          <tr key={prod.id}>
                            <td className="p-1 border text-black">{prod.name}</td>
                            <td className="p-1 border text-black">₦{prod.selling_price}</td>
                            <td className="p-1 border text-black">{prod.progress}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <span className="text-red-700">No products</span>
                  )}
                  <div className="text-xs text-blue-900 mt-1">
                    Total Project Selling Price: ₦{selectedProject.products.total_project_selling_price} | Total Production Cost: ₦{selectedProject.products.total_production_cost} | Total Profit: ₦{selectedProject.products.total_profit}
                  </div>
                </div>
                {/* Sold Items */}
                <div>
                  <span className="font-semibold block mb-1 text-green-900">Sold Items:</span>
                  {selectedProject.sold_items?.sold_items?.length ? (
                    <table className="w-full text-sm border mb-2">
                      <thead>
                        <tr className="bg-green-100">
                          <th className="p-1 border text-green-900">Name</th>
                          <th className="p-1 border text-green-900">Quantity</th>
                          <th className="p-1 border text-green-900">Cost Price</th>
                          <th className="p-1 border text-green-900">Selling Price</th>
                          <th className="p-1 border text-green-900">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProject.sold_items.sold_items.map((item) => (
                          <tr key={item.id}>
                            <td className="p-1 border text-black">{item.name}</td>
                            <td className="p-1 border text-black">{item.quantity}</td>
                            <td className="p-1 border text-black">₦{item.cost_price}</td>
                            <td className="p-1 border text-black">₦{item.selling_price}</td>
                            <td className="p-1 border text-black">₦{item.total_price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <span className="text-red-700">No sold items</span>
                  )}
                  <div className="text-xs text-black mt-1 font-semibold">
                    Total Cost Price: ₦{selectedProject.sold_items.total_cost_price_sold_items} | Total Selling Price: ₦{selectedProject.sold_items.total_selling_price_sold_items}
                  </div>
                </div>
              </div>
              {/* Right Column: Expenses, Other Productions, Calculations */}
              <div className="space-y-6">
                {/* Expenses */}
                <div>
                  <span className="font-semibold block mb-1 text-red-900">Expenses:</span>
                  {selectedProject.expenses?.expenses?.length ? (
                    <table className="w-full text-sm border mb-2">
                      <thead>
                        <tr className="bg-red-100">
                          <th className="p-1 border text-red-900">Name</th>
                          <th className="p-1 border text-red-900">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProject.expenses.expenses.map((exp, idx) => (
                          <tr key={idx}>
                            <td className="p-1 border text-black">{exp.name}</td>
                            <td className="p-1 border text-black">₦{exp.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <span className="text-red-700">No expenses</span>
                  )}
                  <div className="text-xs text-red-900 mt-1">
                    Total Expenses: ₦{selectedProject.expenses.total_expenses}
                  </div>
                </div>
                {/* Other Productions */}
                <div>
                  <span className="font-semibold block mb-1 text-purple-900">Other Productions:</span>
                  {selectedProject.other_productions?.other_productions?.length ? (
                    <table className="w-full text-sm border mb-2">
                      <thead>
                        <tr className="bg-purple-100">
                          <th className="p-1 border text-purple-900">Name</th>
                          <th className="p-1 border text-purple-900">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProject.other_productions.other_productions.map((op) => (
                          <tr key={op.id}>
                            <td className="p-1 border text-black">{op.name}</td>
                            <td className="p-1 border text-black">₦{op.cost ?? '-'} </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <span className="text-red-700">No other productions</span>
                  )}
                  <div className="text-xs text-purple-900 mt-1">
                    Total Cost: ₦{selectedProject.other_productions.total_cost} | Total Budget: ₦{selectedProject.other_productions.total_budget}
                  </div>
                </div>
                {/* Calculations */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <span className="font-bold text-lg text-blue-900 block mb-3">Calculations</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="font-semibold text-blue-900">Total Raw Material Cost:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_raw_material_cost}</div>
                    <div className="font-semibold text-blue-900">Total Artisan Cost:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_artisan_cost}</div>
                    <div className="font-semibold text-blue-900">Total Overhead Cost:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_overhead_cost}</div>
                    <div className="font-semibold text-blue-900">Total Products Cost:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_products_cost}</div>
                    <div className="font-semibold text-blue-900">Total Product Selling Price:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_product_selling_price}</div>
                    <div className="font-semibold text-blue-900">Product Profit:</div>
                    <div className="text-black">₦{selectedProject.calculations.product_profit}</div>
                    <div className="font-semibold text-blue-900">Total Cost Price Sold Items:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_cost_price_sold_items}</div>
                    <div className="font-semibold text-blue-900">Total Selling Price Sold Items:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_selling_price_sold_items}</div>
                    <div className="font-semibold text-blue-900">Shop Items Profit:</div>
                    <div className="text-black">₦{selectedProject.calculations.shop_items_profit}</div>
                    <div className="font-semibold text-blue-900">Money Left for Expenses:</div>
                    <div className="text-black">₦{selectedProject.calculations.money_left_for_expensis}</div>
                    <div className="font-semibold text-blue-900">Money Left (with logistics/service):</div>
                    <div className="text-black">₦{selectedProject.calculations.money_left_for_expensis_with_logistics_and_service_charge}</div>
                    <div className="font-semibold text-blue-900">Total Other Productions Budget:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_other_productions_budget}</div>
                    <div className="font-semibold text-blue-900">Total Other Productions Cost:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_other_productions_cost}</div>
                    <div className="font-semibold text-blue-900">Total Expenses:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_expensis}</div>
                    <div className="font-semibold text-blue-900">Total Money Spent:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_money_spent}</div>
                    <div className="font-semibold text-blue-900">Total Paid:</div>
                    <div className="text-black">₦{selectedProject.calculations.total_paid}</div>
                    <div className="font-semibold text-blue-900">Final Profit:</div>
                    <div className="text-black">₦{selectedProject.calculations.final_profit}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex justify-around items-center w-full">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              {userRole === 'ceo' && (
                <>
                  <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={handleViewOtherProductionRecords}>
                Records
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Large Invoice Image Modal */}
      {selectedProject?.invoice_image && (
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="flex flex-col items-center justify-center bg-black bg-opacity-90 max-w-3xl">
            <button
              className="self-end mb-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
              onClick={() => setShowImageModal(false)}
            >
              Close
            </button>
            <img
              src={selectedProject.invoice_image}
              alt="Invoice Large"
              className="max-h-[80vh] w-auto rounded shadow-lg border-4 border-white"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Project Modal */}
      {selectedProject && (
        <EditProjectModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          projectId={selectedProject.id.toString()}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectModals;