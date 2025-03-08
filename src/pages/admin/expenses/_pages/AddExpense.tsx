import type React from "react"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ExpenseData {
  name: string
  expense_category: string | null
  amount: number
  quantity: number
  description: string
  linked_project: string | null
  date: string
}

// Improved hook with proper loading state
const useCreateExpense = () => {
  const [isPending, setIsPending] = useState(false)
  
  const mutate = async (
    expenseData: ExpenseData,
    options?: {
      onSuccess?: () => void
      onError?: (error: any) => void
    }
  ) => {
    setIsPending(true)
    try {
      await axios.post("https://kidsdesigncompany.pythonanywhere.com/api/expense/", expenseData)
      options?.onSuccess?.()
    } catch (error) {
      options?.onError?.(error)
    } finally {
      setIsPending(false)
    }
  }
  
  return { mutate, isPending }
}

const AddExpense = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useCreateExpense()
  
  const [formData, setFormData] = useState<ExpenseData>({
    name: "",
    expense_category: null,
    amount: 0,
    quantity: 1,
    description: "",
    linked_project: null,
    date: new Date().toISOString().split('T')[0]
  })

  // Improved handler that correctly processes inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    
    if (name === "amount" || name === "quantity") {
      // For number fields, allow direct input but convert to number
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value)
      }))
    } else {
      // For text fields
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validation
    if (!formData.name.trim()) {
      toast.error("Please enter an expense name")
      return
    }
    
    if (formData.amount <= 0) {
      toast.error("Amount must be greater than zero")
      return
    }
    
    if (formData.quantity <= 0) {
      toast.error("Quantity must be greater than zero")
      return
    }
    
    // Submit the form
    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["expenses"] })
        toast.success("Expense added successfully!")
        navigate("/admin/dashboard/expenses")
      },
      onError: (error) => {
        console.error("Failed to add expense:", error)
        toast.error("Failed to add expense. Please try again.")
      },
    })
  }

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add New Expense</h1>
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
            type="text" 
            inputMode="decimal"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            pattern="[0-9]*\.?[0-9]+"
            placeholder="Enter amount"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity:</Label>
          <Input
            type="text"
            inputMode="numeric"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            pattern="[0-9]+"
            placeholder="Enter quantity"
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
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Expense"}
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

export default AddExpense