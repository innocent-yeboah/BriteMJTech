"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, TrendingUp, TrendingDown, DollarSign, Users, FolderKanban, Package } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Select, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, SERVICES_LIST } from "@/lib/admin/constants";

interface ReportData {
  revenue: {
    total: number;
    byMonth: { month: string; amount: number }[];
  };
  leads: {
    total: number;
    converted: number;
    conversionRate: number;
    bySource: { source: string; count: number }[];
    byService: { service: string; count: number }[];
  };
  projects: {
    total: number;
    completed: number;
    byType: { type: string; count: number }[];
  };
  expenses: {
    total: number;
    byCategory: { category: string; amount: number }[];
  };
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("year");

  const supabase = createClient();

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      if (dateRange === "month") {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (dateRange === "quarter") {
        startDate.setMonth(startDate.getMonth() - 3);
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const [leadsRes, projectsRes, invoicesRes, expensesRes] = await Promise.all([
        supabase.from("leads").select("*").gte("created_at", startDate.toISOString()),
        supabase.from("projects").select("*").gte("created_at", startDate.toISOString()),
        supabase.from("invoices").select("*").eq("status", "paid").gte("created_at", startDate.toISOString()),
        supabase.from("expenses").select("*").gte("expense_date", startDate.toISOString().split("T")[0]),
      ]);

      const leads = leadsRes.data || [];
      const projects = projectsRes.data || [];
      const invoices = invoicesRes.data || [];
      const expenses = expensesRes.data || [];

      const leadsBySource = leads.reduce((acc, lead) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const leadsByService = leads.reduce((acc, lead) => {
        (lead.service_interest || []).forEach((service: string) => {
          acc[service] = (acc[service] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const projectsByType = projects.reduce((acc, project) => {
        if (project.project_type) {
          acc[project.project_type] = (acc[project.project_type] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const expensesByCategory = expenses.reduce((acc, expense) => {
        const cat = expense.category || "other";
        acc[cat] = (acc[cat] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);

      const revenueByMonth = invoices.reduce((acc, inv) => {
        const month = new Date(inv.paid_at || inv.created_at).toLocaleString("en-GH", {
          month: "short",
          year: "2-digit",
        });
        acc[month] = (acc[month] || 0) + inv.total_amount;
        return acc;
      }, {} as Record<string, number>);

      setData({
        revenue: {
          total: invoices.reduce((sum, inv) => sum + inv.total_amount, 0),
          byMonth: Object.entries(revenueByMonth).map(([month, amount]) => ({
            month,
            amount: amount as number,
          })),
        },
        leads: {
          total: leads.length,
          converted: leads.filter((l) => l.status === "won").length,
          conversionRate:
            leads.length > 0
              ? (leads.filter((l) => l.status === "won").length / leads.length) * 100
              : 0,
          bySource: Object.entries(leadsBySource).map(([source, count]) => ({
            source,
            count: count as number,
          })),
          byService: Object.entries(leadsByService)
            .map(([service, count]) => ({
              service: SERVICES_LIST.find((s) => s.value === service)?.label || service,
              count: count as number,
            }))
            .sort((a, b) => b.count - a.count),
        },
        projects: {
          total: projects.length,
          completed: projects.filter((p) => p.status === "completed").length,
          byType: Object.entries(projectsByType).map(([type, count]) => ({
            type,
            count: count as number,
          })),
        },
        expenses: {
          total: expenses.reduce((sum, e) => sum + e.amount, 0),
          byCategory: Object.entries(expensesByCategory)
            .map(([category, amount]) => ({
              category,
              amount: amount as number,
            }))
            .sort((a, b) => b.amount - a.amount),
        },
      });
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, dateRange]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const exportReport = () => {
    if (!data) return;
    const reportText = `
BRITE MJ TECHNOLOGIES - BUSINESS REPORT
Generated: ${new Date().toLocaleDateString("en-GH")}
Period: ${dateRange === "month" ? "Last Month" : dateRange === "quarter" ? "Last Quarter" : "Last Year"}

REVENUE
Total Revenue: ${formatCurrency(data.revenue.total)}

LEADS
Total Leads: ${data.leads.total}
Converted: ${data.leads.converted}
Conversion Rate: ${data.leads.conversionRate.toFixed(1)}%

PROJECTS
Total Projects: ${data.projects.total}
Completed: ${data.projects.completed}

EXPENSES
Total Expenses: ${formatCurrency(data.expenses.total)}
Profit: ${formatCurrency(data.revenue.total - data.expenses.total)}
    `.trim();

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brite-mj-report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Reports" description="Business analytics and insights" />
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  const profit = (data?.revenue.total ?? 0) - (data?.expenses.total ?? 0);

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Business analytics and insights"
        actions={
          <div className="flex items-center gap-3">
            <Select
              options={[
                { value: "month", label: "Last Month" },
                { value: "quarter", label: "Last Quarter" },
                { value: "year", label: "Last Year" },
              ]}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-36"
            />
            <Button variant="secondary" icon={<Download className="h-4 w-4" />} onClick={exportReport}>
              Export
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Revenue</p>
              <p className="mt-1 text-2xl font-bold text-green-700">
                {formatCurrency(data?.revenue.total ?? 0)}
              </p>
            </div>
            <div className="rounded-xl bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Expenses</p>
              <p className="mt-1 text-2xl font-bold text-red-700">
                {formatCurrency(data?.expenses.total ?? 0)}
              </p>
            </div>
            <div className="rounded-xl bg-red-100 p-3">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl border p-6 ${profit >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                Profit
              </p>
              <p className={`mt-1 text-2xl font-bold ${profit >= 0 ? "text-green-700" : "text-red-700"}`}>
                {formatCurrency(profit)}
              </p>
            </div>
            <div className={`rounded-xl p-3 ${profit >= 0 ? "bg-green-100" : "bg-red-100"}`}>
              <DollarSign className={`h-6 w-6 ${profit >= 0 ? "text-green-600" : "text-red-600"}`} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Conversion Rate</p>
              <p className="mt-1 text-2xl font-bold text-blue-700">
                {data?.leads.conversionRate.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-xl bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Lead Sources</h3>
          <div className="space-y-3">
            {data?.leads.bySource.map((item) => (
              <div key={item.source} className="flex items-center justify-between">
                <span className="text-sm capitalize text-slate-600">
                  {item.source.replace("_", " ")}
                </span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{
                        width: `${(item.count / (data?.leads.total || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-medium text-slate-900">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Popular Services</h3>
          <div className="space-y-3">
            {data?.leads.byService.slice(0, 6).map((item) => (
              <div key={item.service} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{item.service}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{
                        width: `${(item.count / Math.max(...(data?.leads.byService.map((s) => s.count) || [1]))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-medium text-slate-900">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Expense Breakdown</h3>
          <div className="space-y-3">
            {data?.expenses.byCategory.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-sm capitalize text-slate-600">
                  {item.category.replace("_", " ")}
                </span>
                <span className="text-sm font-medium text-slate-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Key Metrics</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                <p className="text-sm text-slate-500">Total Leads</p>
              </div>
              <p className="mt-1 text-xl font-bold text-slate-900">{data?.leads.total}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                <p className="text-sm text-slate-500">Converted</p>
              </div>
              <p className="mt-1 text-xl font-bold text-green-600">{data?.leads.converted}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-slate-400" />
                <p className="text-sm text-slate-500">Projects</p>
              </div>
              <p className="mt-1 text-xl font-bold text-slate-900">{data?.projects.total}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-slate-400" />
                <p className="text-sm text-slate-500">Completed</p>
              </div>
              <p className="mt-1 text-xl font-bold text-green-600">{data?.projects.completed}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
