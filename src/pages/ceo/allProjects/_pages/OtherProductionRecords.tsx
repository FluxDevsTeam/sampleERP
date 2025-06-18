import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
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

// Base URL for API requests
const BASE_URL = 'https://backend.kidsdesigncompany.com/api';

// Define the type for a production record
interface ProductionRecord {
  id: number;
  name: string;
  budget: string;
  cost: string;
  created_at: string;
  updated_at: string;
}

// Define the type for the API response
interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductionRecord[];
}

// Fetch production records from the API
const fetchProductionRecords = async (projectId: string): Promise<ApiResponse> => {
  const response = await axios.get(`${BASE_URL}/project/${projectId}/other-production-record/`);
  return response.data;
};

// Form values interface
interface FormValues {
  name: string;
  budget: string;
  cost: string;
}

const OtherProductionRecords = () => {
  const { projectId } = useParams<{ projectId: string }>(); // Change to string
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

  // Fetch records
  const { data, isLoading, error } = useQuery({
    queryKey: ['productionRecords', projectId],
    queryFn: () => fetchProductionRecords(projectId!),
    enabled: !!projectId,
  });

  // Add record mutation
  const addRecordMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await axios.post(`${BASE_URL}/project/${projectId}/other-production-record/`, values);
      return response.data;
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

  // Edit record mutation
  const editRecordMutation = useMutation({
    mutationFn: async (values: FormValues & { id: number }) => {
      const { id, ...data } = values;
      const response = await axios.patch(`${BASE_URL}/project/${projectId}/other-production-record/${id}/`, data);
      return response.data;
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

  // Delete record mutation
  const deleteRecordMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${BASE_URL}/project/${projectId}/other-production-record/${id}/`);
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

  // Handle form submission for adding a new record
  const onSubmit = (values: FormValues) => {
    addRecordMutation.mutate(values);
  };

  // Handle form submission for editing a record
  const onEditSubmit = (values: FormValues) => {
    if (selectedRecord) {
      editRecordMutation.mutate({ id: selectedRecord.id, ...values });
    }
  };

  // Handle edit button click
  const handleEdit = (record: ProductionRecord) => {
    setSelectedRecord(record);
    editForm.setValue('name', record.name);
    editForm.setValue('budget', record.budget);
    editForm.setValue('cost', record.cost);
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (record: ProductionRecord) => {
    setSelectedRecord(record);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    if (selectedRecord) {
      deleteRecordMutation.mutate(selectedRecord.id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const records = data?.results || [];

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Other Production Records</h1>
          <p className="text-gray-500">Project ID: {projectId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/ceo/projects`}>Back to Projects</Link>
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add New Record
          </Button>
        </div>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No production records found. Add a new record to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <Card key={record.id} className="overflow-hidden">
              <CardHeader className="bg-blue-50 pb-2">
                <CardTitle>{record.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-medium">₦{record.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cost</p>
                    <p className="font-medium">₦{record.cost}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(record)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Record Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onOpenChange={(open) => {
          // Only allow closing if not in the middle of submitting
          if (!addRecordMutation.isPending) {
            setIsAddDialogOpen(open);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Production Record</DialogTitle>
            <DialogDescription>
              Enter the details for the new production record.
            </DialogDescription>
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
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input placeholder="Actual cost" type="number" {...field} required />
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

      {/* Edit Record Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          if (!editRecordMutation.isPending) {
            setIsEditDialogOpen(open);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Production Record</DialogTitle>
            <DialogDescription>
              Update the details for this production record.
            </DialogDescription>
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
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input placeholder="Actual cost" type="number" {...field} required />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          if (!deleteRecordMutation.isPending) {
            setIsDeleteDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the
              production record "{selectedRecord?.name}".
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