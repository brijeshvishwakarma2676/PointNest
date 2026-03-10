import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { customersApi } from "../api";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  // Pagination and metrics
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });

  useEffect(() => {
    fetchCustomers(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCustomers = async (page) => {
    setLoading(true);
    try {
      const response = await customersApi.getCustomers({
        page,
        size: pagination.size,
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

    setSubmitting(true);
    try {
      const response = await customersApi.addCustomer(newCustomer);
      if (response.success || response.id) {
        // Just in case backend returns success slightly differently
        toast.success("Customer added successfully!");
        setNewCustomer({ name: "", phone: "" });
        setIsModalOpen(false);
        // Refresh the first page
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all font-semibold hover:-translate-y-0.5"
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
          Add Customer
        </button>
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
                      <Link
                        to={`/purchase?phone=${customer.phone}`}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100 shadow-sm"
                      >
                        Issue Points
                      </Link>
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
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/60 w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-5 border-b border-gray-100/60 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Add New Customer
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
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
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
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
          </div>
        </div>
      )}
    </div>
  );
};

// Force Vite HMR reload
export default CustomersPage;
