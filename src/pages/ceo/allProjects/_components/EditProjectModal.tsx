import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent, 
  CardFooter, 
 
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
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

const EditProjectModal: React.FC<EditProjectModalProps> = ({ 
  open, 
  onOpenChange, 
  projectId,
  onSuccess
}) => {
  const queryClient = useQueryClient();
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

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await axios.get(`https://kidsdesigncompany.pythonanywhere.com/api/project/${projectId}/`);
      return response.data;
    },
    enabled: !!projectId && open,
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoadingCustomers(true);
      try {
        const response = await axios.get('https://kidsdesigncompany.pythonanywhere.com/api/customer/');
        if (response.data?.results?.all_customers) {
          setCustomers(response.data.results.all_customers);
        } else {
          setCustomers([
            { id: 1, name: "Adebayo Jubreel" },
            { id: 2, name: "Julius Caesar" },
            { id: 3, name: "Martha Ayodele" },
            { id: 4, name: "Smith Wigglesworth" },
            { id: 5, name: "iyegere" },
            { id: 6, name: "john cena" },
            { id: 7, name: "suskidee" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([
          { id: 1, name: "Adebayo Jubreel" },
          { id: 2, name: "Julius Caesar" },
          { id: 3, name: "Martha Ayodele" },
          { id: 4, name: "Smith Wigglesworth" },
          { id: 5, name: "iyegere" },
          { id: 6, name: "john cena" },
          { id: 7, name: "suskidee" },
        ]);
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    if (open) {
      fetchCustomers();
    }
  }, [open]);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        status: project.status || "",
        start_date: project.start_date || "",
        deadline: project.deadline || "",
        date_delivered: project.date_delivered || "",
        is_delivered: project.is_delivered || false,
        archived: project.archived || false,
        customer_detail: project.customer_detail?.id.toString() || "",
        selling_price: project.selling_price || "",
        logistics: project.logistics || "",
        service_charge: project.service_charge || "",
        note: project.note || "",
      });
      
      if (project.invoice_image) {
        setCurrentInvoiceImage(project.invoice_image);
      }
    }
  }, [project]);

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

  const updateProjectMutation = useMutation({
    mutationFn: async (updatedProject: FormData) => {
      return axios.put(
        `https://kidsdesigncompany.pythonanywhere.com/api/project/${projectId}/`,
        updatedProject,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success("Project updated successfully!");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          setErrorDetails(error.response.data);
          const errorMessages = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          setFormError(`Validation error: ${errorMessages}`);
        } else {
          setFormError("Failed to update project. Please check your data and try again.");
        }
      } else {
        setFormError("Failed to update project. Please try again.");
      }
      toast.error("Failed to update project. Please check the form for errors.");
      setIsSubmitting(false);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (value: string) => {
    setFormData(prev => ({ ...prev, customer_detail: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setErrorDetails({});

    if (!formData.name || !formData.customer_detail) {
      setFormError("Please fill out all required fields");
      setIsSubmitting(false);
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
      logistics: formData.logistics,
      service_charge: formData.service_charge,
      note: formData.note || null,
    };

    Object.entries(projectData).forEach(([key, value]) => {
      if (value !== null) formDataToSubmit.append(key, value.toString());
    });

    if (invoiceImage) formDataToSubmit.append('invoice_image', invoiceImage);

    updateProjectMutation.mutate(formDataToSubmit);
  };

  if (isLoading) return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="p-4">Loading project data...</div>
      </DialogContent>
    </Dialog>
  );

  if (error) return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="p-4">Error: {(error as Error).message}</div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
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
                  placeholder="Enter project name"
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
                  <SelectTrigger className={errorDetails.customer ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCustomers ? (
                      <SelectItem value="loading" disabled>
                        Loading customers...
                      </SelectItem>
                    ) : customers.length > 0 ? (
                      customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-customers" disabled>
                        No customers found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errorDetails.customer && (
                  <p className="text-sm text-red-500">{errorDetails.customer.join(', ')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className={errorDetails.status ? "border-red-500" : ""}>
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
                  <p className="text-sm text-red-500">{errorDetails.status.join(', ')}</p>
                )}
              </div>
              
              {/* Rest of the form fields (same as in your original component) */}
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
                    className={errorDetails.deadline ? "border-red-500" : ""}
                  />
                  {errorDetails.deadline && (
                    <p className="text-sm text-red-500">{errorDetails.deadline.join(', ')}</p>
                  )}
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
                    className={errorDetails.date_delivered ? "border-red-500" : ""}
                  />
                  {errorDetails.date_delivered && (
                    <p className="text-sm text-red-500">{errorDetails.date_delivered.join(', ')}</p>
                  )}
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
                    className={errorDetails.logistics ? "border-red-500" : ""}
                  />
                  {errorDetails.logistics && (
                    <p className="text-sm text-red-500">{errorDetails.logistics.join(', ')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service_charge">Service Charge (₦)</Label>
                  <Input
                    id="service_charge"
                    name="service_charge"
                    type="number"
                    value={formData.service_charge}
                    onChange={handleChange}
                    className={errorDetails.service_charge ? "border-red-500" : ""}
                  />
                  {errorDetails.service_charge && (
                    <p className="text-sm text-red-500">{errorDetails.service_charge.join(', ')}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  name="note"
                  value={formData.note || ""}
                  onChange={handleChange}
                  placeholder="Add any notes about this project"
                  rows={3}
                  className={errorDetails.note ? "border-red-500" : ""}
                />
                {errorDetails.note && (
                  <p className="text-sm text-red-500">{errorDetails.note.join(', ')}</p>
                )}
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
                <div className="flex items-center space-x-2 pt-2">
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
              <Button 
                type="submit"
                disabled={isSubmitting || updateProjectMutation.isPending}
              >
                {isSubmitting || updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal;