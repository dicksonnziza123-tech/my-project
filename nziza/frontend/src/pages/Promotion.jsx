import { useEffect, useState } from "react";
import { request, API_BASE } from "../api";

const initialForm = {
  Title: "",
  Description: "",
  Discount_Type: "Percentage",
  Discount_Value: "",
  Start_Date: "",
  End_Date: "",
  Status: "active",
};

const discountTypes = ["Percentage", "Flat"];
const promotionStatuses = ["active", "inactive"];

export default function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    const data = await fetch(`${API_BASE}/promotion`).then((res) => res.json());
    setPromotions(data || []);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editId) {
        await request(`/promotion/${editId}`, { method: "PUT", body: form });
        setMessage("Promotion updated successfully.");
      } else {
        await request("/promotion", { method: "POST", body: form });
        setMessage("Promotion added successfully.");
      }
      setForm(initialForm);
      setEditId(null);
      loadPromotions();
    } catch (err) {
      setMessage(err.message || "Failed to save promotion.");
    }
  };

  const handleEdit = (promotion) => {
    setEditId(promotion.PromotionId);
    setForm({
      Title: promotion.Title || "",
      Description: promotion.Description || "",
      Discount_Type: promotion.Discount_Type || "Percentage",
      Discount_Value: promotion.Discount_Value || "",
      Start_Date: promotion.Start_Date ? promotion.Start_Date.slice(0, 10) : "",
      End_Date: promotion.End_Date ? promotion.End_Date.slice(0, 10) : "",
      Status: promotion.Status || "active",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this promotion?")) return;
    await request(`/promotion/${id}`, { method: "DELETE" });
    loadPromotions();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Promotion Management</h2>
        <p className="text-sm text-slate-600">Create and manage promotions.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{editId ? "Edit Promotion" : "Add Promotion"}</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm text-slate-700">Title</span>
              <input
                value={form.Title}
                onChange={(e) => setForm({ ...form, Title: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-700">Description</span>
              <textarea
                value={form.Description}
                onChange={(e) => setForm({ ...form, Description: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                rows="4"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-700">Discount Type</span>
                <select
                  value={form.Discount_Type}
                  onChange={(e) => setForm({ ...form, Discount_Type: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                >
                  {discountTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-slate-700">Discount Value</span>
                <input
                  type="number"
                  value={form.Discount_Value}
                  onChange={(e) => setForm({ ...form, Discount_Value: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                  required
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-700">Start Date</span>
                <input
                  type="date"
                  value={form.Start_Date}
                  onChange={(e) => setForm({ ...form, Start_Date: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-700">End Date</span>
                <input
                  type="date"
                  value={form.End_Date}
                  onChange={(e) => setForm({ ...form, End_Date: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-700">Status</span>
              <select
                value={form.Status}
                onChange={(e) => setForm({ ...form, Status: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
              >
                {promotionStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-3">
              <button type="submit" className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                {editId ? "Update Promotion" : "Add Promotion"}
              </button>
              <button type="button" onClick={() => { setForm(initialForm); setEditId(null); setMessage(""); }} className="rounded-lg border border-slate-300 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50">
                Reset
              </button>
            </div>
            {message && <p className="text-sm text-slate-700">{message}</p>}
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Promotion List</h3>
          <div className="space-y-3 overflow-x-auto">
            {promotions.length === 0 ? (
              <p className="text-sm text-slate-600">No promotions found.</p>
            ) : (
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-200 text-slate-900">
                  <tr>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Value</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion) => (
                    <tr key={promotion.PromotionId} className="border-b border-slate-200">
                      <td className="px-3 py-2">{promotion.Title}</td>
                      <td className="px-3 py-2">{promotion.Discount_Type}</td>
                      <td className="px-3 py-2">{promotion.Discount_Value}</td>
                      <td className="px-3 py-2 capitalize">{promotion.Status}</td>
                      <td className="px-3 py-2 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(promotion)}
                          className="rounded-md bg-blue-600 px-3 py-1 text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(promotion.PromotionId)}
                          className="rounded-md bg-red-600 px-3 py-1 text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
