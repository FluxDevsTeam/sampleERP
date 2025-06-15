import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialFormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  address: "",
  craft_specialty: "",
  years_of_experience: 0,
  is_still_active: true,
};

const AddContractorModal: React.FC<Props> = ({ open, onOpenChange }) => {
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialFormData);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await axios.post("https://backend.kidsdesigncompany.com/api/contractors/", formData);
      queryClient.invalidateQueries({ queryKey: ["contractors"] });
      toast.success("Contractor added!");
      setFormData(initialFormData); // Reset form after success
      onOpenChange(false);
      navigate("/admin/workers");
    } catch (err) {
      toast.error("Failed to add contractor.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto max-h-[90vh]">
        <DialogHeader className=" ">
          <DialogTitle>Add New Contractor</DialogTitle>
          <DialogDescription>Fill in the details to add a contractor.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "first_name", label: "First Name" },
            { id: "last_name", label: "Last Name" },
            { id: "email", label: "Email", type: "email" },
            { id: "phone_number", label: "Phone Number" },
            { id: "address", label: "Address" },
            { id: "craft_specialty", label: "Craft Specialty" },
            { id: "years_of_experience", label: "Years of Experience", type: "number" },
          ].map(({ id, label, type }) => (
            <div key={id} className="space-y-1">
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                name={id}
                type={type || "text"}
                value={formData[id as keyof typeof formData] || ""}
                onChange={handleChange}
                required
              />
            </div>
          ))}

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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContractorModal;