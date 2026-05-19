import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  Award,
  Wallet,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ArrowRight,
  Plus,
  UserPlus,
  Sparkles,
  Search,
  Activity,
  ArrowUpRight,
  ArrowDownToLine,
  Ticket,
  X,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { purchasesApi } from "../features/purchases/api";
import { redemptionsApi } from "../features/redemptions/api";
import { formatDate, formatTime } from "../utils/dateUtils";
import toast from "react-hot-toast";

// --- Utility Components ---
const StatCard = ({
  title,
  value,
  subValue,
  subLabel,
  icon: Icon,
  trend,
  trendUp,
  isDark,
  loading,
}) => (
  <div
    className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 ${
      isDark
        ? "bg-[#0A0A0B] text-white border border-gray-800 shadow-xl shadow-black/20"
        : "bg-white text-gray-900 border border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"
    }`}
  >
    {isDark && (
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
    )}

    <div className="flex justify-between items-center mb-6">
      <div
        className={`flex items-center gap-2.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        <Icon size={18} strokeWidth={2} />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {title}
        </span>
      </div>
      {!loading && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold tracking-wide ${
            isDark
              ? "bg-gray-800/50 text-gray-300 border border-gray-700/50"
              : trendUp
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
          }`}
        >
          {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend}
        </div>
      )}
    </div>

    <div className="flex items-baseline gap-1 mt-auto">
      {title.includes("Revenue") && (
        <span
          className={`text-xl font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          ₹
        </span>
      )}
      <p className="text-3xl font-bold tracking-tight">
        {loading ? "..." : (value?.toLocaleString() ?? "0")}
      </p>
    </div>

    {!loading && subValue !== undefined && (
      <div
        className={`mt-4 pt-4 border-t ${isDark ? "border-white/5" : "border-gray-50"} flex items-center justify-between`}
      >
        <span
          className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          {subLabel || "Actual Collection"}
        </span>
        <span
          className={`text-xs font-bold tracking-tight ${isDark ? "text-emerald-400" : subLabel?.includes("Redeem") ? "text-rose-500" : "text-emerald-600"}`}
        >
          {subLabel?.includes("Collection") ||
          subLabel?.includes("Value") ||
          subLabel?.includes("Revenue")
            ? "₹"
            : ""}
          {subValue?.toLocaleString() ?? "0"}
        </span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const [recentRedemptions, setRecentRedemptions] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [purchasePage, setPurchasePage] = useState(1);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [redemptionPage, setRedemptionPage] = useState(1);
  const [redemptionTotal, setRedemptionTotal] = useState(0);
  const [isRedemptionsCollapsed, setIsRedemptionsCollapsed] = useState(false);
  const [isPurchasesCollapsed, setIsPurchasesCollapsed] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [purLoading, setPurLoading] = useState(false);
  const [redLoading, setRedLoading] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState("today");
  const [lastSynced, setLastSynced] = useState(new Date());

  const fetchAllDashboardData = async (filter) => {
    setMetricsLoading(true);
    setPurLoading(true);
    setRedLoading(true);
    try {
      // All three fetches are fired in parallel
      const [_, purRes, redRes] = await Promise.all([
        refreshProfile(filter),
        purchasesApi.getPurchases({ page: 1, size: 5, date_filter: filter }),
        redemptionsApi.getRedemptions({
          page: 1,
          size: 10,
          date_filter: filter,
        }),
      ]);

      if (purRes.success) {
        setRecentPurchases(purRes.data.items || []);
        setPurchaseTotal(purRes.data.total || 0);
        setPurchasePage(purRes.data.page);
      }
      if (redRes.success) {
        setRecentRedemptions(redRes.data.items || []);
        setRedemptionTotal(redRes.data.total || 0);
        setRedemptionPage(redRes.data.page);
      }
      setLastSynced(new Date());
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setMetricsLoading(false);
      setPurLoading(false);
      setRedLoading(false);
    }
  };

  const fetchRecentRedemptions = async (page) => {
    setRedLoading(true);
    try {
      const redRes = await redemptionsApi.getRedemptions({
        page,
        size: 10,
        date_filter: selectedDateFilter,
      });
      if (redRes.success) {
        setRecentRedemptions(redRes.data.items || []);
        setRedemptionTotal(redRes.data.total || 0);
        setRedemptionPage(redRes.data.page);
      }
    } catch (error) {
      toast.error("Failed to load redemptions");
    } finally {
      setRedLoading(false);
    }
  };

  const fetchRecentPurchases = async (page) => {
    setPurLoading(true);
    try {
      const purRes = await purchasesApi.getPurchases({
        page,
        size: 5,
        date_filter: selectedDateFilter,
      });
      if (purRes.success) {
        setRecentPurchases(purRes.data.items || []);
        setPurchaseTotal(purRes.data.total || 0);
        setPurchasePage(purRes.data.page);
      }
    } catch (error) {
      toast.error("Failed to load purchases");
    } finally {
      setPurLoading(false);
    }
  };

  // Re-fetch everything when the date filter changes (defaults to today on mount)
  useEffect(() => {
    fetchAllDashboardData(selectedDateFilter);

    // Setup 60s polling for "Live" mode
    const pollInterval = setInterval(() => {
      fetchAllDashboardData(selectedDateFilter);
    }, 60000);

    return () => clearInterval(pollInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateFilter]);

  const analytics = () => {
    toast.custom((t) => (
      <div
        className={`${t.visible ? "animate-in fade-in zoom-in" : "animate-out fade-out zoom-out"} pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-[1.5rem] bg-white shadow-2xl ring-1 ring-black/5 backdrop-blur-md border border-gray-100/50`}
        style={{ animationDuration: "300ms" }}
      >
        <div className="flex w-0 flex-1 p-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/30">
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                  Upgrade Workspace
                </p>
                <p className="mt-1 text-xs text-gray-500 font-medium leading-relaxed">
                  Discover hidden purchasing patterns and forecast customer
                  behavior with our new advanced analytics suite. Treat your
                  data as your greatest asset.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex p-2 pr-4 items-start pt-4">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-90"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen text-gray-900 p-4 md:p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Dashboard Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Showing data for:{" "}
            <span className="font-black text-gray-900">
              {selectedDateFilter === "today"
                ? "Today"
                : selectedDateFilter === "yesterday"
                  ? "Yesterday"
                  : selectedDateFilter === "7days"
                    ? "Last 7 Days"
                    : selectedDateFilter === "30days"
                      ? "Last 30 Days"
                      : "All Time"}
            </span>
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
              <Activity size={12} className="text-gray-300" />
              <span>
                Last Synced:{" "}
                {lastSynced.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="appearance-none px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-[11px] font-black uppercase tracking-widest shadow-sm hover:border-gray-300 focus:border-gray-900 outline-none transition-all cursor-pointer pr-10"
            >
              <option value="all">Protocol: All Time</option>
              <option value="today">Protocol: Today</option>
              <option value="yesterday">Protocol: Yesterday</option>
              <option value="7days">Protocol: Last 7 Days</option>
              <option value="30days">Protocol: Last 30 Days</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={14} />
            </div>
          </div>

          <button className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all shadow-sm group">
            <ArrowDownToLine
              size={16}
              className="group-hover:translate-y-0.5 transition-transform"
            />
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={user?.metrics?.total_customers}
          subValue={user?.metrics?.new_customers}
          subLabel="Registrations"
          icon={Users}
          trend="+12.5%"
          trendUp={true}
          loading={metricsLoading}
        />
        <StatCard
          title="Transactions"
          value={user?.metrics?.total_purchases}
          subValue={user?.metrics?.avg_order_value}
          subLabel="Avg Order Value"
          icon={ShoppingCart}
          trend="+8.2%"
          trendUp={true}
          loading={metricsLoading}
        />
        <StatCard
          title="Points Issued"
          value={user?.metrics?.total_points_issued}
          subValue={user?.metrics?.total_points_redeemed}
          subLabel="Points Redeemed"
          icon={Award}
          trend="Steady"
          trendUp={true}
          loading={metricsLoading}
        />
        <StatCard
          title="Total Revenue"
          value={user?.metrics?.total_revenue}
          subValue={user?.metrics?.total_net_revenue}
          subLabel="Actual Collection"
          icon={Wallet}
          trend="Record High"
          trendUp={true}
          isDark={true}
          loading={metricsLoading}
        />
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchases (Ledger) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-gray-900">
                Recent Ledger
              </h3>
              <button
                onClick={() => setIsPurchasesCollapsed(!isPurchasesCollapsed)}
                className="p-1 rounded-md hover:bg-gray-50 text-gray-400 transition-colors"
              >
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${isPurchasesCollapsed ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            <Link
              to="/purchases"
              className="text-gray-500 hover:text-gray-900 text-xs font-bold transition-colors flex items-center gap-1 uppercase tracking-widest"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {!isPurchasesCollapsed && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 px-2 font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                      Customer
                    </th>
                    <th className="pb-3 px-2 font-bold text-[10px] text-gray-400 uppercase tracking-widest text-right">
                      Net Amount
                    </th>
                    <th className="pb-3 px-2 font-bold text-[10px] text-gray-400 uppercase tracking-widest text-right">
                      Points
                    </th>
                    <th className="pb-3 px-2 font-bold text-[10px] text-gray-400 uppercase tracking-widest text-right hidden sm:table-cell">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {purLoading ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-10 text-center text-gray-400 text-sm italic"
                      >
                        Updating ledger...
                      </td>
                    </tr>
                  ) : recentPurchases.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-10 text-center text-gray-400 text-sm italic"
                      >
                        No recent transactions.
                      </td>
                    </tr>
                  ) : (
                    recentPurchases.map((purchase) => (
                      <tr
                        key={purchase.id}
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-900 border border-gray-100">
                              {purchase.customer_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-gray-900">
                                {purchase.customer_name}
                              </p>
                              <p className="text-[10px] text-gray-500 font-medium">
                                {purchase.customer_phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <p className="font-bold text-sm text-gray-900">
                            ₹
                            {(
                              purchase.payable_amount || purchase.amount
                            )?.toLocaleString()}
                          </p>
                          {(purchase.coupon_discount || 0) +
                            (purchase.points_discount || 0) >
                            0 && (
                            <p className="text-[10px] text-rose-500 font-bold tracking-tighter mt-0.5 leading-none">
                              -₹
                              {(
                                (purchase.coupon_discount || 0) +
                                (purchase.points_discount || 0)
                              ).toLocaleString()}
                            </p>
                          )}
                          {purchase.coupon_code && (
                            <div className="flex items-center justify-end gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-0.5 leading-none">
                              <Ticket size={11} className="shrink-0" />
                              {purchase.coupon_code}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className="inline-flex items-center text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-100/50">
                            +{purchase.points_earned}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right hidden sm:table-cell">
                          <p className="text-xs font-bold text-gray-600">
                            {formatDate(purchase.created_at)}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {formatTime(purchase.created_at)}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {purchaseTotal > 5 && !purLoading && (
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Page {purchasePage}
                  </span>
                  <div className="flex gap-1">
                    <button
                      disabled={purchasePage === 1}
                      onClick={() => fetchRecentPurchases(purchasePage - 1)}
                      className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ArrowRight size={14} className="rotate-180" />
                    </button>
                    <button
                      disabled={
                        recentPurchases.length < 5 ||
                        purchasePage * 5 >= purchaseTotal
                      }
                      onClick={() => fetchRecentPurchases(purchasePage + 1)}
                      className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex flex-col">
          {/* Actions */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/purchase"
                className="w-full flex items-center justify-center gap-2 p-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-bold"
              >
                <Plus size={16} /> Record Purchase
              </Link>
              <Link
                to="/customers"
                className="w-full flex items-center justify-center gap-2 p-2.5 bg-white border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold"
              >
                <UserPlus size={16} /> Add Customer
              </Link>
            </div>
          </div>

          {/* Redemptions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">
                Recent Redemptions
              </h3>
              <button
                onClick={() =>
                  setIsRedemptionsCollapsed(!isRedemptionsCollapsed)
                }
                className="text-gray-400 hover:text-gray-900"
              >
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${isRedemptionsCollapsed ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {!isRedemptionsCollapsed && (
              <div className="space-y-5">
                {redLoading ? (
                  <div className="text-center py-10 text-gray-400 text-xs italic">
                    Syncing activity...
                  </div>
                ) : recentRedemptions.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-xs italic">
                    No activity yet.
                  </div>
                ) : (
                  recentRedemptions.map((red) => (
                    <div
                      key={red.id}
                      className="flex items-start justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-gray-200 group-hover:bg-gray-900 transition-colors mt-1.5"></div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {red.customer_name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {formatDate(red.created_at)} ·{" "}
                            {formatTime(red.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-rose-600">
                          -{red.points_used}{" "}
                          <span className="text-[10px] text-gray-400 font-bold uppercase ml-0.5">
                            pts
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {redemptionTotal > 10 && !redLoading && (
                  <div className="pt-4 border-t border-gray-50 flex justify-end gap-2">
                    <button
                      disabled={redemptionPage === 1}
                      onClick={() => fetchRecentRedemptions(redemptionPage - 1)}
                      className="p-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ArrowRight size={12} className="rotate-180" />
                    </button>
                    <button
                      disabled={
                        recentRedemptions.length < 10 ||
                        redemptionPage * 10 >= redemptionTotal
                      }
                      onClick={() => fetchRecentRedemptions(redemptionPage + 1)}
                      className="p-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enterprise Analytics Banner */}
      <section className="">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0A0B] text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 border border-gray-800 shadow-2xl">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div className="flex-1 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
              <Sparkles size={14} className="text-gray-400" />
              PointNest Enterprise
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Advanced AI <br /> Market Insights
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md font-medium">
              Discover hidden purchasing patterns and forecast customer behavior
              with our new advanced analytics suite. Treat your data as your
              greatest asset.
            </p>
            <div className="pt-2">
              <button
                onClick={() => analytics()}
                className="bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg shadow-white/5 active:scale-95 cursor-not-allowed opacity-50"
              >
                Upgrade Workspace <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          <div className="w-full md:w-auto relative z-10 flex justify-center md:justify-end">
            <div className="w-[280px] h-[180px] rounded-2xl bg-gray-900/50 border border-gray-800 p-6 flex flex-col justify-end gap-3 relative overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/10 blur-[80px]"></div>

              <div className="flex items-end gap-3 h-full w-full relative z-10">
                <div className="w-full bg-gray-800 rounded-lg h-[30%] hover:bg-gray-700 transition-all"></div>
                <div className="w-full bg-gray-700 rounded-lg h-[55%] hover:bg-gray-600 transition-all"></div>
                <div className="w-full bg-white rounded-lg h-[85%] relative group shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    +85.2% INSIGHT
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-lg h-[40%] hover:bg-gray-700 transition-all"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
