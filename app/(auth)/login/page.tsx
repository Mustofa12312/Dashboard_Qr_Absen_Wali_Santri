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
    <div className="flex min-h-screen items-center justify-center px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="w-full max-w-md glass-card rounded-3xl p-8 relative z-10 animate-[fadeIn_0.5s_ease-out]">
        <div className="mb-8 text-center">
          <div className="mx-auto h-16 w-16 mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30 text-white">
            🎓
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Selamat Datang
          </h1>
          <p className="text-sm text-slate-400">
            Masuk untuk mengelola kehadiran wisuda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">Email</label>
            <input
              type="email"
              className="input-field w-full"
              placeholder="admin@sekolah.sch.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
              Password
            </label>
            <input
              type="password"
              className="input-field w-full"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium animate-bounce">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sedang Masuk..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
