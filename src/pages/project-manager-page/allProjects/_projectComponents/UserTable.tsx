import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import userpic from "../../../../assets/images/16.png";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MdCancel } from "react-icons/md";
import FilterDropdown from "./FilterDropdown";
import { useUpdateProject, useDeleteProject } from "../_projectApi/FetchDashboardCeo";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

interface Project {
  id: string;
  name: string;
  is_delivered: boolean;
  deadline: string;
  start_date: string;
  status: string;
}

interface UserTableProps {
  title?: string;
  data: Project[];
}

const UserTable: React.FC<UserTableProps> = ({ title = "Total Projects", data }) => {
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: "", start_date: "", deadline: "", status: "" });

  // Open Edit Dialog and set form data
  const openEditDialog = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      name: project.name,
      start_date: project.start_date,
      deadline: project.deadline,
      status: project.status,
    });
    setEditDialogOpen(true);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle edit submission
  const handleEditSubmit = async () => {
    if (!currentProject) return;

    try {
      setLoading((prev) => ({ ...prev, [currentProject.id]: true }));

      await updateProject.mutateAsync({
        id: currentProject.id,
        updatedData: { ...formData },
      });

      toast.success("Project updated successfully!");
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [currentProject.id]: false }));
    }
  };

  // Handle delete functionality
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      setLoading((prev) => ({ ...prev, [id]: true }));
      await deleteProject.mutateAsync(id);
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Filtered Data based on selected filter
  const filteredData = data.filter((project) => {
    const deadlineDate = new Date(project.deadline);
    const currentDate = new Date();
    deadlineDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (filter === "delivered") return project.is_delivered;
    if (filter === "past_deadline") return !project.is_delivered && deadlineDate < currentDate;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center px-6">
        <h1 className="text-3xl font-bold py-3">{title}</h1>
        <FilterDropdown onFilterChange={setFilter} />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto bg-white w-full border-collapse">
          <thead className="bg-gray-100 hidden sm:table-header-group">
            <tr>
              <th className="border px-4 py-2">Project Name</th>
              <th className="border px-4 py-2">View</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Start Date - Deadline</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((project) => (
              <tr key={project.id} className="border sm:table-row flex flex-col sm:flex-row">
                <td className="px-4 py-2 flex items-center">
                  <img src={userpic} alt="user" className="w-[45px] h-[45px] mr-2" />
                  <p className="text-md font-bold">{project.name}</p>
                </td>
                <td className="border px-4 py-2 text-sm text-center">
                      <button className="border rounded-full border-neutral-900 border-2 p-2 px-5">
                        View
                      </button>
                    </td>

                <td className="px-4 py-2 flex items-center justify-center space-x-2">
                <div className="flex items-center space-x-2">
                        {project.status === "completed" || project.status === "in progress" ? (
                          <div className="w-3 h-3 bg-gray-300 border rounded-full flex items-center justify-start overflow-hidden">
                            <div
                              className="bg-lime-600 h-full rounded-full"
                              style={{
                                width: project.status === "completed" ? "100%" : "50%",
                              }}
                            ></div>
                          </div>
                        ) : (
                          <span className="w-3 h-3 bg-red-500 border rounded-full"></span>
                        )}
                        <p className="text-sm">{project.status}</p>
                      </div>

                      {project.status === "completed" ? (
                        <span className="w-10 h-2 bg-lime-600 border rounded-full"></span>
                      ) : project.status === "in progress" ? (
                        <div className="w-10 h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div className="bg-lime-600 h-full rounded-full" style={{ width: "50%" }}></div>
                        </div>
                      ) : (
                        <div className="text-red-500 flex space-x-1">
                          <MdCancel />
                          <MdCancel />
                          <MdCancel />
                        </div>
                      )}
               


                </td>

                <td className="px-4 py-2 text-center">
                  {project.start_date} - {project.deadline}
                </td>

                <td className="border px-4 py-2 text-center">
                  {loading[project.id] ? (
                    <div className="animate-spin h-5 w-5 border-b-2 border-gray-900"></div>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="border-none">
                          <HiDotsVertical />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-70">
                        <div className="flex flex-col space-y-4">
                          <button className="hover:text-blue-500" onClick={() => openEditDialog(project)}>
                            Edit
                          </button>
                          <button className="hover:text-red-500" onClick={() => handleDelete(project.id)}>
                            Delete
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Project Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />

            <Label>Start Date</Label>
            <Input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />

            <Label>Deadline</Label>
            <Input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />

            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger>Choose Status</SelectTrigger>
              <SelectContent>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserTable;
