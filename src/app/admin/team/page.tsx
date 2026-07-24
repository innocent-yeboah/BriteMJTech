"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Eye,
  Pencil,
  Mail,
  Phone,
  User,
  Shield,
  Plus,
  KeyRound,
  UserCheck,
  UserX,
} from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import {
  DataTable,
  ActionMenu,
  ActionMenuItem,
  type Column,
} from "@/components/admin/ui/data-table";
import { RoleBadge } from "@/components/admin/ui/badges";
import { Modal } from "@/components/admin/ui/modal";
import { Input, Select, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime, USER_ROLE_CONFIG } from "@/lib/admin/constants";
import type { User as UserType, UserRole } from "@/types/database";

const ROLE_OPTIONS = Object.entries(USER_ROLE_CONFIG).map(([value, config]) => ({
  value,
  label: `${config.label} — ${config.description}`,
}));

const emptyCreateForm = {
  email: "",
  full_name: "",
  phone: "",
  role: "staff" as UserRole,
  password: "",
};

/**
 * Team roster with admin-only staff creation and role assignment so Brite MJ
 * can grow its Accra operations safely.
 */
export default function TeamPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [viewUser, setViewUser] = useState<UserType | null>(null);
  const [resetUser, setResetUser] = useState<UserType | null>(null);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    role: "staff" as UserRole,
    is_active: true,
  });
  const [resetPassword, setResetPassword] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
  });

  const supabase = createClient();

  const loadCurrentUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setCurrentUserId(user.id);
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    setIsAdmin(profile?.role === "admin");
  }, [supabase]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = supabase
        .from("users")
        .select("*")
        .order("full_name", { ascending: true });

      if (filters.role) {
        query = query.eq("role", filters.role);
      }
      if (filters.status === "active") {
        query = query.eq("is_active", true);
      } else if (filters.status === "inactive") {
        query = query.eq("is_active", false);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setUsers((data as UserType[]) ?? []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Could not load team members. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    void loadCurrentUser();
  }, [loadCurrentUser]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async () => {
    if (!isAdmin) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add staff member");
      setCreateOpen(false);
      setCreateForm(emptyCreateForm);
      setSuccess(
        `${createForm.full_name || "Staff member"} added as ${USER_ROLE_CONFIG[createForm.role].label}.`
      );
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add staff member");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editUser || !isAdmin) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update staff member");
      setEditUser(null);
      setSuccess("Staff member updated.");
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update staff member");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetUser || !isAdmin || resetPassword.length < 8) return;
    setSaving(true);
    setError("");
    setSuccess("");
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
      setSuccess(`Password updated for ${resetUser.full_name || resetUser.email}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user: UserType) => {
    if (!isAdmin) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update status");
      setSuccess(
        user.is_active
          ? `${user.full_name || "User"} deactivated.`
          : `${user.full_name || "User"} activated.`
      );
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<UserType>[] = [
    {
      key: "full_name",
      header: "Team Member",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="font-medium text-slate-900">
              {user.full_name || "Unnamed User"}
            </p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
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
      key: "phone",
      header: "Contact",
      render: (user) =>
        user.phone ? (
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <Phone className="h-3.5 w-3.5" />
            {user.phone}
          </div>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (user) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            user.is_active
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {user.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "last_login",
      header: "Last Login",
      sortable: true,
      render: (user) => (
        <span className="text-sm text-slate-600">
          {user.last_login ? formatDateTime(user.last_login) : "Never"}
        </span>
      ),
    },
  ];

  const filterComponent = (
    <div className="flex flex-wrap gap-4">
      <Select
        options={[
          { value: "", label: "All Roles" },
          ...Object.entries(USER_ROLE_CONFIG).map(([value, config]) => ({
            value,
            label: config.label,
          })),
        ]}
        value={filters.role}
        onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
        className="w-36"
      />
      <Select
        options={[
          { value: "", label: "All Status" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
        value={filters.status}
        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        className="w-32"
      />
    </div>
  );

  const roleStats = Object.keys(USER_ROLE_CONFIG).map((role) => ({
    role,
    ...USER_ROLE_CONFIG[role as UserRole],
    count: users.filter((u) => u.role === role).length,
  }));

  return (
    <div>
      <PageHeader
        title="Team"
        description="Add staff, assign roles, and manage access for your Accra operations"
        actions={
          isAdmin ? (
            <Button
              icon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setError("");
                setCreateOpen(true);
              }}
            >
              Add Staff
            </Button>
          ) : null
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      {!isAdmin ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Only admins can add staff and change roles. You can still view the roster.
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {roleStats.map((stat) => (
          <div
            key={stat.role}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-2">
              <Shield className={`h-4 w-4 ${stat.color}`} />
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stat.count}</p>
            <p className="text-xs text-slate-400">{stat.description}</p>
          </div>
        ))}
      </div>

      <DataTable
        data={users}
        columns={columns}
        keyField="id"
        loading={loading}
        searchable
        searchPlaceholder="Search team members..."
        searchFields={["full_name", "email", "phone"]}
        filterComponent={filterComponent}
        emptyMessage="No team members found. Admins can add staff to get started."
        actions={(user) => (
          <ActionMenu>
            <ActionMenuItem icon={Eye} onClick={() => setViewUser(user)}>
              View Profile
            </ActionMenuItem>
            {isAdmin ? (
              <>
                <ActionMenuItem
                  icon={Pencil}
                  onClick={() => {
                    setEditUser(user);
                    setEditForm({
                      full_name: user.full_name || "",
                      phone: user.phone || "",
                      role: user.role,
                      is_active: user.is_active,
                    });
                  }}
                >
                  Edit Role & Details
                </ActionMenuItem>
                <ActionMenuItem
                  icon={KeyRound}
                  onClick={() => {
                    setResetUser(user);
                    setResetPassword("");
                  }}
                >
                  Reset Password
                </ActionMenuItem>
                <ActionMenuItem
                  icon={user.is_active ? UserX : UserCheck}
                  onClick={() => void toggleActive(user)}
                  disabled={saving || user.id === currentUserId}
                >
                  {user.is_active ? "Deactivate" : "Activate"}
                </ActionMenuItem>
              </>
            ) : null}
            {user.email ? (
              <ActionMenuItem
                icon={Mail}
                onClick={() => window.open(`mailto:${user.email}`, "_blank")}
              >
                Send Email
              </ActionMenuItem>
            ) : null}
          </ActionMenu>
        )}
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add Staff Member"
        description="Create a login and assign an access role."
      >
        <div className="space-y-4">
          <Input
            label="Full name"
            value={createForm.full_name}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, full_name: e.target.value }))
            }
            placeholder="Kwame Mensah"
            required
          />
          <Input
            label="Email"
            type="email"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, email: e.target.value }))
            }
            placeholder="staff@britemjtech.com"
            required
          />
          <Input
            label="Phone"
            value={createForm.phone}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, phone: e.target.value }))
            }
            placeholder="0200000000"
          />
          <Select
            label="Role"
            options={ROLE_OPTIONS}
            value={createForm.role}
            onChange={(e) =>
              setCreateForm((f) => ({
                ...f,
                role: e.target.value as UserRole,
              }))
            }
          />
          <Input
            label="Temporary password"
            type="password"
            value={createForm.password}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, password: e.target.value }))
            }
            placeholder="At least 8 characters"
            required
          />
          <p className="text-xs text-slate-500">
            Roles: Admin (full access), Manager (operations), Staff (assigned
            work), Technician (field tasks).
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setCreateOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={() => void handleCreate()} disabled={saving}>
              {saving ? "Adding..." : "Add Staff"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        title="Edit Staff Member"
        description="Update profile details and system role."
      >
        <div className="space-y-4">
          <Input
            label="Full name"
            value={editForm.full_name}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, full_name: e.target.value }))
            }
            required
          />
          <Input
            label="Phone"
            value={editForm.phone}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, phone: e.target.value }))
            }
          />
          <Select
            label="Role"
            options={ROLE_OPTIONS}
            value={editForm.role}
            onChange={(e) =>
              setEditForm((f) => ({
                ...f,
                role: e.target.value as UserRole,
              }))
            }
          />
          <Select
            label="Status"
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
            value={editForm.is_active ? "true" : "false"}
            onChange={(e) =>
              setEditForm((f) => ({
                ...f,
                is_active: e.target.value === "true",
              }))
            }
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setEditUser(null)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={() => void handleUpdate()} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(resetUser)}
        onClose={() => setResetUser(null)}
        title="Reset Password"
        description={
          resetUser
            ? `Set a new temporary password for ${resetUser.full_name || resetUser.email}.`
            : undefined
        }
      >
        <div className="space-y-4">
          <Input
            label="New password"
            type="password"
            value={resetPassword}
            onChange={(e) => setResetPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setResetUser(null)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handleResetPassword()}
              disabled={saving || resetPassword.length < 8}
            >
              {saving ? "Updating..." : "Reset Password"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(viewUser)}
        onClose={() => setViewUser(null)}
        title="Staff Profile"
      >
        {viewUser ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-900">
                {viewUser.full_name || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-900">{viewUser.email}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Phone</span>
              <span className="font-medium text-slate-900">
                {viewUser.phone || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Role</span>
              <RoleBadge role={viewUser.role} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Status</span>
              <span className="font-medium text-slate-900">
                {viewUser.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Last login</span>
              <span className="font-medium text-slate-900">
                {viewUser.last_login
                  ? formatDateTime(viewUser.last_login)
                  : "Never"}
              </span>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setViewUser(null)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
