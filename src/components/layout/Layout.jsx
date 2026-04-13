import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Layout = ({ children }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      name: "Customers",
      path: "/customers",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      name: "Add Purchase",
      path: "/purchase",
      icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
    },
    {
      name: "Purchases",
      path: "/purchases",
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    },
    {
      name: "Redeem Points",
      path: "/redeem",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      name: "Points History",
      path: "/history",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white/70 backdrop-blur-xl border-r border-gray-200">
        <div className="p-6">
          <Link
            to="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/dashboard";
            }}
            className="group relative inline-block"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-sm group-hover:shadow-blue-500/20 transition-all">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 tracking-tight group-hover:opacity-80 transition-opacity">
                PointNest
              </span>
            </div>
            
            {/* Hard Reload Tooltip */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-[#2c2a51] text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-white/10 z-50 transform translate-x-2 group-hover:translate-x-0">
              Click to hard reload
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#2c2a51] rotate-45 border-b border-l border-white/10"></div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={isActive ? 2.5 : 2}
                    d={item.icon}
                  />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          {user && (
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 mb-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
              title="View Profile"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200">
                  {user.owner_name
                    ? user.owner_name.charAt(0).toUpperCase()
                    : "A"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user.shop_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email || user.phone}
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-gray-50/50">
        {/* Background Blobs for Glassmorphism Context */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 pointer-events-none transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto pb-24 md:pb-12">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/80 backdrop-blur-2xl border-t border-gray-200 pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={isActive ? 2.5 : 2}
                    d={item.icon}
                  />
                </svg>
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Mobile Profile Button */}
          {user && (
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200 text-xs shadow-sm">
                {user.owner_name
                  ? user.owner_name.charAt(0).toUpperCase()
                  : "A"}
              </div>
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          )}
        </div>
      </nav>

      {/* Admin Profile Modal */}
      {isProfileOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsProfileOpen(false)}
          ></div>
          <div className="relative bg-white/70 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-3xl w-full max-w-sm overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Curve */}
            <div className="h-32 bg-linear-to-br from-blue-500 to-indigo-600 relative">
              <div className="absolute -bottom-10 inset-x-0 flex justify-center">
                <div className="h-20 w-20 bg-white rounded-full p-1 shadow-lg">
                  <div className="h-full w-full bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-3xl font-bold border-2 border-white">
                    {user.owner_name
                      ? user.owner_name.charAt(0).toUpperCase()
                      : "A"}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pt-14 pb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.owner_name}
              </h2>
              <p className="text-sm font-medium text-indigo-600 mb-6">
                {user.shop_name}
              </p>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-100">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 font-medium">
                      Email Address
                    </p>
                    <p className="text-sm text-gray-900 font-semibold truncate">
                      {user.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-100">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Phone Number
                    </p>
                    <p className="text-sm text-gray-900 font-semibold">
                      {user.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
