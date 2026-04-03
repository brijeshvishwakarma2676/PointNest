import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { customersApi } from "../api";
import { redemptionsApi } from "../../redemptions/api";
import { formatDate, formatTime } from "../../../utils/dateUtils";

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

  // ---------------------------------------------------------------------------
  // Customer View Functions
  // ---------------------------------------------------------------------------
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

  const handleReset = () => {
    setPhone("");
    setSearched(false);
    setCustomerId(null);
    setCustomerName("");
    setCustomerPoints(null);
    setLedger([]);
    setCustomerPagination({ page: 1, size: 20, total: 0 });
  };

  // ---------------------------------------------------------------------------
  // Shop View Functions
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------
  const renderTabButton = (id, label, icon) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
          isActive
            ? "bg-white text-blue-600 shadow-sm border border-blue-50"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            History & Ledger
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Manage customer loyalty passbooks and track recent shop activity.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-gray-100/80 p-1.5 rounded-3xl flex gap-1 self-start">
          {renderTabButton(
            "customer",
            "Customer Passbook",
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
          {renderTabButton(
            "shop",
            "Shop Activity",
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === "customer" ? (
          /* PART 1: CUSTOMER PASSBOOK VIEW */
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                Lookup Customer Passbook
              </h2>
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter 10-digit phone number"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {loading && !searched ? "..." : "Find"}
                </button>
              </form>
            </div>

            {searched && (
              <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-4xl overflow-hidden">
                {/* Customer Info Header */}
                <div className="p-6 bg-linear-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl border border-white/30">
                      {customerName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold leading-tight">{customerName}</h3>
                      <p className="text-blue-100 text-sm font-medium">{phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-1">Total Balance</p>
                    <p className="text-3xl font-black">{customerPoints} <span className="text-lg font-medium opacity-80">pts</span></p>
                  </div>
                </div>

                {/* Ledger Content */}
                <div className="p-2">
                  {loading ? (
                    <div className="py-20 text-center text-gray-400 font-medium">Loading history...</div>
                  ) : ledger.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 font-medium">No transactions yet.</div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {ledger.map((item) => (
                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                              item.type === 'earn' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.type === 'earn' ? "M12 6v12m6-6H6" : "M18 12H6"} />
                              </svg>
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{item.type === 'earn' ? 'Earned via Purchase' : 'Redeemed for Discount'}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-0.5">
                                <span>{formatDate(item.created_at)}</span>
                                <span>•</span>
                                <span>Ref #{item.reference_id}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`text-lg font-black tracking-tight ${item.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {item.type === 'earn' ? '+' : '-'}{item.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {customerPagination.total > customerPagination.size && (
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                    <button
                      disabled={customerPagination.page === 1}
                      onClick={() => fetchCustomerHistory(customerId, customerPagination.page - 1)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-gray-400">Page {customerPagination.page} of {Math.ceil(customerPagination.total / customerPagination.size)}</span>
                    <button
                      disabled={ledger.length < customerPagination.size}
                      onClick={() => fetchCustomerHistory(customerId, customerPagination.page + 1)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* PART 2: SHOP OWNER RECENT REDEMPTIONS TABLE */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="h-2 w-2 bg-rose-500 rounded-full"></span>
                    Recent Redemptions
                  </h2>
                  <p className="text-sm text-gray-400 font-medium mt-0.5">Real-time log of points used across your shop.</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Table Body */}
              <div className="overflow-hidden rounded-2xl border border-gray-50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-gray-400">Customer</th>
                      <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-gray-400">Points & Discount</th>
                      <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-gray-400 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {shopLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan="3" className="px-5 py-4 h-16 bg-gray-50/30"></td>
                        </tr>
                      ))
                    ) : shopRedemptions.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-5 py-20 text-center text-gray-400 font-bold">No redemptions found.</td>
                      </tr>
                    ) : (
                      shopRedemptions.map((red) => (
                        <tr key={red.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-bold text-gray-900">{red.customer_name}</p>
                            <p className="text-xs text-gray-400 font-medium">{red.customer_phone}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col">
                              <span className="text-rose-600 font-black text-sm">-{red.points_used} Pts</span>
                              <span className="text-[10px] font-bold text-gray-500">₹{red.amount_discounted} Discount</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <p className="text-xs font-bold text-gray-700">
                              {formatDate(red.created_at)}
                            </p>
                            <p className="text-[10px] font-medium text-gray-400">
                              {formatTime(red.created_at)}
                            </p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination (Shop View) */}
              {shopPagination.total > shopPagination.size && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    disabled={shopPagination.page === 1}
                    onClick={() => fetchShopRedemptions(shopPagination.page - 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-all disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    Prev
                  </button>
                  <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Page {shopPagination.page}</span>
                  <button
                    disabled={shopRedemptions.length < shopPagination.size}
                    onClick={() => fetchShopRedemptions(shopPagination.page + 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-all disabled:opacity-40"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsHistory;
