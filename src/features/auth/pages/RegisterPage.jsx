import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Store,
  User,
  Mail,
  Phone,
  Lock,
  ChevronRight,
  ExternalLink,
  Info,
  RefreshCw,
} from "lucide-react";

/**
 * RegisterPage - PointNest Noir Edition
 * A high-impact enrollment terminal for new enterprises.
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    shop_name: "",
    owner_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const handleGoogleResponse = async (response) => {
      const { credential } = response;
      if (!credential) {
        toast.error("Google Authentication failed to retrieve ID Token");
        return;
      }
      const result = await loginWithGoogle(credential);
      if (result.success) {
        toast.success(result.message || "Connection Established with Google");
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Google Authentication Failed");
      }
    };

    const initializeGoogleSignIn = () => {
      if (!window.google) return;
      
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id-here.apps.googleusercontent.com";
      
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });

      // Render the official, high-quality Google Button
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn-register"),
        { 
          theme: "filled_black", 
          size: "large", 
          text: "signup_with",
          shape: "rectangular",
          width: 320 
        }
      );
    };

    const loadGoogleScript = () => {
      if (document.getElementById("google-gsi-client")) {
        initializeGoogleSignIn();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = "google-gsi-client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGoogleSignIn();
      };
      script.onerror = () => {
        console.error("Failed to load Google Identity Services SDK");
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, [loginWithGoogle, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    const { confirm_password, ...submitData } = formData;
    const result = await register(submitData);

    if (result.success) {
      toast.success(result.message || "Enrollment successful");
      navigate("/");
    } else {
      toast.error(result.message || "Enrollment failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0B] font-sans antialiased text-white py-12">
      {/* Structural Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-white/[0.01] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[580px] mx-6 animate-in fade-in zoom-in-95 duration-700">
        {/* Terminal Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-white text-black border border-gray-200 shadow-2xl">
            <Store size={36} strokeWidth={2.5} />
          </div>
          <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3">
            Entity Registration Protocol
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">
            ENROLLMENT
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            Establish a new enterprise terminal
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#111113] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                <Info size={14} />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Enterprise Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                    <Store size={16} />
                  </div>
                  <input
                    type="text"
                    name="shop_name"
                    placeholder="PointNest HQ"
                    value={formData.shop_name}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Admin Identity
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    name="owner_name"
                    placeholder="Alexander P."
                    value={formData.owner_name}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                Access Protocol (Email)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@lumina.io"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                Primary Communication Link (Phone)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="9988776655"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Secure Key
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Confirm Key
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-white transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    name="confirm_password"
                    placeholder="••••••••"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 focus:border-white focus:bg-white/[0.05] outline-none transition-all text-white font-bold text-sm rounded-2xl placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full flex items-center justify-center gap-3 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-20 shadow-xl"
            >
              {isLoading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <>
                  Authorize Registration
                  <ChevronRight size={18} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
              Secure Auth Link
            </span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <div className="flex justify-center w-full">
            <div id="google-signin-btn-register" className="w-full flex justify-center max-w-xs overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 transition-all"></div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm font-medium text-gray-600">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
              Already a verified partner?
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/[0.03] transition-all"
            >
              Sign In to Connection
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Global Footer */}
        <div className="mt-12 text-center pb-8">
          <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em]">
            Identity Proxy © 2026 PointNest Group
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
