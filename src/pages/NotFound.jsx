import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const NotFound = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div
        className={`absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[150px] transition-all duration-1000 ease-out ${mounted ? "opacity-30 scale-100" : "opacity-0 scale-75"}`}
      />
      <div
        className={`absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[150px] transition-all duration-1000 ease-out delay-300 ${mounted ? "opacity-30 scale-100" : "opacity-0 scale-75"}`}
      />

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      <div
        className={`relative z-10 w-full max-w-2xl transition-all duration-700 delay-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <div className="flex flex-col items-center">
          {/* Main Illustration Area */}
          <div className="relative mb-12 sm:mb-16 group">
            {/* Pulsing Backlight */}
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse group-hover:opacity-30 transition-opacity" />

            {/* The 404 Text */}
            <div className="relative flex items-center justify-center">
              <span className="text-[10rem] sm:text-[14rem] font-black text-transparent bg-clip-text bg-linear-to-b from-gray-900 via-gray-800 to-blue-900 leading-none drop-shadow-2xl select-none tracking-tighter">
                404
              </span>

              {/* Floating Icons */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <div className="absolute top-0 left-0 animate-bounce duration-3000">
                  <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-white/50 backdrop-blur-md rotate-12 transition-transform hover:scale-110">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 right-0 animate-bounce duration-4000 delay-500">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-white/50 backdrop-blur-md -rotate-12 transition-transform hover:scale-110">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[40px] p-8 sm:p-12 w-full max-w-lg text-center transform transition-all hover:scale-[1.01] duration-500">
            <div className="inline-flex px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">
              Lost in space
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Page vanished.
            </h1>

            <p className="text-gray-600 font-medium text-lg mb-10 leading-relaxed">
              We couldn't find the location you were looking for. Let's get you
              back on track.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/70 text-gray-700 font-bold hover:bg-white transition-all shadow-sm border border-gray-100 active:scale-95"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Go Back
              </button>

              <Link
                to={isAuthenticated ? "/dashboard" : "/"}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {isAuthenticated ? "Dashboard" : "Home"}
              </Link>
            </div>
          </div>

          <p className="mt-12 text-gray-400 font-semibold text-sm tracking-wide">
            Error Code: 0x404_NOT_FOUND
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
