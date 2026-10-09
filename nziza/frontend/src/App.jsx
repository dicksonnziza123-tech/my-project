import { useState } from "react";
import Login from "./pages/Login.jsx";
import Report from "./pages/Report.jsx";
import Vehicle from "./pages/Vehicle.jsx";
import Customer from "./pages/Customer.jsx";
import Promotion from "./pages/Promotion.jsx";
import PromotionVehicle from "./pages/PromotionVehicle.jsx";

const menuItems = [
  { label: "Dashboard", key: "report" },
  { label: "Vehicles", key: "vehicle" },
  { label: "Customers", key: "customer" },
  { label: "Promotions", key: "promotion" },
  { label: "Promotion Vehicle", key: "promotionVehicle" },
];

export default function App() {
  const [page, setPage] = useState("report");
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
   <div className="min-h-screen bg-blue-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">PMS Control Panel</h1>
            <p className="text-sm text-slate-600">Logged in as {user.UserName || user.Username} ({user.Role})</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${page === item.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setUser(null)}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="rounded-3xl bg-slate-50 p-0 shadow-sm">
          {page === "report" && <Report />}
          {page === "vehicle" && <Vehicle />}
          {page === "customer" && <Customer />}
          {page === "promotion" && <Promotion />}
          {page === "promotionVehicle" && <PromotionVehicle />}
        </main>
      </div>
    </div>
  );
}