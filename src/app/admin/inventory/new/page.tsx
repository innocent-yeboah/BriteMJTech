"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Input, Textarea, Select, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { inventorySchema, type InventoryFormData } from "@/lib/validations/admin";
import { INVENTORY_CATEGORY_CONFIG } from "@/lib/admin/constants";

export default function NewInventoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      quantity: 0,
      min_quantity: 5,
      max_quantity: 100,
      reorder_point: 5,
    },
  });

  const onSubmit = async (data: InventoryFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("inventory").insert({
        ...data,
        sku: data.sku || null,
        created_by: user?.id,
      });

      if (error) throw error;
      router.push("/admin/inventory");
    } catch (error) {
      console.error("Failed to create inventory item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add Inventory Item"
        description="Add a new item to your inventory"
        backHref="/admin/inventory"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Item Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Item Name"
              placeholder="Hikvision 4MP Dome Camera"
              {...register("item_name")}
              error={errors.item_name?.message}
              required
              className="sm:col-span-2"
            />
            <Select
              label="Category"
              options={[
                { value: "", label: "Select category" },
                ...Object.entries(INVENTORY_CATEGORY_CONFIG).map(([value, config]) => ({
                  value,
                  label: config.label,
                })),
              ]}
              {...register("category")}
              error={errors.category?.message}
              required
            />
            <Input
              label="SKU"
              placeholder="CAM-HIK-4MP-001"
              {...register("sku")}
              error={errors.sku?.message}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Description"
              placeholder="Item description and specifications..."
              {...register("description")}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Stock Information</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Initial Quantity"
              type="number"
              min={0}
              {...register("quantity", { valueAsNumber: true })}
              error={errors.quantity?.message}
              required
            />
            <Input
              label="Min Quantity"
              type="number"
              min={0}
              {...register("min_quantity", { valueAsNumber: true })}
              error={errors.min_quantity?.message}
            />
            <Input
              label="Max Quantity"
              type="number"
              min={1}
              {...register("max_quantity", { valueAsNumber: true })}
              error={errors.max_quantity?.message}
            />
            <Input
              label="Reorder Point"
              type="number"
              min={0}
              {...register("reorder_point", { valueAsNumber: true })}
              error={errors.reorder_point?.message}
              hint="Alert when stock falls below this level"
            />
            <Input
              label="Unit Price (GHS)"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("unit_price", { valueAsNumber: true })}
            />
            <Input
              label="Storage Location"
              placeholder="Warehouse A, Shelf 3"
              {...register("location")}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Supplier Information</h3>
          <Input
            label="Supplier"
            placeholder="Tech Distributors Ltd"
            {...register("supplier")}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Item
          </Button>
        </div>
      </form>
    </div>
  );
}
