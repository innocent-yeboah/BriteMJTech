"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Input, Textarea, Select, MultiSelect, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { leadSchema, type LeadFormData } from "@/lib/validations/admin";
import { SERVICES_LIST, PROPERTY_TYPES, PROPERTY_SIZES } from "@/lib/admin/constants";

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serviceInterest, setServiceInterest] = useState<string[]>([]);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: "new",
      priority: "normal",
      source: "website",
      service_interest: [],
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        ...data,
        service_interest: serviceInterest,
        email: data.email || null,
      });

      if (error) throw error;
      router.push("/admin/leads");
    } catch (error) {
      console.error("Failed to create lead:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New Lead"
        description="Create a new lead from a potential customer"
        backHref="/admin/leads"
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

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Lead
          </Button>
        </div>
      </form>
    </div>
  );
}
