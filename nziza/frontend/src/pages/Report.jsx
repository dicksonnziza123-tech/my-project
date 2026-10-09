import { useEffect, useState } from "react";
import { API_BASE } from "../api";

export default function Report() {
  const [summary, setSummary] = useState({ vehicles: 0, customers: 0, promotions: 0, activeCustomers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        const [vehiclesRes, customersRes, promotionsRes] = await Promise.all([
          fetch(`${API_BASE}/vehicle`).then((res) => res.json()),
          fetch(`${API_BASE}/customer`).then((res) => res.json()),
          fetch(`${API_BASE}/promotion`).then((res) => res.json()),
        ]);

        const activeCustomers = customersRes.filter((customer) => customer.Status === "active").length;

        setSummary({
          vehicles: vehiclesRes.length,
          customers: customersRes.length,
          promotions: promotionsRes.length,
          activeCustomers,
        });
      } catch (err) {
        setError("Unable to load report data.");
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  if (loading) {
    return <p className="p-6 text-slate-700">Loading report...</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Dashboard Report</h2>
        <p className="text-sm text-slate-600">A quick overview of the current data in the system.</p>
      </div>
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-slate-900 p-6 text-white">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-300">Vehicles</div>
          <div className="mt-4 text-4xl font-semibold">{summary.vehicles}</div>
        </div>
        <div className="rounded-3xl bg-emerald-600 p-6 text-white">
          <div className="text-sm uppercase tracking-[0.2em] text-emerald-100">Customers</div>
          <div className="mt-4 text-4xl font-semibold">{summary.customers}</div>
        </div>
        <div className="rounded-3xl bg-cyan-600 p-6 text-white">
          <div className="text-sm uppercase tracking-[0.2em] text-cyan-100">Active Customers</div>
          <div className="mt-4 text-4xl font-semibold">{summary.activeCustomers}</div>
        </div>
        <div className="rounded-3xl bg-violet-600 p-6 text-white">
          <div className="text-sm uppercase tracking-[0.2em] text-violet-100">Promotions</div>
          <div className="mt-4 text-4xl font-semibold">{summary.promotions}</div>
        </div>
      </div>
    </div>
  );
}
