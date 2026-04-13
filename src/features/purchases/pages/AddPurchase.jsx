import React, { useState } from "react";
import toast from "react-hot-toast";
import { purchasesApi } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Phone, 
  IndianRupee, 
  CreditCard, 
  UserPlus, 
  X, 
  AlertCircle,
  Plus,
  Loader2,
  Check
} from "lucide-react";

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

      if (
        response.success === false &&
        response.message?.includes("Customer not found")
      ) {
        setNotFoundModal(true);
        setNewCustomer({ phone: purchase.phone, name: "" });
        return;
      }

      if (
        response.success ||
        response.message?.includes("success") ||
        response.id
      ) {
        toast.success(
          `Successfully recorded purchase of ₹${amountNum} for ${purchase.phone}`,
        );
        setPurchase({ phone: "", amount: "" });
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Failed to record purchase");
      }
    } catch (error) {
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
      const { customersApi } = await import("../../customers/api");
      const response = await customersApi.addCustomer(newCustomer);

      if (response.success || response.id) {
        toast.success("Customer created successfully!");
        setNotFoundModal(false);
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
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-[90vh] flex flex-col justify-center animate-in fade-in duration-700">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">
          <CreditCard size={12} />
          Point Center
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-4">
          Record <span className="text-gray-400">Yield</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-md text-sm leading-relaxed">
          Input customer metrics to distribute loyalty points across the enterprise ledger.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50">
        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                  Customer Protocol (Phone)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={purchase.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPurchase({ ...purchase, phone: val });
                    }}
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-lg placeholder-gray-300"
                    placeholder="9988776655"
                    required
                  />
                </div>
                <p className="mt-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  10-DIGIT VERIFIED IDENTIFIER
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                  Transaction Magnitude (INR)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                    <IndianRupee size={18} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={purchase.amount}
                    onChange={(e) =>
                      setPurchase({ ...purchase, amount: e.target.value })
                    }
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-lg placeholder-0.00"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end">
               <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 mb-8 md:mb-0">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    <AlertCircle size={14} />
                    System Logic
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Recording this transaction will automatically calculate loyalty yields based on your tier configuration and broadcast them to the customer's ledger.
                  </p>
               </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
            <button
              type="submit"
              disabled={submitting || purchase.phone.length !== 10}
              className="flex-1 w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0A0A0B] hover:bg-gray-800 text-white px-10 py-5 rounded-2xl shadow-xl shadow-gray-200 transition-all font-bold text-base active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Check size={20} />
                  Authorize Transaction
                </>
              )}
            </button>
            
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-[200px] text-center sm:text-left leading-relaxed">
              PRESS AUTHORIZE TO EXECUTE AUDIT.
            </p>
          </div>
        </form>
      </div>

      {/* Customer Create Overlay */}
      {notFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#0A0A0B]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <UserPlus size={16} className="text-gray-400" />
                Registry Correction
              </h3>
              <button
                onClick={() => setNotFoundModal(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-xl hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-5 text-gray-900 border border-gray-200 shadow-sm font-black text-2xl">
                  ?
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Client identifier <span className="font-bold text-gray-900">{purchase.phone}</span> is not present in the registry. 
                  Enroll them now to continue.
                </p>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                    Client Legal Name
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-base"
                    placeholder="e.g. Alexander Pierce"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submittingCustomer}
                    className="flex-1 bg-[#0A0A0B] hover:bg-gray-800 text-white px-6 py-4 rounded-xl font-bold text-sm shadow-lg shadow-gray-200 transition-all active:scale-95 disabled:opacity-30"
                  >
                    {submittingCustomer ? "Enrolling..." : "Enroll Client"}
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

