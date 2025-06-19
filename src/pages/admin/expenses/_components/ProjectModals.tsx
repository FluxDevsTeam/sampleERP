import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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

interface Project {
  id: number;
  name: string;
  description?: string;
  status?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  status: string;
  budget: number | "";
  start_date: string;
  end_date: string;
}

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSuccess?: () => void;
}

interface DeleteProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSuccess?: () => void;
}

// API Functions
const fetchProjects = async (): Promise<Project[]> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(
    "https://backend.kidsdesigncompany.com/api/project/",
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return response.data.all_projects || [];
};

const createProject = async (
  projectData: ProjectFormData
): Promise<Project> => {
  const token = localStorage.getItem("accessToken");
  const formattedData = {
    name: projectData.name,
    description: projectData.description || "",
    status: projectData.status || "active",
    budget: projectData.budget ? Number(projectData.budget) : null,
    start_date: projectData.start_date || null,
    end_date: projectData.end_date || null,
  };

  const response = await axios.post<Project>(
    "https://backend.kidsdesigncompany.com/api/project/",
    formattedData,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return response.data;
};

const updateProject = async (
  id: number,
  projectData: ProjectFormData
): Promise<Project> => {
  const token = localStorage.getItem("accessToken");
  const formattedData = {
    name: projectData.name,
    description: projectData.description || "",
    status: projectData.status || "active",
    budget: projectData.budget ? Number(projectData.budget) : null,
    start_date: projectData.start_date || null,
    end_date: projectData.end_date || null,
  };

  const response = await axios.put<Project>(
    `https://backend.kidsdesigncompany.com/api/project/${id}/`,
    formattedData,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return response.data;
};

const deleteProject = async (id: number): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  await axios.delete(
    `https://backend.kidsdesigncompany.com/api/project/${id}/`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
};

// Add Project Modal
export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: "active",
    budget: "",
    start_date: "",
    end_date: "",
  });

  const addProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      queryClient.setQueryData<Project[]>(["projects"], (oldData = []) => [
        ...oldData,
        data,
      ]);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project added successfully!");
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
        status: "active",
        budget: "",
        start_date: "",
        end_date: "",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Error adding project:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add project. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    addProjectMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Create a new project with details and timeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter budget amount"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addProjectMutation.isPending || !formData.name.trim()}
            >
              {addProjectMutation.isPending ? "Adding..." : "Add Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Project Modal
export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  open,
  onOpenChange,
  project,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: "active",
    budget: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (project && open) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "active",
        budget: project.budget || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
      });
    }
  }, [project, open]);

  const updateProjectMutation = useMutation({
    mutationFn: (data: ProjectFormData) => updateProject(project!.id, data),
    onSuccess: (data) => {
      queryClient.setQueryData<Project[]>(["projects"], (oldData = []) =>
        oldData.map((p) => (p.id === project!.id ? data : p))
      );
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Error updating project:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update project. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    updateProjectMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update project details and timeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Project Name *</Label>
            <Input
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-budget">Budget</Label>
              <Input
                id="edit-budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter budget amount"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-start_date">Start Date</Label>
              <Input
                id="edit-start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-end_date">End Date</Label>
              <Input
                id="edit-end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                updateProjectMutation.isPending || !formData.name.trim()
              }
            >
              {updateProjectMutation.isPending
                ? "Updating..."
                : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Delete Project Modal
export const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  open,
  onOpenChange,
  project,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: () => deleteProject(project!.id),
    onSuccess: () => {
      queryClient.setQueryData<Project[]>(["projects"], (oldData = []) =>
        oldData.filter((p) => p.id !== project!.id)
      );
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully!");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Error deleting project:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete project. Please try again."
      );
    },
  });

  const handleDelete = () => {
    if (project) {
      deleteProjectMutation.mutate();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            project "{project?.name}" and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProjectMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteProjectMutation.isPending ? "Deleting..." : "Delete Project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Projects Table Component (usage example)
export const ProjectsTable: React.FC = () => {
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Project
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {project.name}
                    </div>
                    {project.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {project.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      project.status === "active"
                        ? "bg-green-100 text-green-800"
                        : project.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : project.status === "on-hold"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {project.status || "active"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.budget
                    ? `$${project.budget.toLocaleString()}`
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.start_date
                    ? new Date(project.start_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(project)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddProjectModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

      <EditProjectModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        project={selectedProject}
      />

      <DeleteProjectModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        project={selectedProject}
      />
    </div>
  );
};
