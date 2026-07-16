"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Eye, Pencil, Mail, Phone, User, Shield } from "lucide-react";
import { PageHeader, AddButton } from "@/components/admin/ui/page-header";
import { DataTable, ActionMenu, ActionMenuItem, type Column } from "@/components/admin/ui/data-table";
import { RoleBadge } from "@/components/admin/ui/badges";
import { Select } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime, USER_ROLE_CONFIG } from "@/lib/admin/constants";
import type { User as UserType, UserRole } from "@/types/database";

export default function TeamPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: "",
    status: "",
  });

  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
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

      const { data, error } = await query;
      if (error) throw error;
      setUsers((data as UserType[]) ?? []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns: Column<UserType>[] = [
    {
      key: "full_name",
      header: "Team Member",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            {user.avatar_url ? (
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
            <p className="font-medium text-slate-900">{user.full_name || "Unnamed User"}</p>
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
        description="Manage staff and team members"
        actions={<AddButton href="/admin/team/new">Add Team Member</AddButton>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {roleStats.map((stat) => (
          <div key={stat.role} className="rounded-xl border border-slate-200 bg-white p-4">
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
        emptyMessage="No team members found."
        actions={(user) => (
          <ActionMenu>
            <ActionMenuItem
              icon={Eye}
              onClick={() => (window.location.href = `/admin/team/${user.id}`)}
            >
              View Profile
            </ActionMenuItem>
            <ActionMenuItem
              icon={Pencil}
              onClick={() => (window.location.href = `/admin/team/${user.id}/edit`)}
            >
              Edit Member
            </ActionMenuItem>
            {user.email && (
              <ActionMenuItem
                icon={Mail}
                onClick={() => window.open(`mailto:${user.email}`, "_blank")}
              >
                Send Email
              </ActionMenuItem>
            )}
          </ActionMenu>
        )}
      />
    </div>
  );
}
