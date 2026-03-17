"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { loginDriver } from "@/lib/api";

export default function DriverLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("driver@test.com");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = Cookies.get("driver_token");
    if (token) {
      router.replace("/");
    }
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await loginDriver(email, password);

      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#16213e] p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.25em] text-green-400 mb-2">
          Driver App
        </p>
        <h1 className="text-3xl font-bold">Driver Login</h1>
        <p className="text-gray-300 mt-2 mb-8">
          Sign in to manage deliveries and update order status.
        </p>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400"
              placeholder="driver@test.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-500 px-4 py-3 font-semibold text-black hover:bg-green-400 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
          Demo login:
          <div className="mt-2 font-medium text-white">driver@test.com</div>
          <div className="font-medium text-white">12345678</div>
        </div>
      </div>
    </main>
  );
}
