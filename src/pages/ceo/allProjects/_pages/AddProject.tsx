import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import customersData from "@/data/ceo/project/customers.json";
import projectsData from "@/data/ceo/project/projects.json";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  project: any;
  shop_item: any;
  created_at: string | null;
}

const saveProjectsToJson = async (updatedProjects: any) => {
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
  return updatedProjects;
};

const AddProject = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState("");
  const [errorDetails, setErrorDetails] = useState<Record<string, string[]>>({});
  const [invoiceImage, setInvoiceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customers] = useState<Customer[]>(customersData.results.all_customers || []);
  const [isLoadingCustomers] = useState(false);
  const [allItems, setAllItems] = useState([{ item: "", price: "", quantity: "1" }]);

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

  const handleAllItemChange = (idx: number, field: "item" | "price" | "quantity", value: string) => {
    setAllItems((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  const handleAddAllItem = () => {
    setAllItems((prev) => [...prev, { item: "", price: "", quantity: "1" }]);
  };

  const handleRemoveAllItem = (idx: number) => {
    setAllItems((prev) => prev.filter((_, i) => i !== idx));
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
        is_delivered: false,
        archived: false,
        customer_detail: customers.find((c) => c.id.toString() === formData.customer_detail) || {
          id: 0,
          name: "",
        },
        selling_price: formData.selling_price,
        logistics: formData.logistics || "0",
        service_charge: formData.service_charge || "0",
        note: formData.note || null,
        all_items: allItems
          .filter((row) => row.item && row.price)
          .map((row) => ({
            ...row,
            quantity: row.quantity || "1",
          })),
        invoice_image: invoiceImage ? URL.createObjectURL(invoiceImage) : null,
        products: {
          progress: 0,
          total_product_selling_price: 0,
          total_production_cost: 0,
          total_artisan_cost: 0,
          total_overhead_cost: 0,
          total_raw_material_cost: 0,
          total_grand_total: 0,
          total_profit: 0,
          products: [],
        },
        sold_items: { total_cost_price_sold_items: 0, total_selling_price_sold_items: 0, sold_items: [] },
        expenses: { total_expenses: 0, expenses: [] },
        other_productions: { total_cost: 0, total_budget: 0, other_productions: [] },
        calculations: {
          total_raw_material_cost: 0,
          total_artisan_cost: 0,
          total_overhead_cost: 0,
          total_products_cost: 0,
          total_product_selling_price: parseFloat(formData.selling_price) || 0,
          product_profit: 0,
          total_cost_price_sold_items: 0,
          total_selling_price_sold_items: 0,
          shop_items_profit: 0,
          money_left_for_expensis: parseFloat(formData.selling_price) || 0,
          money_left_for_expensis_with_logistics_and_service_charge:
            parseFloat(formData.selling_price) - parseFloat(formData.logistics) - parseFloat(formData.service_charge) || 0,
          total_other_productions_budget: 0,
          total_other_productions_cost: 0,
          total_expensis: 0,
          total_money_spent: 0,
          total_paid: 0,
          final_profit: parseFloat(formData.selling_price) || 0,
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project added successfully!");
      navigate("/ceo/projects");
    } catch (error: any) {
      setFormError("Failed to add project. Please try again.");
      toast.error("Failed to add project. Please check the form for errors.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <Card className="max-w-2xl mx-auto ">
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Project Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={errorDetails.name ? "border-red-500" : ""}
              />
              {errorDetails.name && <p className="text-sm text-red-500">{errorDetails.name.join(", ")}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_detail">Customer*</Label>
              <Select
                value={formData.customer_detail}
                onValueChange={handleCustomerChange}
                disabled={isLoadingCustomers}
              >
                <SelectTrigger className={errorDetails.customer_detail ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCustomers ? (
                    <SelectItem value="placeholder" disabled>
                      Loading customers...
                    </SelectItem>
                  ) : customers.length > 0 ? (
                    customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="placeholder" disabled>
                      No customers found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errorDetails.customer_detail && (
                <p className="text-sm text-red-500">{errorDetails.customer_detail.join(", ")}</p>
              )}
              {customers.length === 0 && !isLoadingCustomers && (
                <p className="text-sm text-amber-500">Failed to load customers. Please try refreshing the page.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date*</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className={errorDetails.start_date ? "border-red-500" : ""}
                />
                {errorDetails.start_date && (
                  <p className="text-sm text-red-500">{errorDetails.start_date.join(", ")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="selling_price">Selling Price (₦)*</Label>
                <Input
                  id="selling_price"
                  name="selling_price"
                  type="number"
                  value={formData.selling_price}
                  onChange={handleChange}
                  required
                  className={errorDetails.selling_price ? "border-red-500" : ""}
                />
                {errorDetails.selling_price && (
                  <p className="text-sm text-red-500">{errorDetails.selling_price.join(", ")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_delivered">Date Delivered</Label>
                <Input
                  id="date_delivered"
                  name="date_delivered"
                  type="date"
                  value={formData.date_delivered}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logistics">Logistics Cost (₦)</Label>
                <Input
                  id="logistics"
                  name="logistics"
                  type="number"
                  value={formData.logistics}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_charge">Service Charge (₦)</Label>
                <Input
                  id="service_charge"
                  name="service_charge"
                  type="number"
                  value={formData.service_charge}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea id="note" name="note" value={formData.note} onChange={handleChange} rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice_image">Invoice Image</Label>
              <Input
                id="invoice_image"
                type="file"
                accept="image/jpeg,image/png,image/gif,application/pdf"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {invoiceImage && <p className="text-sm text-green-600 mt-2">{invoiceImage.name} selected</p>}
              <p className="text-xs text-muted-foreground">Allowed formats: JPEG, PNG, GIF, PDF. Max size: 5MB</p>
            </div>

            <div className="space-y-2">
              <Label>All Items</Label>
              <div className="space-y-2">
                {allItems.map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Item"
                      value={row.item}
                      onChange={(e) => handleAllItemChange(idx, "item", e.target.value)}
                      className="w-1/3"
                    />
                    <Input
                      placeholder="Price"
                      type="number"
                      value={row.price}
                      onChange={(e) => handleAllItemChange(idx, "price", e.target.value)}
                      className="w-1/3"
                    />
                    <Input
                      placeholder="Quantity"
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => handleAllItemChange(idx, "quantity", e.target.value)}
                      className="w-1/4"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveAllItem(idx)}
                      disabled={allItems.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddAllItem}>
                  Add Item
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/ceo/projects")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddProject;