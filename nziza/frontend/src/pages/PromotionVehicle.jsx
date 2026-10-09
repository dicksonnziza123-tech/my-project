import { useEffect, useState } from "react";
import { API_BASE } from "../api";

export default function PromotionVehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const [vehicleData, promotionData] = await Promise.all([
        fetch(`${API_BASE}/vehicle`).then((res) => res.json()),
        fetch(`${API_BASE}/promotion`).then((res) => res.json()),
      ]);
      setVehicles(vehicleData || []);
      setPromotions(promotionData || []);
    }
    loadData();
  }, []);

  const addAssignment = (event) => {
    event.preventDefault();
    if (!selectedVehicle || !selectedPromotion) {
      setMessage("Please select both a vehicle and a promotion.");
      return;
    }

    const existing = assignments.find(
      (item) => item.vehicleId === selectedVehicle && item.promotionId === selectedPromotion,
    );
    if (existing) {
      setMessage("This promotion is already assigned to that vehicle.");
      return;
    }

    const vehicle = vehicles.find((item) => item.VehicleId === Number(selectedVehicle));
    const promotion = promotions.find((item) => item.PromotionId === Number(selectedPromotion));
    setAssignments([...assignments, {
      vehicleId: Number(selectedVehicle),
      promotionId: Number(selectedPromotion),
      vehicleName: vehicle?.Plate_Number || "Unknown",
      promotionTitle: promotion?.Title || "Unknown",
    }]);
    setMessage("Assignment added.");
  };

  const removeAssignment = (index) => {
    setAssignments(assignments.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Promotion Vehicle Linking</h2>
        <p className="text-sm text-slate-600">Assign promotions to vehicles for campaign tracking.</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4 sm:grid-cols-3" onSubmit={addAssignment}>
          <label className="block">
            <span className="text-sm text-slate-700">Vehicle</span>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
            >
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.VehicleId} value={vehicle.VehicleId}>
                  {vehicle.Plate_Number} - {vehicle.Brand}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Promotion</span>
            <select
              value={selectedPromotion}
              onChange={(e) => setSelectedPromotion(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
            >
              <option value="">Select promotion</option>
              {promotions.map((promotion) => (
                <option key={promotion.PromotionId} value={promotion.PromotionId}>
                  {promotion.Title}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
              Assign
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Assignments</h3>
        {assignments.length === 0 ? (
          <p className="text-sm text-slate-600">No promotion assignments created yet.</p>
        ) : (
          <div className="space-y-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 text-slate-900">
                <tr>
                  <th className="px-3 py-2">Vehicle</th>
                  <th className="px-3 py-2">Promotion</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, index) => (
                  <tr key={`${assignment.vehicleId}-${assignment.promotionId}`} className="border-b border-slate-200">
                    <td className="px-3 py-2">{assignment.vehicleName}</td>
                    <td className="px-3 py-2">{assignment.promotionTitle}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeAssignment(index)}
                        className="rounded-md bg-red-600 px-3 py-1 text-white"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
