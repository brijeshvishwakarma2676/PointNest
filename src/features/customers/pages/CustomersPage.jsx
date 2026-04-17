import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { customersApi } from "../api";
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Pencil, 
  CreditCard, 
  X, 
  UserPlus, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  User,
  ExternalLink,
  History,
  Loader2
} from "lucide-react";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [existingCustomer, setExistingCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // View/Edit Customer Modal State
  const [viewCustomerModal, setViewCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Pagination and metrics
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch when page or debounced search changes
  useEffect(() => {
    fetchCustomers(pagination.page, debouncedSearchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, debouncedSearchQuery]);

  const fetchCustomers = async (page, query = debouncedSearchQuery) => {
    setLoading(true);
    try {
      const response = await customersApi.getCustomers({
        page,
        size: pagination.size,
        ...(query && { search_query: query }),
      });
      if (response.success) {
        setCustomers(response.data.items);
        setPagination({
          page: response.data.page,
          size: response.data.size,
          total: response.data.total,
        });
      } else {
        toast.error(response.message || "Failed to fetch customers");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching customers");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Name and Phone are required");
      return;
    }

    if (newCustomer.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setSubmitting(true);
    try {
      const response = await customersApi.addCustomer(newCustomer);
      if (response.success) {
        if (response.data?.is_new_customer === false) {
          setExistingCustomer(response.data);
        } else {
          toast.success("Customer added successfully!");
          setNewCustomer({ name: "", phone: "", email: "" });
          setIsModalOpen(false);
        }
        fetchCustomers(1);
      } else {
        toast.error(response.message || "Failed to add customer");
      }
    } catch (error) {
      toast.error(error.message || "Error adding customer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewCustomer = async (id, editMode = false) => {
    setFetchingDetails(true);
    setViewCustomerModal(true);
    setIsEditingCustomer(editMode);

    try {
      const response = await customersApi.getCustomerDetails({
        customer_id: id,
      });
      if (response.success) {
        setSelectedCustomer(response.data);
      } else {
        toast.error(response.message || "Failed to fetch customer details");
        setViewCustomerModal(false);
      }
    } catch (error) {
      toast.error(error.message || "Error fetching customer details");
      setViewCustomerModal(false);
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!selectedCustomer.name?.trim()) {
      toast.error("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        id: selectedCustomer.id,
        name: selectedCustomer.name.trim(),
      };
      if (selectedCustomer.phone?.trim()) payload.phone = selectedCustomer.phone.trim();
      if (selectedCustomer.email?.trim()) payload.email = selectedCustomer.email.trim();

      const response = await customersApi.updateCustomer(payload);
      if (response.success) {
        toast.success("Customer details updated successfully!");
        setIsEditingCustomer(false);
        setViewCustomerModal(false);
        setSelectedCustomer(null);
        fetchCustomers(pagination.page);
      } else {
        toast.error(response.message || "Failed to update customer details");
      }
    } catch (error) {
      toast.error(error.message || "Error updating customer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen font-sans antialiased">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">
            <ShieldCheck size={12} />
            Enterprise Registry
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-none mb-4">
            Client <br />
            <span className="text-gray-400">Management</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-md text-sm leading-relaxed">
            Manage your high-value customers, audit loyalty point balances, and track interaction history.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              placeholder="Search registry..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-gray-900 outline-none transition-all text-gray-900 text-sm font-bold placeholder-gray-300"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-4 bg-[#0A0A0B] text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200 whitespace-nowrap"
          >
            <Plus size={18} />
            Enroll Client
          </button>
        </div>
      </div>

      {/* Main Registry Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Users size={14} className="text-gray-400" />
            Active Records
          </h2>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {pagination.total} VERIFIED CLIENTS
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Client Profile</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Protocol</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Loyalty Yield</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Interaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-10 py-7">
                      <div className="h-4 bg-gray-100 rounded-full w-1/3"></div>
                    </td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center">
                     <div className="flex flex-col items-center gap-4 opacity-30">
                      <Search size={48} className="text-gray-400" />
                      <p className="text-lg font-black text-gray-400 uppercase tracking-tighter">
                        No Records Found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-gray-900 border border-gray-200 group-hover:bg-white group-hover:shadow-md transition-all">
                          {customer.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base mb-0.5">{customer.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">U-ID: #{customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <p className="text-sm font-bold text-gray-900 mb-0.5">{customer.phone}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-[150px]">
                        {customer.email || "No Email"}
                      </p>
                    </td>
                    <td className="px-10 py-7 text-right">
                       <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 text-xs font-black shadow-sm group-hover:bg-[#0A0A0B] group-hover:text-white group-hover:border-[#0A0A0B] transition-all">
                        {customer.points} <span className="text-[9px] opacity-60 uppercase">pts</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleViewCustomer(customer.id, false)}
                          className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-gray-200"
                        >
                          <Eye size={18} />
                        </button>
                        <Link
                          to={`/purchase?phone=${customer.phone}`}
                          className="ml-2 inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95"
                        >
                          Add Purchase
                        </Link>
                        <Link
                          to={`/redeem?phone=${customer.phone}`}
                          className="ml-2 inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95"
                        >
                          Redeem Points
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && customers.length > 0 && (
          <div className="px-10 py-8 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              PAGE {pagination.page} OF {Math.ceil(pagination.total / pagination.size)}
            </div>
            
            <div className="flex gap-3">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchCustomers(pagination.page - 1)}
                 className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs font-bold hover:shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Previous
              </button>
              <button
                disabled={customers.length < pagination.size}
                onClick={() => fetchCustomers(pagination.page + 1)}
                 className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs font-bold hover:shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                Next
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#0A0A0B]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <UserPlus size={16} className="text-gray-400" />
                {existingCustomer ? "Registry Hit" : "Client Enrollment"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTimeout(() => setExistingCustomer(null), 300);
                }}
                className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-xl hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {existingCustomer ? (
              <div className="p-10 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-3xl flex items-center justify-center mb-6 border border-gray-200 shadow-sm font-black text-3xl text-gray-900">
                  {existingCustomer.name.charAt(0).toUpperCase()}
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-2">
                  {existingCustomer.name}
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-8">
                  {existingCustomer.phone}
                </p>
                
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 mb-10 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Enterprise Balance</p>
                  <p className="text-4xl font-black text-black tracking-tighter">
                    {existingCustomer.points} <span className="text-xs text-gray-400">PTS</span>
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <Link
                    to={`/purchase?phone=${existingCustomer.phone}`}
                    className="w-full flex items-center justify-center gap-3 bg-[#0A0A0B] text-white py-4 rounded-2xl font-bold text-base hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                  >
                    <History size={18} />
                    Issue New Yield
                  </Link>
                  <button
                    onClick={() => {
                      setExistingCustomer(null);
                      setNewCustomer({ name: "", phone: "", email: "" });
                    }}
                    className="w-full py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Add Different Client
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddCustomer} className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-base"
                      placeholder="e.g. Alexander Pierce"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                      Protocol Address (Phone)
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={newCustomer.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setNewCustomer({ ...newCustomer, phone: val });
                      }}
                       className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-base"
                      placeholder="9988776655"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                      Email Link (Optional)
                    </label>
                    <input
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                       className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-base"
                      placeholder="alex@lumina.io"
                    />
                  </div>
                </div>

                <div className="mt-10">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0A0A0B] text-white py-5 rounded-2xl font-bold text-base shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-30"
                  >
                    {submitting ? "Enrolling..." : "Complete Enrollment"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* View/Edit Modal */}
      {viewCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#0A0A0B]/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                {isEditingCustomer ? "Modify Record" : "Client Dossier"}
              </h3>
              <div className="flex items-center gap-2">
                {!isEditingCustomer && (
                  <button
                    onClick={() => setIsEditingCustomer(true)}
                    className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-2"
                    title="Modify Record"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Modify</span>
                    <Pencil size={18} />
                  </button>
                )}
                <button
                  onClick={() => {
                    setViewCustomerModal(false);
                    setSelectedCustomer(null);
                  }}
                   className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-xl hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {fetchingDetails ? (
              <div className="p-16 text-center flex flex-col items-center justify-center">
                 <Loader2 className="animate-spin text-gray-900 mb-4" size={32} />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Querying Registry...</p>
              </div>
            ) : selectedCustomer ? (
              <form onSubmit={handleUpdateCustomer} className="p-8">
                <div className="text-center mb-10">
                  <div className="h-20 w-20 mx-auto bg-gray-100 rounded-3xl flex items-center justify-center font-black text-2xl text-gray-900 border border-gray-200 shadow-sm mb-4">
                    {selectedCustomer.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    SYSTEM ID: #{selectedCustomer.id}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                      Legal Name
                    </label>
                    <input
                      type="text"
                      value={selectedCustomer.name || ""}
                      onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                      disabled={!isEditingCustomer}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-base disabled:opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                      Contact Protocol
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={selectedCustomer.phone || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setSelectedCustomer({ ...selectedCustomer, phone: val });
                      }}
                      disabled={!isEditingCustomer}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-900 outline-none transition-all text-gray-900 font-bold text-base disabled:opacity-50"
                      required
                    />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 text-right">
                      Yield Balance
                    </label>
                    <div className="w-full px-5 py-4 rounded-2xl bg-[#0A0A0B] text-white flex justify-between items-center">
                       <CreditCard size={18} className="text-gray-500" />
                       <span className="font-black text-xl tracking-tighter">{selectedCustomer.points}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-3">
                   {isEditingCustomer && (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#0A0A0B] text-white py-5 rounded-2xl font-bold text-base shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
                    >
                      {submitting ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          Verify & Authorize
                        </>
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setViewCustomerModal(false);
                      setSelectedCustomer(null);
                    }}
                    className="w-full py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Close Dossier
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-16 text-center text-[10px] font-black text-rose-500 uppercase tracking-widest">
                Data Stream Corrupted
              </div>
            )}
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
