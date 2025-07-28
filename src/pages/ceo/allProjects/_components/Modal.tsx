import React, { useState, useEffect } from "react";
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
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import axios from 'axios';
import AllItemsManager from './AllItemsManager';

dayjs.extend(relativeTime);

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
    other_productions: Array<{
      id: number;
      name: string;
      cost: string | null;
      budget: string | null;
    }>;
  };
  selling_price: string;
  logistics: string;
  service_charge: string;
  note: string | null;
  calculations: Calculations;
  tasks?: Task[];
}

interface ProjectModalsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedProject: Project | null;
  handleDelete: () => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
  handleViewTasks: (project: Project) => void;
}

const ProjectModals: React.FC<ProjectModalsProps> = ({
  isModalOpen,
  setIsModalOpen,
  selectedProject,
  handleDelete,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  confirmDelete,
  handleViewTasks,
}) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const userRole =
    typeof window !== "undefined" ? localStorage.getItem("user_role") : null;
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [newStatus, setNewStatus] = useState(selectedProject?.status || "");
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [showAllItemsManager, setShowAllItemsManager] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>(selectedProject?.tasks || []);

  useEffect(() => {
    setLocalTasks(selectedProject?.tasks || []);
  }, [selectedProject, isModalOpen]);

  if (!selectedProject) {
    return null;
  }

  const handleViewOtherProductionRecords = () => {
    if (selectedProject?.id) {
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

      navigate(`${basePath}/projects/${selectedProject.id}/records`);
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setIsModalOpen(false);
  };

  const handleEditClick = () => {
    setNewStatus(selectedProject.status);
    setIsEditStatusModalOpen(true);
  };

  const handleStatusSave = async () => {
    setStatusLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      let statusToSend = newStatus;
      // Only allow valid statuses
      if (statusToSend === 'in_progress' || statusToSend === 'pending') statusToSend = 'in progress';
      if (statusToSend !== 'in progress' && statusToSend !== 'completed' && statusToSend !== 'delivered') statusToSend = 'in progress';
      const payload: Record<string, any> = { status: statusToSend };
      if (statusToSend === 'delivered') {
        payload['is_delivered'] = true;
        payload['date_delivered'] = dayjs().format('YYYY-MM-DD');
      } else {
        payload['is_delivered'] = false;
        payload['date_delivered'] = null;
      }
      console.log('PATCH payload to backend:', payload);
      await axios.patch(
        `https://backend.kidsdesigncompany.com/api/project/${selectedProject.id}/`,
        payload,
        { headers: { Authorization: `JWT ${token}` } }
      );
      setIsEditStatusModalOpen(false);
      window.location.reload(); // Or refetch project data if you have a query
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  // Calculate totals from frontend
  const totalProductsSellingPrice =
    selectedProject.products?.products?.reduce(
      (acc, product) => acc + parseFloat(product.selling_price || '0'),
      0
    ) || 0;

  const totalSoldItemsCost =
    selectedProject.sold_items?.sold_items?.reduce(
      (acc, item) => acc + parseFloat(item.cost_price || '0'),
      0
    ) || 0;
  const totalSoldItemsSelling =
    selectedProject.sold_items?.sold_items?.reduce(
      (acc, item) => acc + parseFloat(item.selling_price || '0'),
      0
    ) || 0;

  const totalSoldItemsTotalPrice =
    selectedProject.sold_items?.sold_items?.reduce(
      (acc, item) => acc + item.total_price,
      0
    ) || 0;

  const totalExpensesAmount =
    selectedProject.expenses?.expenses?.reduce(
      (acc, expense) => acc + parseFloat(expense.amount || '0'),
      0
    ) || 0;

  const totalOtherProductionsBudget =
    selectedProject.other_productions?.other_productions?.reduce(
      (acc, production) => acc + parseFloat(production.budget || '0'),
      0
    ) || 0;
  const totalOtherProductionsCost =
    selectedProject.other_productions?.other_productions?.reduce(
      (acc, production) => acc + parseFloat(production.cost || '0'),
      0
    ) || 0;

  const formatNumber = (num: number) => {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate total for All Items
  const allItemsTotal = Array.isArray(selectedProject.all_items)
    ? selectedProject.all_items.reduce((acc, item) => acc + (parseFloat(item.price || '0') * (parseInt(item.quantity || '1', 10) || 1)), 0)
    : 0;

  // --- Time Remaining and Timeframe logic to match ProjectsTable.tsx ---
  const getTimeRemainingInfo = (project: any) => {
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
  const timeRemainingInfo = getTimeRemainingInfo(selectedProject);
  let timeframeDisplay = "N/A";
  if (
    selectedProject.status === "delivered" ||
    selectedProject.status === "cancelled" ||
    selectedProject.date_delivered ||
    selectedProject.is_delivered
  ) {
    timeframeDisplay = "-";
  } else if (selectedProject.timeframe) {
    timeframeDisplay = `${selectedProject.timeframe} ${selectedProject.timeframe === 1 ? "day" : "days"}`;
  }

  // Update handler to use localTasks and update UI immediately
  const handleTaskCompletionToggle = async (taskIdx: number, subIdx?: number) => {
    if (!selectedProject) return;
    const updatedTasks = [...localTasks];
    if (typeof subIdx === 'number') {
      if (updatedTasks[taskIdx].subtasks && updatedTasks[taskIdx].subtasks![subIdx]) {
        updatedTasks[taskIdx].subtasks![subIdx].checked = !updatedTasks[taskIdx].subtasks![subIdx].checked;
        // After toggling, check if all subtasks are checked
        const allChecked = updatedTasks[taskIdx].subtasks!.every(sub => sub.checked);
        updatedTasks[taskIdx].checked = allChecked;
      }
    } else {
      updatedTasks[taskIdx].checked = !updatedTasks[taskIdx].checked;
      // If toggling the main task, also toggle all subtasks to match
      if (updatedTasks[taskIdx].subtasks && Array.isArray(updatedTasks[taskIdx].subtasks)) {
        updatedTasks[taskIdx].subtasks = updatedTasks[taskIdx].subtasks!.map(sub => ({
          ...sub,
          checked: updatedTasks[taskIdx].checked
        }));
      }
    }
    setLocalTasks(updatedTasks); // Update local state for immediate UI feedback
    // Send PATCH to backend
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        `https://backend.kidsdesigncompany.com/api/project/${selectedProject.id}/`,
        { tasks: JSON.stringify(updatedTasks) },
        { headers: { Authorization: `JWT ${token}` } }
      );
    } catch (err) {
      alert('Failed to update task completion');
    }
  };

  // Calculate progress for localTasks
  const calculateProgress = (tasks: Task[]) => {
    if (!Array.isArray(tasks) || tasks.length === 0) return 0;
    let total = 0;
    for (const task of tasks) {
      if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
        const completed = task.subtasks.filter((sub: { checked: boolean }) => sub.checked).length;
        total += completed / task.subtasks.length;
      } else {
        total += task.checked ? 1 : 0;
      }
    }
    return Math.round((total / tasks.length) * 100);
  };
  const progress = calculateProgress(localTasks);

  // Shorter display names for financials
  const financialsDisplayNames: Record<string, string> = {
    total_raw_material_cost: 'Total Raw Materials',
    total_artisan_cost: 'Artisan Cost',
    total_overhead_cost: 'Overhead',
    total_products_cost: 'Products Cost',
    total_product_selling_price: 'Products Revenue',
    product_profit: 'Product Profit',
    total_cost_price_sold_items: 'Sold Cost',
    total_selling_price_sold_items: 'Sold Revenue',
    shop_items_profit: 'Shop Profit',
    money_left_for_expensis: 'Net After Expenses',
    money_left_for_expensis_with_logistics_and_service_charge: 'Net After All',
    total_other_productions_budget: 'Other Prod. Budget',
    total_other_productions_cost: 'Other Prod. Cost',
    total_expensis: 'Expenses',
    total_money_spent: 'Total Spent',
    total_paid: 'Total Paid',
    final_profit: 'Final Profit',
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-90% max-sm:mt-7 max-sm:max-w-[54vh] max-sm:min-w-[54vh] min-w-[80vh]  lg:min-w-[165vh] p-1 sm:p-6 md:p-10 overflow-y-auto max-h-[98vh]">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 px-2 mr-8">
              <div>
            <DialogTitle className="text-lg md:text-xl pt-2">Project Details</DialogTitle>
            {/* <DialogDescription className="text-sm sm:text-base">
              View details for the selected project.
            </DialogDescription> */}
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  onClick={handleViewOtherProductionRecords}
                  className="text-xs md:text-sm px-1 md:px-3 py-1 md:py-2"
                >
                  +Records
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setTimeout(() => setShowAllItemsManager(true), 300);
                  }}
                  className="text-xs md:text-sm px-1 md:px-3 py-1 md:py-2"
                >
                  +Item
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEditClick}
                  className="text-xs md:text-sm px-1 md:px-3 py-1 md:py-2"
                >
                  Edit Status
                </Button>
                {/* Only CEO can see Full Edit and Delete buttons */}
                {userRole === "ceo" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-xs md:text-sm px-1 md:px-3 py-1 md:py-2"
                    >
                      Full Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="text-xs md:text-sm px-1 md:px-3 py-1 md:py-2"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </>
                )}
                {/* <Button variant="outline" onClick={() => navigate('/ceo/allProjects')} className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                  Close
                </Button> */}
              </div>
            </div>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4 sm:space-y-6 max-sm:mb-10">
              {/* Project Info Section */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-black-400 mb-3 sm:mb-4">
                  Project Info
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 w-full">
                  {/* Project Name Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Project Name</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">{selectedProject.name}</p>
                </div>
                  {/* Customer Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Customer</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">{selectedProject.customer_detail?.name}</p>
                </div>
                  {/* Status Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Status</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">{selectedProject.status}</p>
                </div>
                  {/* Start Date Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Start Date</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">{dayjs(selectedProject.start_date).format("MMM D, YYYY")}</p>
                </div>
                  {/* Deadline Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Deadline</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">{selectedProject.deadline ? dayjs(selectedProject.deadline).format("MMM D, YYYY") : "-"}</p>
                </div>
                  {/* Date Delivered Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Date Delivered</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">{selectedProject.date_delivered ? dayjs(selectedProject.date_delivered).format("MMM D, YYYY") : "-"}</p>
                </div>
                  {/* Time Remaining Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Time Remaining</span>
                    <p className={`text-[11px] sm:text-sm mt-1 ${timeRemainingInfo.color}`}>{timeRemainingInfo.text}</p>
                </div>
                  {/* Timeframe Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Timeframe</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">{timeframeDisplay}</p>
                </div>
                  {/* Selling Price Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Selling Price</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">₦{formatNumber(parseFloat(selectedProject.selling_price || '0'))}</p>
                </div>
                  {/* Logistics Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Logistics</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">₦{formatNumber(parseFloat(selectedProject.logistics || '0'))}</p>
                </div>
                  {/* Service Charge Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Service Charge</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">₦{formatNumber(parseFloat(selectedProject.service_charge || '0'))}</p>
                </div>
                  {/* Total Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Total</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">₦{formatNumber(parseFloat(selectedProject.total || '0'))}</p>
                </div>
                
                  {/* Archived Card */}
                  <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs text-blue-600 font-medium">Archived</span>
                    <p className="text-[11px] sm:text-sm text-black mt-1">{selectedProject.archived ? 'Yes' : 'No'}</p>
                  </div>
                  {/* Invoice Image Card */}
                {selectedProject.invoice_image && (
                    <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                      <span className="text-xs text-blue-600 font-medium">Invoice</span>
                      <Button variant="link" className="p-0 h-auto text-xs sm:text-sm text-blue-500 block mt-1" onClick={() => setShowImageModal(true)}>
                        View Invoice
                      </Button>
                  </div>
                )}
                  {/* Note Card */}
                {selectedProject.note && (
                    <div className="col-span-2 max-sm:col-span-3 lg:col-span-7 bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200">
                      <span className="text-xs text-blue-600 font-medium">Note</span>
                      <p className="text-[11px] sm:text-sm text-black whitespace-pre-wrap mt-1">{selectedProject.note}</p>
                  </div>
                )}
                </div>
              </div>

              {/* Calculations Section */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-black-400 mb-3 sm:mb-4">
                  Financials
                </h3>
                {(() => {
                  const entries = Object.entries(selectedProject.calculations);
                  const mainItems = entries.slice(0, -2);
                  const lastTwo = entries.slice(-2);
                  return (
                    <>
                      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 w-full">
                        {mainItems.map(([key, value]) => (
                          <div
                            key={key}
                            className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200"
                          >
                            <span className="text-xs text-blue-600 font-medium">
                              {financialsDisplayNames[key] || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                            <p className="text-[11px] sm:text-sm text-black mt-1">
                              ₦{typeof value === "number" ? formatNumber(value) : value}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mt-2">
                        {lastTwo.map(([key, value]) => (
                          <div
                            key={key}
                            className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200"
                          >
                            <span className="text-xs text-blue-600 font-medium">
                              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                            <p className="text-[11px] sm:text-sm text-black mt-1">
                              ₦{typeof value === "number" ? formatNumber(value) : value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Tables Section */}
              <div className="columns-1 lg:columns-2 gap-4 sm:gap-6 space-y-4 sm:space-y-6 [&>*]:break-inside-avoid-column">
                {/* All Items Table */}
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm sm:text-md font-semibold text-gray-700">
                      All Items
                    </h4>
                    <button 
                      onClick={() => {
                        setIsModalOpen(false);
                        setTimeout(() => setShowAllItemsManager(true), 300);
                      }}
                      className="px-2 sm:px-3 py-1 bg-blue-400 text-white rounded text-xs hover:bg-blue-500 transition-colors"
                    >
                      + Item
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead className="bg-blue-400 text-white">
                        <tr>
                          <th className="p-1 sm:p-2 text-left">Item</th>
                          <th className="p-1 sm:p-2 text-left">Budget</th>
                          <th className="p-1 sm:p-2 text-left">Price</th>
                          <th className="p-1 sm:p-2 text-left">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(selectedProject.all_items) && selectedProject.all_items.length > 0 ? (
                          selectedProject.all_items.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-200">
                              <td className="p-1 sm:p-2 text-left">{item.item}</td>
                              <td className="p-1 sm:p-2 text-left">₦{formatNumber(parseFloat(item.budget || '0'))}</td>
                              <td className="p-1 sm:p-2 text-left">₦{formatNumber(parseFloat(item.price || '0'))}</td>
                              <td className="p-1 sm:p-2 text-left">{item.quantity || 1}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-2 text-center text-gray-500">No items found</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-gray-100">
                        <tr className="font-semibold">
                          <td className="p-1 sm:p-2 text-left">Total</td>
                          <td className="p-1 sm:p-2 text-left">
                            ₦{formatNumber(
                              Array.isArray(selectedProject.all_items)
                                ? selectedProject.all_items.reduce((sum, item) => sum + (parseFloat(item.budget || '0')), 0)
                                : 0
                            )}
                          </td>
                          <td className="p-1 sm:p-2 text-left">
                            ₦{formatNumber(
                              Array.isArray(selectedProject.all_items)
                                ? selectedProject.all_items.reduce((sum, item) => sum + (parseFloat(item.price || '0') * (parseInt(item.quantity) || 1)), 0)
                                : 0
                            )}
                          </td>
                          <td className="p-1 sm:p-2 text-left">
                            {Array.isArray(selectedProject.all_items)
                              ? selectedProject.all_items.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0)
                              : 0}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                                {/* Products Table */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="text-md font-semibold text-gray-700 mb-2">
                    Products
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-blue-400 text-white">
                        <tr>
                          <th className="p-2 text-left">Name</th>
                          <th className="p-2 text-left">Selling Price</th>
                          <th className="p-2 text-left">Progress (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProject.products?.products?.length > 0 ? (
                          selectedProject.products.products.map((product) => (
                            <tr
                              key={product.id}
                              className="border-b border-gray-200"
                            >
                              <td className="p-2 text-left">{product.name}</td>
                              <td className="p-2 text-left">
                                ₦{formatNumber(parseFloat(product.selling_price))}
                            </td>
                              <td className="p-2 text-left">{product.progress}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="p-2 text-left" colSpan={3}>No data found</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-gray-100">
                        <tr className="font-semibold">
                          <td className="p-2 text-left">Total</td>
                          <td className="p-2 text-left">
                            ₦{formatNumber(totalProductsSellingPrice)}
                          </td>
                          <td className="p-2 text-left">
                            {(() => {
                              const products = selectedProject.products?.products || [];
                              if (!products.length) return 0;
                              const sum = products.reduce((acc, p) => acc + (typeof p.progress === 'number' ? p.progress : 0), 0);
                              return Math.round(sum / products.length);
                            })()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Sold Items Table */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                      Sold Items
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-blue-400 text-white">
                          <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Quantity</th>
                            <th className="p-2 text-left">Cost Price</th>
                            <th className="p-2 text-left">Selling Price</th>
                            <th className="p-2 text-left">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                          {selectedProject.sold_items.sold_items.map(
                            (item) => (
                              <tr
                                key={item.id}
                                className="border-b border-gray-200"
                              >
                                <td className="p-2 text-left">{item.name}</td>
                                <td className="p-2 text-left">{item.quantity}</td>
                                <td className="p-2 text-left">
                                  ₦{formatNumber(parseFloat(item.cost_price))}
                                </td>
                                <td className="p-2 text-left">
                                  ₦{formatNumber(parseFloat(item.selling_price))}
                              </td>
                                <td className="p-2 text-left">
                                  ₦{formatNumber(item.total_price)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                        <tfoot className="bg-gray-100 ">
                          <tr className="font-semibold">
                            <td className="p-2 text-left">Total</td>
                            <td className="p-2 text-left"></td>
                            <td className="p-2 text-left">₦{formatNumber(totalSoldItemsCost)}</td>
                            <td className="p-2 text-left">₦{formatNumber(totalSoldItemsSelling)}</td>
                            <td className="p-2  text-left">₦{formatNumber(totalSoldItemsTotalPrice)}</td>
                          </tr>
                        </tfoot>
                    </table>
                    </div>
                    </div>

                {/* Tasks Table */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex  md:flex-row md:items-center md:justify-between mb-2 gap-2">
                    <h4 className="text-md font-semibold text-gray-700">Tasks</h4>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-blue-400">Progress:</span>
                        <span className="text-xs font-semibold text-blue-400">{progress}%</span>
                      </div>
                      <div className="w-40 bg-gray-200 rounded h-2.5">
                        <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (selectedProject) {
                          setIsModalOpen(false);
                          setTimeout(() => handleViewTasks(selectedProject), 300);
                        }
                      }}
                      className="px-3 py-1 bg-blue-400 text-white rounded text-xs hover:bg-blue-500 transition-colors"
                      disabled={!selectedProject}
                    >
                      + Task
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-blue-400 text-white">
                        <tr>
                          <th className="p-2 text-left">Task</th>
                          <th className="p-2 text-left">Completed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(localTasks) && localTasks.length > 0 ? (
                          localTasks.map((task, idx) => (
                            task ? (
                              <React.Fragment key={idx}>
                                <tr className="border-b border-gray-200">
                                  <td className="p-2 text-left font-medium">{task?.title}</td>
                                  <td className="p-2 text-left">
                                    <input type="checkbox" checked={task?.checked} onChange={() => task && handleTaskCompletionToggle(idx)} />
                            </td>
                                </tr>
                                {Array.isArray(task.subtasks) ? task.subtasks.map((sub, subIdx) => (
                                  sub ? (
                                    <tr key={subIdx} className="border-b border-gray-100">
                                      <td className="p-2 pl-8 text-left text-gray-700 flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                                        <span>{sub.title}</span>
                            </td>
                                      <td className="p-2 text-left">
                                        <input type="checkbox" checked={sub.checked} onChange={() => sub && handleTaskCompletionToggle(idx, subIdx)} />
                            </td>
                                    </tr>
                                  ) : null
                                )) : null}
                              </React.Fragment>
                            ) : null
                          ))
                        ) : (
                          <tr>
                            <td className="p-2 text-left" colSpan={2}>No tasks found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Expenses Table */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                      Expenses
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-blue-400 text-white">
                          <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProject.expenses.expenses.map(
                            (expense, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-200"
                              >
                                <td className="p-2 text-left">{expense.name}</td>
                                <td className="p-2 text-left">
                                  ₦{formatNumber(parseFloat(expense.amount))}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot className="bg-gray-100">
                          <tr className="font-semibold">
                            <td className="p-2 text-left">Total</td>
                            <td className="p-2 text-left">₦{formatNumber(totalExpensesAmount)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    </div>

                {/* Other Productions Table */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-md font-semibold text-gray-700">
                      Other Productions
                    </h4>
                      <button
                        onClick={handleViewOtherProductionRecords}
                        className="px-3 py-1 bg-blue-400 text-white rounded text-xs hover:bg-blue-500 transition-colors"
                        disabled={!selectedProject}
                      >
                        + View
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-blue-400 text-white">
                          <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Budget</th>
                            <th className="p-2 text-left">Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProject.other_productions.other_productions.map(
                            (production) => (
                              <tr
                                key={production.id}
                                className="border-b border-gray-200"
                              >
                                <td className="p-2 text-left">
                                  {production.name}
                                </td>
                                <td className="p-2 text-left">
                                  {production.budget ? `₦${formatNumber(parseFloat(production.budget))}` : '-'}
                                </td>
                                <td className="p-2 text-left">
                                  {production.cost ? `₦${formatNumber(parseFloat(production.cost))}` : '-'}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot className="bg-gray-100">
                          <tr className="font-semibold">
                            <td className="p-2 text-left">Total</td>
                            <td className="p-2 text-left">₦{formatNumber(totalOtherProductionsBudget)}</td>
                            <td className="p-2 text-left">₦{formatNumber(totalOtherProductionsCost)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {selectedProject && (
        <EditProjectModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          projectId={selectedProject.id.toString()}
          onSuccess={handleEditSuccess}
        />
      )}

      {selectedProject && selectedProject.invoice_image && (
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invoice Image</DialogTitle>
            </DialogHeader>
            <img
              src={selectedProject.invoice_image}
              alt="Invoice"
              className="max-w-full h-auto rounded-lg"
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all its related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Status Modal */}
      <Dialog open={isEditStatusModalOpen} onOpenChange={setIsEditStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="w-full border rounded p-2"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
            >
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
              {/* Add more statuses as needed */}
            </select>
            <Button onClick={handleStatusSave} disabled={statusLoading}>
              {statusLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new item to the project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input type="text" className="w-full border rounded p-2" placeholder="Enter item name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" className="w-full border rounded p-2" placeholder="Enter price" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" className="w-full border rounded p-2" placeholder="Enter quantity" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddItemModalOpen(false)}>
                Add Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Modal */}
      <Dialog open={isAddTaskModalOpen} onOpenChange={setIsAddTaskModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Add a new task to the project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Title</label>
              <input type="text" className="w-full border rounded p-2" placeholder="Enter task title" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddTaskModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddTaskModalOpen(false)}>
                Add Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showAllItemsManager && selectedProject && (
        <AllItemsManager
          project={selectedProject}
          onUpdate={(updatedItems) => {
            selectedProject.all_items = updatedItems as any;
          }}
          onClose={() => {
            setShowAllItemsManager(false);
            setIsModalOpen(true);
          }}
        />
      )}
    </>
  );
};

export default ProjectModals;
