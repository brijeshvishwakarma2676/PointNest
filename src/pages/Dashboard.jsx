import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  Award,
  Wallet,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ArrowRight,
  Plus,
  UserPlus,
  Sparkles,
  Search,
  Activity,
  ArrowUpRight,
  ArrowDownToLine,
  Ticket,
  X,
  Trash2,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { purchasesApi } from "../features/purchases/api";
import { redemptionsApi } from "../features/redemptions/api";
import { formatDate, formatTime } from "../utils/dateUtils";
import toast from "react-hot-toast";
import apiClient from "../api/client";
import urls from "../constants/urls";

// --- Utility Components ---
const parseInlineMarkdown = (text) => {
  if (!text) return "";
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-extrabold text-gray-950">{part}</strong>;
    }
    return part;
  });
};

const FormattedMarkdownText = ({ text }) => {
  if (!text) return null;

  // Split by newlines
  const lines = text.split("\n");
  
  return (
    <div className="space-y-1.5 text-left w-full">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Skip table headers and structural decorators
        if (trimmed.startsWith("|")) {
          // If this is a separator line, skip it
          if (trimmed.includes("---")) {
            return null;
          }
          
          // If the next line is a separator line, this line is a table header - skip it!
          const nextLine = lines[idx + 1] ? lines[idx + 1].trim() : "";
          if (nextLine.startsWith("|") && nextLine.includes("---")) {
            return null;
          }
        }

        // Parse key-value table lines: | ID | 90001 | or similar
        if (trimmed.startsWith("|")) {
          const parts = trimmed.split("|").map(p => p.trim()).filter(Boolean);
          if (parts.length >= 2) {
            return (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0 text-[10px] bg-white px-2 rounded">
                <span className="text-gray-400 font-bold uppercase tracking-wider">{parts[0]}</span>
                <span className="text-gray-900 font-black">{parts[1]}</span>
              </div>
            );
          }
          return null;
        }

        // Parse headings ###
        if (trimmed.startsWith("### ")) {
          const content = trimmed.replace("### ", "");
          return (
            <h3 key={idx} className="text-xs font-black text-gray-900 mt-3 first:mt-0 pb-0.5 border-b border-gray-200">
              {parseInlineMarkdown(content)}
            </h3>
          );
        }

        // Parse headings ####
        if (trimmed.startsWith("#### ")) {
          const content = trimmed.replace("#### ", "");
          return (
            <h4 key={idx} className="text-[10px] font-black uppercase tracking-wider text-indigo-600 mt-2">
              {parseInlineMarkdown(content)}
            </h4>
          );
        }

        // Parse bullet list items
        if (trimmed.startsWith("- ")) {
          const content = trimmed.replace("- ", "");
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
              <span className="h-1 w-1 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <p className="text-xs text-gray-600 mb-0 leading-normal">
                {parseInlineMarkdown(content)}
              </p>
            </div>
          );
        }

        // Carriage space
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Standard text paragraph
        return (
          <p key={idx} className="text-xs text-gray-600 mb-0 leading-normal">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

const StatCard = ({
  title,
  value,
  subValue,
  subLabel,
  icon: Icon,
  trend,
  trendUp,
  isDark,
  loading,
}) => (
  <div
    className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 ${
      isDark
        ? "bg-[#0A0A0B] text-white border border-gray-800 shadow-xl shadow-black/20"
        : "bg-white text-gray-900 border border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"
    }`}
  >
    {isDark && (
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
    )}

    <div className="flex justify-between items-center mb-6">
      <div
        className={`flex items-center gap-2.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        <Icon size={18} strokeWidth={2} />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {title}
        </span>
      </div>
      {!loading && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold tracking-wide ${
            isDark
              ? "bg-gray-800/50 text-gray-300 border border-gray-700/50"
              : trendUp
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
          }`}
        >
          {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend}
        </div>
      )}
    </div>

    <div className="flex items-baseline gap-1 mt-auto">
      {title.includes("Revenue") && (
        <span
          className={`text-xl font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          ₹
        </span>
      )}
      <p className="text-3xl font-bold tracking-tight">
        {loading ? "..." : (value?.toLocaleString() ?? "0")}
      </p>
    </div>

    {!loading && subValue !== undefined && (
      <div
        className={`mt-4 pt-4 border-t ${isDark ? "border-white/5" : "border-gray-50"} flex items-center justify-between`}
      >
        <span
          className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          {subLabel || "Actual Collection"}
        </span>
        <span
          className={`text-xs font-bold tracking-tight ${isDark ? "text-emerald-400" : subLabel?.includes("Redeem") ? "text-rose-500" : "text-emerald-600"}`}
        >
          {subLabel?.includes("Collection") ||
          subLabel?.includes("Value") ||
          subLabel?.includes("Revenue")
            ? "₹"
            : ""}
          {subValue?.toLocaleString() ?? "0"}
        </span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const [recentRedemptions, setRecentRedemptions] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [purchasePage, setPurchasePage] = useState(1);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [redemptionPage, setRedemptionPage] = useState(1);
  const [redemptionTotal, setRedemptionTotal] = useState(0);
  const [isRedemptionsCollapsed, setIsRedemptionsCollapsed] = useState(false);
  const [isPurchasesCollapsed, setIsPurchasesCollapsed] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [purLoading, setPurLoading] = useState(false);
  const [redLoading, setRedLoading] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState("today");
  const [lastSynced, setLastSynced] = useState(new Date());

  const [activeRightTab, setActiveRightTab] = useState("quick_actions");
  
  // Store all chat sessions
  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem("pointnest_chat_sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(session => ({
            ...session,
            messages: session.messages.map(msg => ({
              ...msg,
              time: msg.time ? new Date(msg.time) : new Date()
            }))
          }));
        }
      } catch (e) {
        console.error("Failed to parse chat sessions", e);
      }
    }
    // Default initial session
    const initialSessionId = "session_" + Date.now();
    return [
      {
        id: initialSessionId,
        title: "New Conversation",
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: 1,
            sender: "ai",
            text: "Hello! I am your PointNest AI Assistant. How can I help you manage your customers, rewards, or point strategies today?",
            time: new Date(),
          }
        ]
      }
    ];
  });

  // Current active session ID
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const savedActive = localStorage.getItem("pointnest_active_session_id");
    if (savedActive) return savedActive;
    return chatSessions[0]?.id || ("session_" + Date.now());
  });

  // View toggle: true = shows list of saved histories, false = active chat bubble view
  const [showHistoryList, setShowHistoryList] = useState(false);

  // Derived active session and message list
  const activeSession = chatSessions.find(s => s.id === currentSessionId) || chatSessions[0];
  const chatMessages = activeSession ? activeSession.messages : [];

  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Sync session changes with localStorage
  const updateCurrentSessionMessages = (newMessages) => {
    setChatSessions(prev => {
      const updated = prev.map(s => {
        if (s.id === currentSessionId) {
          // Auto-name session based on the first user query
          let title = s.title;
          if (s.title === "New Conversation") {
            const firstUserQuery = newMessages.find(m => m.sender === "user")?.text;
            if (firstUserQuery) {
              title = firstUserQuery.length > 22 ? firstUserQuery.substring(0, 22) + "..." : firstUserQuery;
            }
          }
          return {
            ...s,
            title,
            messages: newMessages,
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
      localStorage.setItem("pointnest_chat_sessions", JSON.stringify(updated));
      return updated;
    });
  };

  const handleNewChat = () => {
    const newId = "session_" + Date.now();
    const newSession = {
      id: newId,
      title: "New Conversation",
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: Date.now(),
          sender: "ai",
          text: "Hello! I am your PointNest AI Assistant. How can I help you manage your customers, rewards, or point strategies today?",
          time: new Date(),
        }
      ]
    };
    
    setChatSessions(prev => {
      const updated = [newSession, ...prev];
      localStorage.setItem("pointnest_chat_sessions", JSON.stringify(updated));
      return updated;
    });
    setCurrentSessionId(newId);
    localStorage.setItem("pointnest_active_session_id", newId);
    setShowHistoryList(false);
  };

  const handleDeleteSession = (sessionId, e) => {
    if (e) e.stopPropagation();
    
    setChatSessions(prev => {
      let updated = prev.filter(s => s.id !== sessionId);
      
      // If we deleted all sessions, recreate a fresh initial session
      if (updated.length === 0) {
        const freshId = "session_" + Date.now();
        updated = [
          {
            id: freshId,
            title: "New Conversation",
            updatedAt: new Date().toISOString(),
            messages: [
              {
                id: Date.now(),
                sender: "ai",
                text: "Hello! I am your PointNest AI Assistant. How can I help you manage your customers, rewards, or point strategies today?",
                time: new Date(),
              }
            ]
          }
        ];
      }
      
      localStorage.setItem("pointnest_chat_sessions", JSON.stringify(updated));
      
      // If we deleted the active session, switch to the first remaining session
      if (currentSessionId === sessionId) {
        const nextActiveId = updated[0].id;
        setCurrentSessionId(nextActiveId);
        localStorage.setItem("pointnest_active_session_id", nextActiveId);
      }
      
      return updated;
    });
  };

  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    localStorage.setItem("pointnest_active_session_id", sessionId);
    setShowHistoryList(false);
  };

  const handleClearChat = (e) => {
    if (e) e.stopPropagation();
    const initial = [
      {
        id: Date.now(),
        sender: "ai",
        text: "Hello! I am your PointNest AI Assistant. How can I help you manage your customers, rewards, or point strategies today?",
        time: new Date(),
      },
    ];
    updateCurrentSessionMessages(initial);
  };

  const chatContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleChatScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 30;
    setShowScrollButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (activeRightTab === "ai_chat") {
      setTimeout(scrollToBottom, 50);
    }
  }, [chatMessages, activeRightTab]);

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const queryText = chatInput.trim();
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: queryText,
      time: new Date(),
    };

    const newMessages = [...chatMessages, userMessage];
    updateCurrentSessionMessages(newMessages);
    setChatInput("");
    setIsAiTyping(true);

    try {
      // Map active state chat messages into context history payload
      const historyPayload = chatMessages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      // Dispatch API request to secure backend co-pilot endpoint with full memory
      const response = await apiClient.post(urls.ai_chat, { 
        query: queryText,
        history: historyPayload
      });
      
      if (response.success && response.data) {
        const aiRes = response.data;
        
        // Auto-detect if DB results represent a single customer or multiple customers
        let customerCardObj = null;
        let customerListObj = null;
        let suggestAddPhone = null;

        if (aiRes.intent === "SQL_QUERY" && Array.isArray(aiRes.data)) {
          const rows = aiRes.data;
          
          // Verify if keys belong to customers schema
          const isCustomerSchema = rows.length > 0 && 
            'phone' in rows[0] && 
            'name' in rows[0];

          if (isCustomerSchema) {
            if (rows.length === 1) {
              customerCardObj = {
                name: rows[0].name,
                phone: rows[0].phone,
                points: rows[0].points || 0
              };
            } else if (rows.length > 1) {
              customerListObj = rows.map(r => ({
                id: r.id,
                name: r.name,
                phone: r.phone,
                points: r.points || 0
              }));
            }
          }
        } else if (aiRes.intent === "OFFLINE") {
          // If offline and query matches a 10-digit number, suggest registering
          const phoneMatch = queryText.match(/\b\d{10}\b/);
          if (phoneMatch) {
            suggestAddPhone = phoneMatch[0];
          }
        }

        const aiMessage = {
          id: Date.now() + 1,
          sender: "ai",
          text: aiRes.text,
          time: new Date(),
          customerCard: customerCardObj,
          customerList: customerListObj,
          suggestAddCustomer: suggestAddPhone
        };
        updateCurrentSessionMessages([...newMessages, aiMessage]);
      } else {
        throw new Error("Failed response payload from AI engine.");
      }
    } catch (error) {
      console.error("AI Chatbot co-pilot API error:", error);
      
      // Fallback local helper when database/key is missing
      const currentInput = queryText.toLowerCase();
      let aiText = "I'm processing that request. Try typing a phone number (e.g. 9022642659) or search query (e.g. 'find Rahul') to look up customer profiles!";

      if (currentInput.includes("hello") || currentInput.includes("hi")) {
        aiText = "Hello! How can I assist you with your loyalty program or purchases today?";
      } else if (currentInput.includes("purchase") || currentInput.includes("sale") || currentInput.includes("record")) {
        aiText = "To record a purchase and reward points to a customer, click the 'Record Purchase' action in the Quick Actions tab!";
      } else if (currentInput.includes("customer") || currentInput.includes("member")) {
        aiText = "You can add new loyalty members using the 'Add Customer' button or manage all profiles under the dedicated Customers navigation panel.";
      } else if (currentInput.includes("point") || currentInput.includes("earn") || currentInput.includes("ratio")) {
        aiText = "By default, customer purchases earn 1 reward point for every ₹10 spent. You can view points balances and history directly in any customer's detail view.";
      } else if (currentInput.includes("coupon") || currentInput.includes("discount") || currentInput.includes("promo")) {
        aiText = "PointNest supports stackable and percentage/fixed coupon discount strategies. Go to your Coupons dashboard to create and configure new ones!";
      }

      const fallbackMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: aiText,
        time: new Date(),
      };
      updateCurrentSessionMessages([...newMessages, fallbackMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const fetchAllDashboardData = async (filter) => {
    setMetricsLoading(true);
    setPurLoading(true);
    setRedLoading(true);
    try {
      // All three fetches are fired in parallel
      const [_, purRes, redRes] = await Promise.all([
        refreshProfile(filter),
        purchasesApi.getPurchases({ page: 1, size: 5, date_filter: filter }),
        redemptionsApi.getRedemptions({
          page: 1,
          size: 10,
          date_filter: filter,
        }),
      ]);

      if (purRes.success) {
        setRecentPurchases(purRes.data.items || []);
        setPurchaseTotal(purRes.data.total || 0);
        setPurchasePage(purRes.data.page);
      }
      if (redRes.success) {
        setRecentRedemptions(redRes.data.items || []);
        setRedemptionTotal(redRes.data.total || 0);
        setRedemptionPage(redRes.data.page);
      }
      setLastSynced(new Date());
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setMetricsLoading(false);
      setPurLoading(false);
      setRedLoading(false);
    }
  };

  const fetchRecentRedemptions = async (page) => {
    setRedLoading(true);
    try {
      const redRes = await redemptionsApi.getRedemptions({
        page,
        size: 10,
        date_filter: selectedDateFilter,
      });
      if (redRes.success) {
        setRecentRedemptions(redRes.data.items || []);
        setRedemptionTotal(redRes.data.total || 0);
        setRedemptionPage(redRes.data.page);
      }
    } catch (error) {
      toast.error("Failed to load redemptions");
    } finally {
      setRedLoading(false);
    }
  };

  const fetchRecentPurchases = async (page) => {
    setPurLoading(true);
    try {
      const purRes = await purchasesApi.getPurchases({
        page,
        size: 5,
        date_filter: selectedDateFilter,
      });
      if (purRes.success) {
        setRecentPurchases(purRes.data.items || []);
        setPurchaseTotal(purRes.data.total || 0);
        setPurchasePage(purRes.data.page);
      }
    } catch (error) {
      toast.error("Failed to load purchases");
    } finally {
      setPurLoading(false);
    }
  };

  // Re-fetch everything when the date filter changes (defaults to today on mount)
  useEffect(() => {
    fetchAllDashboardData(selectedDateFilter);

    // Setup 60s polling for "Live" mode
    const pollInterval = setInterval(() => {
      fetchAllDashboardData(selectedDateFilter);
    }, 60000);

    return () => clearInterval(pollInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateFilter]);

  const analytics = () => {
    toast.custom((t) => (
      <div
        className={`${t.visible ? "animate-in fade-in zoom-in" : "animate-out fade-out zoom-out"} pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-[1.5rem] bg-white shadow-2xl ring-1 ring-black/5 backdrop-blur-md border border-gray-100/50`}
        style={{ animationDuration: "300ms" }}
      >
        <div className="flex w-0 flex-1 p-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/30">
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                  Upgrade Workspace
                </p>
                <p className="mt-1 text-xs text-gray-500 font-medium leading-relaxed">
                  Discover hidden purchasing patterns and forecast customer
                  behavior with our new advanced analytics suite. Treat your
                  data as your greatest asset.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex p-2 pr-4 items-start pt-4">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-90"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen text-gray-900 p-4 md:p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Dashboard Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Showing data for:{" "}
            <span className="font-black text-gray-900">
              {selectedDateFilter === "today"
                ? "Today"
                : selectedDateFilter === "yesterday"
                  ? "Yesterday"
                  : selectedDateFilter === "7days"
                    ? "Last 7 Days"
                    : selectedDateFilter === "30days"
                      ? "Last 30 Days"
                      : "All Time"}
            </span>
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
              <Activity size={12} className="text-gray-300" />
              <span>
                Last Synced:{" "}
                {lastSynced.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="appearance-none px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-[11px] font-black uppercase tracking-widest shadow-sm hover:border-gray-300 focus:border-gray-900 outline-none transition-all cursor-pointer pr-10"
            >
              <option value="all">Protocol: All Time</option>
              <option value="today">Protocol: Today</option>
              <option value="yesterday">Protocol: Yesterday</option>
              <option value="7days">Protocol: Last 7 Days</option>
              <option value="30days">Protocol: Last 30 Days</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={14} />
            </div>
          </div>

          <button className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all shadow-sm group">
            <ArrowDownToLine
              size={16}
              className="group-hover:translate-y-0.5 transition-transform"
            />
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={user?.metrics?.total_customers}
          subValue={user?.metrics?.new_customers}
          subLabel="Registrations"
          icon={Users}
          trend="+12.5%"
          trendUp={true}
          loading={metricsLoading}
        />
        <StatCard
          title="Transactions"
          value={user?.metrics?.total_purchases}
          subValue={user?.metrics?.avg_order_value}
          subLabel="Avg Order Value"
          icon={ShoppingCart}
          trend="+8.2%"
          trendUp={true}
          loading={metricsLoading}
        />
        <StatCard
          title="Points Issued"
          value={user?.metrics?.total_points_issued}
          subValue={user?.metrics?.total_points_redeemed}
          subLabel="Points Redeemed"
          icon={Award}
          trend="Steady"
          trendUp={true}
          loading={metricsLoading}
        />
        <StatCard
          title="Total Revenue"
          value={user?.metrics?.total_revenue}
          subValue={user?.metrics?.total_net_revenue}
          subLabel="Actual Collection"
          icon={Wallet}
          trend="Record High"
          trendUp={true}
          isDark={true}
          loading={metricsLoading}
        />
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchases (Ledger) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-gray-900">
                Recent Ledger
              </h3>
              <button
                onClick={() => setIsPurchasesCollapsed(!isPurchasesCollapsed)}
                className="p-1 rounded-md hover:bg-gray-50 text-gray-400 transition-colors"
              >
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${isPurchasesCollapsed ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            <Link
              to="/purchases"
              className="text-gray-500 hover:text-gray-900 text-xs font-bold transition-colors flex items-center gap-1 uppercase tracking-widest"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {!isPurchasesCollapsed && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 px-2 font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                      Customer
                    </th>
                    <th className="pb-3 px-2 font-bold text-[10px] text-gray-400 uppercase tracking-widest text-right">
                      Net Amount
                    </th>
                    <th className="pb-3 px-2 font-bold text-[10px] text-gray-400 uppercase tracking-widest text-right">
                      Points
                    </th>
                    <th className="pb-3 px-2 font-bold text-[10px] text-gray-400 uppercase tracking-widest text-right hidden sm:table-cell">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {purLoading ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-10 text-center text-gray-400 text-sm italic"
                      >
                        Updating ledger...
                      </td>
                    </tr>
                  ) : recentPurchases.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-10 text-center text-gray-400 text-sm italic"
                      >
                        No recent transactions.
                      </td>
                    </tr>
                  ) : (
                    recentPurchases.map((purchase) => (
                      <tr
                        key={purchase.id}
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-900 border border-gray-100">
                              {purchase.customer_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-gray-900">
                                {purchase.customer_name}
                              </p>
                              <p className="text-[10px] text-gray-500 font-medium">
                                {purchase.customer_phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <p className="font-bold text-sm text-gray-900">
                            ₹
                            {(
                              purchase.payable_amount || purchase.amount
                            )?.toLocaleString()}
                          </p>
                          {(purchase.coupon_discount || 0) +
                            (purchase.points_discount || 0) >
                            0 && (
                            <p className="text-[10px] text-rose-500 font-bold tracking-tighter mt-0.5 leading-none">
                              -₹
                              {(
                                (purchase.coupon_discount || 0) +
                                (purchase.points_discount || 0)
                              ).toLocaleString()}
                            </p>
                          )}
                          {purchase.coupon_code && (
                            <div className="flex items-center justify-end gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-0.5 leading-none">
                              <Ticket size={11} className="shrink-0" />
                              {purchase.coupon_code}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className="inline-flex items-center text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-100/50">
                            +{purchase.points_earned}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right hidden sm:table-cell">
                          <p className="text-xs font-bold text-gray-600">
                            {formatDate(purchase.created_at)}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {formatTime(purchase.created_at)}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {purchaseTotal > 5 && !purLoading && (
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Page {purchasePage}
                  </span>
                  <div className="flex gap-1">
                    <button
                      disabled={purchasePage === 1}
                      onClick={() => fetchRecentPurchases(purchasePage - 1)}
                      className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ArrowRight size={14} className="rotate-180" />
                    </button>
                    <button
                      disabled={
                        recentPurchases.length < 5 ||
                        purchasePage * 5 >= purchaseTotal
                      }
                      onClick={() => fetchRecentPurchases(purchasePage + 1)}
                      className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex flex-col">
          {/* Action / Chat Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 p-2 bg-gray-50/50">
              <button
                onClick={() => setActiveRightTab("quick_actions")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                  activeRightTab === "quick_actions"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Plus size={14} /> Quick Actions
              </button>
              <button
                onClick={() => setActiveRightTab("ai_chat")}
                className={`flex-1 flex items-center justify-center py-2 px-3 text-xs font-bold rounded-xl transition-all relative ${
                  activeRightTab === "ai_chat"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={14}
                    className={
                      activeRightTab === "ai_chat"
                        ? "text-amber-500 animate-pulse"
                        : ""
                    }
                  />{" "}
                  <span>AI Chat</span>
                </div>
                
                {activeRightTab === "ai_chat" && chatMessages.length > 1 && (
                  <button
                    onClick={handleClearChat}
                    title="Clear Chat History"
                    className="absolute right-2 p-1 text-gray-400 hover:text-red-500 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              {activeRightTab === "quick_actions" ? (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Link
                    to="/purchase"
                    className="w-full flex items-center justify-center gap-2 p-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-bold"
                  >
                    <Plus size={16} /> Record Purchase
                  </Link>
                  <Link
                    to="/customers"
                    className="w-full flex items-center justify-center gap-2 p-2.5 bg-white border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold"
                  >
                    <UserPlus size={16} /> Add Customer
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col h-[280px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Custom thin scrollbar styling block */}
                  <style>{`
                    .custom-chat-scrollbar::-webkit-scrollbar {
                      width: 4px;
                    }
                    .custom-chat-scrollbar::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .custom-chat-scrollbar::-webkit-scrollbar-thumb {
                      background: #e4e4e7;
                      border-radius: 9999px;
                    }
                    .custom-chat-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: #d4d4d8;
                    }
                    .custom-chat-scrollbar {
                      scrollbar-width: thin;
                      scrollbar-color: #e4e4e7 transparent;
                    }
                  `}</style>

                  {/* Co-pilot compact control bar */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2 text-[10px]">
                    <div className="flex items-center gap-1 font-black text-gray-700 uppercase tracking-wide min-w-0">
                      <Sparkles size={11} className="text-amber-500 shrink-0" />
                      <span className="truncate max-w-[100px]">{showHistoryList ? "Conversations" : activeSession?.title || "AI Assistant"}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={handleNewChat}
                        title="Start New Chat"
                        className="flex items-center gap-1 py-1 px-1.5 font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded text-[9px] border border-indigo-100 transition-colors"
                      >
                        <Plus size={9} /> New Chat
                      </button>
                      <button
                        onClick={() => setShowHistoryList(!showHistoryList)}
                        title="Chat History"
                        className={`flex items-center gap-1 py-1 px-1.5 font-bold rounded text-[9px] border transition-all duration-200 ${
                          showHistoryList 
                            ? "bg-gray-900 border-gray-950 text-white" 
                            : "text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <Activity size={9} /> {showHistoryList ? "Back to Chat" : `History (${chatSessions.length})`}
                      </button>
                    </div>
                  </div>

                  <div className="relative flex-1 flex flex-col min-h-0 mb-4">
                    {showHistoryList ? (
                      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-chat-scrollbar">
                        {chatSessions.map((session) => (
                          <div
                            key={session.id}
                            onClick={() => handleSelectSession(session.id)}
                            className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer text-left ${
                              session.id === currentSessionId
                                ? "bg-indigo-50/50 border-indigo-100 text-indigo-900"
                                : "bg-white hover:bg-gray-50 border-gray-100 text-gray-700"
                            }`}
                          >
                            <div className="flex flex-col min-w-0 flex-1 pr-1.5">
                              <span className="text-[10px] font-bold truncate leading-tight">
                                {session.title}
                              </span>
                              <span className="text-[8px] text-gray-400 font-medium mt-0.5 leading-none">
                                {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            
                            <button
                              onClick={(e) => handleDeleteSession(session.id, e)}
                              title="Delete Session"
                              className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100 shrink-0 transition-colors"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        ref={chatContainerRef}
                        onScroll={handleChatScroll}
                        className="flex-1 overflow-y-auto space-y-3 pr-1 custom-chat-scrollbar"
                      >
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col animate-in fade-in slide-in-from-bottom-1 duration-200 ${
                              msg.sender === "user" ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed transition-all duration-300 ${
                                msg.sender === "user"
                                  ? "bg-gray-900 text-white rounded-tr-none"
                                  : "bg-gray-100 text-gray-800 rounded-tl-none w-full"
                              }`}
                            >
                              {msg.sender === "user" ? (
                                msg.text
                              ) : (
                                <FormattedMarkdownText text={msg.text} />
                              )}

                              {/* Card rendering blocks */}
                              {msg.customerCard && (
                                <div className="mt-3 p-3 bg-white text-gray-900 rounded-xl border border-gray-150 shadow-sm text-left animate-in slide-in-from-top-1 duration-200">
                                  <div className="flex items-center gap-2 mb-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-gray-950 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                      {msg.customerCard.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-[11px] font-black text-gray-900 truncate leading-none mb-0.5">
                                        {msg.customerCard.name}
                                      </h4>
                                      <p className="text-[9px] text-gray-400 font-bold">
                                        {msg.customerCard.phone}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 mb-2">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Ledger Balance</span>
                                    <span className="text-[10px] font-black text-indigo-600">{msg.customerCard.points} PTS</span>
                                  </div>
                                  <Link
                                    to={`/purchase?phone=${msg.customerCard.phone}`}
                                    className="w-full flex items-center justify-center gap-1 py-1.5 bg-gray-950 hover:bg-gray-800 text-white text-[9px] font-black uppercase tracking-wider rounded-md transition-all active:scale-95"
                                  >
                                    <Plus size={10} /> Record Purchase
                                  </Link>
                                </div>
                              )}

                              {msg.customerList && (
                                <div className="mt-3 space-y-1.5 text-left w-full animate-in slide-in-from-top-1 duration-200">
                                  {msg.customerList.map((cust) => (
                                    <div key={cust.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-150 shadow-sm hover:border-gray-200 transition-all">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <div className="h-6 w-6 rounded-md bg-gray-100 text-gray-700 flex items-center justify-center font-black text-[10px] shrink-0">
                                          {cust.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-[10px] font-black text-gray-900 truncate leading-none mb-0.5">{cust.name}</p>
                                          <p className="text-[8px] text-gray-400 font-medium">{cust.phone}</p>
                                        </div>
                                      </div>
                                      <Link
                                        to={`/purchase?phone=${cust.phone}`}
                                        className="flex items-center justify-center p-1 bg-gray-950 text-white rounded-md hover:bg-gray-800 transition-colors shrink-0"
                                        title="Record Purchase"
                                      >
                                        <Plus size={9} />
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {msg.suggestAddCustomer && (
                                <div className="mt-3 p-2.5 bg-rose-50 text-rose-900 rounded-xl border border-rose-100 text-left animate-in slide-in-from-top-1 duration-200">
                                  <p className="text-[9px] text-rose-800 font-bold leading-normal mb-2">
                                    Enroll phone number "{msg.suggestAddCustomer}" to reward points.
                                  </p>
                                  <Link
                                    to="/customers"
                                    className="w-full flex items-center justify-center gap-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black uppercase tracking-wider rounded-md transition-all active:scale-95"
                                  >
                                    <UserPlus size={10} /> Add Customer
                                  </Link>
                                </div>
                              )}
                            </div>
                            <span className="text-[9px] text-gray-400 mt-1 px-1">
                              {msg.sender === "user" ? "You" : "PointNest AI"} •{" "}
                              {msg.time.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ))}
                        {isAiTyping && (
                          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] pl-1 font-medium animate-pulse animate-in fade-in duration-200">
                            <Sparkles
                              size={10}
                              className="text-amber-500 animate-spin"
                            />
                            AI is thinking...
                          </div>
                        )}
                      </div>
                    )}

                    {!showHistoryList && showScrollButton && (
                      <button
                        onClick={scrollToBottom}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white text-gray-950 shadow-lg border border-gray-150 rounded-full w-7 h-7 hover:bg-gray-50 transition-all hover:scale-110 active:scale-95 flex items-center justify-center animate-in fade-in zoom-in-95 duration-200 z-20"
                      >
                        <ChevronDown
                          size={14}
                          className="text-gray-700 animate-bounce"
                        />
                      </button>
                    )}
                  </div>

                  {/* Chat Input */}
                  {!showHistoryList && (
                    <form onSubmit={handleSendChatMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask PointNest AI..."
                        className="flex-1 min-w-0 bg-gray-50 border border-gray-200 outline-none text-xs font-medium text-gray-800 rounded-lg py-2 px-3 focus:border-gray-900 focus:bg-white transition-all placeholder:text-gray-400"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim()}
                        className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:hover:bg-gray-900 flex items-center justify-center animate-in fade-in"
                      >
                        <ArrowRight size={14} />
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Redemptions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">
                Recent Redemptions
              </h3>
              <button
                onClick={() =>
                  setIsRedemptionsCollapsed(!isRedemptionsCollapsed)
                }
                className="text-gray-400 hover:text-gray-900"
              >
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${isRedemptionsCollapsed ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {!isRedemptionsCollapsed && (
              <div className="space-y-5">
                {redLoading ? (
                  <div className="text-center py-10 text-gray-400 text-xs italic">
                    Syncing activity...
                  </div>
                ) : recentRedemptions.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-xs italic">
                    No activity yet.
                  </div>
                ) : (
                  recentRedemptions.map((red) => (
                    <div
                      key={red.id}
                      className="flex items-start justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-gray-200 group-hover:bg-gray-900 transition-colors mt-1.5"></div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {red.customer_name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {formatDate(red.created_at)} ·{" "}
                            {formatTime(red.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-rose-600">
                          -{red.points_used}{" "}
                          <span className="text-[10px] text-gray-400 font-bold uppercase ml-0.5">
                            pts
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {redemptionTotal > 10 && !redLoading && (
                  <div className="pt-4 border-t border-gray-50 flex justify-end gap-2">
                    <button
                      disabled={redemptionPage === 1}
                      onClick={() => fetchRecentRedemptions(redemptionPage - 1)}
                      className="p-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ArrowRight size={12} className="rotate-180" />
                    </button>
                    <button
                      disabled={
                        recentRedemptions.length < 10 ||
                        redemptionPage * 10 >= redemptionTotal
                      }
                      onClick={() => fetchRecentRedemptions(redemptionPage + 1)}
                      className="p-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enterprise Analytics Banner */}
      <section className="">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0A0B] text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 border border-gray-800 shadow-2xl">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div className="flex-1 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
              <Sparkles size={14} className="text-gray-400" />
              PointNest Enterprise
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Advanced AI <br /> Market Insights
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md font-medium">
              Discover hidden purchasing patterns and forecast customer behavior
              with our new advanced analytics suite. Treat your data as your
              greatest asset.
            </p>
            <div className="pt-2">
              <button
                onClick={() => analytics()}
                className="bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg shadow-white/5 active:scale-95 cursor-not-allowed opacity-50"
              >
                Upgrade Workspace <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          <div className="w-full md:w-auto relative z-10 flex justify-center md:justify-end">
            <div className="w-[280px] h-[180px] rounded-2xl bg-gray-900/50 border border-gray-800 p-6 flex flex-col justify-end gap-3 relative overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/10 blur-[80px]"></div>

              <div className="flex items-end gap-3 h-full w-full relative z-10">
                <div className="w-full bg-gray-800 rounded-lg h-[30%] hover:bg-gray-700 transition-all"></div>
                <div className="w-full bg-gray-700 rounded-lg h-[55%] hover:bg-gray-600 transition-all"></div>
                <div className="w-full bg-white rounded-lg h-[85%] relative group shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    +85.2% INSIGHT
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-lg h-[40%] hover:bg-gray-700 transition-all"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
