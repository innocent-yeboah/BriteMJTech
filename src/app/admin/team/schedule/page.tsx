"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, User } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Modal } from "@/components/admin/ui/modal";
import { Select, Textarea, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { SHIFT_CONFIG } from "@/lib/admin/constants";
import type { User as UserType, TeamSchedule, ShiftType, Project } from "@/types/database";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<(TeamSchedule & { user?: UserType; project?: Project })[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));
  const [scheduleModal, setScheduleModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    user_id: "",
    date: "",
    shift: "full_day" as ShiftType,
    project_id: "",
    notes: "",
  });

  const supabase = createClient();

  function getStartOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getWeekDays(startDate: Date) {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  }

  const weekDays = getWeekDays(currentWeek);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = currentWeek.toISOString().split("T")[0];
      const endDate = new Date(currentWeek);
      endDate.setDate(endDate.getDate() + 6);

      const [schedulesRes, usersRes, projectsRes] = await Promise.all([
        supabase
          .from("team_schedule")
          .select("*, user:users(*), project:projects(*)")
          .gte("date", startDate)
          .lte("date", endDate.toISOString().split("T")[0]),
        supabase.from("users").select("*").eq("is_active", true).order("full_name"),
        supabase.from("projects").select("*").in("status", ["planning", "in_progress", "installation", "testing"]),
      ]);

      setSchedules((schedulesRes.data as (TeamSchedule & { user?: UserType; project?: Project })[]) ?? []);
      setUsers((usersRes.data as UserType[]) ?? []);
      setProjects((projectsRes.data as Project[]) ?? []);
    } catch (error) {
      console.error("Failed to fetch schedule data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, currentWeek]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddSchedule = async () => {
    if (!newSchedule.user_id || !newSchedule.date) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("team_schedule")
        .insert({
          user_id: newSchedule.user_id,
          date: newSchedule.date,
          shift: newSchedule.shift,
          project_id: newSchedule.project_id || null,
          notes: newSchedule.notes || null,
        })
        .select("*, user:users(*), project:projects(*)")
        .single();

      if (error) throw error;
      setSchedules([...schedules, data as TeamSchedule & { user?: UserType; project?: Project }]);
      setScheduleModal(false);
      setNewSchedule({ user_id: "", date: "", shift: "full_day", project_id: "", notes: "" });
    } catch (error) {
      console.error("Failed to add schedule:", error);
    } finally {
      setSaving(false);
    }
  };

  const prevWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const formatWeekRange = () => {
    const end = new Date(currentWeek);
    end.setDate(end.getDate() + 6);
    return `${currentWeek.toLocaleDateString("en-GH", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-GH", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const getScheduleForDay = (userId: string, date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return schedules.find((s) => s.user_id === userId && s.date === dateStr);
  };

  return (
    <div>
      <PageHeader
        title="Team Schedule"
        description="Manage staff schedules and assignments"
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setScheduleModal(true)}>
            Add Schedule
          </Button>
        }
      />

      <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
        <button
          onClick={prevWeek}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-slate-900">{formatWeekRange()}</h2>
        <button
          onClick={nextWeek}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-48 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Team Member
                </th>
                {weekDays.map((day) => (
                  <th
                    key={day.toISOString()}
                    className="px-2 py-3 text-center text-sm font-semibold text-slate-700"
                  >
                    <div>{day.toLocaleDateString("en-GH", { weekday: "short" })}</div>
                    <div className="text-xs text-slate-500">
                      {day.toLocaleDateString("en-GH", { day: "numeric" })}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No team members found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {user.full_name || user.email}
                          </p>
                          <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day) => {
                      const schedule = getScheduleForDay(user.id, day);
                      return (
                        <td key={day.toISOString()} className="px-2 py-2 text-center">
                          {schedule ? (
                            <div
                              className="rounded-lg bg-brand-100 px-2 py-1.5 text-xs"
                              title={schedule.project?.project_name || schedule.notes || ""}
                            >
                              <p className="font-medium text-brand-700">
                                {SHIFT_CONFIG[schedule.shift!]?.label || schedule.shift}
                              </p>
                              {schedule.project && (
                                <p className="mt-0.5 truncate text-brand-600">
                                  {schedule.project.project_name}
                                </p>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setNewSchedule({
                                  ...newSchedule,
                                  user_id: user.id,
                                  date: day.toISOString().split("T")[0],
                                });
                                setScheduleModal(true);
                              }}
                              className="h-8 w-full rounded border-2 border-dashed border-slate-200 text-slate-400 hover:border-brand-300 hover:text-brand-600"
                            >
                              +
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={scheduleModal}
        onClose={() => setScheduleModal(false)}
        title="Add Schedule"
        size="sm"
      >
        <div className="space-y-4">
          <Select
            label="Team Member"
            options={[
              { value: "", label: "Select member" },
              ...users.map((u) => ({ value: u.id, label: u.full_name || u.email })),
            ]}
            value={newSchedule.user_id}
            onChange={(e) => setNewSchedule({ ...newSchedule, user_id: e.target.value })}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                value={newSchedule.date}
                onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <Select
              label="Shift"
              options={Object.entries(SHIFT_CONFIG).map(([value, config]) => ({
                value,
                label: `${config.label} (${config.hours})`,
              }))}
              value={newSchedule.shift}
              onChange={(e) => setNewSchedule({ ...newSchedule, shift: e.target.value as ShiftType })}
            />
          </div>
          <Select
            label="Project Assignment"
            options={[
              { value: "", label: "No project" },
              ...projects.map((p) => ({ value: p.id, label: p.project_name })),
            ]}
            value={newSchedule.project_id}
            onChange={(e) => setNewSchedule({ ...newSchedule, project_id: e.target.value })}
          />
          <Textarea
            label="Notes"
            placeholder="Additional notes..."
            value={newSchedule.notes}
            onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setScheduleModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSchedule}
              loading={saving}
              disabled={!newSchedule.user_id || !newSchedule.date}
            >
              Add Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
