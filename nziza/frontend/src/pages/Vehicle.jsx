import { useEffect, useState } from "react";
import { request, API_BASE } from "../api";

const initialForm = {
  Plate_Number: "",
  Brand: "",
  Model: "",
  Year: "",
  Vehicle_Type: "",
  Purchase_Price: "",
  Status: "Available",
};

const vehicleStatuses = ["Available", "Rented", "In Service", "Inactive"];

export default function Vehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const data = await fetch(`${API_BASE}/vehicle`).then((res) => res.json());
    setVehicles(data || []);
  };

  const reset = () => {
    setForm(initialForm);
    setEditId(null);
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editId) {
        await request(`/vehicle/${editId}`, {
          method: "PUT",
          body: form,
        });
        setMessage("Vehicle updated successfully.");
      } else {
        await request("/vehicle", {
          method: "POST",
          body: form,
        });
        setMessage("Vehicle added successfully.");
      }
      reset();
      loadVehicles();
    } catch (err) {
      setMessage(err.message || "Failed to save vehicle.");
    }
  };

  const handleEdit = (vehicle) => {
    setEditId(vehicle.VehicleId);
    setForm({
      Plate_Number: vehicle.Plate_Number || "",
      Brand: vehicle.Brand || "",
      Model: vehicle.Model || "",
      Year: vehicle.Year || "",
      Vehicle_Type: vehicle.Vehicle_Type || "",
      Purchase_Price: vehicle.Purchase_Price || "",
      Status: vehicle.Status || "Available",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    await request(`/vehicle/${id}`, { method: "DELETE" });
    loadVehicles();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Vehicle Management</h2>
        <p className="text-sm text-slate-600">Add, edit, or remove vehicles from the fleet.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{editId ? "Edit Vehicle" : "Add Vehicle"}</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-700">Plate Number</span>
                <input
                  value={form.Plate_Number}
                  onChange={(e) => setForm({ ...form, Plate_Number: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-700">Brand</span>
                <input
                  value={form.Brand}
                  onChange={(e) => setForm({ ...form, Brand: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                  required
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-700">Model</span>
                <input
                  value={form.Model}
                  onChange={(e) => setForm({ ...form, Model: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-700">Year</span>
                <input
                  type="number"
                  value={form.Year}
                  onChange={(e) => setForm({ ...form, Year: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-700">Vehicle Type</span>
                <input
                  value={form.Vehicle_Type}
                  onChange={(e) => setForm({ ...form, Vehicle_Type: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-700">Purchase Price</span>
                <input
                  type="number"
                  value={form.Purchase_Price}
                  onChange={(e) => setForm({ ...form, Purchase_Price: e.target.value })}
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
                {vehicleStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-3">
              <button type="submit" className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                {editId ? "Update Vehicle" : "Add Vehicle"}
              </button>
              <button type="button" onClick={reset} className="rounded-lg border border-slate-300 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50">
                Reset
              </button>
            </div>
            {message && <p className="text-sm text-slate-700">{message}</p>}
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Vehicle List</h3>
          <div className="space-y-3 overflow-x-auto">
            {vehicles.length === 0 ? (
              <p className="text-sm text-slate-600">No vehicles found.</p>
            ) : (
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-200 text-slate-900">
                  <tr>
                    <th className="px-3 py-2">Plate</th>
                    <th className="px-3 py-2">Brand</th>
                    <th className="px-3 py-2">Model</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.VehicleId} className="border-b border-slate-200">
                      <td className="px-3 py-2">{vehicle.Plate_Number}</td>
                      <td className="px-3 py-2">{vehicle.Brand}</td>
                      <td className="px-3 py-2">{vehicle.Model}</td>
                      <td className="px-3 py-2">{vehicle.Status}</td>
                      <td className="px-3 py-2 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(vehicle)}
                          className="rounded-md bg-blue-600 px-3 py-1 text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                            onClick={() => handleDelete(vehicle.VehicleId)}
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
