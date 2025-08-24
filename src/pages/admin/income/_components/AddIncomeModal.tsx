import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import SearchableCategoryDropdown from "./SearchableCategoryDropdown";
import incomeSummary from '@/data/admin/income/incomeSummary.json';
import incomeCategories from '@/data/admin/income/incomeCategories.json';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface IncomeFormData {
  name: string;
  amount: string;
  cash: boolean;
  date: string;
  category: string | null;
}

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<IncomeFormData>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayFormatted = `${year}-${month}-${day}`;
    return {
      name: "",
      amount: "",
      cash: true,
      date: todayFormatted,
      category: null,
    };
  });

  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
    setUserRole(localStorage.getItem("user_role"));
  }, []);

  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [categoryRefreshTrigger, setCategoryRefreshTrigger] = useState(0);

  const resolveCategoryIdByName = async (name: string): Promise<string | null> => {
    const category = incomeCategories.find((cat) => cat.name === name);
    return category ? category.id : null;
  };

  const addIncomeMutation = useMutation({
    mutationFn: async (payload: IncomeFormData) => {
      const formatted: any = {
        name: payload.name,
        amount: Number(payload.amount),
        cash: payload.cash,
        date: payload.date,
        category: payload.category,
      };

      if (typeof formatted.category === 'string' && !incomeCategories.some((cat) => cat.id === formatted.category)) {
        const resolvedId = await resolveCategoryIdByName(formatted.category);
        if (resolvedId) {
          formatted.category = resolvedId;
        } else {
          toast.error('Invalid category. Please select a valid category.');
          throw new Error('Category ID resolution failed');
        }
      }

      // Simulate adding to JSON
      const newId = (incomeSummary.daily_data.flatMap((d) => d.entries).length + 1);
      const newEntry = { id: newId, ...formatted };
      const dateEntry = incomeSummary.daily_data.find((d) => d.date === payload.date) || {
        date: payload.date,
        entries: [],
        daily_total: 0,
      };
      dateEntry.entries.unshift(newEntry);
      dateEntry.daily_total = (dateEntry.daily_total || 0) + Number(payload.amount);
      if (!incomeSummary.daily_data.includes(dateEntry)) {
        incomeSummary.daily_data.unshift(dateEntry);
      }
      incomeSummary.daily_data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return newEntry;
    },
    onSuccess: () => {
      toast.success("Income added successfully!");
      queryClient.invalidateQueries({ queryKey: ["income"] });
      onClose();
      setFormData((prev) => ({ ...prev, name: "", amount: "", cash: true, category: null }));
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add income.");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Income</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!formData.category) {
              toast.error("Please select a category");
              return;
            }
            addIncomeMutation.mutate(formData);
          }}
          className="p-2 sm:p-4 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cash">Payment Method</Label>
              <select
                id="cash"
                name="cash"
                value={formData.cash ? "cash" : "bank"}
                onChange={(e) => setFormData((p) => ({ ...p, cash: e.target.value === "cash" }))}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
              </select>
            </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                  className="w-full"
                  required
                />
              </div>
          </div>

          <SearchableCategoryDropdown
            endpoint="/data/admin/income/incomeCategories.json"
            label="Category"
            name="category"
            resultsKey={undefined}
            onChange={(_field, val) => {
              const value = val && val !== 'undefined' && val !== '' ? val : null;
              setFormData((p) => ({ ...p, category: value }));
            }}
            selectedValue={formData.category}
            refreshTrigger={categoryRefreshTrigger}
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">Create New</Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Create New Income Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="newIncomeCategory">Category Name</Label>
                    <Input id="newIncomeCategory" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCatDialogOpen(false)}>Cancel</Button>
                    <Button
                      type="button"
                      disabled={catActionLoading || !newCatName.trim()}
                      onClick={async () => {
                        if (!newCatName.trim()) return;
                        setCatActionLoading(true);
                        try {
                          const newId = `cat-${incomeCategories.length + 1}`;
                          incomeCategories.unshift({ id: newId, name: newCatName.trim() });
                          setFormData((p) => ({ ...p, category: newId }));
                          toast.success('Category created');
                          setIsCatDialogOpen(false);
                          setNewCatName('');
                          setCategoryRefreshTrigger(prev => prev + 1);
                        } catch (err: any) {
                          toast.error(err?.message || 'Failed to create category');
                        } finally {
                          setCatActionLoading(false);
                        }
                      }}
                    >
                      {catActionLoading ? 'Creating...' : 'Create'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={!formData.category || catActionLoading}
              onClick={async () => {
                if (!formData.category) return;
                if (!confirm('Delete this category? This cannot be undone.')) return;
                setCatActionLoading(true);
                try {
                  const index = incomeCategories.findIndex((cat) => cat.id === formData.category);
                  if (index === -1) throw new Error('Category not found');
                  incomeCategories.splice(index, 1);
                  toast.success('Category deleted');
                  setFormData((p) => ({ ...p, category: null }));
                  setCategoryRefreshTrigger(prev => prev + 1);
                } catch (err: any) {
                  toast.error(err?.message || 'Failed to delete category');
                } finally {
                  setCatActionLoading(false);
                }
              }}
            >
              Delete
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addIncomeMutation.isPending || !formData.category}>
              {addIncomeMutation.isPending ? "Adding..." : "Add Income"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncomeModal;