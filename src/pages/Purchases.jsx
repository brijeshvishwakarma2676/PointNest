import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { purchasesApi } from "../features/purchases/api";
import { formatDate, formatTime } from "../utils/dateUtils";
import toast from "react-hot-toast";
import { 
  ShoppingBag, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  User,
  Clock,
  ArrowUpRight
} from "lucide-react";

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
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen font-sans antialiased">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">
            <Clock size={12} />
            Enterprise Ledger
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-none mb-4">
            Transaction <br />
            <span className="text-gray-400">Audit Trail</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-md text-sm leading-relaxed">
            Detailed log of all customer transactions and points distributions across the Lumina network.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/purchase"
            className="flex items-center gap-2.5 px-6 py-4 bg-[#0A0A0B] text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
          >
            <Plus size={18} />
            Record Transaction
          </Link>
        </div>
      </div>

      {/* Main Ledger Card */}
      <div className="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Search size={14} className="text-gray-400" />
            Global Activity
          </h2>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {pagination.total} ENTRIES RECORDED
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Merchant Client</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Ref ID</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Value (INR)</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Yield (PTS)</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Executed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-10 py-7">
                      <div className="h-4 bg-gray-100 rounded-full w-1/3 mb-3"></div>
                      <div className="h-3 bg-gray-50 rounded-full w-1/5"></div>
                    </td>
                  </tr>
                ))
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <ShoppingBag size={48} className="text-gray-400" />
                      <p className="text-lg font-black text-gray-400 uppercase tracking-tighter">
                        Empty Audit Trail
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                purchases.map((pur) => (
                  <tr key={pur.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-gray-900 border border-gray-200 group-hover:bg-white group-hover:shadow-md transition-all">
                          {pur.customer_name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base mb-0.5">{pur.customer_name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{pur.customer_phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className="text-[11px] font-black text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200/50">
                        #{pur.id?.toString().padStart(6, '0')}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <p className="text-lg font-bold text-gray-900 tracking-tight">
                        ₹{pur.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 text-xs font-bold shadow-sm group-hover:bg-[#0A0A0B] group-hover:text-white group-hover:border-[#0A0A0B] transition-all">
                        +{pur.points_earned} <span className="text-[9px] opacity-60 uppercase">pts</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <p className="text-sm font-bold text-gray-900 mb-0.5">
                        {formatDate(pur.created_at)}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
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
          <div className="px-10 py-8 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              PAGE {pagination.page} OF {Math.ceil(pagination.total / pagination.size)}
            </div>
            
            <div className="flex gap-3">
              <button
                disabled={pagination.page === 1 || loading}
                onClick={() => fetchPurchases(pagination.page - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs font-bold hover:shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Previous
              </button>
              
              <button
                disabled={pagination.page * pagination.size >= pagination.total || loading}
                onClick={() => fetchPurchases(pagination.page + 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs font-bold hover:shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                Next
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit Transparency Flag */}
      <div className="mt-12 flex justify-center">
         <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
           <ArrowUpRight size={14} className="text-gray-300" />
           Certified Lumina Audit Protocol v2.4
         </div>
      </div>
    </div>
  );
};

export default Purchases;
