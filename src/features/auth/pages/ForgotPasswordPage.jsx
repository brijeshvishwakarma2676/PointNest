import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-100 font-sans">
      {/* Background blobs */}
      <div className="absolute top-[10%] left-[20%] h-[400px] w-[400px] rounded-full bg-pink-300 opacity-60 mix-blend-multiply blur-[100px]"></div>
      <div className="absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-blue-300 opacity-50 mix-blend-multiply blur-[120px]"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 md:mx-0 p-8 sm:p-10 rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-xl text-center">
        {!submitted ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              Forgot Password?
            </h2>
            <p className="mt-3 mb-8 text-gray-600 font-medium">
              Enter your email and we'll send a reset link.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:ring-2 focus:ring-blue-400 outline-none transition-all text-gray-800 placeholder-gray-500 shadow-sm font-medium"
                required
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-4 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all"
              >
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Check Your Email
            </h2>
            <p className="mt-3 mb-8 text-gray-600">
              We've sent password reset instructions to your address.
            </p>
          </>
        )}

        <div className="mt-6">
          <Link
            to="/"
            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
