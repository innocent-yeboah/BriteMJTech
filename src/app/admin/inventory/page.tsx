"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, Pencil, Trash2, AlertTriangle, Package, Plus, Minus } from "lucide-react";
import { PageHeader, AddButton } from "@/components/admin/ui/page-header";
import { DataTable, ActionMenu, ActionMenuItem, type Column } from "@/components/admin/ui/data-table";
import { ConfirmModal, Modal } from "@/components/admin/ui/modal";
import { Select, Input, Textarea, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, INVENTORY_CATEGORY_CONFIG } from "@/lib/admin/constants";
import type { InventoryItem, TransactionType } from "@/types/database";

function InventoryContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: InventoryItem | null }>({
    open: false,
    item: null,
  });
  const [adjustModal, setAdjustModal] = useState<{ open: boolean; item: InventoryItem | null }>({
    open: false,
    item: null,
  });
  const [adjustment, setAdjustment] = useState({
    type: "received" as TransactionType,
    quantity: 1,
    notes: "",
  });
  const [deleting, setDeleting] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    lowStock: filterParam === "low-stock",
  });

  const supabase = createClient();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("inventory")
        .select("*")
        .order("item_name", { ascending: true });

      if (filters.category) {
        query = query.eq("category", filters.category);
      }
      if (filters.lowStock) {
        query = query.lt("quantity", 5);
      }

      const { data, error } = await query;
      if (error) throw error;
      setItems((data as InventoryItem[]) ?? []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async () => {
    if (!deleteModal.item) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("inventory").delete().eq("id", deleteModal.item.id);
      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== deleteModal.item!.id));
      setDeleteModal({ open: false, item: null });
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleAdjust = async () => {
    if (!adjustModal.item) return;
    setAdjusting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      let newQuantity = adjustModal.item.quantity;
      if (adjustment.type === "received" || adjustment.type === "returned") {
        newQuantity += adjustment.quantity;
      } else if (adjustment.type === "used") {
        newQuantity -= adjustment.quantity;
      } else {
        newQuantity = adjustment.quantity;
      }

      const [transRes, updateRes] = await Promise.all([
        supabase.from("inventory_transactions").insert({
          inventory_id: adjustModal.item.id,
          transaction_type: adjustment.type,
          quantity: adjustment.quantity,
          notes: adjustment.notes || null,
          created_by: user?.id,
        }),
        supabase
          .from("inventory")
          .update({
            quantity: Math.max(0, newQuantity),
            last_restocked: adjustment.type === "received" ? new Date().toISOString().split("T")[0] : undefined,
          })
          .eq("id", adjustModal.item.id),
      ]);

      if (transRes.error) throw transRes.error;
      if (updateRes.error) throw updateRes.error;

      setItems((prev) =>
        prev.map((i) =>
          i.id === adjustModal.item!.id ? { ...i, quantity: Math.max(0, newQuantity) } : i
        )
      );
      setAdjustModal({ open: false, item: null });
      setAdjustment({ type: "received", quantity: 1, notes: "" });
    } catch (error) {
      console.error("Failed to adjust inventory:", error);
    } finally {
      setAdjusting(false);
    }
  };

  const columns: Column<InventoryItem>[] = [
    {
      key: "item_name",
      header: "Item",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <Package className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{item.item_name}</p>
            {item.sku && <p className="text-sm text-slate-500">SKU: {item.sku}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item) => (
        <span className="text-sm text-slate-600">
          {item.category ? INVENTORY_CATEGORY_CONFIG[item.category]?.label : "—"}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      sortable: true,
      align: "center",
      render: (item) => {
        const isLow = item.quantity <= item.reorder_point;
        return (
          <div className="flex items-center justify-center gap-2">
            <span
              className={`text-lg font-bold ${
                isLow ? "text-red-600" : "text-slate-900"
              }`}
            >
              {item.quantity}
            </span>
            {isLow && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
        );
      },
    },
    {
      key: "unit_price",
      header: "Unit Price",
      align: "right",
      render: (item) => (
        <span className="text-sm font-medium text-slate-900">
          {item.unit_price ? formatCurrency(item.unit_price) : "—"}
        </span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (item) => (
        <span className="text-sm text-slate-600">{item.location || "—"}</span>
      ),
    },
  ];

  const filterComponent = (
    <div className="flex flex-wrap items-center gap-4">
      <Select
        options={[
          { value: "", label: "All Categories" },
          ...Object.entries(INVENTORY_CATEGORY_CONFIG).map(([value, config]) => ({
            value,
            label: config.label,
          })),
        ]}
        value={filters.category}
        onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        className="w-48"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.lowStock}
          onChange={(e) => setFilters((f) => ({ ...f, lowStock: e.target.checked }))}
          className="h-4 w-4 rounded border-slate-300 text-brand-600"
        />
        <span className="text-slate-700">Show low stock only</span>
      </label>
    </div>
  );

  const lowStockCount = items.filter((i) => i.quantity <= i.reorder_point).length;
  const totalValue = items.reduce(
    (sum, i) => sum + (i.unit_price ?? 0) * i.quantity,
    0
  );

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Track and manage equipment and supplies"
        actions={<AddButton href="/admin/inventory/new">Add Item</AddButton>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total Items</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{items.length}</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm text-orange-600">Low Stock Items</p>
          <p className="mt-1 text-2xl font-bold text-orange-700">{lowStockCount}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-600">Total Value</p>
          <p className="mt-1 text-2xl font-bold text-green-700">{formatCurrency(totalValue)}</p>
        </div>
      </div>

      <DataTable
        data={items}
        columns={columns}
        keyField="id"
        loading={loading}
        searchable
        searchPlaceholder="Search inventory..."
        searchFields={["item_name", "sku", "supplier"]}
        filterComponent={filterComponent}
        emptyMessage="No inventory items found. Add your first item to get started."
        actions={(item) => (
          <ActionMenu>
            <ActionMenuItem
              icon={Eye}
              onClick={() => (window.location.href = `/admin/inventory/${item.id}`)}
            >
              View Details
            </ActionMenuItem>
            <ActionMenuItem
              icon={Plus}
              onClick={() => {
                setAdjustModal({ open: true, item });
                setAdjustment({ type: "received", quantity: 1, notes: "" });
              }}
            >
              Adjust Stock
            </ActionMenuItem>
            <ActionMenuItem
              icon={Pencil}
              onClick={() => (window.location.href = `/admin/inventory/${item.id}/edit`)}
            >
              Edit Item
            </ActionMenuItem>
            <ActionMenuItem
              icon={Trash2}
              variant="danger"
              onClick={() => setDeleteModal({ open: true, item })}
            >
              Delete Item
            </ActionMenuItem>
          </ActionMenu>
        )}
      />

      <Modal
        open={adjustModal.open}
        onClose={() => setAdjustModal({ open: false, item: null })}
        title={`Adjust Stock: ${adjustModal.item?.item_name}`}
        size="sm"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-sm text-slate-600">
              Current quantity:{" "}
              <span className="font-semibold text-slate-900">
                {adjustModal.item?.quantity}
              </span>
            </p>
          </div>
          <Select
            label="Transaction Type"
            options={[
              { value: "received", label: "Received (Add Stock)" },
              { value: "used", label: "Used (Remove Stock)" },
              { value: "returned", label: "Returned (Add Stock)" },
              { value: "adjusted", label: "Adjusted (Set to Value)" },
            ]}
            value={adjustment.type}
            onChange={(e) =>
              setAdjustment({ ...adjustment, type: e.target.value as TransactionType })
            }
          />
          <Input
            label={adjustment.type === "adjusted" ? "New Quantity" : "Quantity"}
            type="number"
            min={0}
            value={adjustment.quantity}
            onChange={(e) =>
              setAdjustment({ ...adjustment, quantity: parseInt(e.target.value) || 0 })
            }
          />
          <Textarea
            label="Notes"
            placeholder="Reason for adjustment..."
            value={adjustment.notes}
            onChange={(e) => setAdjustment({ ...adjustment, notes: e.target.value })}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setAdjustModal({ open: false, item: null })}>
              Cancel
            </Button>
            <Button onClick={handleAdjust} loading={adjusting}>
              Confirm Adjustment
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleDelete}
        title="Delete Item"
        description={`Are you sure you want to delete "${deleteModal.item?.item_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <InventoryContent />
    </Suspense>
  );
}
