import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { redemptionsApi } from "../api";
import { 
  Gift, 
  Phone, 
  ShieldCheck, 
  CheckCircle, 
  CreditCard, 
  ArrowRight, 
  RefreshCw,
  User,
  ArrowDownLeft,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";

/**
 * RedeemPoints - Lumina Enterprise Edition
 * A high-impact redemption terminal with a minimalist enterprise aesthetic.
 */
const RedeemPoints = () => {
  const [searchParams] = useSearchParams();
  const initialPhone = searchParams.get("phone") || "";

  const [form, setForm] = useState({ phone: initialPhone, points_to_redeem: "" });
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (initialPhone && initialPhone.length === 10) {
      verifyClient(initialPhone);
    }
  }, [initialPhone]);

  const verifyClient = async (phone) => {
    if (phone.length !== 10) return;
    setVerifying(true);
    try {
      const { customersApi } = await import("../../customers/api");
      const response = await customersApi.getCustomerDetails({ phone });
      if (response.success && response.data) {
        setCustomerData(response.data);
      } else {
        setCustomerData(null);
      }
    } catch (error) {
      setCustomerData(null);
    } finally {
      setVerifying(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
    
    if (name === "phone" && sanitizedValue.length === 10) {
      verifyClient(sanitizedValue);
    } else if (name === "phone") {
      setCustomerData(null);
    }
  };

  const handleReset = () => {
    setResult(null);
    setForm({ phone: "", points_to_redeem: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.phone || !form.points_to_redeem) {
      toast.error("Phone number and points to redeem are required.");
      return;
    }
    if (form.phone.length !== 10 || isNaN(form.phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }
    const points = parseInt(form.points_to_redeem, 10);
    if (isNaN(points) || points <= 0) {
      toast.error("Please enter a valid number of points to redeem.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await redemptionsApi.redeemPoints({
        phone: form.phone,
        points_to_redeem: points,
      });

      if (response.success) {
        toast.success(response.message || "Points redeemed successfully!");
        setResult(response.data);
      } else {
        toast.error(response.message || "Redemption failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto min-h-screen font-sans antialiased">
      {/* Header Section */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">
          <ShieldCheck size={12} />
          Terminal Authorization
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-none mb-4">
          Redeem <br />
          <span className="text-gray-400">Loyalty Yield</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-sm text-sm leading-relaxed">
          Convert accumulated verified points into an instantaneous monetary discount for the customer's purchase.
        </p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {result ? (
          /* ── SUCCESS STATE (VOCHER/RECEIPT STYLE) ── */
          <div className="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50">
            <div className="bg-[#0A0A0B] p-10 text-white text-center relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Gift size={120} />
              </div>

              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xl">
                  <Check size={40} strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Redemption Verified</h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">AUTH-ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>

            <div className="p-10">
              <div className="flex items-center gap-4 mb-10 pb-10 border-b border-gray-100">
                <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-900 border border-gray-200">
                  {result.customer_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Dossier Profile</p>
                  <p className="text-xl font-bold text-gray-900 tracking-tight">{result.customer_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Yield Deduction</p>
                  <p className="text-3xl font-black text-gray-900 tracking-tighter">-{result.points_used}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">POINTS</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Discount Auth</p>
                  <p className="text-3xl font-black text-emerald-600 tracking-tighter">₹{result.amount_discounted?.toFixed(0)}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">SAVINGS</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Closing Yield</p>
                  <p className="text-3xl font-black text-gray-900 tracking-tighter">{result.remaining_points}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">PTS REM</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-[#0A0A0B] text-white font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
              >
                <RefreshCw size={16} />
                Return to Terminal
              </button>
            </div>
          </div>
        ) : (
          /* ── FORM STATE ── */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[2.5rem] border border-gray-200 p-10 shadow-2xl shadow-gray-200/50"
          >
            <div className="space-y-8">
              {/* Identified Client Card */}
              { (customerData || verifying) && (
                <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-between animate-in fade-in zoom-in duration-500">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-lg font-black text-gray-900 shadow-sm">
                      {verifying ? (
                        <Loader2 className="animate-spin text-gray-400" size={20} />
                      ) : (
                        customerData?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Identified Client</p>
                      <p className="font-black text-gray-900">
                        {verifying ? "Auditing Registry..." : customerData?.name}
                      </p>
                    </div>
                  </div>
                  {!verifying && (
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Avail Yield</p>
                      <p className="font-black text-emerald-600 text-lg">
                        {customerData?.points} <span className="text-[10px] opacity-60">PTS</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
              {/* Protocol ID (Phone) */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">
                  Client Protocol Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-gray-900 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="ENTER 10-DIGIT PROTOCOL ID"
                    maxLength={10}
                    className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black text-lg tracking-widest placeholder:text-gray-200 rounded-2xl"
                  />
                </div>
              </div>

              {/* Yield Quantity (Points) */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">
                  Yield Dispersement Quantity
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-gray-900 transition-colors">
                    <CreditCard size={18} />
                  </div>
                  <input
                    type="number"
                    name="points_to_redeem"
                    value={form.points_to_redeem}
                    onChange={handleChange}
                    placeholder="ENTER QUANTITY"
                    min={1}
                    className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black text-lg tracking-widest placeholder:text-gray-200 rounded-2xl"
                  />
                </div>
                 <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 leading-relaxed">
                  <ArrowDownLeft size={12} />
                  Yield will be authorized for immediate point deduction.
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-12 flex items-center justify-center gap-3 w-full py-6 rounded-2xl bg-[#0A0A0B] text-white font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200 disabled:opacity-30"
            >
              {submitting ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Verifying Session...
                </>
              ) : (
                <>
                  <Gift size={18} />
                  Authorize Redemption
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RedeemPoints;
