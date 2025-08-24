import React, { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { updateSalaryWorker, getSalaryWorkerDetails } from "@/utils/jsonDataService";

const EditSalaryWorker = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    position: "",
    salary: 0,
    is_still_active: true,
    date_joined: "",
    date_left: "",
    guarantor_name: "",
    guarantor_phone_number: "",
    guarantor_address: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [agreementFormImage, setAgreementFormImage] = useState<File | null>(null);
  const [originalData, setOriginalData] = useState<any>(null);

  // Fetch the salary worker data to populate the form
  useEffect(() => {
    const fetchSalaryWorker = async () => {
      try {
        const normalized = await getSalaryWorkerDetails(id);
        setFormData(normalized);
        setOriginalData(normalized);
      } catch (error) {
        toast.error("Failed to fetch salary worker data.");
      }
    };

    fetchSalaryWorker();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === "image") setImage(files[0]);
      if (name === "agreement_form_image") setAgreementFormImage(files[0]);
    }
  };

  const isChanged = () => {
    if (!originalData) return false;
    // Check if any field in formData is different from originalData
    for (const key in formData) {
      if (formData[key as keyof typeof formData] !== originalData[key]) {
        return true;
      }
    }
    // Check if a new file is selected
    if (image || agreementFormImage) return true;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await updateSalaryWorker(id, formData, image, agreementFormImage);
      queryClient.invalidateQueries({ queryKey: ["salary-workers"], refetchType: "active" });
      toast.success("Salary worker updated successfully!");
      navigate("/admin/workers");
    } catch (error) {
      toast.error("Failed to update salary worker. Please try again.");
      console.error("Update error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container mx-auto p-4 mb-14 md:mb-4">
      <Card className="mx-auto w-full md:max-w-3xl lg:max-w-5xl relative">
        {/* X Close Button */}
        <button
          type="button"
          onClick={() => navigate("/admin/workers")}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-4xl font-bold z-10"
          aria-label="Close"
        >
          &times;
        </button>
        <CardHeader>
          <CardTitle>Edit Salary Worker</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* First/Last Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
            {/* Email/Phone */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number (optional)</Label>
              <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
            </div>
            {/* Address/Craft */}
            <div className="space-y-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="craft_specialty">Craft Specialty (optional)</Label>
              <Input id="craft_specialty" name="craft_specialty" value={formData.craft_specialty} onChange={handleChange} />
            </div>
            {/* Years of Experience/Position */}
            <div className="space-y-2">
              <Label htmlFor="years_of_experience">Years of Experience (optional)</Label>
              <Input id="years_of_experience" name="years_of_experience" type="number" value={formData.years_of_experience} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position (optional)</Label>
              <Input id="position" name="position" value={formData.position} onChange={handleChange} />
            </div>
            {/* Salary/Date Joined/Date Left */}
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" name="salary" type="number" value={formData.salary} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_joined">Date Joined (optional)</Label>
              <Input id="date_joined" name="date_joined" type="date" value={formData.date_joined} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_left">Date Left (optional)</Label>
              <Input id="date_left" name="date_left" type="date" value={formData.date_left} onChange={handleChange} />
            </div>
            {/* Guarantor Name/Phone */}
            <div className="space-y-2">
              <Label htmlFor="guarantor_name">Guarantor Name (optional)</Label>
              <Input id="guarantor_name" name="guarantor_name" value={formData.guarantor_name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guarantor_phone_number">Guarantor Phone Number (optional)</Label>
              <Input id="guarantor_phone_number" name="guarantor_phone_number" value={formData.guarantor_phone_number} onChange={handleChange} />
            </div>
            {/* Guarantor Address */}
            <div className="space-y-2">
              <Label htmlFor="guarantor_address">Guarantor Address (optional)</Label>
              <Input id="guarantor_address" name="guarantor_address" value={formData.guarantor_address} onChange={handleChange} />
            </div>
            {/* Image/Agreement Form */}
            <div className="space-y-2">
              <Label htmlFor="image">Image (optional)</Label>
              <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agreement_form_image">Agreement Form Image (optional)</Label>
              <Input id="agreement_form_image" name="agreement_form_image" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="is_still_active" name="is_still_active" checked={formData.is_still_active} onChange={handleChange} className="h-4 w-4" />
              <Label htmlFor="is_still_active">Active (optional)</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/workers")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !isChanged()}>
              {isPending ? "Updating..." : "Update Salary Worker"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditSalaryWorker;