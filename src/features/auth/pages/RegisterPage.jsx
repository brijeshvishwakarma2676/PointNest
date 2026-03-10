import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    shop_name: "",
    owner_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

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

    // Remove confirm_password before sending to API
    // eslint-disable-next-line no-unused-vars
    const { confirm_password, ...submitData } = formData;

    const result = await register(submitData);

    if (result.success) {
      toast.success(result.message || "Registration successful!");
      // Send them to login page after successful registration
      navigate("/");
    } else {
      toast.error(result.message || "Registration failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-100 font-sans">
      {/* Background iOS-style blurry blobs */}
      <div className="absolute top-[-20%] left-[10%] h-[700px] w-[700px] rounded-full bg-cyan-300 opacity-50 mix-blend-multiply blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-500 opacity-40 mix-blend-multiply blur-[120px]"></div>
      <div className="absolute top-[30%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-400 opacity-40 mix-blend-multiply blur-[100px]"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[500px] mx-4 md:mx-0 p-8 sm:p-10 rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-gray-600 font-medium">Join PointNest today</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="shop_name"
              placeholder="Shop Name"
              value={formData.shop_name}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-500 shadow-sm font-medium"
              required
            />
            <input
              type="text"
              name="owner_name"
              placeholder="Owner Name"
              value={formData.owner_name}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-500 shadow-sm font-medium"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-500 shadow-sm font-medium"
              required
            />
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-500 shadow-sm font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-500 shadow-sm font-medium"
              required
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-500 shadow-sm font-medium"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-4 text-base font-semibold text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "cursor-pointer shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-gray-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
