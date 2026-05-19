import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Mail,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  Fingerprint,
  Lock,
  ShieldCheck,
  Key
} from "lucide-react";
import { authApi } from "../api";
import toast from "react-hot-toast";

/**
 * ForgotPasswordPage - PointNest Noir Edition
 * A recovery terminal for lost authorization keys using dynamic OTP mail validation.
 */
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  
  // Stages: 1 = Enter Email, 2 = Verify OTP Only, 3 = Enter New Password, 4 = Reset Success
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle step 1: Request OTP email dispatch
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      if (response.success) {
        toast.success(response.message || "Security OTP code dispatched successfully!");
        setStep(2); // Transition to the OTP input step only on success
      } else {
        toast.error(response.message || "Failed to dispatch recovery code.");
      }
    } catch (error) {
      toast.error(error.message || "Registered access profile (email) not found.");
    } finally {
      setLoading(false);
    }
  };

  // Handle step 2: Verify the security OTP code
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the verification OTP code.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verifyOtp(email, otp);
      if (response.success) {
        toast.success(response.message || "OTP verified successfully!");
        setStep(3); // Proceed to setting new password stage
      } else {
        toast.error(response.message || "Invalid verification OTP code.");
      }
    } catch (error) {
      toast.error(error.message || "Invalid or expired verification OTP code.");
    } finally {
      setLoading(false);
    }
  };

  // Handle step 3: Save new password credentials
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error("New authorization key must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Credentials mismatch. Passwords must match.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.resetPassword({
        email,
        otp,
        new_password: newPassword
      });
      
      if (response.success) {
        toast.success(response.message || "Authorization key updated successfully!");
        setStep(4); // Move to success step
      } else {
        toast.error(response.message || "Failed to reset password.");
      }
    } catch (error) {
      toast.error(error.message || "Verification expired or invalid. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0B] font-sans antialiased text-white">
      {/* Structural Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-6 animate-in fade-in zoom-in-95 duration-700">
        {/* Terminal Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-white text-black border border-gray-200 shadow-2xl">
            <Fingerprint size={36} strokeWidth={2} />
          </div>
          <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3">
            Recovery Terminal
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">
            RECOVERY
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            Reset verified authorization keys
          </p>
        </div>

        {/* Interface Card */}
        <div className="bg-[#111113] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          {step === 1 && (
            <>
              <p className="mb-10 text-gray-400 font-medium text-center text-sm leading-relaxed">
                Enter your registered access profile (email) to receive a secure
                one-time validation code.
              </p>

              <form className="space-y-6" onSubmit={handleRequestOtp}>
                <div className="space-y-2 text-left">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Access Profile (Email)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@pointnest.io"
                      className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-20 shadow-xl mt-4"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <>
                      Request Verification OTP
                      <ChevronRight size={18} strokeWidth={3} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <p className="mb-10 text-gray-400 font-medium text-center text-sm leading-relaxed">
                A verification OTP code has been dispatched. Enter the code below to verify your identity.
              </p>

              <form className="space-y-5" onSubmit={handleVerifyOtp}>
                {/* Disabled Email input for context */}
                <div className="space-y-2 text-left opacity-60">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Resetting Profile
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-500">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full pl-14 pr-6 py-4 bg-white/[0.01] border border-white/5 text-gray-400 font-bold text-sm rounded-2xl"
                    />
                  </div>
                </div>

                {/* OTP Code input */}
                <div className="space-y-2 text-left">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Verification OTP Code
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                      <Key size={16} />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="••••••"
                      className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl tracking-[0.3em] placeholder:tracking-normal placeholder:text-gray-600"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-20 shadow-xl mt-6"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <>
                      Verify Security OTP
                      <ChevronRight size={18} strokeWidth={3} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <p className="mb-10 text-gray-400 font-medium text-center text-sm leading-relaxed">
                Identity verified. Establish your new security authorization key below.
              </p>

              <form className="space-y-5" onSubmit={handleResetPassword}>
                {/* Disabled Email input for context */}
                <div className="space-y-2 text-left opacity-60">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Resetting Profile
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-500">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full pl-14 pr-6 py-4 bg-white/[0.01] border border-white/5 text-gray-400 font-bold text-sm rounded-2xl"
                    />
                  </div>
                </div>

                {/* New Password input */}
                <div className="space-y-2 text-left">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                    New Authorization Key
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password input */}
                <div className="space-y-2 text-left">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                    Confirm Authorization Key
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                      <ShieldCheck size={16} />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-20 shadow-xl mt-6"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <>
                      Establish New Credentials
                      <ChevronRight size={18} strokeWidth={3} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 4 && (
            <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-inner">
                <CheckCircle size={40} className="text-white animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-4 uppercase italic">
                Keys Restored
              </h2>
              <p className="text-gray-400 font-medium text-sm leading-relaxed mb-10">
                Your profile security authorization keys have been updated. You can now establish connection using your new credentials.
              </p>
              
              <button
                onClick={() => navigate("/")}
                className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
              >
                Access Secure Terminal
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Secure Login
            </Link>
          </div>
        </div>

        {/* Global Footer */}
        <div className="mt-12 text-center">
          <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em]">
            Safety Protocol © 2026 PointNest
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

