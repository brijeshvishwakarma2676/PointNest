import React, { useState } from "react";
import toast from "react-hot-toast";
import { customersApi } from "../api";

const PointsHistory = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPoints, setCustomerPoints] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, size: 20, total: 0 });

  const fetchHistory = async (cid, page = 1) => {
    setLoading(true);
    try {
      const response = await customersApi.getCustomerLedger({
        customer_id: cid,
        page,
        size: pagination.size,
      });

      if (response.success) {
        setLedger(response.data.items || []);
        setPagination({
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
      // Search for the customer by phone to get their ID
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
        await fetchHistory(customer.id, 1);
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
    setPagination({ page: 1, size: 20, total: 0 });
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Points History
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          View a customer's full loyalty passbook — earns and redemptions.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              className="w-full pl-12 pr-4 py-3.5 bg-white/70 border border-gray-200 rounded-2xl text-gray-900 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-60 whitespace-nowrap"
          >
            {loading && !searched ? "Searching..." : "Search"}
          </button>
          {searched && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg shadow-gray-900/5 rounded-3xl overflow-hidden">
          {/* Customer Summary Header */}
          <div className="p-5 border-b border-gray-100/60 flex items-center justify-between bg-white/40">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-100 to-indigo-200 flex items-center justify-center font-black text-xl text-blue-700 border-2 border-white shadow-sm">
                {customerName ? customerName.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base leading-tight">
                  {customerName}
                </p>
                <p className="text-xs text-gray-500 font-medium">{phone}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                Balance
              </p>
              <p className="text-2xl font-extrabold text-blue-600 tracking-tight">
                {customerPoints ?? "—"}{" "}
                <span className="text-sm font-semibold">pts</span>
              </p>
            </div>
          </div>

          {/* Transaction List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <svg
                className="animate-spin h-7 w-7 text-blue-500 mb-3"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-sm font-semibold">Fetching transactions...</p>
            </div>
          ) : ledger.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <p className="text-sm font-semibold">
                No transactions found for this customer.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100/60">
              {ledger.map((item) => {
                const isEarn = item.type === "earn";
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-white/40 transition-colors"
                  >
                    {/* Icon + Description */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isEarn
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-rose-100 text-rose-600"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d={isEarn ? "M12 4v16m8-8H4" : "M20 12H4"}
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {isEarn ? "Points Earned" : "Points Redeemed"}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          {new Date(item.created_at).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" · "}
                          <span className="text-gray-400">
                            Ref&nbsp;#{item.reference_id}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Points Badge */}
                    <span
                      className={`text-base font-extrabold tracking-tight ${
                        isEarn ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isEarn ? "+" : ""}
                      {item.points}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.total > pagination.size && !loading && (
            <div className="px-5 py-4 border-t border-gray-100/60 flex items-center justify-between bg-white/30">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchHistory(customerId, pagination.page - 1)}
                className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Page {pagination.page} · {pagination.total} total
              </span>
              <button
                disabled={ledger.length < pagination.size}
                onClick={() => fetchHistory(customerId, pagination.page + 1)}
                className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State (Before Search) */}
      {!searched && !loading && (
        <div className="text-center py-20 text-gray-400">
          <svg
            className="w-14 h-14 mx-auto mb-4 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="font-semibold text-sm">
            Enter a phone number to view a customer's passbook.
          </p>
        </div>
      )}
    </div>
  );
};

export default PointsHistory;
