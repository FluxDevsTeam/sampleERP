// src/pages/admin/assets/_components/EditAssetModal.tsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import assetsData from "@/data/admin/assets/assets.json";

interface Asset {
  id: number;
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
  date_added?: string;
  end_date?: string;
  note?: string;
}

interface EditAssetModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditAssetModal = ({ asset, isOpen, onClose, onSuccess }: EditAssetModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    expected_lifespan: "",
    is_still_available: true,
    date_added: "",
    end_date: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (asset && isOpen) {
      setFormData({
        name: asset.name || "",
        value: asset.value?.toString() || "",
        expected_lifespan: asset.expected_lifespan || "",
        is_still_available: asset.is_still_available || false,
        date_added: asset.date_added || "",
        end_date: asset.end_date || "",
        note: asset.note || "",
      });
    }
  }, [asset, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_still_available: checked,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    if (!formData.name || !formData.value || !formData.expected_lifespan || !formData.date_added) {
      setFormError("Please fill out all required fields");
      setIsSubmitting(false);
      return;
    }

    toast.error("Update asset functionality is disabled in static mode.");
    setIsSubmitting(false);
    onSuccess();
  };

  const handleClose = () => {
    setFormData({
      name: asset.name || "",
      value: asset.value?.toString() || "",
      expected_lifespan: asset.expected_lifespan || "",
      is_still_available: asset.is_still_available || false,
      date_added: asset.date_added || "",
      end_date: asset.end_date || "",
      note: asset.note || "",
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Asset</CardTitle>
            <CardDescription>Update the details for the selected asset.</CardDescription>
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
                <Label htmlFor="name">Asset Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter asset name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Asset Value (NGN)</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="Enter asset value"
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
                  placeholder="Enter expected lifespan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_added">Date Added</Label>
                <Input
                  id="date_added"
                  name="date_added"
                  type="date"
                  value={formData.date_added}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date (optional)</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="is_still_available"
                  checked={formData.is_still_available}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="is_still_available">Asset is still available</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Input
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Enter a note (optional)"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssetModal;