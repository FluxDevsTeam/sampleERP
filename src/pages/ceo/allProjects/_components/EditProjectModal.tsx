import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import projectsData from "@/data/ceo/project/projects.json";
import customersData from "@/data/ceo/project/customers.json";

interface CustomerDetail {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
  invoice_image: string | null;
  status: string;
  start_date: string;
  deadline: string | null;
  date_delivered: string | null;
  is_delivered: boolean;
  archived: boolean;
  customer_detail: CustomerDetail;
  selling_price: string;
  logistics: string;
  service_charge: string;
  note: string | null;
  all_items: { item: string; price: string; quantity: string }[];
}

interface Customer {
  id: number;
  name: string;
}

interface ApiErrorResponse {
  [key: string]: string[];
}

interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess?: () => void;
}

const saveProjectsToJson = async (updatedProjects: any) => {
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
  return updatedProjects;
};

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  open,
  onOpenChange,
  projectId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    start_date: "",
    deadline: "",
    date_delivered: "",
    is_delivered: false,
    archived: false,
    customer_detail: "",
    selling_price: "",
    logistics: "",
    service_charge: "",
    note: "",
  });

  const [invoiceImage, setInvoiceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentInvoiceImage, setCurrentInvoiceImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [errorDetails, setErrorDetails] = useState<ApiErrorResponse>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [allItems, setAllItems] = useState<{ item: string; price: string; quantity: string }[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (projectId && open) {
      const foundProject = projectsData.all_projects.find((p) => String(p.id) === projectId);
      if (foundProject) {
        setProject(foundProject);
        setFormData({
          name: foundProject.name || "",
          status: foundProject.status || "",
          start_date: foundProject.start_date || "",
          deadline: foundProject.deadline || "",
          date_delivered: foundProject.date_delivered || "",
          is_delivered: foundProject.is_delivered || false,
          archived: foundProject.archived || false,
          customer_detail: foundProject.customer_detail?.id.toString() || "",
          selling_price: foundProject.selling_price || "",
          logistics: foundProject.logistics || "",
          service_charge: foundProject.service_charge || "",
          note: foundProject.note || "",
        });
        setCurrentInvoiceImage(foundProject.invoice_image);
        setAllItems(
          Array.isArray(foundProject.all_items)
            ? foundProject.all_items.map((row: any) => ({
                item: row.item || "",
                price: row.price || "",
                quantity: row.quantity ? String(row.quantity) : "1",
              }))
            : []
        );
      }
    }
  }, [projectId, open]);

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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (value: string) => {
    setFormData((prev) => ({ ...prev, customer_detail: value }));
  };

  const handleAllItemChange = (
    idx: number,
    field: "item" | "price" | "quantity",
    value: string
  ) => {
    setAllItems((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleAddAllItem = () => {
    setAllItems((prev) => [...prev, { item: "", price: "", quantity: "1" }]);
  };

  const handleRemoveAllItem = (idx: number) => {
    setAllItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setErrorDetails({});

    if (!formData.name || !formData.customer_detail) {
      setFormError("Please fill out all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedProject = {
        ...project,
        name: formData.name,
        status: formData.status,
        start_date: formData.start_date,
        deadline: formData.deadline || null,
        date_delivered: formData.is_delivered ? formData.date_delivered : null,
        is_delivered: formData.is_delivered,
        archived: formData.archived,
        customer_detail: customers.find((c) => String(c.id) === formData.customer_detail),
        selling_price: formData.selling_price,
        logistics: formData.logistics,
        service_charge: formData.service_charge,
        note: formData.note || null,
        all_items: allItems
          .filter((row) => row.item && row.price)
          .map((row) => ({ ...row, quantity: row.quantity || "1" })),
        invoice_image: invoiceImage ? URL.createObjectURL(invoiceImage) : currentInvoiceImage,
      };

      const updatedProjects = projectsData.all_projects.map((p) =>
        String(p.id) === projectId ? updatedProject : p
      );

      await saveProjectsToJson({ ...projectsData, all_projects: updatedProjects });
      toast.success("Project updated successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Update error:", error);
      setFormError("Failed to update project. Please try again.");
      toast.error("Failed to update project. Please check the form for errors.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="p-4">Loading project data...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] sm:w-[95vw] lg:min-w-[90vw] xl:w-[85vw] mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edit Project</DialogTitle>
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
                {/* Left column */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm lg:text-base">
                      Project Name*
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter project name"
                      required
                      className={`text-xs sm:text-sm lg:text-base ${errorDetails.name ? "border-red-500" : ""}`}
                    />
                    {errorDetails.name && (
                      <p className="text-xs sm:text-sm text-red-500">
                        {errorDetails.name.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_detail" className="text-xs sm:text-sm lg:text-base">
                      Customer
                    </Label>
                    <Select
                      value={formData.customer_detail}
                      onValueChange={handleCustomerChange}
                    >
                      <SelectTrigger
                        className={`text-xs sm:text-sm lg:text-base ${errorDetails.customer_detail ? "border-red-500" : ""}`}
                      >
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
                    {errorDetails.customer_detail && (
                      <p className="text-xs sm:text-sm text-red-500">
                        {errorDetails.customer_detail.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note" className="text-xs sm:text-sm lg:text-base">
                      Note
                    </Label>
                    <Textarea
                      id="note"
                      name="note"
                      value={formData.note || ""}
                      onChange={handleChange}
                      placeholder="Add any notes about this project"
                      rows={3}
                      className={`text-xs sm:text-sm lg:text-base ${errorDetails.note ? "border-red-500" : ""}`}
                    />
                    {errorDetails.note && (
                      <p className="text-xs sm:text-sm text-red-500">
                        {errorDetails.note.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice_image" className="text-xs sm:text-sm lg:text-base">
                      Invoice Image
                    </Label>
                    <Input
                      id="invoice_image"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,application/pdf"
                      onChange={handleImageChange}
                      className="cursor-pointer text-xs sm:text-sm lg:text-base"
                    />
                    {invoiceImage && (
                      <p className="text-xs sm:text-sm text-green-600 mt-2">
                        {invoiceImage.name} selected
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Allowed formats: JPEG, PNG, GIF, PDF. Max size: 5MB
                    </p>
                  </div>
                </div>
                {/* Right column */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-xs sm:text-sm lg:text-base">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger
                        className={`text-xs sm:text-sm lg:text-base ${errorDetails.status ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    {errorDetails.status && (
                      <p className="text-xs sm:text-sm text-red-500">
                        {errorDetails.status.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date" className="text-xs sm:text-sm lg:text-base">
                        Start Date*
                      </Label>
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
                        <p className="text-xs sm:text-sm text-red-500">
                          {errorDetails.start_date.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-xs sm:text-sm lg:text-base">
                        Deadline
                      </Label>
                      <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={`text-xs sm:text-sm lg:text-base ${errorDetails.deadline ? "border-red-500" : ""}`}
                      />
                      {errorDetails.deadline && (
                        <p className="text-xs sm:text-sm text-red-500">
                          {errorDetails.deadline.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="selling_price" className="text-xs sm:text-sm lg:text-base">
                        Selling Price (₦)*
                      </Label>
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
                        <p className="text-xs sm:text-sm text-red-500">
                          {errorDetails.selling_price.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_delivered" className="text-xs sm:text-sm lg:text-base">
                        Date Delivered
                      </Label>
                      <Input
                        id="date_delivered"
                        name="date_delivered"
                        type="date"
                        value={formData.date_delivered}
                        onChange={handleChange}
                        disabled={!formData.is_delivered}
                        className={`text-xs sm:text-sm lg:text-base ${errorDetails.date_delivered ? "border-red-500" : ""}`}
                      />
                      {errorDetails.date_delivered && (
                        <p className="text-xs sm:text-sm text-red-500">
                          {errorDetails.date_delivered.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="logistics" className="text-xs sm:text-sm lg:text-base">
                        Logistics Cost (₦)
                      </Label>
                      <Input
                        id="logistics"
                        name="logistics"
                        type="number"
                        value={formData.logistics}
                        onChange={handleChange}
                        className={`text-xs sm:text-sm lg:text-base ${errorDetails.logistics ? "border-red-500" : ""}`}
                      />
                      {errorDetails.logistics && (
                        <p className="text-xs sm:text-sm text-red-500">
                          {errorDetails.logistics.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service_charge" className="text-xs sm:text-sm lg:text-base">
                        Service Charge (₦)
                      </Label>
                      <Input
                        id="service_charge"
                        name="service_charge"
                        type="number"
                        value={formData.service_charge}
                        onChange={handleChange}
                        className={`text-xs sm:text-sm lg:text-base ${errorDetails.service_charge ? "border-red-500" : ""}`}
                      />
                      {errorDetails.service_charge && (
                        <p className="text-xs sm:text-sm text-red-500">
                          {errorDetails.service_charge.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="is_delivered"
                        checked={formData.is_delivered}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("is_delivered", checked as boolean)
                        }
                      />
                      <Label htmlFor="is_delivered" className="text-xs sm:text-sm lg:text-base">
                        Project is delivered
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="archived"
                        checked={formData.archived}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("archived", checked as boolean)
                        }
                      />
                      <Label htmlFor="archived" className="text-xs sm:text-sm lg:text-base">
                        Archive this project
                      </Label>
                    </div>
                  </div>
                </div>
                {/* All Items Section */}
                <div className="space-y-2 lg:col-span-2">
                  <Label className="text-xs sm:text-sm lg:text-base">All Items</Label>
                  <div className="space-y-2">
                    {allItems.map((row, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row gap-2 items-start sm:items-center"
                      >
                        <Input
                          placeholder="Item"
                          value={row.item}
                          onChange={(e) => handleAllItemChange(idx, "item", e.target.value)}
                          className="w-full sm:w-1/3 text-xs sm:text-sm lg:text-base"
                        />
                        <Input
                          placeholder="Price"
                          type="number"
                          value={row.price}
                          onChange={(e) => handleAllItemChange(idx, "price", e.target.value)}
                          className="w-full sm:w-1/3 text-xs sm:text-sm lg:text-base"
                        />
                        <Input
                          placeholder="Quantity"
                          type="number"
                          min="1"
                          value={row.quantity}
                          onChange={(e) => handleAllItemChange(idx, "quantity", e.target.value)}
                          className="w-full sm:w-1/4 text-xs sm:text-sm lg:text-base"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveAllItem(idx)}
                          disabled={allItems.length === 1}
                          className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddAllItem}
                      className="text-xs sm:text-sm"
                    >
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row justify-end pt-4 sm:pt-6 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-auto text-xs sm:text-sm lg:text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-auto text-xs sm:text-sm lg:text-base"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal;