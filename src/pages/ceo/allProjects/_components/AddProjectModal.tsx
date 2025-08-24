import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import projectsData from "@/data/ceo/project/projects.json";
import customersData from "@/data/ceo/project/customers.json";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const saveProjectsToJson = async (updatedProjects: any) => {
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
  return updatedProjects;
};

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState("");
  const [errorDetails, setErrorDetails] = useState<Record<string, string[]>>({});
  const [invoiceImage, setInvoiceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [allItems, setAllItems] = useState([{ item: '', price: '', quantity: '1' }]);

  const [formData, setFormData] = useState({
    name: "",
    status: "in progress",
    start_date: new Date().toISOString().split("T")[0],
    deadline: "",
    date_delivered: "",
    customer_detail: "placeholder",
    selling_price: "",
    logistics: "0",
    service_charge: "0",
    note: "",
  });

  useEffect(() => {
    setIsLoadingCustomers(true);
    try {
      setCustomers(customersData.results.all_customers || []);
    } catch (error) {
      console.error("Error loading customers:", error);
      setCustomers([]);
    } finally {
      setIsLoadingCustomers(false);
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      name: "",
      status: "in progress",
      start_date: new Date().toISOString().split("T")[0],
      deadline: "",
      date_delivered: "",
      customer_detail: "placeholder",
      selling_price: "",
      logistics: "0",
      service_charge: "0",
      note: "",
    });
    setInvoiceImage(null);
    setImagePreview(null);
    setFormError("");
    setErrorDetails({});
    setAllItems([{ item: '', price: '', quantity: '1' }]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload a JPEG, PNG, GIF, or PDF.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }

      setInvoiceImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (value: string) => {
    setFormData((prev) => ({ ...prev, customer_detail: value }));
  };

  const handleAllItemChange = (idx: number, field: 'item' | 'price' | 'quantity', value: string) => {
    setAllItems((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const handleAddAllItem = () => {
    setAllItems((prev) => [...prev, { item: '', price: '', quantity: '1' }]);
  };

  const handleRemoveAllItem = (idx: number) => {
    setAllItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setErrorDetails({});
    setIsPending(true);

    if (!formData.name || formData.customer_detail === "placeholder") {
      setFormError("Please fill all required fields");
      setIsPending(false);
      return;
    }

    try {
      const newProject = {
        id: projectsData.all_projects.length + 1,
        name: formData.name,
        status: formData.status,
        start_date: formData.start_date,
        deadline: formData.deadline || null,
        date_delivered: null,
        customer_detail: customers.find(c => String(c.id) === formData.customer_detail),
        selling_price: formData.selling_price,
        logistics: formData.logistics || "0",
        service_charge: formData.service_charge || "0",
        note: formData.note || null,
        is_delivered: false,
        archived: false,
        all_items: allItems.filter(row => row.item && row.price).map(row => ({ ...row, quantity: row.quantity || '1' })),
        invoice_image: invoiceImage ? URL.createObjectURL(invoiceImage) : null,
        products: { progress: 0, total_product_selling_price: 0, total_production_cost: 0, total_artisan_cost: 0, total_overhead_cost: 0, total_raw_material_cost: 0, total_grand_total: 0, total_profit: 0, products: [] },
        sold_items: { total_cost_price_sold_items: 0, total_selling_price_sold_items: 0, sold_items: [] },
        expenses: { total_expenses: 0, expenses: [] },
        other_productions: { total_cost: 0, total_budget: 0, other_productions: [] },
        calculations: {
          total_raw_material_cost: 0,
          total_artisan_cost: 0,
          total_overhead_cost: 0,
          total_products_cost: 0,
          total_product_selling_price: 0,
          product_profit: 0,
          total_cost_price_sold_items: 0,
          total_selling_price_sold_items: 0,
          shop_items_profit: 0,
          money_left_for_expensis: 0,
          money_left_for_expensis_with_logistics_and_service_charge: 0,
          total_other_productions_budget: 0,
          total_other_productions_cost: 0,
          total_expensis: 0,
          total_money_spent: 0,
          total_paid: 0,
          final_profit: 0,
        },
        tasks: [],
      };

      const updatedProjects = {
        ...projectsData,
        all_projects: [...projectsData.all_projects, newProject],
        all_time_projects_count: projectsData.all_time_projects_count + 1,
        all_projects_count: projectsData.all_projects_count + 1,
        ongoing_projects_count: projectsData.ongoing_projects_count + 1,
      };

      await saveProjectsToJson(updatedProjects);
      toast.success("Project added successfully!");
      onOpenChange(false);
      onSuccess?.();
      resetForm();
    } catch (error) {
      console.error("Error adding project:", error);
      setFormError("Failed to add project. Please try again.");
      toast.error("Failed to add project. Please check the form for errors.");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] sm:w-[95vw] lg:min-w-[90vw] xl:w-[85vw] mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg lg:text-xl">Add New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-none">
            <CardContent className="pt-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm lg:text-base">Project Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`text-xs sm:text-sm lg:text-base ${errorDetails.name ? "border-red-500" : ""}`}
                    />
                    {errorDetails.name && (
                      <p className="text-xs text-red-500">{errorDetails.name.join(", ")}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_detail" className="text-xs sm:text-sm lg:text-base">Customer</Label>
                    <Select
                      value={formData.customer_detail}
                      onValueChange={handleCustomerChange}
                    >
                      <SelectTrigger className="text-xs sm:text-sm lg:text-base">
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCustomers ? (
                          <SelectItem value="loading">Loading...</SelectItem>
                        ) : (
                          customers.map((customer) => (
                            <SelectItem key={customer.id} value={String(customer.id)}>
                              {customer.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note" className="text-xs sm:text-sm lg:text-base">Note (optional)</Label>
                    <Textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={3}
                      className="text-xs sm:text-sm lg:text-base"
                    />
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date" className="text-xs sm:text-sm lg:text-base">Start Date</Label>
                      <Input
                        id="start_date"
                        name="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                        className={`text-xs sm:text-sm lg:text-base ${errorDetails.start_date ? "border-red-500" : ""}`}
                      />
                      {errorDetails.start_date && (
                        <p className="text-xs text-red-500">{errorDetails.start_date.join(", ")}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-xs sm:text-sm lg:text-base">Deadline (optional)</Label>
                      <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="text-xs sm:text-sm lg:text-base"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="selling_price" className="text-xs sm:text-sm lg:text-base">Selling Price (₦)</Label>
                      <Input
                        id="selling_price"
                        name="selling_price"
                        type="number"
                        value={formData.selling_price}
                        onChange={handleChange}
                        required
                        className={`text-xs sm:text-sm lg:text-base ${errorDetails.selling_price ? "border-red-500" : ""}`}
                      />
                      {errorDetails.selling_price && (
                        <p className="text-xs text-red-500">{errorDetails.selling_price.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="logistics" className="text-xs sm:text-sm lg:text-base">Logistics Cost (optional)</Label>
                      <Input
                        id="logistics"
                        name="logistics"
                        type="number"
                        value={formData.logistics}
                        onChange={handleChange}
                        className="text-xs sm:text-sm lg:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service_charge" className="text-xs sm:text-sm lg:text-base">Service Charge (optional)</Label>
                      <Input
                        id="service_charge"
                        name="service_charge"
                        type="number"
                        value={formData.service_charge}
                        onChange={handleChange}
                        className="text-xs sm:text-sm lg:text-base"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice_image" className="text-xs sm:text-sm lg:text-base">Invoice Image (optional)</Label>
                    <Input
                      id="invoice_image"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,application/pdf"
                      onChange={handleImageChange}
                      className="cursor-pointer text-xs sm:text-sm lg:text-base"
                    />
                    {invoiceImage && (
                      <p className="text-xs text-green-600 mt-2">{invoiceImage.name} selected</p>
                    )}
                    <p className="text-xs text-muted-foreground">Allowed formats: JPEG, PNG, GIF, PDF. Max size: 5MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:col-span-2">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm lg:text-base">All Items (Optional)</Label>
                    <div className="space-y-2">
                      {allItems.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-2 sm:flex sm:flex-row gap-2 items-start sm:items-center">
                          <Input
                            placeholder="Item"
                            value={row.item}
                            onChange={e => handleAllItemChange(idx, 'item', e.target.value)}
                            className="w-full sm:w-1/3 text-xs sm:text-sm lg:text-base"
                          />
                          <Input
                            placeholder="Price"
                            type="number"
                            value={row.price}
                            onChange={e => handleAllItemChange(idx, 'price', e.target.value)}
                            className="w-full sm:w-1/3 text-xs sm:text-sm lg:text-base"
                          />
                          <Input
                            placeholder="Quantity"
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={e => handleAllItemChange(idx, 'quantity', e.target.value)}
                            className="w-full sm:w-1/4 text-xs sm:text-sm lg:text-base"
                          />
                          <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveAllItem(idx)} disabled={allItems.length === 1} className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">Remove</Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={handleAddAllItem} className="text-xs sm:text-sm">Add Item</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 sm:flex sm:flex-row justify-between pt-4 sm:pt-6 gap-3 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto text-xs sm:text-sm lg:text-base"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto text-xs sm:text-sm lg:text-base">
                {isPending ? "Saving..." : "Create Project"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;