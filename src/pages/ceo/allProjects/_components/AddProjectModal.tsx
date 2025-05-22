import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

interface CustomerApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    all_customers_count: number;
    active_customers: number;
    all_customers: Customer[];
  };
}

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState("");
  const [errorDetails, setErrorDetails] = useState<Record<string, string[]>>({});
  const [invoiceImage, setInvoiceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    status: "in progress",
    start_date: new Date().toISOString().split("T")[0],
    deadline: "",
    date_delivered: "",
    is_delivered: false,
    archived: false,
    customer_detail: "placeholder", 
    selling_price: "",
    logistics: "0",
    service_charge: "0",
    note: "",
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoadingCustomers(true);
      try {
        const response = await axios.get<CustomerApiResponse>('https://kidsdesigncompany.pythonanywhere.com/api/customer/');
        if (response.data?.results?.all_customers) {
          setCustomers(response.data.results.all_customers);
        } else {
          throw new Error("Unexpected API response structure");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([]);
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    if (open) {
      fetchCustomers();
    }
  }, [open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCustomerChange = (value: string) => {
    setFormData(prev => ({ ...prev, customer_detail: value }));
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

    const formDataToSubmit = new FormData();
    const projectData = {
      name: formData.name,
      status: formData.status,
      start_date: formData.start_date,
      deadline: formData.deadline || null,
      date_delivered: formData.is_delivered ? formData.date_delivered : null,
      is_delivered: formData.is_delivered,
      archived: formData.archived,
      customer: parseInt(formData.customer_detail),
      selling_price: formData.selling_price,
      logistics: formData.logistics || "0",
      service_charge: formData.service_charge || "0",
      note: formData.note || null,
    };

    Object.entries(projectData).forEach(([key, value]) => {
      if (value !== null) formDataToSubmit.append(key, value.toString());
    });

    if (invoiceImage) formDataToSubmit.append('invoice_image', invoiceImage);

    try {
      await axios.post(
        "https://kidsdesigncompany.pythonanywhere.com/api/project/",
        formDataToSubmit,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project added successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding project:", error);
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          setErrorDetails(error.response.data);
          const errorMessages = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          setFormError(`Validation error: ${errorMessages}`);
        } else {
          setFormError("Failed to add project. Please check your data and try again.");
        }
      } else {
        setFormError("Failed to add project. Please try again.");
      }
      
      toast.error("Failed to add project. Please check the form for errors.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-none">
            <CardContent className="space-y-4 pt-4">
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
                {errorDetails.name && (
                  <p className="text-sm text-red-500">{errorDetails.name.join(', ')}</p>
                )}
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
                      <SelectItem value="placeholder" disabled>Loading customers...</SelectItem>
                    ) : customers.length > 0 ? (
                      customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="placeholder" disabled>No customers found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errorDetails.customer_detail && (
                  <p className="text-sm text-red-500">
                    {Array.isArray(errorDetails.customer_detail) 
                      ? errorDetails.customer_detail.join(', ') 
                      : "Invalid customer selection"}
                  </p>
                )}
                {customers.length === 0 && !isLoadingCustomers && (
                  <p className="text-sm text-amber-500">Failed to load customers from API.</p>
                )}
              </div>

              {/* Rest of the form fields (same as in your original component) */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
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
                    <p className="text-sm text-red-500">{errorDetails.start_date.join(', ')}</p>
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
                    <p className="text-sm text-red-500">{errorDetails.selling_price.join(', ')}</p>
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
                    disabled={!formData.is_delivered}
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
                <Textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                />
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
                {invoiceImage && (
                  <p className="text-sm text-green-600 mt-2">
                    {invoiceImage.name} selected
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Allowed formats: JPEG, PNG, GIF, PDF. Max size: 5MB
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_delivered"
                    checked={formData.is_delivered}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("is_delivered", checked as boolean)
                    }
                  />
                  <Label htmlFor="is_delivered">Project is delivered</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="archived"
                    checked={formData.archived}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("archived", checked as boolean)
                    }
                  />
                  <Label htmlFor="archived">Archive this project</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
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