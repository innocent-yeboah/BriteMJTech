"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Receipt, TrendingDown } from "lucide-react";
import { PageHeader, AddButton } from "@/components/admin/ui/page-header";
import { DataTable, ActionMenu, ActionMenuItem, type Column } from "@/components/admin/ui/data-table";
import { ConfirmModal } from "@/components/admin/ui/modal";
import { Select } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, EXPENSE_CATEGORY_CONFIG } from "@/lib/admin/constants";
import type { Expense, ExpenseCategory } from "@/types/database";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; expense: Expense | null }>({
    open: false,
    expense: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    dateRange: "all",
  });

  const supabase = createClient();

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("expenses")
        .select("*")
        .order("expense_date", { ascending: false });

      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      if (filters.dateRange === "month") {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        query = query.gte("expense_date", startOfMonth.toISOString().split("T")[0]);
      } else if (filters.dateRange === "quarter") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        query = query.gte("expense_date", threeMonthsAgo.toISOString().split("T")[0]);
      }

      const { data, error } = await query;
      if (error) throw error;
      setExpenses((data as Expense[]) ?? []);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDelete = async () => {
    if (!deleteModal.expense) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", deleteModal.expense.id);
      if (error) throw error;
      setExpenses((prev) => prev.filter((e) => e.id !== deleteModal.expense!.id));
      setDeleteModal({ open: false, expense: null });
    } catch (error) {
      console.error("Failed to delete expense:", error);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Expense>[] = [
    {
      key: "description",
      header: "Description",
      sortable: true,
      render: (expense) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{expense.description}</p>
            {expense.vendor && <p className="text-sm text-slate-500">{expense.vendor}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (expense) => (
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {expense.category ? EXPENSE_CATEGORY_CONFIG[expense.category]?.label : "—"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      align: "right",
      render: (expense) => (
        <span className="text-lg font-semibold text-red-600">
          -{formatCurrency(expense.amount)}
        </span>
      ),
    },
    {
      key: "expense_date",
      header: "Date",
      sortable: true,
      render: (expense) => (
        <span className="text-sm text-slate-600">{formatDate(expense.expense_date)}</span>
      ),
    },
  ];

  const filterComponent = (
    <div className="flex flex-wrap gap-4">
      <Select
        options={[
          { value: "", label: "All Categories" },
          ...Object.entries(EXPENSE_CATEGORY_CONFIG).map(([value, config]) => ({
            value,
            label: config.label,
          })),
        ]}
        value={filters.category}
        onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        className="w-40"
      />
      <Select
        options={[
          { value: "all", label: "All Time" },
          { value: "month", label: "This Month" },
          { value: "quarter", label: "Last 3 Months" },
        ]}
        value={filters.dateRange}
        onChange={(e) => setFilters((f) => ({ ...f, dateRange: e.target.value }))}
        className="w-36"
      />
    </div>
  );

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = expenses.reduce((acc, e) => {
    const cat = e.category || "other";
    acc[cat] = (acc[cat] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Track and manage business expenses"
        actions={<AddButton href="/admin/expenses/new">Add Expense</AddButton>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">Total Expenses</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
        </div>
        {topCategories.map(([category, amount]) => (
          <div key={category} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">
              {EXPENSE_CATEGORY_CONFIG[category as ExpenseCategory]?.label || category}
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(amount)}</p>
          </div>
        ))}
      </div>

      <DataTable
        data={expenses}
        columns={columns}
        keyField="id"
        loading={loading}
        searchable
        searchPlaceholder="Search expenses..."
        searchFields={["description", "vendor"]}
        filterComponent={filterComponent}
        emptyMessage="No expenses found. Add your first expense to start tracking."
        actions={(expense) => (
          <ActionMenu>
            <ActionMenuItem
              icon={Eye}
              onClick={() => (window.location.href = `/admin/expenses/${expense.id}`)}
            >
              View Details
            </ActionMenuItem>
            <ActionMenuItem
              icon={Pencil}
              onClick={() => (window.location.href = `/admin/expenses/${expense.id}/edit`)}
            >
              Edit Expense
            </ActionMenuItem>
            <ActionMenuItem
              icon={Trash2}
              variant="danger"
              onClick={() => setDeleteModal({ open: true, expense })}
            >
              Delete Expense
            </ActionMenuItem>
          </ActionMenu>
        )}
      />

      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, expense: null })}
        onConfirm={handleDelete}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
