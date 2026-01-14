"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error || !data.session) {
      setErrorMsg("Email atau password salah.");
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-700/70 shadow-2xl shadow-emerald-500/10 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Absen Wisuda Admin
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Masuk untuk mengelola kehadiran wali.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-slate-200">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors py-2.5 text-sm font-semibold text-slate-900 disabled:opacity-60"
          >
            {isLoading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
