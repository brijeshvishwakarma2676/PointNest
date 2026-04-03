import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { purchasesApi } from "../features/purchases/api";
import { formatDate, formatTime } from "../utils/dateUtils";
import toast from "react-hot-toast";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, size: 10 });

  const fetchPurchases = async (page = 1) => {
    setLoading(true);
    try {
      const response = await purchasesApi.getPurchases({ page, size: 10 });
      if (response.success) {
        setPurchases(response.data.items || []);
        setPagination({
          page: response.data.page,
          total: response.data.total,
          size: response.data.size,
        });
      } else {
        toast.error("Failed to load purchase history");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong while fetching history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases(1);
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
            Purchase <span className="text-emerald-600">History</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium max-w-lg text-base">
            Detailed log of all customer transactions and points distributions.
          </p>
        </div>

        <Link
          to="/purchase"
          className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Record Purchase
        </Link>
      </div>

      {/* Main Ledger Card */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Transaction ID</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Points</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-6 bg-gray-50/20">
                      <div className="h-4 bg-gray-100 rounded-full w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-50 rounded-full w-1/6"></div>
                    </td>
                  </tr>
                ))
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-28 text-center text-gray-400 font-black italic tracking-tight text-xl opacity-60">
                    No purchase history found for this shop.
                  </td>
                </tr>
              ) : (
                purchases.map((pur) => (
                  <tr key={pur.id} className="group hover:bg-gray-50/80 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-linear-to-br from-indigo-50 to-blue-50 flex items-center justify-center font-black text-blue-600 border border-white shadow-sm transition-transform group-hover:scale-110">
                          {pur.customer_name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 group-hover:text-blue-600 transition-colors text-base">{pur.customer_name}</p>
                          <p className="text-xs text-gray-400 font-black tracking-widest uppercase">{pur.customer_phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-gray-400 opacity-60 bg-gray-100 px-2 py-1 rounded-md">#{pur.id}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-lg font-black text-gray-900">
                        <span className="text-emerald-600 mr-0.5 font-bold">₹</span>{pur.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tighter shadow-xs">
                        +{pur.points_earned} PTS
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-black text-gray-700 tracking-tight">
                        {formatDate(pur.created_at)}
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                        {formatTime(pur.created_at)}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.total > 0 && (
          <div className="px-8 py-6 bg-gray-50/50 backdrop-blur-sm border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
              Showing {(pagination.page - 1) * pagination.size + 1} - {Math.min(pagination.page * pagination.size, pagination.total)} of {pagination.total}
            </div>
            
            <div className="flex gap-3">
              <button
                disabled={pagination.page === 1 || loading}
                onClick={() => fetchPurchases(pagination.page - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 text-sm font-black hover:bg-gray-50 hover:shadow-md transition-all disabled:opacity-40 disabled:hover:shadow-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                Prev
              </button>
              
              <button
                disabled={pagination.page * pagination.size >= pagination.total || loading}
                onClick={() => fetchPurchases(pagination.page + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 text-sm font-black hover:bg-gray-50 hover:shadow-md transition-all disabled:opacity-40 disabled:hover:shadow-none"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Counter (Subtle Footer) */}
      <div className="mt-8 px-4 flex justify-end">
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
           TOTAL RECORDED: {pagination.total} PURCHASES
         </p>
      </div>
    </div>
  );
};

export default Purchases;
