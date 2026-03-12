import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { customersApi } from "../features/customers/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, loading: true });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Refresh full user profile/metrics from /me
        refreshProfile();

        // Fetch Page 1, Size 5 for the recent list
        const response = await customersApi.getCustomers({ page: 1, size: 5 });
        if (response.success) {
          setRecentCustomers(response.data.items || []);
          setMetrics({ total: response.data.total || 0, loading: false });
        } else {
          toast.error("Failed to load dashboard data");
          setMetrics((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        toast.error(error.message || "Failed to load dashboard data");
        setMetrics((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 md:p-10">
      {/* Header section without the Logout button since Layout handles it */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Overview
        </h1>
        {user && (
          <p className="text-gray-500 mt-2 font-medium">
            Welcome back to{" "}
            <span className="text-blue-600 font-semibold">
              {user.shop_name}
            </span>
          </p>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white/60 backdrop-blur-xl shadow-lg shadow-blue-900/5 p-6 rounded-3xl border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              Total Customers
            </p>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {user?.metrics?.total_customers ??
              (metrics.loading ? "..." : metrics.total)}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl shadow-lg shadow-purple-900/5 p-6 rounded-3xl border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              Total Purchases
            </p>
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {user?.metrics?.total_purchases ?? "0"}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl shadow-lg shadow-indigo-900/5 p-6 rounded-3xl border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              Points Issued
            </p>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-indigo-600 tracking-tight">
            {user?.metrics?.total_points_issued?.toLocaleString() ?? "0"}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl shadow-lg shadow-emerald-900/5 p-6 rounded-3xl border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              Total Revenue
            </p>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-emerald-600">₹</span>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">
              {user?.metrics?.total_revenue?.toLocaleString() ?? "0"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Customers List */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-xl shadow-lg shadow-gray-900/5 rounded-3xl border border-white/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100/60 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Customers
              </h2>
              <Link
                to="/customers"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-gray-100/60 w-full overflow-x-auto">
              {metrics.loading ? (
                <div className="p-8 text-center text-gray-500 font-medium">
                  Loading customers...
                </div>
              ) : recentCustomers.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-medium">
                  No customers yet
                </div>
              ) : (
                <table className="w-full text-left whitespace-nowrap">
                  <tbody className="divide-y divide-gray-100/60">
                    {recentCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-white/40 transition-colors"
                      >
                        <td className="p-4 sm:px-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 shrink-0 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 border border-white">
                              {customer.name
                                ? customer.name.charAt(0).toUpperCase()
                                : "?"}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {customer.name}
                              </p>
                              <p className="text-xs font-medium text-gray-500">
                                {customer.phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 sm:px-6 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                            {customer.points} pts
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white/60 backdrop-blur-xl shadow-lg shadow-gray-900/5 rounded-3xl border border-white/50 overflow-hidden mb-6">
            <div className="px-6 py-5 border-b border-gray-100/60">
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <Link
                to="/purchase"
                className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 px-4 rounded-xl font-semibold shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Record Purchase
              </Link>
              <Link
                to="/customers"
                className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-100 py-3.5 px-4 rounded-xl font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Manage Customers
              </Link>
            </div>
          </div>

          {/* Profile Details (Sidebar layout handles most of it, but good to have Account ID here) */}
          <div className="p-4 bg-white/60 border border-white/50 shadow-lg shadow-gray-900/5 rounded-2xl flex items-center justify-between backdrop-blur-md">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Account Reference ID
              </p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">
                #{user?.id || "---"}
              </p>
            </div>
            <div className="p-2 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200/60">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
