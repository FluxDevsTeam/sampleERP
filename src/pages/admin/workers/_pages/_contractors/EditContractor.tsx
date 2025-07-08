import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
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

const EditContractor = () => {
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
    date_joined: "",
    date_left: "",
    guarantor_name: "",
    guarantor_phone_number: "",
    guarantor_address: "",
    is_still_active: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [agreementFormImage, setAgreementFormImage] = useState<File | null>(null);
  const [originalData, setOriginalData] = useState<any>(null);

  // Fetch the contractor data to populate the form
  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`https://backend.kidsdesigncompany.com/api/contractors/${id}/`, {
          headers: { Authorization: `JWT ${token}` },
        });
        const normalized = {
          ...response.data,
          date_joined: response.data.date_joined ? response.data.date_joined.slice(0, 10) : "",
          date_left: response.data.date_left ? response.data.date_left.slice(0, 10) : "",
        };
        setFormData(normalized);
        setOriginalData(normalized);
      } catch (error) {
        toast.error("Failed to fetch contractor data.");
      }
    };

    fetchContractor();
  }, [id]);

  const isChanged = () => {
    if (!originalData) return false;
    for (const key in formData) {
      if (formData[key as keyof typeof formData] !== originalData[key]) {
        return true;
      }
    }
    if (image || agreementFormImage) return true;
    return false;
  };

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
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (originalData && value !== originalData[key]) {
          data.append(key, value as string);
        }
      });
      if (image) data.append("image", image);
      if (agreementFormImage) data.append("agreement_form_image", agreementFormImage);
      const token = localStorage.getItem("accessToken");
      await axios.patch(`https://backend.kidsdesigncompany.com/api/contractors/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `JWT ${token}`,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["contractors"], refetchType: "active" });
      toast.success("Contractor updated successfully!");
      navigate("/admin/workers");
    } catch (error) {
      toast.error("Failed to update contractor. Please try again.");
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
          <CardTitle>Edit Contractor</CardTitle>
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
            {/* Years of Experience/Date Joined/Date Left */}
            <div className="space-y-2">
              <Label htmlFor="years_of_experience">Years of Experience (optional)</Label>
              <Input id="years_of_experience" name="years_of_experience" type="number" value={formData.years_of_experience} onChange={handleChange} />
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
              {isPending ? "Updating..." : "Update Contractor"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditContractor;