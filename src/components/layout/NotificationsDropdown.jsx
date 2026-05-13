import React from "react";

const typeColors = {
  financial: "bg-emerald-500",
  security:  "bg-rose-500",
  audit:     "bg-indigo-500",
  system:    "bg-gray-900",
};

/**
 * NotificationsDropdown
 * Props:
 *  - isOpen: boolean
 *  - notifications: array of notification objects
 *  - onClearAll: () => void
 */
const NotificationsDropdown = ({ isOpen, notifications, onClearAll }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-0 w-80 bg-white border border-gray-200 rounded-[2rem] shadow-2xl py-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="px-6 mb-4 flex items-center justify-between">
        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
          Recent Activity
          {notifications.some(n => !n.is_read) && (
            <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-black">
              {notifications.filter(n => !n.is_read).length}
            </span>
          )}
        </h3>
        <button
          onClick={onClearAll}
          className="text-[9px] font-bold text-gray-400 uppercase hover:text-rose-500 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* List */}
      <div className="space-y-1 max-h-[320px] overflow-y-auto scrollbar-hide">
        {notifications.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">All caught up!</p>
            <p className="text-[9px] font-bold text-gray-200 uppercase mt-1">No recent activity</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-gray-900 ${
                !notif.is_read ? "bg-gray-50/50" : ""
              }`}
            >
              <div className="flex items-start gap-4 px-2">
                <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${typeColors[notif.type] || "bg-gray-400"} ${!notif.is_read ? "shadow-[0_0_6px_rgba(0,0,0,0.3)]" : "opacity-40"}`} />
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-gray-900 uppercase tracking-wider leading-none mb-1">{notif.title}</p>
                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{notif.body}</p>
                  <p className="text-[8px] font-bold text-gray-300 uppercase mt-2">{notif.time || "just now"}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 px-6 pt-6 border-t border-gray-100">
        <button className="w-full py-3 rounded-xl bg-gray-50 text-[10px] font-black text-gray-900 uppercase tracking-widest hover:bg-gray-100 transition-all">
          View Audit Log
        </button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
