"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Input, Textarea, Select, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { projectSchema, type ProjectFormData } from "@/lib/validations/admin";
import { PROJECT_TYPE_CONFIG } from "@/lib/admin/constants";
import type { User } from "@/types/database";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: "planning",
      priority: "normal",
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("is_active", true)
        .order("full_name");
      setUsers((data as User[]) ?? []);
    };
    fetchUsers();
  }, [supabase]);

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("projects").insert({
        ...data,
        client_email: data.client_email || null,
        client_phone: data.client_phone || null,
      });

      if (error) throw error;
      router.push("/admin/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create New Project"
        description="Set up a new installation or service project"
        backHref="/admin/projects"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Project Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Project Name"
              placeholder="CCTV Installation - ABC Company"
              {...register("project_name")}
              error={errors.project_name?.message}
              required
              className="sm:col-span-2"
            />
            <Select
              label="Project Type"
              options={[
                { value: "", label: "Select type" },
                ...Object.entries(PROJECT_TYPE_CONFIG).map(([value, config]) => ({
                  value,
                  label: config.label,
                })),
              ]}
              {...register("project_type")}
              error={errors.project_type?.message}
              required
            />
            <Select
              label="Priority"
              options={[
                { value: "low", label: "Low" },
                { value: "normal", label: "Normal" },
                { value: "high", label: "High" },
                { value: "urgent", label: "Urgent" },
              ]}
              {...register("priority")}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Description"
              placeholder="Describe the project scope and requirements..."
              {...register("description")}
              rows={4}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Client Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Client Name"
              placeholder="John Doe / ABC Company"
              {...register("client_name")}
              error={errors.client_name?.message}
              required
            />
            <Input
              label="Client Phone"
              placeholder="0203412477"
              {...register("client_phone")}
              error={errors.client_phone?.message}
            />
            <Input
              label="Client Email"
              type="email"
              placeholder="client@example.com"
              {...register("client_email")}
              error={errors.client_email?.message}
              className="sm:col-span-2"
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Timeline & Budget</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Start Date"
              type="date"
              {...register("start_date")}
            />
            <Input
              label="Estimated Completion"
              type="date"
              {...register("estimated_completion")}
            />
            <Input
              label="Budget (GHS)"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("budget", { valueAsNumber: true })}
            />
            <Select
              label="Status"
              options={[
                { value: "planning", label: "Planning" },
                { value: "in_progress", label: "In Progress" },
                { value: "awaiting_approval", label: "Awaiting Approval" },
                { value: "installation", label: "Installation" },
                { value: "testing", label: "Testing" },
                { value: "completed", label: "Completed" },
                { value: "maintenance", label: "Maintenance" },
              ]}
              {...register("status")}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Additional Notes</h3>
          <Textarea
            label="Notes"
            placeholder="Any additional information about this project..."
            {...register("notes")}
            rows={4}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
}
