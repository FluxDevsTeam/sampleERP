

import type React from "react"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useCreateAsset, type AssetData } from "../_api/apiService"
import { toast } from "sonner" // ✅ Import Sonner toast

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

        // ✅ Success toast notification
        toast.success("Asset added successfully!")

        navigate("/admin/dashboard/assets")
      },
      onError: (error) => {
        console.error("Failed to add asset:", error)

        // ❌ Error toast notification
        toast.error("Failed to add asset. Please try again.")
      },
    })
  }

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add New Asset</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Value:</label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Expected Lifespan:</label>
          <input
            type="text"
            name="expected_lifespan"
            value={formData.expected_lifespan}
            onChange={handleChange}
            className="w-full border p-2 rounded"
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
          <label htmlFor="is_still_available" className="font-medium">
            Available
          </label>
        </div>

        <button
          type="submit"
          className="bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Asset"}
        </button>
      </form>
    </div>
  )
}

export default AddAsset
