import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldAlert, 
  Mail, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle,
  RefreshCw,
  Fingerprint
} from "lucide-react";

/**
 * ForgotPasswordPage - Lumina Noir Edition
 * A recovery terminal for lost authorization keys.
 */
const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0B] font-sans antialiased text-white">
      {/* Structural Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-6 animate-in fade-in zoom-in-95 duration-700">
        {/* Terminal Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-white text-black border border-gray-200 shadow-2xl">
             <Fingerprint size={36} strokeWidth={2} />
          </div>
          <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3">
             Recovery Terminal
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">
            RECOVERY
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            Reset verified authorization keys
          </p>
        </div>

        {/* Interface Card */}
        <div className="bg-[#111113] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl text-center">
          {!submitted ? (
            <>
              <p className="mb-10 text-gray-400 font-medium text-sm leading-relaxed">
                Enter your registered access protocol (email) to receive a one-time authorization reset link.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2 text-left">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Access Profile</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      placeholder="admin@lumina.io"
                      className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-20 shadow-xl mt-4"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <>
                      Request Recovery Link
                      <ChevronRight size={18} strokeWidth={3} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-inner">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-4">Transmission Sent</h2>
              <p className="text-gray-400 font-medium text-sm leading-relaxed mb-10">
                We've dispatched password reset instructions to your registered address. Please verify your inbox.
              </p>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Secure Login
            </Link>
          </div>
        </div>

        {/* Global Footer */}
        <div className="mt-12 text-center">
           <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em]">
            Safety Protocol © 2026 Lumina
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
