import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBalanceSwitch, BalanceSwitch } from '../_api/balanceSwitchService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditBalanceSwitchModalProps {
  balanceSwitch: BalanceSwitch;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const formSchema = z.object({
  from_method: z.enum(['CASH', 'BANK', 'DEBT']),
  to_method: z.enum(['CASH', 'BANK', 'DEBT']),
  amount: z.string().min(1, 'Amount is required'),
  switch_date: z.string().optional(),
}).refine(data => data.from_method !== data.to_method, {
  message: "From and To methods cannot be the same",
  path: ["to_method"], // Show error on the to_method field
});

type FormValues = z.infer<typeof formSchema>;

const EditBalanceSwitchModal: React.FC<EditBalanceSwitchModalProps> = ({ balanceSwitch, isOpen, onOpenChange, onSuccess }) => {
  const queryClient = useQueryClient();
  const currentUserRole = localStorage.getItem('user_role');
  const isCeo = currentUserRole === 'ceo';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_method: balanceSwitch.from_method,
      to_method: balanceSwitch.to_method,
      amount: balanceSwitch.amount.toString(),
      switch_date: balanceSwitch.switch_date,
    },
  });

  // Update form values when balanceSwitch changes
  useEffect(() => {
    form.reset({
      from_method: balanceSwitch.from_method,
      to_method: balanceSwitch.to_method,
      amount: balanceSwitch.amount.toString(),
      switch_date: balanceSwitch.switch_date,
    });
  }, [balanceSwitch, form]);

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) => updateBalanceSwitch(balanceSwitch.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance-switches'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['income-summary'] });
      onOpenChange(false);
      toast.success('Balance switch updated successfully!');
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Failed to update balance switch. Please try again.');
    },
  });

  const onSubmit = (data: FormValues) => {
    // Convert amount to a number with 2 decimal places
    const formattedData = {
      ...data,
      amount: parseFloat(data.amount).toFixed(2),
    };
    updateMutation.mutate(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edit Balance Switch</DialogTitle>
          <DialogDescription className="text-sm">Update the balance switch record.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="from_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="BANK">Bank</SelectItem>
                        <SelectItem value="DEBT">Debt</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="to_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="BANK">Bank</SelectItem>
                        <SelectItem value="DEBT">Debt</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₦)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) => {
                        // Ensure only positive numbers
                        const value = e.target.value;
                        if (value === '' || parseFloat(value) >= 0) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
                control={form.control}
                name="switch_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <DialogFooter>
              <div className="flex justify-end gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-1/3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-2/3"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBalanceSwitchModal;