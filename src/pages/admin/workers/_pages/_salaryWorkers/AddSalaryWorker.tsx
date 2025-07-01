import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

const AddSalaryWorker = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) data.append(key, value as string);
      });
      if (image) data.append("image", image);
      if (agreementFormImage) data.append("agreement_form_image", agreementFormImage);
      await axios.post("https://backend.kidsdesigncompany.com/api/salary-workers/", data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `JWT ${accessToken}`,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["salary-workers"], refetchType: "active" });
      toast.success("Salary worker added successfully!");
      navigate("/admin/workers");
    } catch (error) {
      toast.error("Failed to add salary worker. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto w-full md:max-w-3xl lg:max-w-5xl">
        <CardHeader>
          <CardTitle>Add New Salary Worker</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number (optional)</Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="craft_specialty">Craft Specialty (optional)</Label>
              <Input
                id="craft_specialty"
                name="craft_specialty"
                value={formData.craft_specialty}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_of_experience">Years of Experience (optional)</Label>
              <Input
                id="years_of_experience"
                name="years_of_experience"
                type="number"
                value={formData.years_of_experience}
                onChange={handleChange}
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

            <div className="space-y-2">
              <Label htmlFor="date_joined">Date Joined (optional)</Label>
              <Input
                id="date_joined"
                name="date_joined"
                type="date"
                value={formData.date_joined}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guarantor_name">Guarantor Name (optional)</Label>
              <Input
                id="guarantor_name"
                name="guarantor_name"
                value={formData.guarantor_name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guarantor_phone_number">Guarantor Phone Number (optional)</Label>
              <Input
                id="guarantor_phone_number"
                name="guarantor_phone_number"
                value={formData.guarantor_phone_number}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guarantor_address">Guarantor Address (optional)</Label>
              <Input
                id="guarantor_address"
                name="guarantor_address"
                value={formData.guarantor_address}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image (optional)</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agreement_form_image">Agreement Form Image (optional)</Label>
              <Input
                id="agreement_form_image"
                name="agreement_form_image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Salary Worker"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddSalaryWorker;