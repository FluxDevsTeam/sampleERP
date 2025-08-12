import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import SearchableCategoryDropdown from "./SearchableCategoryDropdown";

interface IncomeEntry {
  id: number;
  name: string;
  amount: number;
  cash: boolean;
  date: string;
  category?: { id: string; name: string } | null;
}

interface IncomeFormData {
  name: string;
  amount: string;
  cash: boolean;
  date: string;
  category: string | null;
}

interface EditIncomeModalProps {
  entry: IncomeEntry;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditIncomeModal: React.FC<EditIncomeModalProps> = ({ entry, isOpen, onOpenChange, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<IncomeFormData>({
    name: "",
    amount: "",
    cash: true,
    date: "",
    category: null,
  });
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [categoryRefreshTrigger, setCategoryRefreshTrigger] = useState(0);
  // Category actions handled inside CategoryDropdown

  useEffect(() => {
    if (!entry) return;
    setFormData({
      name: entry.name || "",
      amount: String(entry.amount ?? ""),
      cash: !!entry.cash,
      date: entry.date ? new Date(entry.date).toISOString().split("T")[0] : "",
      category: entry.category?.id ?? null,
    });
  }, [entry]);

  const mutation = useMutation({
    mutationFn: async (data: IncomeFormData) => {
      const token = localStorage.getItem("accessToken");
      const payload: any = {
        name: data.name,
        amount: Number(data.amount),
        cash: data.cash,
        date: data.date,
        category: data.category,
      };
      console.log("[Income] PATCH payload:", payload);
      // If category isn't a UUID, try to resolve by name
      const isUuid = (value: string | null | undefined) => !!value && /^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$/.test(value);
      if (!isUuid(payload.category) && typeof payload.category === 'string') {
        try {
          const res = await axios.get("https://backend.kidsdesigncompany.com/api/income-category/", {
            params: { search: payload.category },
            headers: { Authorization: `JWT ${token}` },
          });
          const results = res.data?.results || res.data || [];
          const first = Array.isArray(results) ? results.find((it: any) => (it?.name ?? '') === payload.category) || results[0] : null;
          const id = String(first?.id ?? first?.uuid ?? first?.pk ?? "");
          if (id) {
            payload.category = id;
            console.log('[Income] Resolved category name to id (edit):', { name: data.category, id });
          }
        } catch (e) {
          console.error('[Income] resolveCategoryIdByName (edit) error:', e);
        }
      }
      try {
        const res = await axios.patch(`https://backend.kidsdesigncompany.com/api/income/${entry.id}/`, payload, {
          headers: { Authorization: `JWT ${token}` },
        });
        console.log("[Income] PATCH response:", { status: res.status, data: res.data });
      } catch (error: any) {
        console.error("[Income] PATCH error:", {
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Income updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["income"] });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update income.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Edit Income</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input id="amount" name="amount" type="number" value={formData.amount} onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))} required />
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
              <Input id="date" name="date" type="date" value={formData.date} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} className="w-full" required />
            </div>
          </div>

          <SearchableCategoryDropdown
            endpoint="https://backend.kidsdesigncompany.com/api/income-category/"
            label="Category"
            name="category"
            resultsKey={undefined}
            onChange={(_field, val) => {
              const value = val && val !== 'undefined' && val !== '' ? val : null;
              setFormData((p) => ({ ...p, category: value }));
            }}
            selectedValue={formData.category}
            selectedName={entry?.category?.name || null}
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
                    <Label htmlFor="newIncomeCategoryEdit">Category Name</Label>
                    <Input id="newIncomeCategoryEdit" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
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
            <Button type="submit" disabled={mutation.isPending || !formData.category}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditIncomeModal;


