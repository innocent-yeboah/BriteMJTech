"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Input, Textarea, Select, MultiSelect, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { leadSchema, type LeadFormData } from "@/lib/validations/admin";
import { SERVICES_LIST, PROPERTY_TYPES, PROPERTY_SIZES } from "@/lib/admin/constants";
import type { Lead } from "@/types/database";

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceInterest, setServiceInterest] = useState<string[]>([]);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  useEffect(() => {
    const fetchLead = async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Failed to fetch lead:", error);
        router.push("/admin/leads");
        return;
      }

      const lead = data as Lead;
      reset({
        name: lead.name,
        email: lead.email || "",
        phone: lead.phone,
        service_interest: lead.service_interest || [],
        property_type: lead.property_type || "",
        property_size: lead.property_size || "",
        message: lead.message || "",
        source: lead.source,
        status: lead.status,
        priority: lead.priority,
        notes: lead.notes || "",
        inspection_date: lead.inspection_date || null,
        inspection_time: lead.inspection_time || null,
        quote_amount: lead.quote_amount || null,
      });
      setServiceInterest(lead.service_interest || []);
      setLoading(false);
    };

    fetchLead();
  }, [id, supabase, router, reset]);

  const onSubmit = async (data: LeadFormData) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({
          ...data,
          service_interest: serviceInterest,
          email: data.email || null,
        })
        .eq("id", id);

      if (error) throw error;
      router.push(`/admin/leads/${id}`);
    } catch (error) {
      console.error("Failed to update lead:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Lead"
        description="Update lead information"
        backHref={`/admin/leads/${id}`}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Contact Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              placeholder="John Doe"
              {...register("name")}
              error={errors.name?.message}
              required
            />
            <Input
              label="Phone Number"
              placeholder="0203412477"
              {...register("phone")}
              error={errors.phone?.message}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              error={errors.email?.message}
              className="sm:col-span-2"
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Service Interest</h3>
          <MultiSelect
            label="Services Interested In"
            options={SERVICES_LIST}
            value={serviceInterest}
            onChange={(value) => {
              setServiceInterest(value);
              setValue("service_interest", value);
            }}
            error={errors.service_interest?.message}
            required
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Select
              label="Property Type"
              options={[{ value: "", label: "Select type" }, ...PROPERTY_TYPES]}
              {...register("property_type")}
            />
            <Select
              label="Property Size"
              options={[{ value: "", label: "Select size" }, ...PROPERTY_SIZES]}
              {...register("property_size")}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Message / Notes"
              placeholder="Additional details about the lead..."
              {...register("message")}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Lead Classification</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Lead Source"
              options={[
                { value: "website", label: "Website" },
                { value: "referral", label: "Referral" },
                { value: "walk_in", label: "Walk-in" },
                { value: "call", label: "Phone Call" },
                { value: "whatsapp", label: "WhatsApp" },
                { value: "social_media", label: "Social Media" },
              ]}
              {...register("source")}
              error={errors.source?.message}
              required
            />
            <Select
              label="Status"
              options={[
                { value: "new", label: "New" },
                { value: "contacted", label: "Contacted" },
                { value: "inspection_scheduled", label: "Inspection Scheduled" },
                { value: "quote_sent", label: "Quote Sent" },
                { value: "negotiating", label: "Negotiating" },
                { value: "won", label: "Won" },
                { value: "lost", label: "Lost" },
              ]}
              {...register("status")}
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
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Inspection & Quote</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Inspection Date"
              type="date"
              {...register("inspection_date")}
            />
            <Input
              label="Inspection Time"
              type="time"
              {...register("inspection_time")}
            />
            <Input
              label="Quote Amount (GHS)"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("quote_amount", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Internal Notes</h3>
          <Textarea
            label="Notes"
            placeholder="Internal notes about this lead..."
            {...register("notes")}
            rows={6}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
