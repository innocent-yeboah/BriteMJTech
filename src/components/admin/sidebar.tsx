"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Package,
  FileText,
  Receipt,
  Calendar,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Trophy,
  XCircle,
  Boxes,
  AlertTriangle,
  DollarSign,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { useState } from "react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: { name: string; href: string; icon?: React.ElementType }[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "Leads",
    href: "/admin/leads",
    icon: Users,
    children: [
      { name: "All Leads", href: "/admin/leads" },
      { name: "New Leads", href: "/admin/leads?status=new", icon: UserPlus },
      { name: "Won Leads", href: "/admin/leads?status=won", icon: Trophy },
      { name: "Lost Leads", href: "/admin/leads?status=lost", icon: XCircle },
    ],
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
    children: [
      { name: "All Projects", href: "/admin/projects" },
      { name: "Active Projects", href: "/admin/projects?status=active" },
      { name: "Completed", href: "/admin/projects?status=completed" },
    ],
  },
  {
    name: "Inventory",
    href: "/admin/inventory",
    icon: Package,
    children: [
      { name: "All Items", href: "/admin/inventory" },
      { name: "Low Stock", href: "/admin/inventory?filter=low-stock", icon: AlertTriangle },
      { name: "Categories", href: "/admin/inventory/categories", icon: Boxes },
    ],
  },
  {
    name: "Finance",
    href: "/admin/invoices",
    icon: DollarSign,
    children: [
      { name: "Invoices", href: "/admin/invoices", icon: FileText },
      { name: "Expenses", href: "/admin/expenses", icon: Receipt },
      { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    name: "Team",
    href: "/admin/team",
    icon: Users,
    children: [
      { name: "Staff", href: "/admin/team" },
      { name: "Schedule", href: "/admin/team/schedule", icon: Calendar },
    ],
  },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Leads", "Projects", "Inventory", "Finance", "Team"]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-brand-950 transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <Logo variant="light" className="h-8" />
          </Link>
        )}
        {collapsed && (
          <Link href="/admin" className="mx-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-brand-950 font-bold">
              MJ
            </div>
          </Link>
        )}
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.name);
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </>
                      )}
                    </button>
                    {!collapsed && isExpanded && (
                      <ul className="mt-1 space-y-1 pl-10">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                                pathname === child.href ||
                                  (child.href.includes("?") && pathname === child.href.split("?")[0])
                                  ? "bg-accent/10 text-accent"
                                  : "text-white/60 hover:bg-white/5 hover:text-white"
                              )}
                            >
                              {child.icon && <child.icon className="h-4 w-4" />}
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={onToggleCollapse}
          className="hidden w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
