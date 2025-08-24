import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateSalaryWorker, getSalaryWorkerDetails } from "@/utils/jsonDataService";

interface EditSalaryWorkerModalProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditSalaryWorkerModal: React.FC<EditSalaryWorkerModalProps> = ({
  id,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    craft_specialty: "",
    years_of_experience: 0,
    salary: 0,
    is_still_active: true,
  });

  useEffect(() => {
    if (!open) return;
    const fetchSalaryWorker = async () => {
      try {
        const data = await getSalaryWorkerDetails(id);
        setFormData(data);
      } catch (error) {
        toast.error("Failed to fetch salary worker data.");
      }
    };
    fetchSalaryWorker();
  }, [id, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await updateSalaryWorker(id, formData);
      queryClient.invalidateQueries({
        queryKey: ["salary-workers"],
        refetchType: "active",
      });
      toast.success("Salary worker updated successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update salary worker. Please try again.");
      console.error("Update error:", error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto max-h-[90vh]">
        <DialogHeader className="">
          <DialogTitle>Edit Salary Worker</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 px-1">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="craft_specialty">Craft Specialty</Label>
              <Input
                id="craft_specialty"
                name="craft_specialty"
                value={formData.craft_specialty}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_of_experience">Years of Experience</Label>
              <Input
                id="years_of_experience"
                name="years_of_experience"
                type="number"
                value={formData.years_of_experience}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_still_active"
                name="is_still_active"
                checked={formData.is_still_active}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <Label htmlFor="is_still_active">Active</Label>
            </div>
          </div>
          <DialogFooter className="">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Salary Worker"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSalaryWorkerModal;
