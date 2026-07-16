"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  DollarSign,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  UserPlus,
  FileText,
} from "lucide-react";
import { StatsCard, MiniStatsCard } from "@/components/admin/ui/stats-card";
import { StatusBadge, PriorityBadge, ProjectStatusBadge } from "@/components/admin/ui/badges";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDateTime, LEAD_STATUS_CONFIG } from "@/lib/admin/constants";
import type { Lead, Project, InventoryItem } from "@/types/database";

interface DashboardData {
  leads: {
    total: number;
    new: number;
    contacted: number;
    won: number;
    lost: number;
    recentLeads: Lead[];
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    recentProjects: Project[];
  };
  inventory: {
    totalItems: number;
    lowStock: InventoryItem[];
  };
  finance: {
    revenue: number;
    expenses: number;
    outstanding: number;
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          leadsRes,
          newLeadsRes,
          contactedLeadsRes,
          wonLeadsRes,
          lostLeadsRes,
          recentLeadsRes,
          projectsRes,
          activeProjectsRes,
          completedProjectsRes,
          recentProjectsRes,
          inventoryRes,
          lowStockRes,
          invoicesRes,
          paidInvoicesRes,
          expensesRes,
        ] = await Promise.all([
          supabase.from("leads").select("*", { count: "exact", head: true }),
          supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "contacted"),
          supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "won"),
          supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "lost"),
          supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("projects").select("*", { count: "exact", head: true }).in("status", ["planning", "in_progress", "installation", "testing"]),
          supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "completed"),
          supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(5),
          supabase.from("inventory").select("*", { count: "exact", head: true }),
          supabase.from("inventory").select("*").lt("quantity", 5).order("quantity", { ascending: true }).limit(5),
          supabase.from("invoices").select("total_amount").eq("status", "sent"),
          supabase.from("invoices").select("total_amount").eq("status", "paid"),
          supabase.from("expenses").select("amount"),
        ]);

        const revenue = paidInvoicesRes.data?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
        const outstanding = invoicesRes.data?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
        const expenses = expensesRes.data?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;

        setData({
          leads: {
            total: leadsRes.count ?? 0,
            new: newLeadsRes.count ?? 0,
            contacted: contactedLeadsRes.count ?? 0,
            won: wonLeadsRes.count ?? 0,
            lost: lostLeadsRes.count ?? 0,
            recentLeads: (recentLeadsRes.data as Lead[]) ?? [],
          },
          projects: {
            total: projectsRes.count ?? 0,
            active: activeProjectsRes.count ?? 0,
            completed: completedProjectsRes.count ?? 0,
            recentProjects: (recentProjectsRes.data as Project[]) ?? [],
          },
          inventory: {
            totalItems: inventoryRes.count ?? 0,
            lowStock: (lowStockRes.data as InventoryItem[]) ?? [],
          },
          finance: {
            revenue,
            outstanding,
            expenses,
          },
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  const quickActions = [
    { label: "Add Lead", href: "/admin/leads/new", icon: UserPlus },
    { label: "Create Project", href: "/admin/projects/new", icon: FolderKanban },
    { label: "Add Inventory", href: "/admin/inventory/new", icon: Package },
    { label: "New Invoice", href: "/admin/invoices/new", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here&apos;s what&apos;s happening with your business.
          </p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <Clock className="mr-1.5 inline h-4 w-4" />
          {new Date().toLocaleDateString("en-GH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Leads"
          value={data?.leads.total ?? 0}
          change={12}
          icon={Users}
          iconColor="text-blue-600"
          loading={loading}
        />
        <StatsCard
          title="Active Projects"
          value={data?.projects.active ?? 0}
          change={8}
          icon={FolderKanban}
          iconColor="text-purple-600"
          loading={loading}
        />
        <StatsCard
          title="Revenue"
          value={formatCurrency(data?.finance.revenue ?? 0)}
          change={15}
          icon={DollarSign}
          iconColor="text-green-600"
          loading={loading}
        />
        <StatsCard
          title="Low Stock Items"
          value={data?.inventory.lowStock.length ?? 0}
          icon={Package}
          iconColor="text-orange-600"
          loading={loading}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <action.icon className="h-4 w-4 text-brand-600" />
            {action.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Lead Status</h2>
            <Link
              href="/admin/leads"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStatsCard
              label="New"
              value={data?.leads.new ?? 0}
              color="text-blue-700"
              bgColor="bg-blue-50"
            />
            <MiniStatsCard
              label="Contacted"
              value={data?.leads.contacted ?? 0}
              color="text-yellow-700"
              bgColor="bg-yellow-50"
            />
            <MiniStatsCard
              label="Won"
              value={data?.leads.won ?? 0}
              color="text-green-700"
              bgColor="bg-green-50"
            />
            <MiniStatsCard
              label="Lost"
              value={data?.leads.lost ?? 0}
              color="text-red-700"
              bgColor="bg-red-50"
            />
          </div>
          {data?.leads.total && data.leads.won ? (
            <div className="mt-4 rounded-lg bg-slate-50 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Conversion Rate</span>
                <span className="font-semibold text-green-600">
                  {((data.leads.won / data.leads.total) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${(data.leads.won / data.leads.total) * 100}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Financial Overview</h2>
            <Link
              href="/admin/reports"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Reports <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-green-100 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-700">Total Revenue</span>
              </div>
              <span className="text-lg font-bold text-green-700">
                {formatCurrency(data?.finance.revenue ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-700">Total Expenses</span>
              </div>
              <span className="text-lg font-bold text-red-700">
                {formatCurrency(data?.finance.expenses ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-yellow-100 bg-yellow-50 p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-700">Outstanding</span>
              </div>
              <span className="text-lg font-bold text-yellow-700">
                {formatCurrency(data?.finance.outstanding ?? 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
            <Link
              href="/admin/leads"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-500">Loading...</div>
            ) : data?.leads.recentLeads.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">No leads yet</div>
            ) : (
              data?.leads.recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{lead.name}</p>
                    <p className="text-sm text-slate-500">{lead.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={lead.status} />
                    <PriorityBadge priority={lead.priority} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Active Projects</h2>
            <Link
              href="/admin/projects"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-500">Loading...</div>
            ) : data?.projects.recentProjects.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">No projects yet</div>
            ) : (
              data?.projects.recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{project.project_name}</p>
                    <p className="text-sm text-slate-500">{project.client_name}</p>
                  </div>
                  <ProjectStatusBadge status={project.status} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {data?.inventory.lowStock && data.inventory.lowStock.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-900">Low Stock Alert</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.inventory.lowStock.map((item) => (
              <Link
                key={item.id}
                href={`/admin/inventory/${item.id}`}
                className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition-colors hover:bg-orange-100"
              >
                <div>
                  <p className="font-medium text-slate-900">{item.item_name}</p>
                  <p className="text-sm text-slate-500">{item.category}</p>
                </div>
                <span className="text-lg font-bold text-orange-600">{item.quantity}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
