import { useEffect, useState } from "react";
import { request, API_BASE } from "../api";

const initialForm = {
  FirstName: "",
  LastName: "",
  Email: "",
  PhoneNumber: "",
  Status: "active",
};

const customerStatuses = ["active", "inactive", "blocked"];

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await fetch(`${API_BASE}/customer`).then((res) => res.json());
    setCustomers(data || []);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editId) {
        await request(`/customer/${editId}`, {
          method: "PUT",
          body: form,
        });
        setMessage("Customer updated successfully.");
      } else {
        await request("/customer", {
          method: "POST",
          body: form,
        });
        setMessage("Customer added successfully.");
      }
      setForm(initialForm);
      setEditId(null);
      loadCustomers();
    } catch (err) {
      setMessage(err.message || "Failed to save customer.");
    }
  };

  const handleEdit = (customer) => {
    setEditId(customer.customer_Id);
    setForm({
      FirstName: customer.FirstNme || "",
      LastName: customer.LastName || "",
      Email: customer.Email || "",
      PhoneNumber: customer.PhoneNumber || "",
      Status: customer.Status || "active",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await request(`/customer/${id}`, { method: "DELETE" });
    loadCustomers();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Customer Management</h2>
        <p className="text-sm text-slate-600">Manage customers and set their status.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{editId ? "Edit Customer" : "Add Customer"}</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-700">First Name</span>
                <input
                  value={form.FirstName}
                  onChange={(e) => setForm({ ...form, FirstName: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-700">Last Name</span>
                <input
                  value={form.LastName}
                  onChange={(e) => setForm({ ...form, LastName: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                  required
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-700">Email</span>
              <input
                type="email"
                value={form.Email}
                onChange={(e) => setForm({ ...form, Email: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-700">Phone Number</span>
              <input
                value={form.PhoneNumber}
                onChange={(e) => setForm({ ...form, PhoneNumber: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-700">Status</span>
              <select
                value={form.Status}
                onChange={(e) => setForm({ ...form, Status: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
              >
                {customerStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-3">
              <button type="submit" className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                {editId ? "Update Customer" : "Add Customer"}
              </button>
              <button type="button" onClick={() => { setForm(initialForm); setEditId(null); setMessage(""); }} className="rounded-lg border border-slate-300 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50">
                Reset
              </button>
            </div>
            {message && <p className="text-sm text-slate-700">{message}</p>}
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer List</h3>
          <div className="space-y-3 overflow-x-auto">
            {customers.length === 0 ? (
              <p className="text-sm text-slate-600">No customers found.</p>
            ) : (
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-200 text-slate-900">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Phone</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.customer_Id} className="border-b border-slate-200">
                      <td className="px-3 py-2">{customer.FirstNme || customer.FirstName} {customer.LastName}</td>
                      <td className="px-3 py-2">{customer.Email}</td>
                      <td className="px-3 py-2">{customer.PhoneNumber}</td>
                      <td className="px-3 py-2 capitalize">{customer.Status}</td>
                      <td className="px-3 py-2 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(customer)}
                          className="rounded-md bg-blue-600 px-3 py-1 text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(customer.customer_Id)}
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
