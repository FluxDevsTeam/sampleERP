import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import PaginationComponent from "../allProjects/_components/Pagination";

// Role options constant
const roleOptions = [
  "shopkeeper",
  "project_manager",
  "factory_manager",
  "ceo",
  "admin",
  "storekeeper",
  "accountant",
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
  count: number;
}

const USERS_PER_PAGE = 10;
const ProfileManagement = () => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    roles: [],
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<UserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    roles: [""]
  });
  const [createPassword, setCreatePassword] = useState("");
  const [createVerifyPassword, setCreateVerifyPassword] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  // local-only mode: performs in-memory create/update/delete against `users.json` loaded at startup
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Load users from local JSON file inside src/data/ceo/settings/users.json
  const loadUsers = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const mod = await import("@/data/ceo/settings/users.json");
      const data = (mod && (mod as any).default) ? (mod as any).default : mod;
      const items: User[] = Array.isArray(data.results) ? data.results : [];
      setUsersData(items);
      const count = data.count ?? items.length;
      setTotalCount(count);
      setTotalPages(Math.max(1, Math.ceil(count / USERS_PER_PAGE)));
    } catch (err) {
      console.error("Failed to load local users.json", err);
      setLoadError("Failed to load local users data");
      setUsersData([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // convenience refetch used by existing code paths
  const refetch = () => loadUsers();

  useEffect(() => {
    // initial load
    loadUsers();
    // recalc totalPages when usersData or totalCount changes
  }, []);

  useEffect(() => {
    const total = totalCount || usersData.length;
    setTotalPages(Math.max(1, Math.ceil(total / USERS_PER_PAGE)));
  }, [usersData, totalCount]);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      roles: user.roles && user.roles.length > 0 ? user.roles : [""],
    });
  };

  const handleUpdate = async () => {
    if (!editingUser) {
      console.error("No user selected for editing");
      return;
    }
    // local update: modify usersData in-memory
    setIsSaving(true);
    try {
      setUsersData((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
      setEditingUser(null);
      toast.success("Profile updated (local)!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile (local)!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUserId) {
      console.error("No user ID selected for deletion");
      return;
    }
    try {
      setUsersData((prev) => prev.filter((u) => u.id !== deleteUserId));
      setDeleteUserId(null);
      setSelectedUser(null);
      toast.success("Profile deleted (local)!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete profile (local)!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: [value],
    }));
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateRoleChange = (value: string) => {
    setCreateFormData((prev) => ({
      ...prev,
      roles: [value],
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setIsCreating(true);

    if (createPassword !== createVerifyPassword) {
      setCreateError("Passwords do not match");
      setIsCreating(false);
      return;
    }

    if (createPassword.length < 8) {
      setCreateError("Password must be at least 8 characters long");
      setIsCreating(false);
      return;
    }

    try {
      // simple local create: generate id and push to state
      const maxId = usersData.reduce((m, u) => Math.max(m, u.id), 0);
      const newUser: User = {
        id: maxId + 1,
        first_name: createFormData.first_name,
        last_name: createFormData.last_name,
        email: createFormData.email,
        phone_number: createFormData.phone_number,
        roles: createFormData.roles && createFormData.roles[0] ? [createFormData.roles[0]] : ["shopkeeper"],
      };
      setUsersData((prev) => [newUser, ...prev]);
      setIsCreateModalOpen(false);
      setCreateFormData({ first_name: "", last_name: "", email: "", phone_number: "", roles: [""] });
      setCreatePassword("");
      setCreateVerifyPassword("");
      toast.success("Profile created (local)!");
    } catch (err: any) {
      console.error("Create error:", err);
      setCreateError("Failed to create profile (local)");
    } finally {
      setIsCreating(false);
    }
  };

  const formatRoleName = (role: string): string => {
    return role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );

  if (loadError)
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>{loadError}</p>
      </div>
    );

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">Profile</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="border border-blue-400 text-blue-400 bg-white hover:bg-blue-50 text-sm sm:text-base px-3 sm:px-4 py-2">+ Create New Profile</Button>
      </div>

      <div className="rounded-md border my-4 sm:my-5 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Name</TableHead>
              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Email</TableHead>
              <TableHead className="text-xs sm:text-sm hidden md:table-cell">Phone</TableHead>
              <TableHead className="text-xs sm:text-sm">Roles</TableHead>
              <TableHead className="text-xs sm:text-sm">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData?.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8">
                  <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M16 3v4M8 3v4M3 7h18" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">No profiles found</h2>
                    <p className="text-gray-500 mb-6 text-center max-w-xs">All user profiles will show up here. Click 'Create New Profile' to add your first user.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // client-side pagination slice
              usersData.slice((currentPage - 1) * USERS_PER_PAGE, (currentPage - 1) * USERS_PER_PAGE + USERS_PER_PAGE).map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-xs sm:text-sm">
                  <div>
                    <div className="font-medium">{user.first_name} {user.last_name}</div>
                      {/* Remove email on mobile, only show name */}
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{user.email}</TableCell>
                <TableCell className="text-xs sm:text-sm hidden md:table-cell">{user.phone_number || "-"}</TableCell>
                <TableCell className="text-xs sm:text-sm">{user.roles || "-"}</TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Button size="sm" className="text-xs px-2 sm:px-3 py-1 sm:py-2 border border-blue-400 text-blue-400 bg-white hover:bg-blue-50" onClick={() => setSelectedUser(user)}>
                      Details
                    </Button>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={currentPage < totalPages}
        hasPreviousPage={currentPage > 1}
        handlePageChange={setCurrentPage}
      />

      {/* Edit User Modal */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="w-full max-w-md mx-0 px-2 sm:mx-4 sm:px-6 py-4 sm:py-6 overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-xs sm:text-sm font-medium mb-1">First Name</label>
                <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="text-xs sm:text-base w-full" />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-xs sm:text-sm font-medium mb-1">Last Name</label>
                <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="text-xs sm:text-base w-full" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1">Email</label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="text-xs sm:text-base w-full" />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-xs sm:text-sm font-medium mb-1">Phone Number</label>
              <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} className="text-xs sm:text-base w-full" />
            </div>
            {/* Roles Section */}
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Role</label>
              <Select value={formData.roles[0] || ""} onValueChange={handleRoleChange}>
                <SelectTrigger className="text-xs sm:text-base w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>{formatRoleName(role)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-row justify-end gap-2 mt-4 w-full">
            <Button variant="outline" onClick={() => setEditingUser(null)} className="text-xs sm:text-base w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleUpdate} disabled={isSaving} className="text-xs sm:text-base w-full sm:w-auto">
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
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
      >
        <AlertDialogContent className="w-[95vw] sm:w-full mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">
              Are you sure you want to delete?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setDeleteUserId(null)} className="text-sm sm:text-base">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="text-sm sm:text-base">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create New Profile Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="w-11/12 sm:w-full max-h-[90vh] pb-20 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Create New Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium mb-1">First Name</label>
                <Input id="first_name" name="first_name" value={createFormData.first_name} onChange={handleCreateChange} required className="text-sm sm:text-base" />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium mb-1">Last Name</label>
                <Input id="last_name" name="last_name" value={createFormData.last_name} onChange={handleCreateChange} required className="text-sm sm:text-base" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input id="email" name="email" type="email" value={createFormData.email} onChange={handleCreateChange} required className="text-sm sm:text-base" />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium mb-1">Phone Number</label>
              <Input id="phone_number" name="phone_number" value={createFormData.phone_number} onChange={handleCreateChange} required className="text-sm sm:text-base" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <Input id="password" name="password" type="password" value={createPassword} onChange={e => setCreatePassword(e.target.value)} required className="text-sm sm:text-base" />
            </div>
            <div>
              <label htmlFor="verify_password" className="block text-sm font-medium mb-1">Confirm Password</label>
              <Input id="verify_password" name="verify_password" type="password" value={createVerifyPassword} onChange={e => setCreateVerifyPassword(e.target.value)} required className="text-sm sm:text-base" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <Select value={createFormData.roles[0] || ""} onValueChange={handleCreateRoleChange} required>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>{formatRoleName(role)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {createError && <div className="text-red-500 text-sm text-center">{createError}</div>}
            <Button type="submit" className="bg-blue-400 text-white w-full font-semibold text-sm sm:text-base py-2" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Profile"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="w-full max-w-md mx-0 px-2 sm:mx-4 sm:px-6 py-4 sm:py-6 overflow-x-hidden">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">User Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2 py-2">
              <div className="font-semibold">Name:</div>
              <div>{selectedUser.first_name} {selectedUser.last_name}</div>
              <div className="font-semibold">Email:</div>
              <div>{selectedUser.email}</div>
              <div className="font-semibold">Phone:</div>
              <div>{selectedUser.phone_number}</div>
              <div className="font-semibold">Roles:</div>
              <div>{selectedUser.roles?.join(', ')}</div>
            </div>
            <div className="flex flex-row justify-end gap-2 mt-4 w-full">
              <Button onClick={() => handleEditClick(selectedUser)} className="w-full sm:w-auto">Edit</Button>
              <Button variant="destructive" onClick={() => setDeleteUserId(selectedUser.id)} className="w-full sm:w-auto">Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProfileManagement;
