import React, { useState } from "react";
import toast from "react-hot-toast";
import { purchasesApi } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";

const AddPurchase = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPhone = searchParams.get("phone") || "";

  const [purchase, setPurchase] = useState({ phone: initialPhone, amount: "" });
  const [submitting, setSubmitting] = useState(false);
  const [notFoundModal, setNotFoundModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ phone: "", name: "" });
  const [submittingCustomer, setSubmittingCustomer] = useState(false);

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

    setSubmitting(true);
    try {
      // API expects amount as a number and phone as string
      const amountNum = parseFloat(purchase.amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        toast.error("Please enter a valid amount");
        setSubmitting(false);
        return;
      }

      const response = await purchasesApi.addPurchase(
        purchase.phone,
        amountNum,
      );

      // Handle "Customer not found" gracefully
      if (
        response.success === false &&
        response.message?.includes("Customer not found")
      ) {
        setNotFoundModal(true);
        setNewCustomer({ phone: purchase.phone, name: "" });
        return;
      }

      // Handle various success responses
      if (
        response.success ||
        response.message?.includes("success") ||
        response.id
      ) {
        toast.success(
          `Successfully recorded purchase of ₹${amountNum} for ${purchase.phone}`,
        );
        setPurchase({ phone: "", amount: "" });
        navigate("/dashboard"); // Take them back to overview
      } else {
        toast.error(response.message || "Failed to record purchase");
      }
    } catch (error) {
      // apiClient already formats the error into { message, status, data }
      if (error.message?.includes("Customer not found")) {
        setNotFoundModal(true);
        setNewCustomer({ phone: purchase.phone, name: "" });
      } else {
        toast.error(error.message || "Error recording purchase");
      }
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
      // Import and use customersApi here
      const { customersApi } = await import("../../customers/api");
      const response = await customersApi.addCustomer(newCustomer);

      if (response.success || response.id) {
        toast.success("Customer created successfully!");
        setNotFoundModal(false);
        // We leave the phone number in the main purchase form so the user
        // can just click "Complete Transaction" again.
      } else {
        toast.error(response.message || "Failed to create customer");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating customer");
    } finally {
      setSubmittingCustomer(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Record Purchase
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Enter customer details to award loyalty points for their transaction.
        </p>
      </div>

      <div className="bg-white/60 backdrop-blur-xl shadow-xl shadow-gray-900/5 rounded-3xl border border-white/50 overflow-hidden">
        <div className="p-1 sm:p-2 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <form onSubmit={handleSubmit} className="p-6 md:p-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Customer Phone Number
              </label>
              <div className="relative">
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
                  maxLength={10}
                  value={purchase.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPurchase({ ...purchase, phone: val });
                  }}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 font-medium text-lg placeholder-gray-400 shadow-inner shadow-gray-100"
                  placeholder="e.g. 9999999999"
                  required
                />
              </div>
              <p className="mt-2 text-xs font-semibold text-gray-500">
                Must be exactly 10 digits.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Purchase Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-bold text-lg">₹</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={purchase.amount}
                  onChange={(e) =>
                    setPurchase({ ...purchase, amount: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-800 font-medium text-lg placeholder-gray-400 shadow-inner shadow-gray-100"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button
              type="submit"
              disabled={submitting || purchase.phone.length !== 10}
              className="group relative w-full flex items-center justify-center gap-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all font-bold text-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></div>
              {submitting ? (
                <svg
                  className="animate-spin h-6 w-6 text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Complete Transaction
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Not Found / Create Customer Overlay */}
      {notFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/60 w-full max-w-md overflow-hidden transform transition-all relative">
            <div className="px-6 py-5 border-b border-gray-100/60 flex justify-between items-center bg-white/50">
              <h3 className="text-lg font-bold text-gray-900">
                Customer Not Found
              </h3>
              <button
                onClick={() => setNotFoundModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-500">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">
                  We couldn't find an account for{" "}
                  <span className="font-bold text-gray-900">
                    {purchase.phone}
                  </span>
                  . Would you like to create one now?
                </p>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Customer Full Name
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all text-gray-800"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div className="opacity-70">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number (Verified)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={newCustomer.phone}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent text-gray-600 cursor-not-allowed"
                    readOnly
                  />
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setNotFoundModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCustomer}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submittingCustomer ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPurchase;
