"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  Activity,
  AlertTriangle,
  Boxes,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

type Medicine = {
  id: number;
  name: string;
  category: string;
  manufacturer: string | null;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  expiryDate: string | null;
};

type MedicineForm = {
  name: string;
  category: string;
  manufacturer: string;
  unit: string;
  purchasePrice: string;
  sellingPrice: string;
  stockQuantity: string;
  lowStockThreshold: string;
  expiryDate: string;
};

const initialForm: MedicineForm = {
  name: "",
  category: "",
  manufacturer: "",
  unit: "Tablet",
  purchasePrice: "0",
  sellingPrice: "0",
  stockQuantity: "0",
  lowStockThreshold: "10",
  expiryDate: "",
};

const API_URL = "/api/pharmacy/medicines";

const formFields: {
  key: keyof MedicineForm;
  label: string;
  type: string;
}[] = [
  { key: "name", label: "Medicine Name", type: "text" },
  { key: "category", label: "Category", type: "text" },
  { key: "manufacturer", label: "Manufacturer", type: "text" },
  { key: "unit", label: "Unit", type: "text" },
  { key: "purchasePrice", label: "Purchase Price (Rs.)", type: "number" },
  { key: "sellingPrice", label: "Selling Price (Rs.)", type: "number" },
  { key: "stockQuantity", label: "Stock Quantity", type: "number" },
  { key: "lowStockThreshold", label: "Low Stock Threshold", type: "number" },
  { key: "expiryDate", label: "Expiry Date", type: "date" },
];

function toNumber(value: unknown): number {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function normalizeMedicine(value: unknown): Medicine | null {
  if (!value || typeof value !== "object") return null;

  const item = value as Record<string, unknown>;

  if (
    item.id === undefined ||
    typeof item.name !== "string" ||
    typeof item.category !== "string"
  ) {
    return null;
  }

  return {
    id: toNumber(item.id),
    name: item.name,
    category: item.category,
    manufacturer:
      typeof item.manufacturer === "string" ? item.manufacturer : null,
    unit: typeof item.unit === "string" ? item.unit : "Tablet",
    purchasePrice: toNumber(item.purchasePrice),
    sellingPrice: toNumber(item.sellingPrice),
    stockQuantity: toNumber(item.stockQuantity),
    lowStockThreshold: toNumber(item.lowStockThreshold),
    expiryDate:
      typeof item.expiryDate === "string"
        ? item.expiryDate
        : item.expiryDate instanceof Date
          ? item.expiryDate.toISOString()
          : null,
  };
}

async function getResponseData(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Invalid server response. HTTP status: ${response.status}`
    );
  }
}

function getError(data: unknown, fallback: string): string {
  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return fallback;
}

function currency(value: number): string {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

/** Returns the expiry as a timestamp, or null if missing/invalid. */
function parseExpiry(value: string | null): number | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

/** Today's date at midnight, expressed in UTC (matches how expiry dates are stored). */
function todayUtc(): number {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatExpiry(time: number): string {
  return new Date(time).toLocaleDateString("en-PK", { timeZone: "UTC" });
}

function isWholeNumber(value: string): boolean {
  if (value.trim() === "") return false;
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0;
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">{icon}</div>
      </div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<MedicineForm>(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadMedicines = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(getError(data, "Unable to load medicines."));
      }

      if (!Array.isArray(data)) {
        throw new Error("The API did not return a medicine list.");
      }

      const records = data
        .map(normalizeMedicine)
        .filter((item): item is Medicine => item !== null);

      setMedicines(records);

      if (records.length !== data.length) {
        setError(
          `${data.length - records.length} record(s) had invalid data and were skipped.`
        );
      }
    } catch (err) {
      console.error("PHARMACY GET ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load medicines."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMedicines();
  }, [loadMedicines]);

  function updateForm(key: keyof MedicineForm, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setShowForm(false);
  }

  async function saveMedicine() {
    setError("");
    setMessage("");

    if (!form.name.trim() || !form.category.trim()) {
      setError("Medicine name and category are required.");
      return;
    }

    if (
      !isWholeNumber(form.stockQuantity) ||
      !isWholeNumber(form.lowStockThreshold)
    ) {
      setError("Stock quantity and low stock threshold must be whole numbers.");
      return;
    }

    const purchasePrice = Number(form.purchasePrice);
    const sellingPrice = Number(form.sellingPrice);
    if (
      !Number.isFinite(purchasePrice) ||
      purchasePrice < 0 ||
      !Number.isFinite(sellingPrice) ||
      sellingPrice < 0
    ) {
      setError("Prices must be valid non-negative numbers.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          category: form.category.trim(),
          manufacturer: form.manufacturer.trim() || null,
          purchasePrice,
          sellingPrice,
          stockQuantity: Number(form.stockQuantity),
          lowStockThreshold: Number(form.lowStockThreshold),
          expiryDate: form.expiryDate || null,
        }),
      });
      const data = await getResponseData(response);
      if (!response.ok) {
        throw new Error(getError(data, "Unable to save medicine."));
      }

      resetForm();
      setMessage("Medicine added successfully.");
      await loadMedicines();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save medicine.");
    } finally {
      setSaving(false);
    }
  }

  const filteredMedicines = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return medicines;
    return medicines.filter((medicine) =>
      [medicine.name, medicine.category, medicine.manufacturer ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [medicines, search]);

  const lowStockCount = medicines.filter(
    (medicine) => medicine.stockQuantity <= medicine.lowStockThreshold
  ).length;
  const expiredCount = medicines.filter((medicine) => {
    const expiry = parseExpiry(medicine.expiryDate);
    return expiry !== null && expiry < todayUtc();
  }).length;
  const totalUnits = medicines.reduce(
    (total, medicine) => total + medicine.stockQuantity,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">Inventory</p>
            <h1 className="text-3xl font-bold">Pharmacy</h1>
            <p className="mt-1 text-slate-500">Manage medicines and stock levels.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void loadMedicines()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setShowForm((visible) => !visible)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? "Close" : "Add medicine"}
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertTriangle className="mr-2 inline" size={18} />{error}
          </div>
        )}
        {message && (
          <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void saveMedicine();
            }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold">Add medicine</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {formFields.map(({ key, label, type }) => (
                <label key={key} className="space-y-1 text-sm font-medium">
                  <span>{label}</span>
                  <input
                    type={type}
                    min={type === "number" ? "0" : undefined}
                    step={type === "number" && key.includes("Price") ? "0.01" : undefined}
                    value={form[key]}
                    onChange={(event) => updateForm(key, event.target.value)}
                    required={key === "name" || key === "category"}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </label>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Save medicine
              </button>
            </div>
          </form>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Medicine types" value={medicines.length} icon={<Boxes size={20} />} />
          <StatCard title="Units in stock" value={totalUnits.toLocaleString("en-PK")} icon={<ShoppingCart size={20} />} />
          <StatCard title="Low stock" value={lowStockCount} icon={<AlertTriangle size={20} />} />
          <StatCard title="Expired" value={expiredCount} icon={<Activity size={20} />} />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
            <h2 className="text-lg font-semibold">Medicine inventory</h2>
            <label className="relative block w-full sm:max-w-xs">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search medicines"
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 outline-none focus:border-blue-500"
              />
            </label>
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-slate-500">
              <Loader2 size={20} className="animate-spin" /> Loading medicines…
            </div>
          ) : filteredMedicines.length === 0 ? (
            <p className="p-10 text-center text-slate-500">No medicines found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Medicine</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium">Selling price</th>
                    <th className="px-5 py-3 font-medium">Expiry</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMedicines.map((medicine) => {
                    const expiry = parseExpiry(medicine.expiryDate);
                    const isExpired = expiry !== null && expiry < todayUtc();
                    const isLow = medicine.stockQuantity <= medicine.lowStockThreshold;
                    return (
                      <tr key={medicine.id}>
                        <td className="px-5 py-4">
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-slate-500">{medicine.manufacturer || "—"}</p>
                        </td>
                        <td className="px-5 py-4">{medicine.category}</td>
                        <td className="px-5 py-4">{medicine.stockQuantity} {medicine.unit}</td>
                        <td className="px-5 py-4">{currency(medicine.sellingPrice)}</td>
                        <td className="px-5 py-4">{expiry === null ? "—" : formatExpiry(expiry)}</td>
                        <td className="px-5 py-4">
                          {isExpired ? (
                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">Expired</span>
                          ) : isLow ? (
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">Low stock</span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">In stock</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}