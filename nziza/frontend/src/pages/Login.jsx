import { useState } from "react";
import { request } from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const user = await request("/login", {
        method: "POST",
        body: { Username: username, Password: password },
      });
      onLogin(user);
    } catch (err) {
      setError(err.message || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-slate-700">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
              required
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-3"
              required
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 text-white px-4 py-3 text-sm font-semibold hover:bg-slate-700"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
