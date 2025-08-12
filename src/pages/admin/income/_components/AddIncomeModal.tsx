import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
// import CategoryDropdown from "./Category";
import SearchableCategoryDropdown from "./SearchableCategoryDropdown";

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
  category: string | null; // uuid
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

  // Income category create/delete controls
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [categoryRefreshTrigger, setCategoryRefreshTrigger] = useState(0);

  // No local quick actions; handled by CategoryDropdown component

  const isUuid = (value: string | null | undefined) => !!value && /^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$/.test(value);
  const isNumericId = (value: string | null | undefined) => !!value && /^\d+$/.test(value);

  const resolveCategoryIdByName = async (name: string): Promise<string | null> => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get("https://backend.kidsdesigncompany.com/api/income-category/", {
        params: { search: name },
        headers: { Authorization: `JWT ${token}` },
      });
      const results = res.data?.results || res.data || [];
      const first = Array.isArray(results) ? results.find((it: any) => (it?.name ?? '') === name) || results[0] : null;
      const id = String(first?.id ?? first?.uuid ?? first?.pk ?? "");
      return id || null;
    } catch (e) {
      console.error("[Income] resolveCategoryIdByName error:", e);
      return null;
    }
  };

  const addIncomeMutation = useMutation({
    mutationFn: async (payload: IncomeFormData) => {
      const token = localStorage.getItem("accessToken");
      const formatted: any = {
        name: payload.name,
        amount: Number(payload.amount),
        cash: payload.cash,
        date: payload.date,
        category: payload.category,
      };
      console.log("[Income] POST payload:", formatted);
      console.log("[Income] Category value being sent:", payload.category, typeof payload.category);
      console.log("[Income] POST headers:", { Authorization: `JWT ${token?.slice(0, 10)}...` });

      // Ensure category is an ID we can send. If UUID or numeric, use as-is.
      if (
        typeof formatted.category === 'string' &&
        !isUuid(formatted.category) &&
        !isNumericId(formatted.category)
      ) {
        // Looks like a name; try to resolve to an id
        const resolvedId = await resolveCategoryIdByName(formatted.category);
        if (resolvedId) {
          formatted.category = resolvedId;
          console.log('[Income] Resolved category name to id:', { name: payload.category, id: resolvedId });
        } else {
          toast.error('Unable to resolve category ID. Please ensure categories API returns IDs or select a valid category.');
          throw new Error('Category ID resolution failed');
        }
      }

      try {
        const response = await axios.post(
          "https://backend.kidsdesigncompany.com/api/income/",
          formatted,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );
        console.log("[Income] POST response:", { status: response.status, data: response.data });
        return response.data;
      } catch (error: any) {
        console.error("[Income] POST error:", {
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
          headers: error?.response?.headers,
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Income added successfully!");
      queryClient.invalidateQueries({ queryKey: ["income"] });
      onClose();
      setFormData((prev) => ({ ...prev, name: "", amount: "", cash: true, category: null }));
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add income.");
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

            {userRole === "ceo" && (
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
            )}
          </div>

          <SearchableCategoryDropdown
            endpoint="https://backend.kidsdesignCompany.com/api/income-category/"
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
                          const token = localStorage.getItem('accessToken');
                          const res = await axios.post(
                            'https://backend.kidsdesigncompany.com/api/income-category/',
                            { name: newCatName.trim() },
                            { headers: { Authorization: `JWT ${token}` } }
                          );
                          const created = res.data || {};
                          const createdId = String(created?.id ?? created?.uuid ?? created?.pk ?? created?.name ?? '');
                          if (createdId) {
                            setFormData((p) => ({ ...p, category: createdId }));
                            toast.success('Category created');
                            setIsCatDialogOpen(false);
                            setNewCatName('');
                            setCategoryRefreshTrigger(prev => prev + 1);
                          } else {
                            toast.error('Created category but no identifier returned');
                          }
                        } catch (err: any) {
                          toast.error(err?.response?.data?.message || 'Failed to create category');
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
                  const token = localStorage.getItem('accessToken');
                  await axios.delete(
                    `https://backend.kidsdesigncompany.com/api/income-category/${formData.category}/`,
                    { headers: { Authorization: `JWT ${token}` } }
                  );
                  toast.success('Category deleted');
                  setFormData((p) => ({ ...p, category: null }));
                  setCategoryRefreshTrigger(prev => prev + 1);
                } catch (err: any) {
                  toast.error(err?.response?.data?.message || 'Failed to delete category');
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


