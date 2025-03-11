import React, { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useCreateAsset, type AssetData } from "../_api/apiService"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const AddAsset = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useCreateAsset()

  const [formData, setFormData] = useState<AssetData>({
    name: "",
    value: 0,
    expected_lifespan: "",
    is_still_available: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["assets"], refetchType: "active" })
        toast.success("Asset added successfully!")
        navigate("/admin/assets")
      },
      onError: () => {
        toast.error("Failed to add asset. Please try again.")
      },
    })
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add New Asset</CardTitle>
        </CardHeader>
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
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                name="value"
                type="number"
                value={formData.value}
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/dashboard/assets")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Asset"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default AddAsset
