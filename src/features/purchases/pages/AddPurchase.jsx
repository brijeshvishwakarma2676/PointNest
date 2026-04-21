import React, { useState } from "react";
import toast from "react-hot-toast";
import { purchasesApi } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Phone, 
  IndianRupee, 
  CreditCard, 
  UserPlus, 
  Plus,
  Loader2,
  Check,
  ChevronRight,
  TicketPercent,
  Wallet,
  Coins,
  AlertCircle,
  X
} from "lucide-react";
import { couponsApi } from "../../coupons/api";

const AddPurchase = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPhone = searchParams.get("phone") || "";

  const [purchase, setPurchase] = useState({ phone: initialPhone, amount: "" });
  const [couponCode, setCouponCode] = useState("");
  const [pointsToRedeem, setPointsToRedeem] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notFoundModal, setNotFoundModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ phone: "", name: "" });
  const [submittingCustomer, setSubmittingCustomer] = useState(false);

  // Conversion rate: 10 points = 1 INR
  const POINTS_VALUATION = 10;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const response = await couponsApi.validateCoupon(couponCode);
      if (response.success && response.data.valid) {
        const coupon = response.data.coupon;
        
        // Stacking check: If points are already entered and coupon is not stackable
        if (parseInt(pointsToRedeem) > 0 && !coupon.is_stackable) {
            toast.error("This coupon cannot be combined with points redemption.");
            setAppliedCoupon(null);
        } else {
            setAppliedCoupon(coupon);
            toast.success(`Coupon applied: ${response.data.message}`);
        }
      } else {
        toast.error(response.message || "Invalid coupon code");
        setAppliedCoupon(null);
      }
    } catch (error) {
      toast.error(error.message || "Error validating coupon");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    const amount = parseFloat(purchase.amount) || 0;
    let disc = 0;
    if (appliedCoupon.type === "percentage") {
      disc = (amount * appliedCoupon.value) / 100;
      if (appliedCoupon.max_discount_cap && disc > appliedCoupon.max_discount_cap) {
        disc = appliedCoupon.max_discount_cap;
      }
    } else {
      disc = appliedCoupon.value;
    }
    return Math.floor(Math.min(disc, amount));
  };

  const calculatePointsDiscount = () => {
    const pts = parseInt(pointsToRedeem) || 0;
    const amountLeft = (parseFloat(purchase.amount) || 0) - calculateCouponDiscount();
    const ptsValue = Math.floor(pts / POINTS_VALUATION);
    return Math.min(ptsValue, amountLeft);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purchase.phone || !purchase.amount) {
      toast.error("Phone number and amount are required");
      return;
    }

    if (purchase.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    const amountNum = parseFloat(purchase.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setSubmitting(true);
    try {
      const { customersApi } = await import("../../customers/api");
      const response = await customersApi.getCustomerDetails({ phone: purchase.phone });

      if (response.success && response.data) {
        const customer = response.data;
        
        // Final point balance check before allowing confirmation
        const pointsRequired = parseInt(pointsToRedeem) || 0;
        if (pointsRequired > customer.points) {
          toast.error(`Insufficient points. Customer has only ${customer.points} points.`);
          setSubmitting(false);
          return;
        }

        setCustomerData(customer);
        setSubmitting(false); 
        setIsConfirming(true);
      } else {
        setNotFoundModal(true);
        setNewCustomer({ phone: purchase.phone, name: "" });
      }
    } catch (error) {
      if (error.response?.status === 404 || error.message?.includes("not found")) {
        setNotFoundModal(true);
        setNewCustomer({ phone: purchase.phone, name: "" });
      } else {
        toast.error("Verification protocol failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const executeTransaction = async () => {
    setSubmitting(true);
    try {
      const amountNum = parseFloat(purchase.amount);
      const response = await purchasesApi.addPurchase({
        phone: purchase.phone,
        amount: amountNum,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        points_to_redeem: parseInt(pointsToRedeem) || 0
      });

      if (response.success || response.id) {
        toast.success(
          `Recorded: ₹${amountNum - calculateCouponDiscount() - calculatePointsDiscount()} paid by ${customerData?.name || purchase.phone}`,
        );
        setPurchase({ phone: "", amount: "" });
        setPointsToRedeem("");
        setAppliedCoupon(null);
        setCouponCode("");
        setIsConfirming(false);
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Failed to record purchase");
      }
    } catch (error) {
      toast.error(error.message || "Error recording purchase");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Name and Phone are required");
      return;
    }

    setSubmittingCustomer(true);
    try {
      const { customersApi } = await import("../../customers/api");
      const response = await customersApi.addCustomer(newCustomer);

      if (response.success || response.id) {
        toast.success("Customer created successfully!");
        setNotFoundModal(false);
      } else {
        toast.error(response.message || "Failed to create customer");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating customer");
    } finally {
      setSubmittingCustomer(false);
    }
  };

  // Helper to determine max points allowed
  const getMaxRedeemablePoints = () => {
     if (!customerData) return 0;
     const amountLeft = (parseFloat(purchase.amount) || 0) - calculateCouponDiscount();
     const pointsNeededForZeroBalance = amountLeft * POINTS_VALUATION;
     return Math.min(customerData.points, pointsNeededForZeroBalance);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-[90vh] flex flex-col justify-center animate-in fade-in duration-700">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">
          <CreditCard size={12} />
          Point Center
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-4">
          Record <span className="text-gray-400">Yield</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-md text-sm leading-relaxed">
          Input customer metrics to distribute loyalty points across the enterprise ledger.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50">
        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                  Customer Protocol (Phone)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={purchase.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPurchase({ ...purchase, phone: val });
                    }}
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-lg placeholder-gray-300"
                    placeholder="9988776655"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex justify-between">
                  <span>Transaction Magnitude (INR)</span>
                  {parseFloat(purchase.amount) > 0 && (
                     <span className="text-indigo-500 normal-case">
                       Yields: +{Math.floor(parseFloat(purchase.amount) * 0.1)} pts
                     </span>
                  )}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                    <IndianRupee size={18} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={purchase.amount}
                    onChange={(e) =>
                      setPurchase({ ...purchase, amount: e.target.value })
                    }
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-lg placeholder-0.00"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                  Voucher Protocol (Coupon)
                </label>
                <div className="flex gap-3">
                  <div className="relative group flex-1">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                      <TicketPercent size={18} />
                    </div>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-lg placeholder-COUPON"
                      placeholder="Optional"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode || isValidatingCoupon}
                    className="px-8 bg-white border border-gray-200 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:border-gray-900 transition-all disabled:opacity-30 active:scale-95 whitespace-nowrap"
                  >
                    {isValidatingCoupon ? <Loader2 className="animate-spin" size={14}/> : "Apply"}
                  </button>
                </div>
                
                {/* Coupon Chip UI */}
                {appliedCoupon && (
                   <div className="mt-3 flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600">
                            <TicketPercent size={14} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Active Voucher</p>
                            <p className="text-sm font-black text-emerald-700 tracking-tight">{appliedCoupon.code}</p>
                         </div>
                      </div>
                      <button 
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="h-8 w-8 rounded-xl hover:bg-emerald-100 flex items-center justify-center text-emerald-400 hover:text-emerald-700 transition-all"
                      >
                         <X size={16} />
                      </button>
                   </div>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-6">
              {/* Point Redemption Section */}
              <div className={`p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 transition-all ${appliedCoupon && !appliedCoupon.is_stackable ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                        <Coins size={14} />
                        Redeem Balance
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-300 group-focus-within:text-indigo-600 transition-colors">
                      <Wallet size={18} />
                    </div>
                    <input
                      type="number"
                      value={pointsToRedeem}
                      onChange={(e) => {
                         const val = parseInt(e.target.value) || "";
                         setPointsToRedeem(val);
                      }}
                      disabled={appliedCoupon && !appliedCoupon.is_stackable}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-indigo-100 focus:border-indigo-600 outline-none transition-all text-indigo-900 font-bold text-base"
                      placeholder="Enter points"
                    />
                  </div>
                  <p className="mt-4 text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em] flex justify-between items-center px-1">
                    <span>10 PTS = ₹1 DISCOUNT</span>
                    {parseInt(pointsToRedeem) > 0 && (
                       <span className="text-indigo-600">-₹{Math.floor(parseInt(pointsToRedeem) / 10)} SAVING</span>
                    )}
                  </p>
              </div>

              {appliedCoupon && !appliedCoupon.is_stackable && (
                 <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="text-rose-500 shrink-0" size={16} />
                    <p className="text-[10px] text-rose-900/60 font-bold uppercase tracking-wide leading-relaxed">
                      Points redemption blocked. <br />
                      Applied coupon does not allow stacking.
                    </p>
                 </div>
              )}
              
              <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex-1">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    <AlertCircle size={14} />
                    System Logic
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Stacking points and coupons is permitted only for specific vouchers. 
                    Redemptions cover up to 100% of the net balance after coupon discounts.
                  </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
            <button
              type="submit"
              disabled={submitting || purchase.phone.length !== 10}
              className="flex-1 w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0A0A0B] hover:bg-gray-800 text-white px-10 py-5 rounded-2xl shadow-xl shadow-gray-200 transition-all font-bold text-base active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Check size={20} />
                  Authorize Transaction
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Overlay */}
      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#0A0A0B]/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden transform animate-in zoom-in-95 duration-400">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Final Audit</span>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  Transaction Review
                </h3>
              </div>
              <button onClick={() => setIsConfirming(false)} className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-2xl hover:bg-gray-100">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 space-y-10">
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="h-16 w-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-2xl font-black text-gray-900">
                  {customerData?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Identified Client</p>
                  <p className="text-xl font-black text-gray-900">{customerData?.name}</p>
                  <div className="flex items-center gap-3">
                     <p className="text-sm text-gray-500 font-bold">{customerData?.phone}</p>
                     <div className="h-1 w-1 rounded-full bg-gray-300" />
                     <p className="text-sm text-indigo-600 font-black uppercase tracking-tighter">
                       Wallet: {customerData?.points} PTS
                     </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="bg-gray-50 rounded-[2rem] border border-gray-100 p-8 space-y-4">
                    <div className="flex justify-between items-center pb-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                        <span className="text-lg font-bold text-gray-900 tracking-tight">₹{purchase.amount}</span>
                    </div>
                    
                    {appliedCoupon && (
                       <div className="flex justify-between items-center text-emerald-600 font-bold">
                          <span className="text-[10px] uppercase tracking-widest">Voucher: {appliedCoupon.code}</span>
                          <span className="text-lg">-₹{calculateCouponDiscount()}</span>
                       </div>
                    )}

                    {parseInt(pointsToRedeem) > 0 && (
                       <div className="flex justify-between items-center text-indigo-600 font-bold border-b border-gray-100 pb-4">
                          <span className="text-[10px] uppercase tracking-widest">Redeemed: {pointsToRedeem} PTS</span>
                          <span className="text-lg">-₹{calculatePointsDiscount()}</span>
                       </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                       <div className="flex flex-col">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Yield Earned</p>
                          <p className="text-xl font-black text-indigo-600">+{Math.floor(parseFloat(purchase.amount) * 0.1)}</p>
                       </div>
                       <div className="bg-[#0A0A0B] rounded-2xl px-6 py-4 text-white text-right">
                          <p className="text-[9px] font-black uppercase tracking-[.2em] opacity-40 mb-1 leading-none">Net Payable</p>
                          <p className="text-2xl font-black">₹{parseFloat(purchase.amount) - calculateCouponDiscount() - calculatePointsDiscount()}</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
                    <AlertCircle className="text-amber-500 shrink-0" size={18} />
                    <p className="text-[11px] text-amber-900/70 font-bold leading-relaxed">
                      Points are generated based on the gross magnitude (₹{purchase.amount}) before any discounts or redemptions.
                    </p>
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsConfirming(false)}
                  className="flex-1 px-6 py-5 rounded-2xl border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={executeTransaction}
                  disabled={submitting}
                  className="flex-[2] bg-[#0A0A0B] hover:bg-gray-800 text-white px-6 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <>Confirm & Broadcast<ChevronRight size={18} /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Create Overlay (re-using existing modal logic from line 308) */}
      {notFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#0A0A0B]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <UserPlus size={16} className="text-gray-400" />
                Registry Correction
              </h3>
              <button onClick={() => setNotFoundModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-xl hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-5 text-gray-900 border border-gray-200 shadow-sm font-black text-2xl">?</div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Client identifier <span className="font-bold text-gray-900">{purchase.phone}</span> is not present in the registry. 
                  Enroll them now to continue.
                </p>
              </div>
              <form onSubmit={handleCreateCustomer} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Client Name</label>
                  <input type="text" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-base" required />
                </div>
                <button type="submit" disabled={submittingCustomer} className="w-full bg-[#0A0A0B] hover:bg-gray-800 text-white px-6 py-4 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-30">
                  {submittingCustomer ? "Enrolling..." : "Enroll Client"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPurchase;

