import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  TicketPercent, 
  ArrowLeft,
  ArrowRight,
  Clock, 
  ShieldCheck, 
  History,
  CreditCard,
  User,
  Percent,
  ShoppingBag,
  Users,
  Layers,
  Calendar
} from "lucide-react";
import { couponsApi } from "../api";

/**
 * Dedicated Enterprise Voucher Creation Terminal
 */
const CreateCouponPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const [newVoucher, setNewVoucher] = useState({
    code: "",
    type: "percentage",
    value: "",
    start_date: "",
    expiry_date: "",
    max_usage_global: "100",
    max_usage_per_user: "1",
    max_discount_cap: "",
    min_order_value: "0",
    eligibility_type: "all",
    is_stackable: false
  });

  const handleMintVoucher = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        code: newVoucher.code,
        type: newVoucher.type,
        value: parseFloat(newVoucher.value),
        max_discount_cap: newVoucher.max_discount_cap ? parseFloat(newVoucher.max_discount_cap) : null,
        min_order_value: parseFloat(newVoucher.min_order_value),
        start_date: newVoucher.start_date ? new Date(newVoucher.start_date).toISOString() : null,
        expiry_date: newVoucher.expiry_date ? new Date(newVoucher.expiry_date).toISOString() : null,
        max_usage_global: parseInt(newVoucher.max_usage_global),
        max_usage_per_user: parseInt(newVoucher.max_usage_per_user),
        is_stackable: newVoucher.is_stackable,
        eligibility_type: newVoucher.eligibility_type
      };

      const result = await couponsApi.mintCoupon(payload);

      if (result.success) {
        toast.success(result.message);
        navigate("/coupons"); // Redirect back to registry
      } else {
        toast.error(result.message || "Minting authorization failed");
      }
    } catch (error) {
      toast.error(error.message || "Critical: Network timeout during minting");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen font-sans antialiased text-gray-900 animate-in fade-in duration-700">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/coupons")}
            className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all shadow-sm hover:shadow-xl hover:-translate-x-1"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Mint Voucher Protocol</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Authorize Enterprise Promotion</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
           <div className="px-5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
             <ShieldCheck size={14} />
             Financial Safety Authorized
           </div>
        </div>
      </div>

      <form onSubmit={handleMintVoucher} className="space-y-8 pb-20">
        
        {/* Section 1: Core Protocol Identity */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-10 space-y-8">
           <div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-2">
             <div className="w-10 h-10 rounded-2xl bg-[#0A0A0B] flex items-center justify-center text-white">
               <TicketPercent size={20} />
             </div>
             <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Protocol Identity</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER-2026"
                  value={newVoucher.code}
                  onChange={(e) => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                  className="w-full px-6 py-5 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 focus:shadow-xl focus:shadow-gray-100/50 outline-none transition-all text-gray-900 font-extrabold text-sm tracking-[0.2em]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Type</label>
                  <select
                    value={newVoucher.type}
                    onChange={(e) => setNewVoucher({...newVoucher, type: e.target.value})}
                    className="w-full px-6 py-5 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-xs uppercase appearance-none cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Magnitude</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={newVoucher.type === 'percentage' ? "20" : "500"}
                    value={newVoucher.value}
                    onChange={(e) => setNewVoucher({...newVoucher, value: e.target.value})}
                    className="w-full px-6 py-5 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-extrabold text-sm"
                  />
                </div>
              </div>
           </div>

           {newVoucher.type === 'percentage' && (
             <div className="p-8 rounded-[2rem] bg-emerald-50/30 border border-emerald-100/50 animate-in slide-in-from-top-4 duration-500">
               <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
                 <ShieldCheck size={14} />
                 Percentage Protocol Guard: Max Discount Cap (₹)
               </label>
               <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-emerald-200 group-focus-within:text-emerald-500 transition-colors">
                   <CreditCard size={18} />
                 </div>
                 <input
                   type="number"
                   placeholder="e.g. 500 (Set 0 for No Cap)"
                   value={newVoucher.max_discount_cap}
                   onChange={(e) => setNewVoucher({...newVoucher, max_discount_cap: e.target.value})}
                   className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-emerald-100 focus:border-emerald-500 focus:shadow-xl focus:shadow-emerald-500/10 outline-none transition-all text-gray-900 font-extrabold text-sm"
                 />
                 <p className="mt-3 px-1 text-[9px] text-emerald-600/60 font-medium italic">
                   Ensures that even on large orders, the shop's liability never exceeds this absolute amount.
                 </p>
               </div>
             </div>
           )}
        </div>

        {/* Section 2: Temporal & Usage Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-10 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <Calendar size={20} />
                </div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Temporal Rules</h3>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                  <Clock size={12} /> Start Authorization
                </label>
                <input
                  type="datetime-local"
                  value={newVoucher.start_date}
                  onChange={(e) => setNewVoucher({...newVoucher, start_date: e.target.value})}
                  className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                  <ShieldCheck size={12} /> Expiry Timestamp
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newVoucher.expiry_date}
                  onChange={(e) => setNewVoucher({...newVoucher, expiry_date: e.target.value})}
                  className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-xs"
                />
              </div>
           </div>

           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-10 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <History size={20} />
                </div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Usage Density</h3>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                   <Users size={12} /> Global Inventory Cap
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newVoucher.max_usage_global}
                  onChange={(e) => setNewVoucher({...newVoucher, max_usage_global: e.target.value})}
                  className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-extrabold text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                   <User size={12} /> Per User Limitation
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newVoucher.max_usage_per_user}
                  onChange={(e) => setNewVoucher({...newVoucher, max_usage_per_user: e.target.value})}
                  className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-extrabold text-sm"
                />
              </div>
           </div>
        </div>

        {/* Section 3: Eligibility & Stacking */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-10 space-y-8">
           <div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-2">
             <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
               <Layers size={20} />
             </div>
             <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Authorization Constraints</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                  <ShoppingBag size={12} /> Min. Order Value (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newVoucher.min_order_value}
                  onChange={(e) => setNewVoucher({...newVoucher, min_order_value: e.target.value})}
                  className="w-full px-6 py-5 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-extrabold text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                   <Users size={12} /> Client Eligibility Tier
                </label>
                <select
                  value={newVoucher.eligibility_type}
                  onChange={(e) => setNewVoucher({...newVoucher, eligibility_type: e.target.value})}
                  className="w-full px-6 py-5 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-xs uppercase cursor-pointer"
                >
                  <option value="all">Authorized for All Client Types</option>
                  <option value="vip">Premium/VIP Clients Only</option>
                  <option value="new">First Time Acquisition Only</option>
                  <option value="inactive">Retention/Re-engagement Only</option>
                </select>
              </div>
           </div>

           <div className="pt-4 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Combination Protocol (Stacking)</label>
                 <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setNewVoucher({...newVoucher, is_stackable: true})}
                      className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        newVoucher.is_stackable 
                        ? 'bg-[#0A0A0B] text-white border-transparent' 
                        : 'bg-white text-gray-400 border-gray-100'
                      }`}
                    >
                      Authorize Stacking
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVoucher({...newVoucher, is_stackable: false})}
                      className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        !newVoucher.is_stackable 
                        ? 'bg-[#0A0A0B] text-white border-transparent' 
                        : 'bg-white text-gray-400 border-gray-100'
                      }`}
                    >
                      Exclusive Use Only
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Final Execution Button */}
        <div className="pt-10">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-8 rounded-[2rem] text-white text-xs font-black uppercase tracking-[0.5em] transition-all shadow-2xl active:scale-95 group flex items-center justify-center gap-4 ${
              submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0A0A0B] hover:shadow-gray-200'
            }`}
          >
            {submitting ? 'Minting Protocol...' : 'Confirm & Authorize Voucher'}
            {!submitting && <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />}
          </button>
          <p className="mt-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            By authorizing, this protocol will be immediately live in the voucher registry.
          </p>
        </div>

      </form>
    </div>
  );
};

export default CreateCouponPage;
