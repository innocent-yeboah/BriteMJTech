"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Input, Textarea, Select, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { expenseSchema, type ExpenseFormData } from "@/lib/validations/admin";
import { EXPENSE_CATEGORY_CONFIG } from "@/lib/admin/constants";
import type { Project } from "@/types/database";

export default function NewExpensePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expense_date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      setProjects((data as Project[]) ?? []);
    };
    fetchProjects();
  }, [supabase]);

  const onSubmit = async (data: ExpenseFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("expenses").insert({
        ...data,
        vendor: data.vendor || null,
        project_id: data.project_id || null,
        notes: data.notes || null,
        created_by: user?.id,
      });

      if (error) throw error;
      router.push("/admin/expenses");
    } catch (error) {
      console.error("Failed to create expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add Expense"
        description="Record a new business expense"
        backHref="/admin/expenses"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Expense Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Date"
              type="date"
              {...register("expense_date")}
              error={errors.expense_date?.message}
              required
            />
            <Select
              label="Category"
              options={[
                { value: "", label: "Select category" },
                ...Object.entries(EXPENSE_CATEGORY_CONFIG).map(([value, config]) => ({
                  value,
                  label: config.label,
                })),
              ]}
              {...register("category")}
              error={errors.category?.message}
              required
            />
            <Input
              label="Description"
              placeholder="What was this expense for?"
              {...register("description")}
              error={errors.description?.message}
              required
              className="sm:col-span-2"
            />
            <Input
              label="Amount (GHS)"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount", { valueAsNumber: true })}
              error={errors.amount?.message}
              required
            />
            <Input
              label="Vendor / Supplier"
              placeholder="Company or person paid"
              {...register("vendor")}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Additional Information</h3>
          <div className="space-y-4">
            <Select
              label="Related Project"
              options={[
                { value: "", label: "No project" },
                ...projects.map((p) => ({ value: p.id, label: p.project_name })),
              ]}
              {...register("project_id")}
              hint="Link this expense to a specific project"
            />
            <Textarea
              label="Notes"
              placeholder="Additional details about this expense..."
              {...register("notes")}
              rows={3}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Expense
          </Button>
        </div>
      </form>
    </div>
  );
}
