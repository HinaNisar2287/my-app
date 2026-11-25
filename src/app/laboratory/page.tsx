
"use client";

import { useEffect, useState } from "react";
import {
  FlaskConical,
  Plus,
  Search,
  Trash2,
  RefreshCw,
  TestTube,
  Activity,
} from "lucide-react";

type LabTest = {
  id: number;
  name: string;
  category: string;
  description: string | null;
  price: number;
  createdAt: string;
};

export default function LaboratoryPage() {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
  });

  async function fetchTests() {
    setLoading(true);
    try {
      const response = await fetch("/api/laboratory/tests");
      if (!response.ok) throw new Error("Failed to load tests");
      const data = await response.json();
      setTests(data);
    } catch {
      setError("Unable to load laboratory tests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTests();
  }, []);

  async function addTest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/laboratory/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not add test");
      }

      setTests((previous) => [data, ...previous]);
      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
      });
      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteTest(id: number) {
    if (!window.confirm("Are you sure you want to delete this test?")) {
      return;
    }

    setError("Delete API will be added in the next step.");
  }

  const filteredTests = tests.filter((test) =>
    `${test.name} ${test.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <FlaskConical size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Laboratory
                </h1>
                <p className="text-sm text-slate-500">
                  Laboratory test management system
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={20} />
            Add New Test
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Tests</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {tests.length}
                </h2>
              </div>
              <TestTube className="text-blue-600" size={35} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Test Categories</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {new Set(tests.map((test) => test.category)).size}
                </h2>
              </div>
              <Activity className="text-green-600" size={35} />
            </div>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={addTest}
            className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900">
              Add Laboratory Test
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                placeholder="Test name (e.g. CBC)"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="rounded-xl border border-slate-300 p-3 text-slate-900"
              />

              <select
                required
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="rounded-xl border border-slate-300 p-3 text-slate-900"
              >
                <option value="">Select category</option>
                <option value="Hematology">Hematology</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Immunology">Immunology</option>
                <option value="Pathology">Pathology</option>
                <option value="Other">Other</option>
              </select>

              <input
                required
                type="number"
                min="0"
                step="1"
                placeholder="Test price (PKR)"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="rounded-xl border border-slate-300 p-3 text-slate-900"
              />

              <input
                placeholder="Test description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="rounded-xl border border-slate-300 p-3 text-slate-900"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Test"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <h2 className="text-xl font-bold text-slate-900">
              Laboratory Tests
            </h2>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3">
              <Search size={18} className="text-slate-400" />
              <input
                placeholder="Search tests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 outline-none sm:w-52"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading laboratory tests...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="p-4">Test Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Date Added</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTests.map((test) => (
                    <tr key={test.id} className="hover:bg-slate-50">
                      <td className="p-4 font-semibold text-slate-800">
                        {test.name}
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {test.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700">
                        Rs. {test.price.toLocaleString("en-PK")}
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(test.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteTest(test.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Delete test"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredTests.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-10 text-center text-slate-500"
                      >
                        No laboratory tests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 p-4">
            <span className="text-sm text-slate-500">
              Showing {filteredTests.length} tests
            </span>

            <button
              onClick={fetchTests}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
