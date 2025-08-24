import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import productionRecordsData from "@/data/ceo/project/production_records.json";

interface ProductionRecord {
  id: number;
  name: string;
  budget: string;
  cost: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductionRecord[];
}

interface FormValues {
  name: string;
  budget: string;
  cost?: string;
}

const saveProductionRecordsToJson = async (updatedRecords: any[]) => {
  // Placeholder for saving to JSON file
  return updatedRecords;
};

const fetchProductionRecords = async (projectId: string): Promise<ApiResponse> => {
  const projectRecords = productionRecordsData.find(p => p.projectId.toString() === projectId)?.records || [];
  return {
    count: projectRecords.length,
    next: null,
    previous: null,
    results: projectRecords,
  };
};

const OtherProductionRecords = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ProductionRecord | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      budget: '',
      cost: '',
    },
  });

  const editForm = useForm<FormValues>({
    defaultValues: {
      name: '',
      budget: '',
      cost: '',
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['productionRecords', projectId],
    queryFn: () => fetchProductionRecords(projectId!),
    enabled: !!projectId,
  });

  const addRecordMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const projectRecords = productionRecordsData.find(p => p.projectId.toString() === projectId)?.records || [];
      const newRecord = {
        id: projectRecords.length + 1,
        name: values.name,
        budget: values.budget,
        cost: values.cost || "0",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updatedRecords = [...projectRecords, newRecord];
      const updatedData = productionRecordsData.map(p =>
        p.projectId.toString() === projectId ? { ...p, records: updatedRecords } : p
      );
      if (!updatedData.some(p => p.projectId.toString() === projectId)) {
        updatedData.push({ projectId: parseInt(projectId!), records: [newRecord] });
      }
      await saveProductionRecordsToJson(updatedData);
      return newRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionRecords', projectId] });
      setIsAddDialogOpen(false);
      form.reset();
      toast.success('Record added successfully!');
    },
    onError: (error) => {
      toast.error(`Error adding record: ${(error as Error).message}`);
    },
  });

  const editRecordMutation = useMutation({
    mutationFn: async (values: FormValues & { id: number }) => {
      const { id, ...data } = values;
      const projectRecords = productionRecordsData.find(p => p.projectId.toString() === projectId)?.records || [];
      const updatedRecords = projectRecords.map(record =>
        record.id === id ? { ...record, ...data, updated_at: new Date().toISOString() } : record
      );
      const updatedData = productionRecordsData.map(p =>
        p.projectId.toString() === projectId ? { ...p, records: updatedRecords } : p
      );
      await saveProductionRecordsToJson(updatedData);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionRecords', projectId] });
      setIsEditDialogOpen(false);
      editForm.reset();
      toast.success('Record updated successfully!');
    },
    onError: (error) => {
      toast.error(`Error updating record: ${(error as Error).message}`);
    },
  });

  const deleteRecordMutation = useMutation({
    mutationFn: async (id: number) => {
      const projectRecords = productionRecordsData.find(p => p.projectId.toString() === projectId)?.records || [];
      const updatedRecords = projectRecords.filter(record => record.id !== id);
      const updatedData = productionRecordsData.map(p =>
        p.projectId.toString() === projectId ? { ...p, records: updatedRecords } : p
      );
      await saveProductionRecordsToJson(updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionRecords', projectId] });
      setIsDeleteDialogOpen(false);
      toast.success('Record deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Error deleting record: ${(error as Error).message}`);
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!projectId) {
      toast.error('Project ID is missing. Cannot create record.');
      return;
    }
    const payload: any = { ...values, project: projectId };
    if (!payload.cost) delete payload.cost;
    if (!payload.budget) delete payload.budget;
    addRecordMutation.mutate(payload);
  };

  const onEditSubmit = (values: FormValues) => {
    if (selectedRecord) {
      const payload = { ...values };
      if (!payload.cost) delete payload.cost;
      editRecordMutation.mutate({ id: selectedRecord.id, ...payload });
    }
  };

  const handleEdit = (record: ProductionRecord) => {
    setSelectedRecord(record);
    editForm.setValue('name', record.name);
    editForm.setValue('budget', record.budget);
    editForm.setValue('cost', record.cost);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (record: ProductionRecord) => {
    setSelectedRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRecord) {
      deleteRecordMutation.mutate(selectedRecord.id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const records = data?.results || [];

  return (
    <div className="p-2 sm:p-6 flex flex-col h-full bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold">Other Production Records</h1>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:flex-row sm:w-auto">
          <Button variant="outline" asChild>
            <Link to={`/project-manager/projects`}>Back to Projects</Link>
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add New Record</Button>
        </div>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No production records found. Add a new record to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {records.map((record) => (
            <Card key={record.id} className="overflow-hidden p-2 sm:p-2 text-sm">
              <CardHeader className="bg-blue-50 pb-1 px-2">
                <CardTitle className="text-base font-semibold">{record.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-2 pb-2">
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-medium text-xs">₦{record.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cost</p>
                    <p className="font-medium text-xs">₦{record.cost}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-1 mt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>Edit</Button>
                  {typeof window !== 'undefined' && (
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(record)}>Delete</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!addRecordMutation.isPending) {
          setIsAddDialogOpen(open);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Production Record</DialogTitle>
            <DialogDescription>Enter the details for the new production record.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Record name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input placeholder="Budget amount" type="number" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Actual cost" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={addRecordMutation.isPending}>
                  {addRecordMutation.isPending ? "Adding..." : "Add Record"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!editRecordMutation.isPending) {
          setIsEditDialogOpen(open);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Production Record</DialogTitle>
            <DialogDescription>Update the details for this production record.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Record name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input placeholder="Budget amount" type="number" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Actual cost" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={editRecordMutation.isPending}>
                  {editRecordMutation.isPending ? "Updating..." : "Update Record"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        if (!deleteRecordMutation.isPending) {
          setIsDeleteDialogOpen(open);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the production record "{selectedRecord?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteRecordMutation.isPending}>
              {deleteRecordMutation.isPending ? "Deleting..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OtherProductionRecords;