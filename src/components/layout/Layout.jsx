import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  History, 
  CreditCard, 
  LogOut, 
  User,
  ChevronRight,
  Menu,
  X,
  Activity,
  Receipt,
  ShieldCheck,
  Settings,
  Bell,
  Search,
  Mail,
  Phone,
  Clock,
  ArrowDownLeft,
  ChevronDown,
  AlertCircle,
  TicketPercent
} from "lucide-react";
import useAuthStore from "../../store/authStore";

/**
 * Layout - Lumina Enterprise Edition
 * The global structural shell for the Lumina ecosystem.
 * Enhanced with interactive search, notifications, and premium spacing.
 */
const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // Interactive Component State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const searchInputRef = useRef(null);
  const notificationRef = useRef(null);

  const [notifications] = useState([
    { id: 1, title: "Client Enrollment", body: "Alexander S. verified as Lumina Prime", time: "2m ago", type: "system" },
    { id: 2, title: "Voucher Authorized", body: "#55412 generated for Terminal B", time: "15m ago", type: "financial" },
    { id: 3, title: "Registry Audit", body: "Monthly performance metrics compiled", time: "1h ago", type: "audit" },
    { id: 4, title: "Security Link", body: "New connection established from IP 192.168.1.1", time: "3h ago", type: "security" },
  ]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Add Purchase", path: "/purchase", icon: PlusCircle },
    { name: "Redeem Points", path: "/redeem", icon: CreditCard },
    { name: "Purchases", path: "/purchases", icon: Receipt },
    { name: "Redemptions", path: "/history", icon: History },
    { name: "Coupons", path: "/coupons", icon: TicketPercent },
  ];

  const activePath = location.pathname;

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans antialiased text-gray-900 selection:bg-gray-900 selection:text-white">
      
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Logo Section */}
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#0A0A0B] flex items-center justify-center shadow-xl shadow-gray-200 group-hover:scale-105 transition-all text-white">
                <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <span className="font-black text-xl tracking-tighter text-gray-900 block italic">LUMINA</span>
                <span className="text-[8px] font-black tracking-[0.3em] text-gray-400 uppercase">Enterprise</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-6 py-10 space-y-2 overflow-y-auto scrollbar-hide">
             <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-6 px-4">Navigation Protocol</p>
            {navItems.map((item) => {
              const isActive = activePath === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all group ${
                    isActive
                      ? "bg-[#0A0A0B] text-white shadow-2xl shadow-gray-300 translate-x-1"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 mt-auto border-t border-gray-100 bg-gray-50/20">
            {user && (
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center justify-between p-4 mb-4 rounded-2xl bg-white border border-gray-100 hover:border-gray-900/10 hover:shadow-xl hover:shadow-gray-200/50 transition-all text-left relative overflow-hidden group"
              >
                <div className="flex items-center gap-3 relative z-10 overflow-hidden">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0A0A0B] text-white font-black text-xs border border-white/10 shadow-lg">
                    {user.owner_name?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-gray-900 truncate uppercase tracking-tighter">
                      {user.shop_name}
                    </p>
                    <p className="text-[8px] font-bold text-gray-400 truncate uppercase tracking-widest leading-none mt-1">
                      Merchant ID: {user.id?.toString().slice(-4) || "8842"}
                    </p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
              </button>
            )}
            
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-gray-400 font-black text-[9px] uppercase tracking-[0.2em] border border-transparent hover:border-rose-500/10 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              <LogOut size={14} />
              Terminate Session
            </button>
          </div>
        </div>
      </aside>

      {/* Content Proxy Shell - MOVED md:ml-6 for better spacing */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white md:m-4 md:ml-6 md:rounded-[2.5rem] md:border md:border-gray-200 md:shadow-inner relative">
        
        {/* Universal Action Bar */}
        <header className="flex items-center justify-between px-8 h-24 border-b border-gray-100 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-3 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 border border-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.5)] mr-2 animate-pulse" />
                Connectivity: Verified
              </div>
           </div>

           <div className="flex items-center gap-2 md:gap-4">
              {/* Expandable Search Input */}
              <div className="flex items-center overflow-hidden">
                <div className={`flex items-center h-12 bg-gray-50 rounded-2xl transition-all duration-500 ease-out border overflow-hidden ${isSearchOpen ? 'w-64 border-gray-200 px-4' : 'w-0 border-transparent opacity-0'}`}>
                   <Search size={16} className="text-gray-400 shrink-0" />
                   <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search protocol..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs font-bold text-gray-900 ml-3 w-full placeholder:text-gray-300"
                   />
                </div>
                {!isSearchOpen ? (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all"
                  >
                    <Search size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-50 ml-4 hover:text-gray-900 transition-all"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Notification System */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all relative ${isNotificationsOpen ? 'bg-[#0A0A0B] text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </button>

                {/* Smooth Notification Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute top-16 right-0 w-80 bg-white border border-gray-200 rounded-[2rem] shadow-2xl py-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-6 mb-4 flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Recent Activity</h3>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Clear All</span>
                    </div>
                    <div className="space-y-1 max-h-[320px] overflow-y-auto scrollbar-hide">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-gray-900">
                          <div className="flex items-start gap-4 px-2">
                             <div className="mt-1 h-2 w-2 rounded-full bg-gray-900 group-hover:scale-125 transition-transform" />
                             <div>
                               <p className="text-[11px] font-black text-gray-900 uppercase tracking-wider leading-none mb-1">{notif.title}</p>
                               <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{notif.body}</p>
                               <p className="text-[8px] font-bold text-gray-300 uppercase mt-2">{notif.time}</p>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 px-6 pt-6 border-t border-gray-100">
                       <button className="w-full py-3 rounded-xl bg-gray-50 text-[10px] font-black text-gray-900 uppercase tracking-widest hover:bg-gray-100 transition-all">
                        View Audit Log
                       </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-8 w-px bg-gray-100 mx-1 hidden md:block" />
              <button className="h-12 w-12 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all">
                <Settings size={20} />
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-200">
          <div className="w-full h-full animate-in fade-in duration-1000 slide-in-from-bottom-2">
            {children}
          </div>
        </div>
      </main>


      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-[#0A0A0B]/60 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setIsLogoutModalOpen(false)}
          ></div>
          <div className="relative bg-white border border-gray-200 shadow-2xl rounded-[3rem] w-full max-w-sm overflow-hidden z-[120] animate-in zoom-in-95 duration-400">
            <div className="p-10 text-center">
              <div className="w-20 h-20 mx-auto bg-rose-50 rounded-[2rem] flex items-center justify-center mb-6 border border-rose-100 text-rose-500">
                <AlertCircle size={40} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                Terminate Session?
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-10 max-w-[200px] mx-auto">
                Once terminated, you will need to re-verify your credentials to access the terminal.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={logout}
                  className="w-full py-5 rounded-2xl bg-[#0A0A0B] text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-rose-600 transition-all shadow-xl shadow-gray-200"
                >
                  Terminate Connection
                </button>
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="w-full py-5 rounded-2xl bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-100 transition-all"
                >
                  Stay Connected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
