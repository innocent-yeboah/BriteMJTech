"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ElementType;
  iconColor?: string;
  className?: string;
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon: Icon,
  iconColor = "text-brand-600",
  className,
  loading = false,
}: StatsCardProps) {
  const getTrendIcon = () => {
    if (!change || change === 0) return Minus;
    return change > 0 ? TrendingUp : TrendingDown;
  };

  const getTrendColor = () => {
    if (!change || change === 0) return "text-slate-500";
    return change > 0 ? "text-green-600" : "text-red-600";
  };

  const TrendIcon = getTrendIcon();

  if (loading) {
    return (
      <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
        <div className="animate-pulse">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-32 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-20 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              <TrendIcon className={cn("h-4 w-4", getTrendColor())} />
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              <span className="text-sm text-slate-500">{changeLabel}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("rounded-xl bg-slate-100 p-3", iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}

export function MiniStatsCard({
  label,
  value,
  color = "text-slate-900",
  bgColor = "bg-slate-100",
  className,
}: {
  label: string;
  value: string | number;
  color?: string;
  bgColor?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg p-4", bgColor, className)}>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold", color)}>{value}</p>
    </div>
  );
}
