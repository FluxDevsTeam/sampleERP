import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define types for Project data
interface CustomerDetail {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
  invoice_image: string | null;
  status: string;
  start_date: string;
  deadline: string | null;
  date_delivered: string | null;
  is_delivered: boolean;
  archived: boolean;
  customer_detail: CustomerDetail;
  selling_price: string;
  logistics: string;
  service_charge: string;
  note: string | null;
}

// Interface for customers
interface Customer {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
  address?: string;
}

// Interface for API error response
interface ApiErrorResponse {
  [key: string]: string[];
}

const EditProject = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Project form state
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    start_date: "",
    deadline: "",
    date_delivered: "",
    is_delivered: false,
    archived: false,
    customer_detail: "",
    selling_price: "",
    logistics: "",
    service_charge: "",
    note: "",
  })

  // Loading, error, and validation states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [errorDetails, setErrorDetails] = useState<ApiErrorResponse>({})
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)

  // Fetch project data
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await axios.get(`https://kidsdesigncompany.pythonanywhere.com/api/project/${id}/`)
      return response.data
    },
    enabled: !!id,
  })

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoadingCustomers(true)
      try {
        const response = await axios.get('https://kidsdesigncompany.pythonanywhere.com/api/customer/')
        
        // Extract customers from the nested structure (similar to AddProject)
        if (response.data && response.data.results && response.data.results.all_customers) {
          setCustomers(response.data.results.all_customers)
        } else {
          // Fallback to mock data if API structure is unexpected
          console.error("Unexpected API response structure:", response.data)
          
          // Use mock data as fallback (same as in the original component)
          setCustomers([
            { id: 1, name: "Adebayo Jubreel" },
            { id: 2, name: "Julius Caesar" },
            { id: 3, name: "Martha Ayodele" },
            { id: 4, name: "Smith Wigglesworth" },
            { id: 5, name: "iyegere" },
            { id: 6, name: "john cena" },
            { id: 7, name: "suskidee" },
          ])
        }
      } catch (error) {
        console.error("Error fetching customers:", error)
        // Use mock data if API fails
        setCustomers([
          { id: 1, name: "Adebayo Jubreel" },
          { id: 2, name: "Julius Caesar" },
          { id: 3, name: "Martha Ayodele" },
          { id: 4, name: "Smith Wigglesworth" },
          { id: 5, name: "iyegere" },
          { id: 6, name: "john cena" },
          { id: 7, name: "suskidee" },
        ])
      } finally {
        setIsLoadingCustomers(false)
      }
    }

    fetchCustomers()
  }, [])

  // Update form when project data is loaded
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        status: project.status || "",
        start_date: project.start_date || "",
        deadline: project.deadline || "",
        date_delivered: project.date_delivered || "",
        is_delivered: project.is_delivered || false,
        archived: project.archived || false,
        customer_detail: project.customer_detail?.id.toString() || "",
        selling_price: project.selling_price || "",
        logistics: project.logistics || "",
        service_charge: project.service_charge || "",
        note: project.note || "",
      })
    }
  }, [project])

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (updatedProject: any) => {
      return axios.put(`https://kidsdesigncompany.pythonanywhere.com/api/project/${id}/`, updatedProject)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["project", id] })
      navigate("/ceo/projects")
      toast.success("Project updated successfully!")
    },
    onError: (error: any) => {
      console.error("Update error:", error)
      
      // Handle specific API error responses
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'object') {
          setErrorDetails(error.response.data)
          
          // Create a readable error message
          const errorMessages = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ')
          
          setFormError(`Validation error: ${errorMessages}`)
        } else {
          setFormError("Failed to update project. Please check your data and try again.")
        }
      } else {
        setFormError("Failed to update project. Please try again.")
      }
      
      toast.error("Failed to update project. Please check the form for errors.")
      setIsSubmitting(false)
    }
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle customer change
  const handleCustomerChange = (value: string) => {
    setFormData({
      ...formData,
      customer_detail: value,
    })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError("")
    setErrorDetails({})

    // Validate form
    if (!formData.name || !formData.customer_detail) {
      setFormError("Please fill out all required fields")
      setIsSubmitting(false)
      return
    }

    // Prepare data for submission (matching API format)
    const projectData = {
      name: formData.name,
      status: formData.status,
      start_date: formData.start_date,
      deadline: formData.deadline || null,
      date_delivered: formData.is_delivered ? formData.date_delivered : null,
      is_delivered: formData.is_delivered,
      archived: formData.archived,
      // Use "customer" instead of "customer_detail" to match the API
      customer: parseInt(formData.customer_detail),
      selling_price: formData.selling_price,
      logistics: formData.logistics,
      service_charge: formData.service_charge,
      note: formData.note,
    }

    updateProjectMutation.mutate(projectData)
  }

  if (isLoading) return <p className="p-4">Loading project data...</p>
  if (error) return <p className="p-4">Error: {(error as Error).message}</p>

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>Update the details for the selected project.</CardDescription>
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
              <Label htmlFor="name">Project Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
                className={errorDetails.name ? "border-red-500" : ""}
              />
              {errorDetails.name && (
                <p className="text-sm text-red-500">{errorDetails.name.join(', ')}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer_detail">Customer*</Label>
              <Select 
  value={formData.customer_detail}
  onValueChange={handleCustomerChange}
  disabled={isLoadingCustomers}
>
  <SelectTrigger className={errorDetails.customer ? "border-red-500" : ""}>
    <SelectValue placeholder="Select a customer" />
  </SelectTrigger>
  <SelectContent>
    {isLoadingCustomers ? (
      <SelectItem value="loading" disabled>
        Loading customers...
      </SelectItem>
    ) : customers.length > 0 ? (
      customers.map((customer) => (
        <SelectItem key={customer.id} value={customer.id.toString()}>
          {customer.name}
        </SelectItem>
      ))
    ) : (
      <SelectItem value="no-customers" disabled>
        No customers found
      </SelectItem>
    )}
  </SelectContent>
</Select>
              {errorDetails.customer && (
                <p className="text-sm text-red-500">{errorDetails.customer.join(', ')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className={errorDetails.status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {errorDetails.status && (
                <p className="text-sm text-red-500">{errorDetails.status.join(', ')}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date*</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className={errorDetails.start_date ? "border-red-500" : ""}
                />
                {errorDetails.start_date && (
                  <p className="text-sm text-red-500">{errorDetails.start_date.join(', ')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={errorDetails.deadline ? "border-red-500" : ""}
                />
                {errorDetails.deadline && (
                  <p className="text-sm text-red-500">{errorDetails.deadline.join(', ')}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="selling_price">Selling Price (₦)*</Label>
                <Input
                  id="selling_price"
                  name="selling_price"
                  type="number"
                  value={formData.selling_price}
                  onChange={handleChange}
                  required
                  className={errorDetails.selling_price ? "border-red-500" : ""}
                />
                {errorDetails.selling_price && (
                  <p className="text-sm text-red-500">{errorDetails.selling_price.join(', ')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_delivered">Date Delivered</Label>
                <Input
                  id="date_delivered"
                  name="date_delivered"
                  type="date"
                  value={formData.date_delivered}
                  onChange={handleChange}
                  disabled={!formData.is_delivered}
                  className={errorDetails.date_delivered ? "border-red-500" : ""}
                />
                {errorDetails.date_delivered && (
                  <p className="text-sm text-red-500">{errorDetails.date_delivered.join(', ')}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logistics">Logistics Cost (₦)</Label>
                <Input
                  id="logistics"
                  name="logistics"
                  type="number"
                  value={formData.logistics}
                  onChange={handleChange}
                  className={errorDetails.logistics ? "border-red-500" : ""}
                />
                {errorDetails.logistics && (
                  <p className="text-sm text-red-500">{errorDetails.logistics.join(', ')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service_charge">Service Charge (₦)</Label>
                <Input
                  id="service_charge"
                  name="service_charge"
                  type="number"
                  value={formData.service_charge}
                  onChange={handleChange}
                  className={errorDetails.service_charge ? "border-red-500" : ""}
                />
                {errorDetails.service_charge && (
                  <p className="text-sm text-red-500">{errorDetails.service_charge.join(', ')}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                name="note"
                value={formData.note || ""}
                onChange={handleChange}
                placeholder="Add any notes about this project"
                rows={3}
                className={errorDetails.note ? "border-red-500" : ""}
              />
              {errorDetails.note && (
                <p className="text-sm text-red-500">{errorDetails.note.join(', ')}</p>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="is_delivered"
                  checked={formData.is_delivered}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("is_delivered", checked as boolean)
                  }
                />
                <Label htmlFor="is_delivered">Project is delivered</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="archived"
                  checked={formData.archived}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("archived", checked as boolean)
                  }
                />
                <Label htmlFor="archived">Archive this project</Label>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/ceo/projects")}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || updateProjectMutation.isPending}
            >
              {isSubmitting || updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default EditProject