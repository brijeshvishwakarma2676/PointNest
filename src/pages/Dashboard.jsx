import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { purchasesApi } from "../features/purchases/api";
import { redemptionsApi } from "../features/redemptions/api";
import { formatDate, formatTime } from "../utils/dateUtils";
import toast from "react-hot-toast";

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
  const [metrics, setMetrics] = useState({ total: 0, loading: true });
  const [purLoading, setPurLoading] = useState(false);
  const [redLoading, setRedLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        refreshProfile();
      } catch (error) {
        toast.error("Failed to load metrics");
        setMetrics((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const fetchRecentRedemptions = async (page) => {
    setRedLoading(true);
    try {
      const redRes = await redemptionsApi.getRedemptions({ page, size: 10 });
      if (redRes.success) {
        setRecentRedemptions(redRes.data.items || []);
        setRedemptionTotal(redRes.data.total || 0);
        setRedemptionPage(redRes.data.page);
        // Keep metrics total as total customers if that's what it was meant for, 
        // or update if metrics refers to something else. 
        // Usually metrics.total is total_customers from refreshProfile.
      }
    } catch (error) {
      toast.error("Failed to load recent activity");
    } finally {
      setRedLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentRedemptions(1);
  }, []);

  const fetchRecentPurchases = async (page) => {
    setPurLoading(true);
    try {
      const purRes = await purchasesApi.getPurchases({ page, size: 5 });
      if (purRes.success) {
        setRecentPurchases(purRes.data.items || []);
        setPurchaseTotal(purRes.data.total || 0);
        setPurchasePage(purRes.data.page);
      }
    } catch (error) {
      toast.error("Failed to load recent purchases");
    } finally {
      setPurLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentPurchases(1);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 font-body text-[#2c2a51]">
      <style>{`
        .font-headline { font-family: 'Manrope', sans-serif; }
        .luminous-shadow { box-shadow: 0 20px 60px -15px rgba(44, 42, 81, 0.08); }
      `}</style>

      {/* Welcome Header */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-700">
        <h2 className="text-4xl font-headline font-extrabold text-[#2c2a51] tracking-tight">
          Performance Overview
        </h2>
        <p className="text-[#5a5781] mt-2 font-body font-medium">
          Real-time data for your <span className="text-[#2444eb] font-bold">elite merchant</span> status.
        </p>
      </section>

      {/* Stats Grid (Bento Style) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        {/* Total Customers */}
        <div className="bg-white p-6 rounded-2xl luminous-shadow flex flex-col justify-between h-44 border border-white/40 transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-[#2444eb] bg-[#2444eb]/10 p-2.5 rounded-xl">
              group
            </span>
            {metrics.loading ? (
              <span className="h-4 w-12 bg-gray-50 animate-pulse rounded-full"></span>
            ) : (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                +12%
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-[#5a5781] uppercase tracking-[0.15em] mb-1">
              Total Customers
            </p>
            <p className="text-3xl font-headline font-black text-[#2c2a51]">
              {user?.metrics?.total_customers ??
                (metrics.loading ? "..." : metrics.total?.toLocaleString())}
            </p>
          </div>
        </div>

        {/* Total Purchases */}
        <div className="bg-white p-6 rounded-2xl luminous-shadow flex flex-col justify-between h-44 border border-white/40 transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-[#652fe7] bg-[#652fe7]/10 p-2.5 rounded-xl">
              shopping_cart
            </span>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
              +8%
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#5a5781] uppercase tracking-[0.15em] mb-1">
              Total Transactions
            </p>
            <p className="text-3xl font-headline font-black text-[#2c2a51]">
              {user?.metrics?.total_purchases?.toLocaleString() ?? "0"}
            </p>
          </div>
        </div>

        {/* Points Issued */}
        <div className="bg-white p-6 rounded-2xl luminous-shadow flex flex-col justify-between h-44 border border-white/40 transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-[#b60051] bg-[#b60051]/10 p-2.5 rounded-xl">
              stars
            </span>
            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest">
              Steady
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#5a5781] uppercase tracking-[0.15em] mb-1">
              Points Issued
            </p>
            <p className="text-3xl font-headline font-black text-[#b60051]">
              {user?.metrics?.total_points_issued?.toLocaleString() ?? "0"}
            </p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-linear-to-br from-[#2444eb] to-[#652fe7] p-6 rounded-2xl shadow-xl shadow-blue-900/20 flex flex-col justify-between h-44 text-white transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-white bg-white/20 p-2.5 rounded-xl">
              payments
            </span>
            <span className="text-[10px] font-black text-white/90 bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest">
              Record High
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.15em] mb-1">
              Total Revenue
            </p>
            <p className="text-3xl font-headline font-black flex items-baseline gap-1">
              <span className="text-sm font-bold opacity-80">₹</span>
              {user?.metrics?.total_revenue?.toLocaleString() ?? "0"}
            </p>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
        {/* Recent Purchases Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 luminous-shadow border border-white/50 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-headline font-black text-[#2c2a51]">
                Recent Purchases
              </h3>
              <button
                onClick={() => setIsPurchasesCollapsed(!isPurchasesCollapsed)}
                className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-[#2444eb] transition-all"
              >
                <span
                  className={`material-symbols-outlined transition-transform duration-300 block ${
                    isPurchasesCollapsed ? "rotate-180" : ""
                  }`}
                >
                  keyboard_arrow_down
                </span>
              </button>
            </div>
            <Link
              to="/purchases"
              className="text-[#2444eb] font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1"
            >
              Ledger <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </div>

          {!isPurchasesCollapsed && (
            <>
              <div className="overflow-x-auto min-h-[300px]">
                {purLoading ? (
                  <div className="p-20 text-center text-gray-400 font-bold italic opacity-60">
                    <span className="animate-pulse">Analyzing transactions...</span>
                  </div>
                ) : recentPurchases.length === 0 ? (
                  <div className="p-20 text-center text-gray-400 font-bold italic opacity-60 text-lg">
                    No transactions yet.
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-4 font-black text-[10px] uppercase tracking-[0.2em] text-[#5a5781]">
                          Customer
                        </th>
                        <th className="pb-4 font-black text-[10px] uppercase tracking-[0.2em] text-[#5a5781] text-right">
                          Amount
                        </th>
                        <th className="pb-4 font-black text-[10px] uppercase tracking-[0.2em] text-[#5a5781] text-right">
                          Points
                        </th>
                        <th className="pb-4 font-black text-[10px] uppercase tracking-[0.2em] text-[#5a5781] text-right">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentPurchases.map((purchase) => (
                        <tr
                          key={purchase.id}
                          className="group hover:bg-[#f9f5ff] transition-all"
                        >
                          <td className="py-5">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[#f3eeff] flex items-center justify-center font-black text-[#2444eb] border border-white">
                                {purchase.customer_name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-headline font-bold text-sm text-[#2c2a51]">
                                  {purchase.customer_name}
                                </p>
                                <p className="text-[10px] font-black text-[#5a5781] uppercase tracking-widest leading-none">
                                  {purchase.customer_phone}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 text-right font-headline font-black text-sm">
                            <span className="text-[#2444eb] mr-0.5">₹</span>
                            {purchase.amount?.toLocaleString()}
                          </td>
                          <td className="py-5 text-right">
                            <span className="bg-[#2444eb]/10 text-[#2444eb] px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter">
                              +{purchase.points_earned} PTS
                            </span>
                          </td>
                          <td className="py-5 text-right">
                            <p className="text-[11px] font-black text-[#2c2a51]">
                              {formatDate(purchase.created_at)}
                            </p>
                            <p className="text-[9px] font-black text-[#5a5781] uppercase tracking-widest leading-none">
                              {formatTime(purchase.created_at)}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {purchaseTotal > 5 && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#5a5781] uppercase tracking-[0.2em]">
                    Page {purchasePage}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={purchasePage === 1 || purLoading}
                      onClick={() => fetchRecentPurchases(purchasePage - 1)}
                      className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#2444eb] hover:bg-[#f3eeff] transition-all disabled:opacity-30"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">
                        arrow_back_ios_new
                      </span>
                    </button>
                    <button
                      disabled={
                        recentPurchases.length < 5 ||
                        purchasePage * 5 >= purchaseTotal ||
                        purLoading
                      }
                      onClick={() => fetchRecentPurchases(purchasePage + 1)}
                      className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#2444eb] hover:bg-[#f3eeff] transition-all disabled:opacity-30"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">
                        arrow_forward_ios
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Side Column: Actions & Customers */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-[#f3eeff] rounded-3xl p-8 luminous-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-8xl">bolt</span>
            </div>
            <h3 className="text-[10px] font-black text-[#2c2a51] uppercase tracking-[0.2em] mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/purchase"
                className="flex items-center justify-between p-4 bg-white rounded-2xl hover:shadow-lg hover:shadow-blue-900/5 transition-all border border-white group/btn"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#2444eb]">
                    add_circle
                  </span>
                  <span className="text-sm font-bold text-[#2c2a51]">
                    Record Purchase
                  </span>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover/btn:text-[#2444eb] transition-colors">
                  chevron_right
                </span>
              </Link>
              <Link
                to="/customers"
                className="flex items-center justify-between p-4 bg-white rounded-2xl hover:shadow-lg hover:shadow-purple-900/5 transition-all border border-white group/btn"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#652fe7]">
                    person_add
                  </span>
                  <span className="text-sm font-bold text-[#2c2a51]">
                    Manage Customers
                  </span>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover/btn:text-[#652fe7] transition-colors">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Redemptions List (Recent Activity) */}
          <div className="bg-white rounded-3xl p-8 luminous-shadow mt-auto border border-white/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-headline font-black text-[#2c2a51]">
                  Recent Redemptions
                </h3>
                <button
                  onClick={() => setIsRedemptionsCollapsed(!isRedemptionsCollapsed)}
                  className="p-1 rounded bg-gray-50 text-gray-400 hover:text-[#2444eb] transition-all"
                >
                  <span
                    className={`material-symbols-outlined text-xs transition-transform duration-300 block ${
                      isRedemptionsCollapsed ? "rotate-180" : ""
                    }`}
                  >
                    keyboard_arrow_down
                  </span>
                </button>
              </div>
            </div>

            {!isRedemptionsCollapsed && (
              <>
                <div className="space-y-6 min-h-[300px]">
                  {redLoading ? (
                    <div className="h-40 flex items-center justify-center text-gray-400 italic font-bold">
                      Fetching redemptions...
                    </div>
                  ) : recentRedemptions.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-gray-400 italic font-bold">
                      No recent redemptions.
                    </div>
                  ) : (
                    recentRedemptions.map((redemption) => (
                      <div
                        key={redemption.id}
                        className="flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-linear-to-br from-[#b60051]/5 to-[#652fe7]/5 flex items-center justify-center font-black text-[#b60051] border border-white shadow-sm ring-2 ring-transparent group-hover:ring-[#b60051]/10 transition-all">
                            {redemption.customer_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#2c2a51] group-hover:text-[#b60051] transition-colors">
                              {redemption.customer_name}
                            </p>
                            <p className="text-[10px] font-black text-[#5a5781] uppercase tracking-widest leading-none">
                              Points Used
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-rose-600">
                            -{redemption.points_used?.toLocaleString()}{" "}
                            <span className="opacity-50">pts</span>
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {redemptionTotal > 10 && (
                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#5a5781] uppercase tracking-[0.2em]">
                      Page {redemptionPage}
                    </span>
                    <div className="flex gap-2">
                       <button 
                         disabled={redemptionPage === 1 || redLoading}
                         onClick={() => fetchRecentRedemptions(redemptionPage - 1)}
                         className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-[#2444eb] hover:bg-[#f3eeff] transition-all disabled:opacity-30"
                       >
                         <span className="material-symbols-outlined text-xs">arrow_back</span>
                       </button>
                       <button 
                         disabled={recentRedemptions.length < 10 || (redemptionPage * 10 >= redemptionTotal) || redLoading}
                         onClick={() => fetchRecentRedemptions(redemptionPage + 1)}
                         className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-[#2444eb] hover:bg-[#f3eeff] transition-all disabled:opacity-30"
                       >
                         <span className="material-symbols-outlined text-xs">arrow_forward</span>
                       </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Luminous Highlight Banner */}
      <section className="bg-[#e3dfff] rounded-[40px] p-1.5 overflow-hidden relative animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <div className="bg-white rounded-[34px] p-12 flex flex-col md:flex-row items-center gap-12 border border-white/50">
          <div className="flex-1 space-y-6">
            <span className="bg-[#ff8fa9]/20 text-[#b60051] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">
              New Feature
            </span>
            <h2 className="text-4xl font-headline font-black text-[#2c2a51] tracking-tight leading-tight">
              Unlock AI-Driven <br /> Market Insights
            </h2>
            <p className="text-[#5a5781] font-body text-lg leading-relaxed max-w-lg">
              Discover hidden purchasing patterns and customer behavior with our
              new advanced analytics suite. Treat your data like high-end
              editorial content.
            </p>
            <button className="bg-[#2444eb] text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-500 transition-all shadow-xl shadow-blue-500/25 active:scale-95 cursor-not-allowed">
              Upgrade to Pro Tier
            </button>
          </div>
          <div className="w-full md:w-1/3 relative">
            <div className="absolute inset-0 bg-[#2444eb]/20 blur-3xl rounded-full"></div>
            <img
              alt="Data Analytics"
              className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 relative z-10 border border-white/50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUukxl4_eqy84XfAifJctNZk4wW2yl9_zM62Uaj5r7cCe7wL7GMBtSLZrTwk2AxUgL04BGwQ8bqKk2A3_xfZbI0H0kUR1L_hNtF5eQGPTB5WSbe4X9AGkZ3Rlojm6uCPuJZ-o4Wj81dKy7lFWPqIzUAZhQbdpSlid7tKuUMKF_IC837ayPp-etNa--EVk9I1mSZf2XhiX429-ATLKc73KdZ0qWg_kmQZ6VQORRzAmfwdKgT3Bqfjp1eUcLMfiwyFmtd62OMShqjHc"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
