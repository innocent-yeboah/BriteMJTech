"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, Pencil, Trash2, Calendar, DollarSign, Users } from "lucide-react";
import { PageHeader, AddButton } from "@/components/admin/ui/page-header";
import { DataTable, ActionMenu, ActionMenuItem, type Column } from "@/components/admin/ui/data-table";
import { ProjectStatusBadge, PriorityBadge } from "@/components/admin/ui/badges";
import { ConfirmModal } from "@/components/admin/ui/modal";
import { Select, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatCurrency, PROJECT_STATUS_CONFIG, PROJECT_TYPE_CONFIG } from "@/lib/admin/constants";
import type { Project, ProjectStatus } from "@/types/database";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState({
    status: statusFilter === "active"
      ? "in_progress"
      : statusFilter === "completed"
      ? "completed"
      : "",
    type: "",
    priority: "",
  });

  const supabase = createClient();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.status) {
        query = query.eq("status", filters.status);
      } else if (statusFilter === "active") {
        query = query.in("status", ["planning", "in_progress", "installation", "testing"]);
      }
      if (filters.type) {
        query = query.eq("project_type", filters.type);
      }
      if (filters.priority) {
        query = query.eq("priority", filters.priority);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProjects((data as Project[]) ?? []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, filters, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async () => {
    if (!deleteModal.project) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("projects").delete().eq("id", deleteModal.project.id);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== deleteModal.project!.id));
      setDeleteModal({ open: false, project: null });
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Project>[] = [
    {
      key: "project_name",
      header: "Project",
      sortable: true,
      render: (project) => (
        <div>
          <p className="font-medium text-slate-900">{project.project_name}</p>
          <p className="text-sm text-slate-500">{project.client_name}</p>
        </div>
      ),
    },
    {
      key: "project_type",
      header: "Type",
      render: (project) => (
        <span className="text-sm text-slate-600">
          {project.project_type
            ? PROJECT_TYPE_CONFIG[project.project_type]?.label
            : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (project) => <ProjectStatusBadge status={project.status} />,
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      render: (project) => <PriorityBadge priority={project.priority} />,
    },
    {
      key: "budget",
      header: "Budget",
      align: "right",
      render: (project) => (
        <span className="text-sm font-medium text-slate-900">
          {project.budget ? formatCurrency(project.budget) : "—"}
        </span>
      ),
    },
    {
      key: "start_date",
      header: "Timeline",
      render: (project) => (
        <div className="text-sm text-slate-600">
          {project.start_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(project.start_date)}
            </div>
          )}
          {project.estimated_completion && (
            <div className="text-slate-400">→ {formatDate(project.estimated_completion)}</div>
          )}
        </div>
      ),
    },
  ];

  const filterComponent = (
    <div className="flex flex-wrap gap-4">
      <Select
        options={[
          { value: "", label: "All Statuses" },
          ...Object.entries(PROJECT_STATUS_CONFIG).map(([value, config]) => ({
            value,
            label: config.label,
          })),
        ]}
        value={filters.status}
        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        className="w-44"
      />
      <Select
        options={[
          { value: "", label: "All Types" },
          ...Object.entries(PROJECT_TYPE_CONFIG).map(([value, config]) => ({
            value,
            label: config.label,
          })),
        ]}
        value={filters.type}
        onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        className="w-44"
      />
      <Select
        options={[
          { value: "", label: "All Priorities" },
          { value: "low", label: "Low" },
          { value: "normal", label: "Normal" },
          { value: "high", label: "High" },
          { value: "urgent", label: "Urgent" },
        ]}
        value={filters.priority}
        onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
        className="w-36"
      />
    </div>
  );

  const kanbanStatuses: ProjectStatus[] = [
    "planning",
    "in_progress",
    "installation",
    "testing",
    "completed",
  ];

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage installation and service projects"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-slate-200 bg-white p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-brand-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "kanban"
                    ? "bg-brand-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Kanban
              </button>
            </div>
            <AddButton href="/admin/projects/new">New Project</AddButton>
          </div>
        }
      />

      {viewMode === "list" ? (
        <DataTable
          data={projects}
          columns={columns}
          keyField="id"
          loading={loading}
          searchable
          searchPlaceholder="Search projects..."
          searchFields={["project_name", "client_name"]}
          filterComponent={filterComponent}
          emptyMessage="No projects found. Create your first project to get started."
          actions={(project) => (
            <ActionMenu>
              <ActionMenuItem
                icon={Eye}
                onClick={() => (window.location.href = `/admin/projects/${project.id}`)}
              >
                View Details
              </ActionMenuItem>
              <ActionMenuItem
                icon={Pencil}
                onClick={() => (window.location.href = `/admin/projects/${project.id}/edit`)}
              >
                Edit Project
              </ActionMenuItem>
              <ActionMenuItem
                icon={Trash2}
                variant="danger"
                onClick={() => setDeleteModal({ open: true, project })}
              >
                Delete Project
              </ActionMenuItem>
            </ActionMenu>
          )}
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanStatuses.map((status) => {
            const statusProjects = projects.filter((p) => p.status === status);
            const config = PROJECT_STATUS_CONFIG[status];
            return (
              <div
                key={status}
                className="w-72 flex-shrink-0 rounded-xl border border-slate-200 bg-slate-50"
              >
                <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${config.bgColor}`} />
                    <h3 className="font-semibold text-slate-900">{config.label}</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-600">
                    {statusProjects.length}
                  </span>
                </div>
                <div className="space-y-3 p-3 max-h-[600px] overflow-y-auto">
                  {statusProjects.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">No projects</p>
                  ) : (
                    statusProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/admin/projects/${project.id}`}
                        className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <h4 className="font-medium text-slate-900">{project.project_name}</h4>
                        <p className="mt-1 text-sm text-slate-500">{project.client_name}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <PriorityBadge priority={project.priority} />
                          {project.budget && (
                            <span className="text-sm font-medium text-slate-600">
                              {formatCurrency(project.budget)}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, project: null })}
        onConfirm={handleDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteModal.project?.project_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
