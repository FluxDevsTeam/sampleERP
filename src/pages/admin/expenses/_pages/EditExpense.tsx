import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ExpenseData {
  id?: number
  name: string
  expense_category: string | null
  amount: number
  quantity: number
  description: string
  linked_project: string | null
  date: string
}

const fetchExpense = async (id: string): Promise<ExpenseData> => {
  const { data } = await axios.get<ExpenseData>(
    `https://kidsdesigncompany.pythonanywhere.com/api/expense/${id}/`
  )
  return data
}

const EditExpense = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState<ExpenseData>({
    name: "",
    expense_category: null,
    amount: 0,
    quantity: 1,
    description: "",
    linked_project: null,
    date: new Date().toISOString().split('T')[0]
  })

  // Fetch the expense data
  const { data: expense, isLoading, error } = useQuery({
    queryKey: ["expense", id],
    queryFn: () => fetchExpense(id as string),
    enabled: !!id
  })

  // Update the expense data
  const updateMutation = useMutation({
    mutationFn: (data: ExpenseData) => 
      axios.put(`https://kidsdesigncompany.pythonanywhere.com/api/expense/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      queryClient.invalidateQueries({ queryKey: ["expense", id] })
      toast.success("Expense updated successfully!")
      navigate("/admin/dashboard/expenses")
    },
    onError: (error) => {
      console.error("Failed to update expense:", error)
      toast.error("Failed to update expense. Please try again.")
    }
  })

  // Populate form when data is loaded
  useEffect(() => {
    if (expense) {
      setFormData({
        ...expense,
        // Ensure numeric values are treated as numbers
        amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount,
        quantity: typeof expense.quantity === 'string' ? parseFloat(expense.quantity) : expense.quantity,
        // Ensure date is in the right format
        date: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0]
      })
    }
  }, [expense])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium text-gray-600">Loading expense data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-xl font-bold text-red-500">Error loading expense</h2>
        <p>Failed to load expense details. Please try again later.</p>
        <Button 
          className="mt-4"
          onClick={() => navigate("/admin/dashboard/expenses")}
        >
          Return to Expenses
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit Expense</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name:</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Date:</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount:</Label>
          <Input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity:</Label>
          <Input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description:</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="min-h-24"
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            className="bg-neutral-900 text-white hover:bg-neutral-800"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Update Expense"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/dashboard/expenses")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditExpense