"use client";

import { FormEvent, useState } from "react";
import { loginRestaurant } from "@/lib/api";

export default function RestaurantLoginPage() {
  const [email, setEmail] = useState("owner@test.com");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("Trying to log in...");

      const result = await loginRestaurant(email, password);

      if (!result?.token) {
        throw new Error("Login succeeded but no token was returned");
      }

      setSuccessMessage("Login successful. Redirecting...");
      window.location.href = "/";
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to log in";
      setError(message);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-10 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl border shadow-sm p-8">
        <p className="text-sm uppercase tracking-widest text-orange-600 font-semibold mb-2">
          Restaurant Console
        </p>
        <h1 className="text-3xl font-bold mb-6">Restaurant Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white rounded-xl py-3 font-semibold disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}
