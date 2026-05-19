import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TicketPercent,
  ChevronLeft,
  User,
  Clock,
  Check,
  ShieldCheck,
  History,
  TrendingDown,
  ArrowDownRight,
  Loader2,
  Calendar,
} from "lucide-react";

/**
 * CouponUsagePage - PointNest Enterprise Edition
 * A dedicated audit terminal for deep-diving into specific voucher redemptions.
 */
import { couponsApi } from "../api";
import { toast } from "react-hot-toast";

/**
 * CouponUsagePage - PointNest Enterprise Edition
 * A dedicated audit terminal for deep-diving into specific voucher redemptions.
 */
const CouponUsagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    const fetchAuditTrail = async () => {
      try {
        setLoading(true);
        const result = await couponsApi.getCouponDetail(id);
        if (result.success) {
          setCoupon(result.data);
        } else {
          toast.error(result.message || "Failed to authorize audit access");
        }
      } catch (error) {
        console.error("Audit fetch error:", error);
        toast.error("Critical: Protocol synchronization failure");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuditTrail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 animate-in fade-in duration-700">
        <div className="relative">
          <Loader2 className="animate-spin text-gray-900" size={48} />
          <TicketPercent
            className="absolute inset-0 m-auto text-gray-400 opacity-30"
            size={20}
          />
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Querying Audit Ledger...
        </p>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="p-10 text-center flex flex-col items-center gap-6 animate-in fade-in duration-700">
        <div className="h-20 w-20 rounded-[2rem] bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 uppercase italic">
            Access Denied
          </h2>
          <p className="text-sm text-gray-400 font-medium">
            No valid voucher protocol found for ID: {id}
          </p>
        </div>
        <button
          onClick={() => navigate("/coupons")}
          className="px-8 py-3 bg-[#0A0A0B] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen font-sans antialiased text-gray-900">
      {/* Navigation Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <button
            onClick={() => navigate("/coupons")}
            className="group flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Registry
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-2xl shadow-gray-200">
              <TicketPercent size={24} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight italic uppercase">
                {coupon.code}
              </h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Dynamic Audit Trail
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
              coupon.status === "active"
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-rose-50 text-rose-600 border-rose-100"
            }`}
          >
            Status: {coupon.status}
          </div>
          <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
            Val:{" "}
            {coupon.type === "percentage"
              ? `${coupon.value}%`
              : `₹${coupon.value}`}
          </div>
        </div>
      </div>

      {/* Usage Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
            <TrendingDown size={100} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Saturation
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {coupon.usage_count}{" "}
              <span className="text-sm font-bold opacity-30">
                / {coupon.max_usage}
              </span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
            <ShieldCheck size={100} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Verify Pulse
            </p>
            <h3
              className={`text-3xl font-black uppercase ${coupon.status === "active" ? "text-emerald-600" : "text-rose-600"}`}
            >
              {coupon.status}
            </h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
            <Calendar size={100} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Validity
            </p>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
              {coupon.expiry_date
                ? new Date(coupon.expiry_date).toLocaleDateString()
                : "Never"}
            </h3>
          </div>
        </div>
      </div>

      {/* Protocol Specification Panel */}
      <div className="mb-12">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-4">
          Protocol Specification
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100/50">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">
              Discount Cap
            </p>
            <p className="text-lg font-black text-gray-900">
              {coupon.max_discount_cap
                ? `₹${coupon.max_discount_cap}`
                : "No Cap"}
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100/50">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">
              Min Order Val
            </p>
            <p className="text-lg font-black text-gray-900">
              ₹{coupon.min_order_value || 0}
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100/50">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">
              Per User Cap
            </p>
            <p className="text-lg font-black text-gray-900">
              {coupon.max_usage_per_user} Usage
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100/50">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">
              Stackable
            </p>
            <p
              className={`text-lg font-black ${coupon.is_stackable ? "text-emerald-600" : "text-gray-400"}`}
            >
              {coupon.is_stackable ? "Authorized" : "Restricted"}
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100/50">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">
              Eligibility
            </p>
            <p className="text-xs font-black text-gray-900 uppercase tracking-widest">
              {coupon.eligibility_type}
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100/50">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">
              Start Date
            </p>
            <p className="text-xs font-black text-gray-900 uppercase tracking-widest">
              {coupon.start_date
                ? new Date(coupon.start_date).toLocaleDateString()
                : "Instant"}
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100/50">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">
              Authorized At
            </p>
            <p className="text-xs font-black text-gray-900 uppercase tracking-widest">
              {new Date(coupon.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-[#0A0A0B] border border-gray-900">
            <p className="text-[9px] font-bold text-gray-500 uppercase mb-2">
              Audit Registry
            </p>
            <p className="text-xs font-black text-white uppercase tracking-widest italic">
              V-PRTCL #{coupon.id}
            </p>
          </div>
        </div>
      </div>

      {/* Main Redemption Ledger */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
          <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
            <History size={16} className="text-gray-400" />
            Full Usage Ledger
          </h2>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {coupon.history.length} AUTHORIZED EVENTS
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Identified Client
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Protocol Access ID
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Auth Timestamp
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Verification
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupon.history.map((log, i) => (
                <tr
                  key={i}
                  className="group hover:bg-gray-50/50 transition-all duration-300"
                >
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 font-black border border-gray-200 group-hover:bg-white group-hover:shadow-md transition-all">
                        {log.name?.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-bold text-gray-900 text-sm tracking-tight">
                        {log.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      U-ID: #{log.id}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <Clock size={12} className="text-gray-300" />
                      {log.used_at}
                    </div>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      Verified <Check size={12} strokeWidth={3} />
                    </div>
                  </td>
                </tr>
              ))}
              {coupon.history.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <ArrowDownRight size={64} className="text-gray-400" />
                      <p className="text-xl font-black text-gray-400 uppercase tracking-tighter italic font-sans">
                        No redemptions on file
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponUsagePage;
