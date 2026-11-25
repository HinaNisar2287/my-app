
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  CreditCard,
  Plus,
  Search,
  Eye,
  Trash2,
  Printer,
  X,
  Wallet,
  Receipt,
} from "lucide-react";

type Invoice = {
  id: string;
  patient: string;
  date: string;
  consultation: number;
  laboratory: number;
  medicine: number;
  other: number;
  paid: number;
  method: string;
};

type InvoiceForm = {
  patient: string;
  date: string;
  consultation: string;
  laboratory: string;
  medicine: string;
  other: string;
  paid: string;
  method: string;
};

const initialInvoices: Invoice[] = [
  {
    id: "INV-1001",
    patient: "Ali Ahmed",
    date: "2026-11-23",
    consultation: 2500,
    laboratory: 1500,
    medicine: 1000,
    other: 0,
    paid: 5000,
    method: "Cash",
  },
  {
    id: "INV-1002",
    patient: "Ayesha Noor",
    date: "2026-11-24",
    consultation: 3000,
    laboratory: 2000,
    medicine: 500,
    other: 0,
    paid: 2000,
    method: "Card",
  },
  {
    id: "INV-1003",
    patient: "Hamza Malik",
    date: "2026-11-24",
    consultation: 2000,
    laboratory: 1000,
    medicine: 1500,
    other: 500,
    paid: 0,
    method: "Cash",
  },
];

const patients = ["Ali Ahmed", "Ayesha Noor", "Hamza Malik"];

const emptyForm: InvoiceForm = {
  patient: "Ali Ahmed",
  date: "",
  consultation: "2500",
  laboratory: "0",
  medicine: "0",
  other: "0",
  paid: "0",
  method: "Cash",
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);
  const [form, setForm] = useState<InvoiceForm>(emptyForm);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setForm((previous) => ({ ...previous, date: today }));
  }, []);

  const totalInvoices = invoices.length;

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + invoice.paid,
    0
  );

  const totalPending = invoices.reduce((sum, invoice) => {
    const total =
      invoice.consultation +
      invoice.laboratory +
      invoice.medicine +
      invoice.other;

    return sum + Math.max(total - invoice.paid, 0);
  }, 0);

  const filteredInvoices = useMemo(
    () =>
      invoices.filter((invoice) =>
        `${invoice.id} ${invoice.patient} ${invoice.date}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [invoices, search]
  );

  function getTotal(invoice: Invoice) {
    return (
      invoice.consultation +
      invoice.laboratory +
      invoice.medicine +
      invoice.other
    );
  }

  function getStatus(invoice: Invoice) {
    const total = getTotal(invoice);

    if (invoice.paid >= total) return "Paid";
    if (invoice.paid > 0) return "Partial";
    return "Pending";
  }

  function saveInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      patient: form.patient,
      date: form.date,
      consultation: Number(form.consultation) || 0,
      laboratory: Number(form.laboratory) || 0,
      medicine: Number(form.medicine) || 0,
      other: Number(form.other) || 0,
      paid: Number(form.paid) || 0,
      method: form.method,
    };

    const total = getTotal(newInvoice);

    if (!newInvoice.date) {
      alert("Please select an invoice date.");
      return;
    }

    if (newInvoice.paid < 0 || newInvoice.paid > total) {
      alert("Amount paid must be between 0 and the invoice total.");
      return;
    }

    setInvoices((previous) => [newInvoice, ...previous]);
    setShowForm(false);

    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
    });
  }

  function deleteInvoice(id: string) {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      setInvoices((previous) =>
        previous.filter((invoice) => invoice.id !== id)
      );

      if (selectedInvoice?.id === id) {
        setSelectedInvoice(null);
      }
    }
  }

  function printInvoice() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-800 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              HOSPITAL MANAGEMENT
            </p>
            <h1 className="mt-1 text-3xl font-bold">
              Billing Management
            </h1>
            <p className="mt-2 text-slate-500">
              Manage invoices, payments and outstanding balances.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={19} />
            Create Invoice
          </button>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total Invoices</p>
              <Receipt className="text-blue-600" />
            </div>
            <h2 className="mt-3 text-3xl font-bold">
              {totalInvoices}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Amount Received</p>
              <Wallet className="text-green-600" />
            </div>
            <h2 className="mt-3 text-2xl font-bold">
              {money(totalRevenue)}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Outstanding Balance
              </p>
              <CreditCard className="text-orange-600" />
            </div>
            <h2 className="mt-3 text-2xl font-bold">
              {money(totalPending)}
            </h2>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Invoice Records</h2>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <Search size={18} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search invoices..."
                className="w-48 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-500">
                  <th className="p-3">Invoice ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Paid</th>
                  <th className="p-3">Balance</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice) => {
                  const total = getTotal(invoice);
                  const balance = Math.max(total - invoice.paid, 0);
                  const status = getStatus(invoice);

                  return (
                    <tr
                      key={invoice.id}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="p-3 font-semibold">{invoice.id}</td>
                      <td className="p-3">{invoice.patient}</td>
                      <td className="p-3">{invoice.date}</td>
                      <td className="p-3">{money(total)}</td>
                      <td className="p-3">{money(invoice.paid)}</td>
                      <td className="p-3">{money(balance)}</td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : status === "Partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            title="View invoice"
                            onClick={() => setSelectedInvoice(invoice)}
                            className="rounded p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            title="Print invoice"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setTimeout(() => window.print(), 100);
                            }}
                            className="rounded p-2 text-green-600 hover:bg-green-50"
                          >
                            <Printer size={17} />
                          </button>

                          <button
                            type="button"
                            title="Delete invoice"
                            onClick={() => deleteInvoice(invoice.id)}
                            className="rounded p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredInvoices.length === 0 && (
              <p className="py-8 text-center text-slate-500">
                No invoices found.
              </p>
            )}
          </div>
        </section>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <form
              onSubmit={saveInvoice}
              className="my-6 w-full max-w-xl rounded-xl bg-white p-6 shadow-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">Create New Invoice</h2>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  <X />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium">
                    Patient
                  </span>
                  <select
                    required
                    value={form.patient}
                    onChange={(e) =>
                      setForm({ ...form, patient: e.target.value })
                    }
                    className="w-full rounded-lg border p-3"
                  >
                    {patients.map((patient) => (
                      <option key={patient} value={patient}>
                        {patient}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium">
                    Invoice Date
                  </span>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className="w-full rounded-lg border p-3"
                  />
                </label>

                {(
                  [
                    ["consultation", "Consultation Fee"],
                    ["laboratory", "Laboratory Charges"],
                    ["medicine", "Medicine Charges"],
                    ["other", "Other Charges"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key}>
                    <span className="mb-1 block text-sm font-medium">
                      {label} (PKR)
                    </span>
                    <input
                      type="number"
                      min="0"
                      required
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="w-full rounded-lg border p-3"
                    />
                  </label>
                ))}

                <label>
                  <span className="mb-1 block text-sm font-medium">
                    Amount Paid (PKR)
                  </span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.paid}
                    onChange={(e) =>
                      setForm({ ...form, paid: e.target.value })
                    }
                    className="w-full rounded-lg border p-3"
                  />
                </label>

                <label>
                  <span className="mb-1 block text-sm font-medium">
                    Payment Method
                  </span>
                  <select
                    value={form.method}
                    onChange={(e) =>
                      setForm({ ...form, method: e.target.value })
                    }
                    className="w-full rounded-lg border p-3"
                  >
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Mobile Wallet</option>
                  </select>
                </label>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Demo billing records only. Invoices are not yet saved to Neon.
              </p>

              <button
                type="submit"
                className="mt-5 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Save Invoice
              </button>
            </form>
          </div>
        )}

        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">Invoice Details</h2>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                >
                  <X />
                </button>
              </div>

              <div id="invoice-print" className="space-y-3 text-sm">
                <p><strong>Invoice:</strong> {selectedInvoice.id}</p>
                <p><strong>Patient:</strong> {selectedInvoice.patient}</p>
                <p><strong>Date:</strong> {selectedInvoice.date}</p>
                <hr />
                <p>Consultation: {money(selectedInvoice.consultation)}</p>
                <p>Laboratory: {money(selectedInvoice.laboratory)}</p>
                <p>Medicine: {money(selectedInvoice.medicine)}</p>
                <p>Other: {money(selectedInvoice.other)}</p>
                <hr />
                <p><strong>Total:</strong> {money(getTotal(selectedInvoice))}</p>
                <p><strong>Paid:</strong> {money(selectedInvoice.paid)}</p>
                <p>
                  <strong>Balance:</strong>{" "}
                  {money(Math.max(getTotal(selectedInvoice) - selectedInvoice.paid, 0))}
                </p>
                <p><strong>Payment Method:</strong> {selectedInvoice.method}</p>
                <p><strong>Status:</strong> {getStatus(selectedInvoice)}</p>
              </div>

              <button
                type="button"
                onClick={printInvoice}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white"
              >
                <Printer size={18} />
                Print Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
