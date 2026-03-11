import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { customersApi } from "../api";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
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
          // Customer already exists, show existing customer details overlay
          setExistingCustomer(response.data);
          toast("Customer already exists", { icon: "ℹ️" });
        } else {
          // Brand new customer
          toast.success("Customer added successfully!");
          setNewCustomer({ name: "", phone: "" });
          setIsModalOpen(false);
        }
        // Refresh the customer list to show the latest points/data
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
    // Update API not yet implemented, so just prevent default and show toast for now
    toast("Update API not yet implemented", { icon: "🚧" });
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Customers
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Manage your loyalty members
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on search
              }}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/60 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-800 text-sm shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all font-semibold hover:-translate-y-0.5 whitespace-nowrap text-sm"
          >
            <svg
              className="w-5 h-5 hidden sm:block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Customer
          </button>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl shadow-lg shadow-gray-900/5 rounded-3xl border border-white/50 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100/60">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Points Balance
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-500 font-medium"
                  >
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-500 font-medium"
                  >
                    No customers found. Click 'Add Customer' to start building
                    your loyalty base!
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-white/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 shrink-0 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 border border-white">
                          {customer.name
                            ? customer.name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {customer.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: #{customer.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{customer.phone}</p>
                      <p className="text-xs text-gray-500">
                        {customer.email || "No email"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                        {customer.points}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewCustomer(customer.id, false)}
                          title="View Customer"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleViewCustomer(customer.id, true)}
                          title="Edit Customer"
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
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
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <Link
                          to={`/purchase?phone=${customer.phone}`}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100 shadow-sm ml-2"
                        >
                          Issue Points
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination minimal UI */}
        {!loading && customers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100/60 flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">
              Total Customers:{" "}
              <span className="font-bold text-gray-900">
                {pagination.total}
              </span>
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchCustomers(pagination.page - 1)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
              >
                Previous
              </button>
              <button
                disabled={customers.length < pagination.size}
                onClick={() => fetchCustomers(pagination.page + 1)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Customer Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/60 w-full max-w-md overflow-hidden transform transition-all relative">
            <div className="px-6 py-5 border-b border-gray-100/60 flex justify-between items-center bg-white/50">
              <h3 className="text-lg font-bold text-gray-900">
                {existingCustomer ? "Customer Details" : "Add New Customer"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTimeout(() => setExistingCustomer(null), 300); // Reset after animation
                }}
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

            {existingCustomer ? (
              <div className="p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 mx-auto bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm font-bold text-indigo-700 text-2xl">
                  {existingCustomer.name.charAt(0).toUpperCase()}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  {existingCustomer.name}
                </h4>
                <p className="text-gray-500 font-medium mb-6">
                  {existingCustomer.phone}
                </p>
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-8">
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    Current Points
                  </p>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {existingCustomer.points}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Link
                    to={`/purchase?phone=${existingCustomer.phone}`}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
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
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Issue New Points
                  </Link>
                  <button
                    onClick={() => {
                      setExistingCustomer(null);
                      setNewCustomer({ name: "", phone: "" });
                    }}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Add a Different Customer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddCustomer} className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={newCustomer.name}
                      onChange={(e) =>
                        setNewCustomer({ ...newCustomer, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-800"
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={newCustomer.phone}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setNewCustomer({
                          ...newCustomer,
                          phone: val,
                        });
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-800"
                      placeholder="e.g. 9999999999"
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Saving..." : "Save Customer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* View/Edit Customer Modal */}
      {viewCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/60 w-full max-w-md overflow-hidden transform transition-all relative">
            <div className="px-6 py-5 border-b border-gray-100/60 flex justify-between items-center bg-white/50">
              <h3 className="text-lg font-bold text-gray-900">
                {isEditingCustomer ? "Edit Customer" : "Customer Details"}
              </h3>
              <button
                onClick={() => {
                  setViewCustomerModal(false);
                  setSelectedCustomer(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {fetchingDetails ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-blue-500 mb-4"
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
                <p className="text-gray-500 font-medium">Loading details...</p>
              </div>
            ) : selectedCustomer ? (
              <form onSubmit={handleUpdateCustomer} className="p-6">
                <div className="text-center mb-6">
                  <div className="h-16 w-16 mx-auto bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center font-bold text-2xl text-blue-600 border border-white shadow-sm mb-3">
                    {selectedCustomer.name
                      ? selectedCustomer.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    ID: #{selectedCustomer.id}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={selectedCustomer.name || ""}
                      onChange={(e) =>
                        setSelectedCustomer({
                          ...selectedCustomer,
                          name: e.target.value,
                        })
                      }
                      disabled={!isEditingCustomer}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-800 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={selectedCustomer.phone || ""}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setSelectedCustomer({
                          ...selectedCustomer,
                          phone: val,
                        });
                      }}
                      disabled={!isEditingCustomer}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-800 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Points Balance
                    </label>
                    <input
                      type="text"
                      value={selectedCustomer.points || 0}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent text-gray-600 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setViewCustomerModal(false);
                      setSelectedCustomer(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  {isEditingCustomer && (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Updating..." : "Update Details"}
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Failed to load customer details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Force Vite HMR reload
export default CustomersPage;
