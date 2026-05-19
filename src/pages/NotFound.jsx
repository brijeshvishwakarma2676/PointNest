import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import {
  ShieldAlert,
  Home,
  ChevronLeft,
  Search,
  Compass,
  ArrowLeft,
  Terminal,
} from "lucide-react";

/**
 * NotFound - PointNest Noir Edition
 * A high-impact 404 terminal for unresolved protocol addresses.
 */
const NotFound = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 relative overflow-hidden font-sans antialiased text-white">
      {/* Structural Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/[0.015] rounded-full blur-[140px]" />
      </div>

      <div
        className={`relative z-10 w-full max-w-2xl text-center transition-all duration-1000 ease-out ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      >
        {/* Main Header / Status Code */}
        <div className="relative mb-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-6 animate-pulse">
            <ShieldAlert size={12} />
            Unresolved Protocol
          </div>

          <div className="relative">
            <h1 className="text-[12rem] md:text-[18rem] font-black text-white leading-none tracking-tighter italic opacity-10 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-0">
                Connection <br />
                <span className="text-gray-500 italic">Terminated</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="mt-12">
          <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-12 max-w-sm mx-auto leading-relaxed">
            The requested terminal address does not exist or has been relocated
            within the PointNest network.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/[0.03] transition-all active:scale-95"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Revert Session
            </button>

            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all active:scale-95 shadow-2xl shadow-gray-900"
            >
              <Home size={14} />
              Return Mainframe
            </Link>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-24 pt-12 border-t border-white/5 opacity-40">
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                Error Sequence
              </span>
              <span className="text-[10px] font-bold text-white tracking-widest">
                0xNULL_VAL
              </span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                Auth Status
              </span>
              <span className="text-[10px] font-bold text-white tracking-widest">
                {isAuthenticated ? "VERIFIED" : "ANONYMOUS"}
              </span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                Protocol
              </span>
              <span className="text-[10px] font-bold text-white tracking-widest">
                POINTNEST-V3
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
