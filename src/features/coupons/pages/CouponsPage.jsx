import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  TicketPercent, 
  Search, 
  Plus, 
  Eye, 
  Ban, 
  CheckCircle, 
  Clock, 
  X, 
  ShieldCheck, 
  Loader2,
  Trash2,
  History,
  TrendingUp,
  CreditCard,
  User,
  ArrowRight,
  ExternalLink,
  Check,
  Percent,
  ShoppingBag,
  Users
} from "lucide-react";

/**
 * CouponsPage - Lumina Enterprise Edition
 * A premium voucher management terminal for promotional yields.
 */
const CouponsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  // Mock Data for UI Demonstration
  const [coupons, setCoupons] = useState([
    { 
      id: 1, 
      code: "LUMINA-WELCOME", 
      type: "percentage", 
      value: 15, 
      status: "active", 
      expiry: "2026-12-31", 
      usage_count: 0,
      max_usage: 100,
      created_at: "2026-04-01",
      history: []
    },
    { 
      id: 2, 
      code: "PRIME-FIXED-500", 
      type: "fixed", 
      value: 500, 
      status: "used", 
      expiry: "2026-05-15", 
      usage_count: 1,
      max_usage: 1,
      created_at: "2026-04-10",
      used_by: { name: "Alexander Pierce", id: "60001", used_at: "2026-04-16 14:22" },
      history: [{ name: "Alexander Pierce", id: "60001", used_at: "2026-04-16 14:22" }]
    },
    { 
      id: 3, 
      code: "EXPIRED-FLASH", 
      type: "percentage", 
      value: 20, 
      status: "blocked", 
      expiry: "2026-04-01", 
      usage_count: 0,
      max_usage: 50,
      created_at: "2026-03-20",
      history: []
    },
    { 
      id: 4, 
      code: "SUMMER-YIELD", 
      type: "percentage", 
      value: 10, 
      status: "active", 
      expiry: "2026-08-30", 
      usage_count: 12,
      max_usage: 200,
      created_at: "2026-04-15",
      history: [
        { name: "Sarah Connor", id: "60042", used_at: "2026-04-17 09:10" },
        { name: "John Doe", id: "60045", used_at: "2026-04-17 09:45" }
      ]
    }
  ]);

  const [newVoucher, setNewVoucher] = useState({
    code: "",
    type: "percentage",
    value: "",
    expiry: "",
    max_usage: "100",
    min_order: "0",
    eligibility: "all"
  });

  const handleMintVoucher = (e) => {
    e.preventDefault();
    const voucher = {
      ...newVoucher,
      id: coupons.length + 1,
      status: "active",
      usage_count: 0,
      created_at: new Date().toISOString().split('T')[0],
      history: []
    };
    setCoupons([voucher, ...coupons]);
    setIsMintModalOpen(false);
    toast.success("Voucher Protocol Minted Successfully");
    setNewVoucher({ 
      code: "", 
      type: "percentage", 
      value: "", 
      expiry: "", 
      max_usage: "100",
      min_order: "0",
      eligibility: "all"
    });
  };

  const toggleVoucherStatus = (id) => {
    setCoupons(coupons.map(c => {
      if (c.id === id) {
        const newStatus = c.status === "active" ? "blocked" : "active";
        toast.success(`Voucher ${newStatus === "active" ? "Authorized" : "Revoked"}`);
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.status === "active").length,
    redeemed: coupons.filter(c => c.status === "used" || c.usage_count > 0).length
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen font-sans antialiased text-gray-900">
      
      {/* Header & Metrical Overview */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">
            <TicketPercent size={12} />
            Coupon Management System
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-none mb-4 italic uppercase">
            Promo <br />
            <span className="text-gray-400">Registry</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-md text-sm leading-relaxed">
            Create new discount coupons, track how many times they've been used, and manage your active promotions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coupon codes..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-gray-900 outline-none transition-all text-gray-900 text-sm font-bold placeholder-gray-300"
            />
          </div>
          <button
            onClick={() => setIsMintModalOpen(true)}
            className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-4 bg-[#0A0A0B] text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200 whitespace-nowrap"
          >
            <Plus size={18} />
            Create Coupon
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100 flex items-center justify-between group hover:border-gray-900/10 transition-all">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Coupons</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.total}</h3>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#0A0A0B] group-hover:text-white transition-all">
            <ShieldCheck size={24} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100 flex items-center justify-between group hover:border-gray-900/10 transition-all">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Currently Active</p>
            <h3 className="text-3xl font-black text-emerald-600">{stats.active}</h3>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100 flex items-center justify-between group hover:border-gray-900/10 transition-all">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fully Redeemed</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.redeemed}</h3>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#0A0A0B] group-hover:text-white transition-all">
            <History size={24} />
          </div>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3">
            <TicketPercent size={16} className="text-gray-400" />
            Coupon List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Coupon Code</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Discount Value</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 border border-gray-200 font-bold group-hover:bg-white group-hover:shadow-md transition-all">
                        <TicketPercent size={18} />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 tracking-wider text-sm">{coupon.code}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Expires: {coupon.expiry}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-black text-gray-900 outline-none">
                      {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                      <span className="text-[8px] opacity-40 uppercase tracking-tighter">{coupon.type}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      coupon.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      coupon.status === "used" ? "bg-gray-100 text-gray-500 border-gray-200" :
                      "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        coupon.status === "active" ? "bg-emerald-500" :
                        coupon.status === "used" ? "bg-gray-400" :
                        "bg-rose-500"
                      }`} />
                      {coupon.status}
                    </div>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <button
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setIsAuditModalOpen(true);
                        }}
                        className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-gray-200"
                        title="Audit Redemption Path"
                      >
                        <Eye size={18} />
                      </button>
                      {coupon.status !== "used" && (
                        <button
                          onClick={() => toggleVoucherStatus(coupon.id)}
                          className={`p-2.5 rounded-xl transition-all border border-transparent hover:shadow-md ${
                            coupon.status === "active" 
                            ? "text-rose-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100" 
                            : "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100"
                          }`}
                          title={coupon.status === "active" ? "Revoke Protocol" : "Authorize Protocol"}
                        >
                          {coupon.status === "active" ? <Ban size={18} /> : <CheckCircle size={18} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isMintModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#0A0A0B]/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsMintModalOpen(false)} />
          <div className="relative bg-white border border-gray-200 shadow-2xl rounded-[3.5rem] w-full max-w-xl overflow-hidden z-[110] animate-in zoom-in-95 duration-400">
            <div className="px-12 py-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <TicketPercent size={20} className="text-gray-400" />
                Create New Coupon
              </h3>
              <button 
                onClick={() => setIsMintModalOpen(false)}
                className="p-3 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-white transition-all shadow-sm hover:shadow-md"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleMintVoucher} className="p-12 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Coupon Code</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-gray-900 transition-colors">
                      <TicketPercent size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SAVE-20"
                      value={newVoucher.code}
                      onChange={(e) => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 focus:shadow-xl focus:shadow-gray-100 outline-none transition-all text-gray-900 font-extrabold text-sm tracking-[0.2em]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Discount Type</label>
                    <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400">
                        <ArrowRight size={16} />
                      </div>
                      <select
                        value={newVoucher.type}
                        onChange={(e) => setNewVoucher({...newVoucher, type: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-xs uppercase appearance-none cursor-pointer"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed (₹)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                      {newVoucher.type === 'percentage' ? 'Percentage Off' : 'Flat Discount'}
                    </label>
                    <div className="relative group">
                       <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                        {newVoucher.type === 'percentage' ? <Percent size={18} /> : <CreditCard size={18} />}
                      </div>
                      <input
                        type="number"
                        required
                        max={newVoucher.type === 'percentage' ? 100 : undefined}
                        min="1"
                        placeholder={newVoucher.type === 'percentage' ? "e.g. 15" : "e.g. 500"}
                        value={newVoucher.value}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (newVoucher.type === 'percentage' && val > 100) val = 100;
                          setNewVoucher({...newVoucher, value: val});
                        }}
                        className="w-full pl-14 pr-14 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-extrabold text-sm"
                      />
                      <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-[10px] font-black text-gray-300">
                        {newVoucher.type === 'percentage' ? 'PERCENT' : 'INR (₹)'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                      <Clock size={12} className="text-gray-300" />
                      Expiry Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newVoucher.expiry}
                      onChange={(e) => setNewVoucher({...newVoucher, expiry: e.target.value})}
                      className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-xs cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                       <History size={12} className="text-gray-300" />
                       Usage Limit
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 100"
                      value={newVoucher.max_usage}
                      onChange={(e) => setNewVoucher({...newVoucher, max_usage: e.target.value})}
                      className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-extrabold text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                      <ShoppingBag size={12} className="text-gray-300" />
                      Min. Order Value (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 999"
                      value={newVoucher.min_order}
                      onChange={(e) => setNewVoucher({...newVoucher, min_order: e.target.value})}
                      className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-extrabold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                       <Users size={12} className="text-gray-300" />
                       Client Eligibility
                    </label>
                    <select
                      value={newVoucher.eligibility}
                      onChange={(e) => setNewVoucher({...newVoucher, eligibility: e.target.value})}
                      className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-xs uppercase appearance-none cursor-pointer"
                    >
                      <option value="all">All Access</option>
                      <option value="vip">Premium/VIP Only</option>
                      <option value="new">First Time Users</option>
                      <option value="inactive">Re-engagement</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-6 rounded-[1.5rem] bg-[#0A0A0B] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-800 transition-all shadow-2xl shadow-gray-200 active:scale-95 group flex items-center justify-center gap-3 overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Confirm & Mint Protocol
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Usage History Modal */}
      {isAuditModalOpen && selectedCoupon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-gray-900">
          <div className="absolute inset-0 bg-[#0A0A0B]/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsAuditModalOpen(false)} />
          <div className="relative bg-white border border-gray-200 shadow-2xl rounded-[3rem] w-full max-w-xl overflow-hidden z-[110] animate-in zoom-in-95 duration-400">
            <div className="px-10 py-10 border-b border-gray-50 bg-[#0A0A0B] text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                 <History size={160} />
               </div>
               <div className="relative z-10 flex items-center justify-between">
                 <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-1">
                      {selectedCoupon.code}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coupon Usage History</p>
                 </div>
                 <button 
                  onClick={() => setIsAuditModalOpen(false)}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <X size={20} />
                </button>
               </div>
            </div>

            <div className="p-10 space-y-8">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Usage Count</p>
                    <p className="text-2xl font-black text-gray-900">
                      {selectedCoupon.usage_count} <span className="text-xs text-gray-400 uppercase tracking-tighter">/ {selectedCoupon.max_usage} TIMES</span>
                    </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Status</p>
                    <div className="inline-flex items-center gap-2 text-sm font-black text-gray-900 uppercase">
                        <span className={`w-2 h-2 rounded-full ${selectedCoupon.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {selectedCoupon.status}
                    </div>
                  </div>
               </div>

               <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-4">Recent Usage Log</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide pr-2">
                    {selectedCoupon.history.length > 0 ? (
                      selectedCoupon.history.map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl group hover:border-gray-900/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-[#0A0A0B] group-hover:text-white transition-all">
                              <User size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-900">{log.name}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">U-ID: #{log.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{log.used_at}</p>
                            <div className="flex items-center justify-end gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-tighter">
                              Verified <Check size={10} />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center rounded-[2rem] border-2 border-dashed border-gray-100 opacity-30 flex flex-col items-center gap-4">
                        <ShieldCheck size={40} className="text-gray-400" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Not used by any customer yet</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>

            <div className="p-10 pt-0 space-y-4">
               <button 
                  onClick={() => {
                    setIsAuditModalOpen(false);
                    navigate(`/coupons/${selectedCoupon.id}/usage`);
                  }}
                  className="w-full py-5 rounded-2xl bg-[#0A0A0B] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                >
                  See All Usage History
               </button>
               <button 
                  onClick={() => setIsAuditModalOpen(false)}
                  className="w-full py-5 rounded-2xl bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-100 transition-all border border-gray-100"
                >
                  Close History
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
