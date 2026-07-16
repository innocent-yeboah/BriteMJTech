"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Shield, UserCheck, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { DataTable, type Column } from "@/components/admin/ui/data-table";
import { RoleBadge } from "@/components/admin/ui/badges";
import { Modal } from "@/components/admin/ui/modal";
import { Input, Select, Button } from "@/components/admin/ui/form-fields";
import { formatDateTime, USER_ROLE_CONFIG } from "@/lib/admin/constants";
import type { User, UserRole } from "@/types/database";

type ManagedUser = Pick<
  User,
  "id" | "email" | "full_name" | "phone" | "role" | "is_active" | "last_login" | "created_at"
>;

export default function AccessControlPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<ManagedUser | null>(null);
  const [resetUser, setResetUser] = useState<ManagedUser | null>(null);
  const [saving, setSaving] = useState(false);

  const [createForm, setCreateForm] = useState({
    email: "",
    full_name: "",
    phone: "",
    role: "staff" as UserRole,
    password: "",
  });
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    role: "staff" as UserRole,
    is_active: true,
  });
  const [resetPassword, setResetPassword] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load users");
      setUsers(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleCreate = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create user");
      setCreateOpen(false);
      setCreateForm({ email: "", full_name: "", phone: "", role: "staff", password: "" });
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update user");
      setEditUser(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetUser || resetPassword.length < 8) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${resetUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to reset password");
      setResetUser(null);
      setResetPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user: ManagedUser) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update status");
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<ManagedUser>[] = [
    {
      key: "full_name",
      header: "User",
      sortable: true,
      render: (user) => (
        <div>
          <p className="font-medium text-slate-900">{user.full_name || "Unnamed"}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (user) => <RoleBadge role={user.role} />,
    },
    {
      key: "is_active",
      header: "Access",
      render: (user) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {user.is_active ? "Active" : "Disabled"}
        </span>
      ),
    },
    {
      key: "last_login",
      header: "Last Login",
      render: (user) => (
        <span className="text-sm text-slate-600">
          {user.last_login ? formatDateTime(user.last_login) : "Never"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Access Control"
        description="Manage who can access the admin system and their security roles"
        backHref="/admin/settings"
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
            Add User
          </Button>
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield className="h-4 w-4" />
            Total users
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <UserCheck className="h-4 w-4" />
            Active
          </div>
          <p className="mt-1 text-2xl font-bold text-green-700">
            {users.filter((u) => u.is_active).length}
          </p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <Shield className="h-4 w-4" />
            Admins
          </div>
          <p className="mt-1 text-2xl font-bold text-purple-700">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        keyField="id"
        loading={loading}
        searchable
        searchPlaceholder="Search users..."
        searchFields={["full_name", "email"]}
        emptyMessage="No users found."
        actions={(user) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setEditUser(user);
                setEditForm({
                  full_name: user.full_name || "",
                  phone: user.phone || "",
                  role: user.role,
                  is_active: user.is_active,
                });
              }}
              className="rounded-lg px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setResetUser(user);
                setResetPassword("");
              }}
              className="rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Reset PW
            </button>
            <button
              type="button"
              onClick={() => void toggleActive(user)}
              disabled={saving}
              className={`rounded-lg px-2 py-1 text-xs font-medium ${
                user.is_active
                  ? "text-red-600 hover:bg-red-50"
                  : "text-green-600 hover:bg-green-50"
              }`}
            >
              {user.is_active ? "Disable" : "Enable"}
            </button>
          </div>
        )}
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add system user" size="md">
        <div className="space-y-4">
          <Input
            label="Full name"
            value={createForm.full_name}
            onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={createForm.email}
            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={createForm.phone}
            onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
          />
          <Select
            label="Role"
            options={Object.entries(USER_ROLE_CONFIG).map(([value, config]) => ({
              value,
              label: `${config.label} — ${config.description}`,
            }))}
            value={createForm.role}
            onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })}
          />
          <Input
            label="Temporary password"
            type="password"
            value={createForm.password}
            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            hint="Minimum 8 characters. Share securely with the user."
            required
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleCreate()} loading={saving}>
              Create user
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title={`Edit access — ${editUser?.email || ""}`}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Full name"
            value={editForm.full_name}
            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
          />
          <Input
            label="Phone"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />
          <Select
            label="Role"
            options={Object.entries(USER_ROLE_CONFIG).map(([value, config]) => ({
              value,
              label: `${config.label} — ${config.description}`,
            }))}
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
          />
          <Select
            label="Account status"
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Disabled" },
            ]}
            value={String(editForm.is_active)}
            onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === "true" })}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button onClick={() => void handleUpdate()} loading={saving}>
              Save access
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!resetUser}
        onClose={() => setResetUser(null)}
        title={`Reset password — ${resetUser?.email || ""}`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Set a new temporary password for this user. Ask them to change it after signing in.
          </p>
          <Input
            label="New password"
            type="password"
            value={resetPassword}
            onChange={(e) => setResetPassword(e.target.value)}
            hint="Minimum 8 characters"
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setResetUser(null)}>
              Cancel
            </Button>
            <Button
              icon={<KeyRound className="h-4 w-4" />}
              onClick={() => void handleResetPassword()}
              loading={saving}
              disabled={resetPassword.length < 8}
            >
              Reset password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
