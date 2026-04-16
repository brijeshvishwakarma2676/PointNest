import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { customersApi } from "../api";
import { redemptionsApi } from "../../redemptions/api";
import { formatDate, formatTime } from "../../../utils/dateUtils";
import { 
  Users, 
  Store, 
  Search, 
  History, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Phone,
  RefreshCw,
  Clock,
  ExternalLink,
  Loader2
} from "lucide-react";

/**
 * PointsHistory - Lumina Enterprise Edition
 * Overhauled to match the high-contrast, minimalist design language.
 */
const PointsHistory = () => {
  const [activeTab, setActiveTab] = useState("customer"); // 'customer' or 'shop'
  
  // Customer View State
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPoints, setCustomerPoints] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [customerPagination, setCustomerPagination] = useState({ page: 1, size: 20, total: 0 });

  // Shop View State
  const [shopRedemptions, setShopRedemptions] = useState([]);
  const [shopLoading, setShopLoading] = useState(false);
  const [shopPagination, setShopPagination] = useState({ page: 1, size: 10, total: 0 });

  const fetchCustomerHistory = async (cid, page = 1) => {
    setLoading(true);
    try {
      const response = await customersApi.getCustomerLedger({
        customer_id: cid,
        page,
        size: customerPagination.size,
      });

      if (response.success) {
        setLedger(response.data.items || []);
        setCustomerPagination({
          page: response.data.page,
          size: response.data.size,
          total: response.data.total,
        });
      } else {
        toast.error(response.message || "Failed to fetch points history");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching points history");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone || phone.length !== 10 || isNaN(phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    setSearched(false);
    try {
      const listRes = await customersApi.getCustomers({
        search_query: phone,
        size: 1,
        page: 1,
      });

      if (listRes.success && listRes.data?.items?.length > 0) {
        const customer = listRes.data.items[0];
        setCustomerId(customer.id);
        setCustomerName(customer.name);
        setCustomerPoints(customer.points);
        setSearched(true);
        await fetchCustomerHistory(customer.id, 1);
      } else {
        toast.error("No customer found with this phone number.");
        setSearched(false);
        setLedger([]);
      }
    } catch (error) {
      toast.error(error.message || "Customer not found.");
      setSearched(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchShopRedemptions = async (page = 1) => {
    setShopLoading(true);
    try {
      const response = await redemptionsApi.getRedemptions({
        page,
        size: shopPagination.size,
      });

      if (response.success) {
        setShopRedemptions(response.data.items || []);
        setShopPagination({
          page: response.data.page,
          size: response.data.size,
          total: response.data.total,
        });
      }
    } catch (error) {
      toast.error("Failed to load shop redemption history");
    } finally {
      setShopLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "shop") {
      fetchShopRedemptions(1);
    }
  }, [activeTab]);

  const renderTabButton = (id, label, Icon) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex-1 flex items-center justify-center gap-2.5 py-4 font-bold transition-all border-b-2 ${
          isActive
            ? "border-gray-900 text-gray-900 bg-gray-50/50 shadow-inner"
            : "border-transparent text-gray-400 hover:text-gray-900"
        }`}
      >
        <Icon size={16} />
        <span className="text-[10px] uppercase tracking-[0.2em] font-black">{label}</span>
      </button>
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen font-sans antialiased">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">
            <ShieldCheck size={12} />
            Enterprise Audit
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-none mb-4">
            Audit <br />
            <span className="text-gray-400">Yield Ledger</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-md text-sm leading-relaxed">
            Verify point allocations, audit redemption events, and maintain a verifiable record of all loyalty events across the enterprise.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl flex w-full md:w-80 overflow-hidden shadow-sm">
          {renderTabButton("customer", "Client", Users)}
          {renderTabButton("shop", "Terminal", Store)}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {activeTab === "customer" ? (
          <div className="space-y-8">
            {/* Search Module */}
            <div className="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50">
              <div className="px-10 py-10">
                <div className="mb-8">
                  <h2 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Protocol Lookup</h2>
                  <p className="text-sm text-gray-400 font-medium font-sans">Query customer ledger by primary terminal phone number.</p>
                </div>
                
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-gray-900 transition-colors">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="ENTER 10-DIGIT PROTOCOL ID"
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-black text-lg tracking-widest placeholder:text-gray-200 rounded-2xl"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-10 bg-[#0A0A0B] text-white font-black uppercase tracking-widest text-xs py-5 sm:py-0 rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200 disabled:opacity-30 flex items-center justify-center gap-3"
                  >
                    {loading && !searched ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                    Initialize Query
                  </button>
                </form>
              </div>
            </div>

            {searched && (
              <div className="bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50">
                {/* Client Profile Header */}
                <div className="px-10 py-8 bg-[#0A0A0B] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-3xl bg-white/10 flex items-center justify-center font-black text-3xl border border-white/20">
                      {customerName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{customerName}</h3>
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                        <Phone size={10} /> {phone}
                      </div>
                    </div>
                  </div>
                  <div className="sm:text-right w-full sm:w-auto p-6 bg-white/5 border border-white/10 rounded-2xl text-center sm:text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Verified Yield Balance</p>
                    <p className="text-4xl font-black tracking-tighter">{customerPoints} <span className="text-sm font-bold opacity-30 uppercase tracking-widest">pts</span></p>
                  </div>
                </div>

                {/* Transaction Ledger Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/30">
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Event Signature</th>
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Yield Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                         [...Array(5)].map((_, i) => (
                           <tr key={i} className="animate-pulse">
                             <td colSpan="3" className="px-10 py-8"><div className="h-4 bg-gray-100 rounded-full w-1/3"></div></td>
                           </tr>
                         ))
                      ) : ledger.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-10 py-32 text-center">
                            <History size={48} className="text-gray-100 mx-auto mb-4" />
                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No transaction records found</p>
                          </td>
                        </tr>
                      ) : (
                        ledger.map((item) => (
                          <tr key={item.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                            <td className="px-10 py-7">
                              <div className="flex items-center gap-5">
                                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all ${
                                  item.type === 'earn' ? 'bg-gray-100 text-gray-900 shadow-sm border border-gray-200' : 'bg-[#0A0A0B] text-white shadow-lg shadow-gray-200'
                                }`}>
                                  {item.type === 'earn' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-sm mb-0.5">
                                    {item.type === 'earn' ? 'Purchase Allocation' : 'Point Redemption'}
                                  </p>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">REF: #{item.reference_id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-7 text-sm font-bold text-gray-500">
                               {formatDate(item.created_at)}
                            </td>
                            <td className="px-10 py-7 text-right">
                              <span className={`text-xl font-black tracking-tighter ${item.type === 'earn' ? 'text-gray-900' : 'text-gray-400'}`}>
                                {item.type === 'earn' ? '+' : '-'}{item.points}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Client Pagination */}
                {customerPagination.total > customerPagination.size && (
                  <div className="px-10 py-8 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                      INDEX {customerPagination.page} / {Math.ceil(customerPagination.total / customerPagination.size)}
                    </div>
                    <div className="flex gap-3">
                      <button
                        disabled={customerPagination.page === 1}
                        onClick={() => fetchCustomerHistory(customerId, customerPagination.page - 1)}
                        className="px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs font-bold hover:shadow-md transition-all disabled:opacity-30"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        disabled={ledger.length < customerPagination.size}
                        onClick={() => fetchCustomerHistory(customerId, customerPagination.page + 1)}
                        className="px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs font-bold hover:shadow-md transition-all disabled:opacity-30"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Terminal Log View */
          <div className="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50">
            <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
              <div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  Terminal Activity
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time ledger of point outflows</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                   <tr className="border-b border-gray-100 bg-gray-50/30">
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Client Signature</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Outflow Metric</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {shopLoading ? (
                    [...Array(6)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                         <td colSpan="3" className="px-10 py-8"><div className="h-4 bg-gray-100 rounded-full w-1/3"></div></td>
                      </tr>
                    ))
                  ) : shopRedemptions.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-10 py-32 text-center text-gray-300 font-bold uppercase tracking-widest italic opacity-60">No terminal records found</td>
                    </tr>
                  ) : (
                    shopRedemptions.map((red) => (
                      <tr key={red.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                        <td className="px-10 py-7">
                          <p className="font-bold text-gray-900 text-sm mb-0.5">{red.customer_name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">{red.customer_phone}</p>
                        </td>
                        <td className="px-10 py-7">
                          <div className="flex flex-col">
                            <span className="text-gray-900 font-black text-base flex items-center gap-1">
                              <ArrowDownRight size={14} className="text-gray-400" />
                              {red.points_used} <span className="text-[10px] uppercase opacity-70">pts</span>
                            </span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">₹{red.amount_discounted} DISC AUTH</span>
                          </div>
                        </td>
                        <td className="px-10 py-7 text-right">
                          <div className="inline-block text-right">
                            <p className="text-sm font-bold text-gray-900 mb-0.5">{formatDate(red.created_at)}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{formatTime(red.created_at)}</p>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Shop Pagination */}
            {!shopLoading && shopRedemptions.length > 0 && shopPagination.total > shopPagination.size && (
               <div className="px-10 py-8 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  INDEX {shopPagination.page} / {Math.ceil(shopPagination.total / shopPagination.size)}
                </div>
                <div className="flex gap-3">
                  <button
                    disabled={shopPagination.page === 1}
                    onClick={() => fetchShopRedemptions(shopPagination.page - 1)}
                    className="px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs font-bold hover:shadow-md transition-all disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={shopRedemptions.length < shopPagination.size}
                    onClick={() => fetchShopRedemptions(shopPagination.page + 1)}
                    className="px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs font-bold hover:shadow-md transition-all disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsHistory;
