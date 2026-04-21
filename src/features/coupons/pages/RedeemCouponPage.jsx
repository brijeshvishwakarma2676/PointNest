import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  ArrowLeft, 
  TicketPercent, 
  Search, 
  User, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { couponsApi } from "../api";

const RedeemCouponPage = () => {
  const navigate = useNavigate();
  
  // Steps: 1 = Enter Code, 2 = Enter Details, 3 = Success
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Data for the redemption
  const [couponCode, setCouponCode] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  
  // Details of the found coupon
  const [couponDetails, setCouponDetails] = useState(null);
  
  // Result of the redemption
  const [redemptionResult, setRedemptionResult] = useState(null);

  // Step 1: Check if the coupon code is real and valid
  const handleCheckCode = async (e) => {
    e.preventDefault();
    if (!couponCode) return;

    try {
      setLoading(true);
      const response = await couponsApi.validateCoupon(couponCode);
      
      if (response.success && response.data.valid) {
        setCouponDetails(response.data.coupon);
        setStep(2);
        toast.success("Coupon found!");
      } else {
        toast.error(response.message || "Invalid coupon code");
      }
    } catch (error) {
      toast.error(error.message || "Could not check coupon");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Finalize the redemption
  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!customerPhone || !orderAmount) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await couponsApi.redeemCoupon({
        code: couponCode,
        customer_phone: customerPhone,
        order_amount: parseFloat(orderAmount)
      });

      if (response.success) {
        setRedemptionResult(response.data);
        setStep(3);
        toast.success("Coupon redeemed!");
      } else {
        toast.error(response.message || "Redemption failed");
      }
    } catch (error) {
      toast.error(error.message || "Error redeeming coupon");
    } finally {
      setLoading(false);
    }
  };

  // Step 1 UI: Search for coupon
  const renderStep1 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-10 text-center space-y-8">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto text-gray-400">
          <TicketPercent size={40} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Enter Coupon Code</h2>
          <p className="text-sm text-gray-500 font-medium">Type the code provided by the customer to verify it.</p>
        </div>

        <form onSubmit={handleCheckCode} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              required
              placeholder="e.g. SUMMER20"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="w-full pl-16 pr-6 py-6 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-xl font-black tracking-widest text-center"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !couponCode}
            className="w-full py-6 rounded-3xl bg-[#0A0A0B] text-white text-xs font-black uppercase tracking-[0.3em] shadow-xl hover:shadow-gray-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Checking..." : "Check Validity"}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );

  // Step 2 UI: Enter final details
  const renderStep2 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Coupon Summary Card */}
      <div className="bg-[#0A0A0B] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Selected Coupon</p>
            <h3 className="text-2xl font-black">{couponDetails.code}</h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Value</p>
            <div className="text-3xl font-black text-emerald-400">
              {couponDetails.type === "percentage" ? `${couponDetails.value}%` : `₹${couponDetails.value}`}
            </div>
          </div>
        </div>
        {/* Background decorative element */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full" />
      </div>

      {/* Redemption Form */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-10 space-y-8">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-4">Redemption Details</h3>
        
        <form onSubmit={handleRedeem} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Customer Phone</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Customer Phone No."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all font-bold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Total Bill Amount (₹)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center text-gray-400">
                  <ShoppingBag size={18} />
                </div>
                <input
                  type="number"
                  required
                  placeholder="Order Amount"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-8 py-6 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all text-xs font-black uppercase tracking-widest"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-6 rounded-3xl bg-[#0A0A0B] text-white text-xs font-black uppercase tracking-[0.3em] shadow-xl hover:shadow-gray-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-300"
            >
              {loading ? "Processing..." : "Complete Redemption"}
              <ShieldCheck size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Step 3 UI: Success screen
  const renderStep3 = () => (
    <div className="animate-in zoom-in-95 fade-in duration-500">
      <div className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl p-12 text-center space-y-8 relative overflow-hidden">
        {/* Celebration Background icon */}
        <div className="absolute top-0 right-0 p-10 text-emerald-50 opacity-20 pointer-events-none">
          <CheckCircle2 size={160} />
        </div>

        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
          <CheckCircle2 size={48} />
        </div>

        <div className="space-y-2 relative z-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Redemption Successful!</h2>
          <p className="text-gray-500 font-medium">The discount has been applied to the customer transaction.</p>
        </div>

        <div className="bg-emerald-50/50 rounded-[2.5rem] p-8 space-y-4 border border-emerald-50 relative z-10">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Discount Applied</span>
            <span className="text-2xl font-black text-emerald-600">₹{redemptionResult.discount_applied}</span>
          </div>
          <div className="h-px bg-emerald-100 w-full" />
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Customer</span>
            <span className="text-sm font-bold text-gray-900">{redemptionResult.customer_name}</span>
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Voucher Code</span>
            <span className="text-sm font-bold text-gray-900 uppercase">{redemptionResult.coupon_code}</span>
          </div>
        </div>

        <div className="pt-4 grid grid-cols-2 gap-4 relative z-10 font-bold">
          <button
            onClick={() => window.location.reload()}
            className="py-6 rounded-3xl bg-gray-50 text-gray-500 hover:text-gray-900 transition-all text-xs uppercase tracking-widest"
          >
            New Redemption
          </button>
          <button
            onClick={() => navigate("/coupons")}
            className="py-6 rounded-3xl bg-[#0A0A0B] text-white transition-all text-xs uppercase tracking-widest shadow-xl"
          >
            Back to Registry
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-6 mb-12">
        <button 
          onClick={() => navigate("/coupons")}
          className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Redeem Coupon</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Authorize Merchant Discount</p>
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

    </div>
  );
};

export default RedeemCouponPage;
