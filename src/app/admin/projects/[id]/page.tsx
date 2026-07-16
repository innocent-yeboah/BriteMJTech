"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  Mail,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Plus,
  CheckCircle2,
  Circle,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { ProjectStatusBadge, PriorityBadge, TaskStatusBadge } from "@/components/admin/ui/badges";
import { Button, Input, Textarea, Select } from "@/components/admin/ui/form-fields";
import { ConfirmModal, Modal } from "@/components/admin/ui/modal";
import { createClient } from "@/lib/supabase/client";
import {
  formatDate,
  formatDateTime,
  formatPhoneGH,
  formatCurrency,
  PROJECT_STATUS_CONFIG,
  PROJECT_TYPE_CONFIG,
} from "@/lib/admin/constants";
import type { Project, ProjectTask, ProjectStatus, TaskStatus, Priority } from "@/types/database";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ProjectStatus>("planning");
  const [saving, setSaving] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "normal" as Priority,
    due_date: "",
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchProject = async () => {
      const [projectRes, tasksRes] = await Promise.all([
        supabase.from("projects").select("*").eq("id", id).single(),
        supabase
          .from("project_tasks")
          .select("*")
          .eq("project_id", id)
          .order("created_at", { ascending: false }),
      ]);

      if (projectRes.error) {
        console.error("Failed to fetch project:", projectRes.error);
        router.push("/admin/projects");
        return;
      }
      setProject(projectRes.data as Project);
      setNewStatus(projectRes.data.status);
      setTasks((tasksRes.data as ProjectTask[]) ?? []);
      setLoading(false);
    };

    fetchProject();
  }, [id, supabase, router]);

  const handleStatusChange = async () => {
    if (!project) return;
    setSaving(true);
    try {
      const updates: Partial<Project> = { status: newStatus };
      if (newStatus === "completed") {
        updates.completed_at = new Date().toISOString();
        updates.actual_completion = new Date().toISOString().split("T")[0];
      }

      const { error } = await supabase.from("projects").update(updates).eq("id", project.id);
      if (error) throw error;

      setProject({ ...project, ...updates });
      setStatusModal(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("projects").delete().eq("id", project.id);
      if (error) throw error;
      router.push("/admin/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTask = async () => {
    if (!project || !newTask.title.trim()) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("project_tasks")
        .insert({
          project_id: project.id,
          title: newTask.title,
          description: newTask.description || null,
          priority: newTask.priority,
          due_date: newTask.due_date || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      setTasks([data as ProjectTask, ...tasks]);
      setTaskModal(false);
      setNewTask({ title: "", description: "", priority: "normal", due_date: "" });
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleTaskStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      const updates: Partial<ProjectTask> = { status };
      if (status === "completed") {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase.from("project_tasks").update(updates).eq("id", taskId);
      if (error) throw error;

      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!project) return null;

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div>
      <PageHeader
        title={project.project_name}
        description={`Project for ${project.client_name}`}
        backHref="/admin/projects"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setStatusModal(true)}>
              Update Status
            </Button>
            <Link href={`/admin/projects/${project.id}/edit`}>
              <Button variant="secondary" icon={<Edit className="h-4 w-4" />}>
                Edit
              </Button>
            </Link>
            <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => setDeleteModal(true)}>
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Project Overview</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Project Type</p>
                <p className="mt-1 font-medium text-slate-900">
                  {project.project_type
                    ? PROJECT_TYPE_CONFIG[project.project_type]?.label
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <div className="mt-1">
                  <ProjectStatusBadge status={project.status} />
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Priority</p>
                <div className="mt-1">
                  <PriorityBadge priority={project.priority} />
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Budget</p>
                <p className="mt-1 font-medium text-slate-900">
                  {project.budget ? formatCurrency(project.budget) : "—"}
                </p>
              </div>
            </div>
            {project.description && (
              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-500">Description</p>
                <p className="mt-2 text-slate-700">{project.description}</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Tasks</h3>
              <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setTaskModal(true)}>
                Add Task
              </Button>
            </div>
            {tasks.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-medium text-slate-900">
                    {completedTasks}/{tasks.length} tasks
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No tasks yet. Add tasks to track project progress.
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 p-4"
                  >
                    <button
                      onClick={() =>
                        handleTaskStatusChange(
                          task.id,
                          task.status === "completed" ? "pending" : "completed"
                        )
                      }
                      className="mt-0.5"
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : task.status === "blocked" ? (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          task.status === "completed"
                            ? "text-slate-400 line-through"
                            : "text-slate-900"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-3">
                        <TaskStatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                        {task.due_date && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(task.due_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {project.notes && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Notes</h3>
              <p className="whitespace-pre-wrap text-slate-600">{project.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Client Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="mt-1 font-medium text-slate-900">{project.client_name}</p>
              </div>
              {project.client_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <a
                    href={`tel:${project.client_phone}`}
                    className="text-slate-700 hover:text-brand-600"
                  >
                    {formatPhoneGH(project.client_phone)}
                  </a>
                </div>
              )}
              {project.client_email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <a
                    href={`mailto:${project.client_email}`}
                    className="text-slate-700 hover:text-brand-600"
                  >
                    {project.client_email}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Start Date</p>
                  <p className="font-medium text-slate-900">
                    {project.start_date ? formatDate(project.start_date) : "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Estimated Completion</p>
                  <p className="font-medium text-slate-900">
                    {project.estimated_completion
                      ? formatDate(project.estimated_completion)
                      : "Not set"}
                  </p>
                </div>
              </div>
              {project.actual_completion && (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-slate-500">Completed On</p>
                    <p className="font-medium text-green-600">
                      {formatDate(project.actual_completion)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(project.budget || project.actual_cost) && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Budget</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Budget</span>
                  <span className="font-semibold text-slate-900">
                    {project.budget ? formatCurrency(project.budget) : "—"}
                  </span>
                </div>
                {project.actual_cost && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Actual Cost</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(project.actual_cost)}
                    </span>
                  </div>
                )}
                {project.budget && project.actual_cost && (
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="text-slate-600">Variance</span>
                    <span
                      className={`font-semibold ${
                        project.actual_cost <= project.budget
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(project.budget - project.actual_cost)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Link href={`/admin/invoices/new?project=${project.id}`}>
            <Button className="w-full" variant="secondary" icon={<DollarSign className="h-4 w-4" />}>
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      <Modal open={statusModal} onClose={() => setStatusModal(false)} title="Update Project Status" size="sm">
        <div className="space-y-4">
          <Select
            label="New Status"
            options={Object.entries(PROJECT_STATUS_CONFIG).map(([value, config]) => ({
              value,
              label: config.label,
            }))}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStatusModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange} loading={saving}>
              Update Status
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={taskModal} onClose={() => setTaskModal(false)} title="Add New Task" size="md">
        <div className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Install cameras in zone A"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Additional details..."
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Priority"
              options={[
                { value: "low", label: "Low" },
                { value: "normal", label: "Normal" },
                { value: "high", label: "High" },
                { value: "urgent", label: "Urgent" },
              ]}
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
            />
            <Input
              label="Due Date"
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setTaskModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask} loading={saving} disabled={!newTask.title.trim()}>
              Add Task
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={saving}
      />
    </div>
  );
}
