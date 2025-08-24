import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  tasks: Task[];
  all_items: { item: string; price: string; quantity: string }[];
}

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
  address?: string;
}

interface ApiErrorResponse {
  [key: string]: string[];
}

interface Subtask {
  title: string;
  checked: boolean;
}

interface Task {
  title: string;
  checked: boolean;
  subtasks: Subtask[];
}

const saveProjectsToJson = async (updatedProjects: any) => {
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
  return updatedProjects;
};

const TasksEditor: React.FC<{
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}> = ({ tasks, setTasks }) => {
  const handleTaskChange = (idx: number, field: "title" | "checked", value: any) => {
    setTasks((prev) => prev.map((task, i) => (i === idx ? { ...task, [field]: value } : task)));
  };
  const handleAddTask = () => {
    setTasks((prev) => [...prev, { title: "", checked: false, subtasks: [] }]);
  };
  const handleRemoveTask = (idx: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleSubtaskChange = (taskIdx: number, subIdx: number, field: "title" | "checked", value: any) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === taskIdx
          ? { ...task, subtasks: task.subtasks.map((sub, j) => (j === subIdx ? { ...sub, [field]: value } : sub)) }
          : task
      )
    );
  };
  const handleAddSubtask = (taskIdx: number) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === taskIdx ? { ...task, subtasks: [...task.subtasks, { title: "", checked: false }] } : task
      )
    );
  };
  const handleRemoveSubtask = (taskIdx: number, subIdx: number) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === taskIdx ? { ...task, subtasks: task.subtasks.filter((_, j) => j !== subIdx) } : task
      )
    );
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="font-semibold">Tasks</label>
        <button type="button" className="px-2 py-1 bg-blue-500 text-white rounded" onClick={handleAddTask}>
          Add Task
        </button>
      </div>
      {tasks.length === 0 && <div className="text-gray-500 text-sm">No tasks yet.</div>}
      {tasks.map((task, idx) => (
        <div key={idx} className="border rounded-lg p-3 mb-2 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={task.checked}
              onChange={(e) => handleTaskChange(idx, "checked", e.target.checked)}
            />
            <input
              placeholder="Task title"
              value={task.title}
              onChange={(e) => handleTaskChange(idx, "title", e.target.value)}
              className="w-1/2 border px-2 py-1 rounded"
            />
            <button
              type="button"
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => handleRemoveTask(idx)}
            >
              Remove
            </button>
          </div>
          <div className="ml-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Subtasks</span>
              <button
                type="button"
                className="px-2 py-1 bg-blue-400 text-white rounded text-xs"
                onClick={() => handleAddSubtask(idx)}
              >
                Add Subtask
              </button>
            </div>
            {task.subtasks.length === 0 && <div className="text-gray-400 text-xs">No subtasks</div>}
            {task.subtasks.map((sub, subIdx) => (
              <div key={subIdx} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={sub.checked}
                  onChange={(e) => handleSubtaskChange(idx, subIdx, "checked", e.target.checked)}
                />
                <input
                  placeholder="Subtask title"
                  value={sub.title}
                  onChange={(e) => handleSubtaskChange(idx, subIdx, "title", e.target.value)}
                  className="w-1/2 border px-2 py-1 rounded"
                />
                <button
                  type="button"
                  className="ml-2 px-2 py-1 bg-red-400 text-white rounded text-xs"
                  onClick={() => handleRemoveSubtask(idx, subIdx)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [customers] = useState<Customer[]>(customersData.results.all_customers || []);
  const [isLoadingCustomers] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allItems, setAllItems] = useState<{ item: string; price: string; quantity: string }[]>([]);

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["project", id],
    queryFn: async () => {
      const project = projectsData.all_projects.find((p) => p.id.toString() === id);
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    },
    enabled: !!id,
  });

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
      setCurrentInvoiceImage(project.invoice_image);
      setTasks(project.tasks || []);
      setAllItems(
        Array.isArray(project.all_items)
          ? project.all_items.map((row: any) => ({
              item: row.item || "",
              price: row.price || "",
              quantity: row.quantity ? String(row.quantity) : "1",
            }))
          : []
      );
    }
  }, [project]);

  const handleAllItemChange = (idx: number, field: "item" | "price" | "quantity", value: string) => {
    setAllItems((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  const handleAddAllItem = () => {
    setAllItems((prev) => [...prev, { item: "", price: "", quantity: "1" }]);
  };

  const handleRemoveAllItem = (idx: number) => {
    setAllItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateProjectMutation = useMutation({
    mutationFn: async (updatedProject: FormData) => {
      const projectData: any = {};
      updatedProject.forEach((value, key) => {
        projectData[key] = value;
      });
      if (projectData.customer) {
        projectData.customer_detail = customers.find((c) => c.id.toString() === projectData.customer) || project!.customer_detail;
        delete projectData.customer;
      }
      if (updatedProject.get("tasks")) {
        projectData.tasks = JSON.parse(updatedProject.get("tasks") as string);
      }
      if (invoiceImage) {
        projectData.invoice_image = URL.createObjectURL(invoiceImage);
      }
      projectData.all_items = allItems
        .filter((row) => row.item && row.price)
        .map((row) => ({ ...row, quantity: row.quantity || "1" }));
      const updatedProjects = {
        ...projectsData,
        all_projects: projectsData.all_projects.map((p) => (p.id.toString() === id ? { ...p, ...projectData } : p)),
      };
      await saveProjectsToJson(updatedProjects);
      return projectData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      navigate("/ceo/projects");
      toast.success("Project updated successfully!");
    },
    onError: (error: any) => {
      setFormError("Failed to update project. Please try again.");
      toast.error("Failed to update project. Please check the form for errors.");
      setIsSubmitting(false);
    },
  });

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
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCustomerChange = (value: string) => {
    setFormData({ ...formData, customer_detail: value });
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
      tasks: JSON.stringify(tasks),
    };

    Object.entries(projectData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSubmit.append(key, value.toString());
      }
    });

    if (invoiceImage) {
      formDataToSubmit.append("invoice_image", invoiceImage);
    }

    updateProjectMutation.mutate(formDataToSubmit);
  };

  if (isLoading) return <p className="p-4">Loading project data...</p>;
  if (error) return <p className="p-4">Error: {(error as Error).message}</p>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>Update the details for the selected project.</CardDescription>
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
                placeholder="Enter project name"
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
              {errorDetails.customer && <p className="text-sm text-red-500">{errorDetails.customer.join(", ")}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
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
              {errorDetails.status && <p className="text-sm text-red-500">{errorDetails.status.join(", ")}</p>}
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
                  className={errorDetails.deadline ? "border-red-500" : ""}
                />
                {errorDetails.deadline && <p className="text-sm text-red-500">{errorDetails.deadline.join(", ")}</p>}
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
                  disabled={!formData.is_delivered}
                  className={errorDetails.date_delivered ? "border-red-500" : ""}
                />
                {errorDetails.date_delivered && (
                  <p className="text-sm text-red-500">{errorDetails.date_delivered.join(", ")}</p>
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
                {errorDetails.logistics && <p className="text-sm text-red-500">{errorDetails.logistics.join(", ")}</p>}
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
                  <p className="text-sm text-red-500">{errorDetails.service_charge.join(", ")}</p>
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
              {errorDetails.note && <p className="text-sm text-red-500">{errorDetails.note.join(", ")}</p>}
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

            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="is_delivered"
                  checked={formData.is_delivered}
                  onCheckedChange={(checked) => handleCheckboxChange("is_delivered", checked as boolean)}
                />
                <Label htmlFor="is_delivered">Project is delivered</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="archived"
                  checked={formData.archived}
                  onCheckedChange={(checked) => handleCheckboxChange("archived", checked as boolean)}
                />
                <Label htmlFor="archived">Archive this project</Label>
              </div>
            </div>

            <div className="space-y-2">
              <TasksEditor tasks={tasks} setTasks={setTasks} />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/ceo/projects")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || updateProjectMutation.isPending}>
              {isSubmitting || updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditProject;