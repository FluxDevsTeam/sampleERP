import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2} from 'lucide-react';
import { toast } from "sonner";


// Role options constant
const roleOptions = [
  "shopkeeper",
  "project_manager", 
  "factory_manager",
  "ceo",
  "admin",
  "storekeeper"
];

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  roles: string[];
}

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  roles: string[];
}

interface ApiResponse {
  results: User[];
}

const ProfileManagement = () => {
  const API_URL = 'https://backend.kidsdesigncompany.com/auth/signup/';
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    roles: []
  });
  


  const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
    queryKey: ['users'],
    queryFn: async () => {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get<ApiResponse>(API_URL, {
        headers: {
          'Authorization': `JWT ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    },
    retry: 3,
  });

 

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      roles: user.roles && user.roles.length > 0 ? user.roles : [""]
    });
  };

  const handleUpdate = async () => {
    if (!editingUser) {
      console.error('No user selected for editing');
      return;
    }
setIsSaving(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      await axios.put(`${API_URL}${editingUser.id}/`, formData, {
        headers: {
          'Authorization': `JWT ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      setEditingUser(null);
      refetch();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Failed to update profile!");
    }
    finally {
    setIsSaving(false); 
  }
  };

  const handleDelete = async () => {
    if (!deleteUserId) {
      console.error('No user ID selected for deletion');
      return;
    }

    try {
      const accessToken = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}${deleteUserId}/`, {
        headers: {
          'Authorization': `JWT ${accessToken}`,
        }
      });
      setDeleteUserId(null);
      refetch();
      toast.success("Profile deleted successfully!");
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete profile!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      roles: [value]
    }));
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <p>Error fetching users: {error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  );

  const getRoleBadgeColor = (role: string) : string => {
    switch (role) {
      case 'ceo': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'project_manager': return 'bg-green-100 text-green-800';
      case 'storekeeper': return 'bg-yellow-100 text-yellow-800';
      case 'factory_manager': return 'bg-orange-100 text-orange-800';
      case 'shopkeeper': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
     
    }
  };

  const formatRoleName = (role: string): string => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-800 mb-8">Profile Management</h1>
      
      <div className="rounded-md border my-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.results?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone_number || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2 text-center flex-wrap  truncate text-ellipsis overflow-hidden
            max-w-full px-2 py-0.5 text-xs">
                    {user.roles?.map((role, index) => (
                      <Badge key={index} className={getRoleBadgeColor(role)} >
                        {formatRoleName(role)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setDeleteUserId(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Modal */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
          
          
            
            {/* Roles Section */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Role
              </label>
              <Select 
                value={formData.roles[0] || ""} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {formatRoleName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </Button>
           <Button onClick={handleUpdate} disabled={isSaving}>
  {isSaving ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    "Save Changes"
  )}
</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteUserId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

     
    </div>
  );
};

export default ProfileManagement;