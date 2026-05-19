import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Fingerprint,
  Key,
  ChevronRight,
  Info,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

/**
 * LoginPage - PointNest Noir Edition
 * A high-impact, minimalist authentication terminal.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      toast.success(result.message || "Access Granted");
      navigate("/dashboard");
    } else {
      toast.error(result.message || "Authentication Failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0B] font-sans antialiased text-white">
      {/* Structural Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-6 animate-in fade-in zoom-in-95 duration-700">
        {/* Terminal Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-white text-black shadow-2xl shadow-gray-900 border border-gray-200">
            <ShieldCheck size={36} strokeWidth={2.5} />
          </div>
          <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3">
            Registry Terminal v3
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">
            POINTNEST
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            Identity Authorization Protocol
          </p>
        </div>

        {/* Auth Interface */}
        <div className="bg-[#111113] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                <Info size={14} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                Access Profile (Email)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@lumina.io"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                Authorization Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-lg bg-white/5 border-white/10 checked:bg-white checked:border-white transition-all appearance-none cursor-pointer border ring-offset-[#0A0A0B] focus:ring-1 focus:ring-white"
                />
                <span className="ml-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">
                  Persistent Session
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-black text-white uppercase tracking-widest border-b border-white/[0.15] hover:border-white transition-all"
              >
                Reset Access
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full flex items-center justify-center gap-3 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-20 shadow-xl"
            >
              {isLoading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <>
                  Establish Connection
                  <ChevronRight size={18} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
              Not a verified partner?
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/[0.03] transition-all"
            >
              Request Enrollment
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Global Footer */}
        <div className="mt-12 text-center">
          <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em]">
            Secure Shell © 2026 PointNest Enterprise
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
