// src/pages/admin/assets/_components/AddAssetModal.tsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AssetData {
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
  date_added?: string;
  note?: string;
}

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormData: AssetData & { date_added?: string; note?: string } = {
  name: "",
  value: 0,
  expected_lifespan: "",
  is_still_available: true,
  date_added: new Date().toISOString().split("T")[0],
  note: "",
};

const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<AssetData & { date_added?: string; note?: string }>(initialFormData);
  const userRole = localStorage.getItem("user_role") || "employee";

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  useEffect(() => {
      setFormData((prev) => ({ ...prev, date_added: undefined }));
  }, [userRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error("Add asset functionality is disabled in static mode.");
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value (NGN)</Label>
              <Input
                id="value"
                name="value"
                type="number"
                value={formData.value || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_lifespan">Expected Lifespan</Label>
              <Input
                id="expected_lifespan"
                name="expected_lifespan"
                value={formData.expected_lifespan}
                onChange={handleChange}
                required
              />
            </div>
              <div className="space-y-2">
                <Label htmlFor="date_added">Date Added</Label>
                <Input
                  id="date_added"
                  name="date_added"
                  type="date"
                  value={formData.date_added || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_still_available"
                name="is_still_available"
                checked={formData.is_still_available}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <Label htmlFor="is_still_available">Available</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Input
                id="note"
                name="note"
                value={formData.note || ""}
                onChange={handleChange}
                placeholder="Enter a note (optional)"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Asset</Button>
          </CardFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetModal;