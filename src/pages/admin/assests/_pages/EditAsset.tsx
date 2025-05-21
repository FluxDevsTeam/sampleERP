import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Asset } from "../_api/apiService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner";
import SkeletonLoader from "../_components/SkeletonLoader"
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const EditAsset = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Asset form state
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    expected_lifespan: "",
    is_still_available: true,
  })

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  // Fetch asset data
  const { data: asset, isLoading, error } = useQuery<Asset>({
    queryKey: ["asset", id],
    queryFn: async () => {
      const response = await axios.get(`https://kidsdesigncompany.pythonanywhere.com/api/assets/${id}/`)
      return response.data
    },
    enabled: !!id,
  })

  // Update form when asset data is loaded
  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || "",
        value: asset.value?.toString() || "",
        expected_lifespan: asset.expected_lifespan || "",
        is_still_available: asset.is_still_available || false,
      })
    }
  }, [asset])

  // Update asset mutation
  const updateAssetMutation = useMutation({
    mutationFn: async (updatedAsset: Partial<Asset>) => {
      return axios.put(`https://kidsdesigncompany.pythonanywhere.com/api/assets/${id}/`, updatedAsset)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] })
      queryClient.invalidateQueries({ queryKey: ["asset", id] })
      navigate("/admin/assets")
      toast.success("Assets updated successfully!");
    },
    onError: (error) => {
      setFormError("Failed to update asset. Please try again.")
       toast.error("Failed to update asset. Please try again.");
      console.error("Update error:", error)
      setIsSubmitting(false)
    }
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_still_available: checked,
    })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError("")

    // Validate form
    if (!formData.name || !formData.value || !formData.expected_lifespan) {
      setFormError("Please fill out all required fields")
      setIsSubmitting(false)
      return
    }

    // Prepare data for submission
    const assetData = {
      name: formData.name,
      value: parseFloat(formData.value),
      expected_lifespan: formData.expected_lifespan,
      is_still_available: formData.is_still_available,
    }

    updateAssetMutation.mutate(assetData)
  }

  if (isLoading) return <p className="p-4"><SkeletonLoader/> </p>
  if (error) return <p className="p-4">Error: {(error as Error).message}</p>

  return (
    <div className="container mx-auto p-4 max-w-2xl">
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
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="is_still_available"
                checked={formData.is_still_available}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_still_available">Asset is still available</Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/assets")}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || updateAssetMutation.isPending}
            >
              {isSubmitting || updateAssetMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default EditAsset