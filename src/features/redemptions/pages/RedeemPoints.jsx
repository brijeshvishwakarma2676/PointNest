import React, { useState } from "react";
import toast from "react-hot-toast";
import { redemptionsApi } from "../api";

const RedeemPoints = () => {
  const [form, setForm] = useState({ phone: "", points_to_redeem: "" });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // holds the success response data

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Redeem Points
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Convert a customer's loyalty points into a purchase discount.
        </p>
      </div>

      {result ? (
        /* ── SUCCESS STATE ── */
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg shadow-gray-900/5 rounded-3xl overflow-hidden">
          {/* Green header banner */}
          <div className="h-2 w-full bg-linear-to-r from-emerald-400 to-green-500" />
          <div className="p-8 text-center">
            <div className="flex justify-center mb-5">
              <div className="h-16 w-16 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center shadow-sm">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              Redemption Successful!
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              Points have been deducted for{" "}
              <span className="font-bold text-gray-800">
                {result.customer_name}
              </span>
              .
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5">
                  Points Used
                </p>
                <p className="text-2xl font-extrabold text-red-500 tracking-tight">
                  -{result.points_used}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5">
                  Discount Given
                </p>
                <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                  ₹{result.amount_discounted?.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5">
                  Remaining
                </p>
                <p className="text-2xl font-extrabold text-blue-600 tracking-tight">
                  {result.remaining_points} pts
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              Redeem for Another Customer
            </button>
          </div>
        </div>
      ) : (
        /* ── FORM STATE ── */
        <form
          onSubmit={handleSubmit}
          className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg shadow-gray-900/5 rounded-3xl p-8"
        >
          <div className="space-y-6">
            {/* Phone */}
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
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/70 border border-gray-200 rounded-2xl text-gray-900 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Points */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Points to Redeem
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <input
                  type="number"
                  name="points_to_redeem"
                  value={form.points_to_redeem}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  min={1}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/70 border border-gray-200 rounded-2xl text-gray-900 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="mt-2 text-xs text-gray-400 font-medium">
                Points will be converted into a monetary discount.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold text-base hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin w-5 h-5"
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
                Processing...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                Redeem Points
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default RedeemPoints;
