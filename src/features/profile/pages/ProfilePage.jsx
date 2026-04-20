import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ArrowLeft,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BadgeCheck,
  Building2,
  Fingerprint,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";
import useAuthStore from "../../../store/authStore";

/**
 * Merchant Identity Terminal (Administrative Profile)
 * A standalone hub for comprehensive merchant metadata.
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState(null);
  const [avatarPreview, setAvatarPreview] = React.useState(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
      if (user.avatar) setAvatarPreview(user.avatar);
    }
  }, [user]);

  if (!user || !editedUser) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProtocol = async () => {
    // Placeholder for API authorization
    toast.success("Identity Registry Updated Successfully");
    setIsEditing(false);
  };

  const profileSections = [
    {
      title: "Profile Protocol",
      icon: <User size={20} />,
      fields: [
        { label: "Master Administrator", value: editedUser.owner_name, icon: <User size={14} /> },
        { label: "Authorized Shop Name", value: editedUser.shop_name, icon: <Building2 size={14} /> },
        { label: "Access Email", value: editedUser.email, icon: <Mail size={14} /> },
        { label: "Terminal Phone", value: editedUser.phone, icon: <Phone size={14} /> }
      ]
    },
    {
      title: "Enterprise Registry",
      icon: <Fingerprint size={20} />,
      fields: [
        { 
          label: "Merchant Hub ID", 
          value: editedUser.id, 
          static: true, 
          icon: <Fingerprint size={14} /> 
        },
        { 
          label: "Authorization Date", 
          value: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Registry Initializing...", 
          static: true, 
          icon: <Calendar size={14} /> 
        },
        { 
          label: "Subscription Tier", 
          value: user.subscription_tier || "Enterprise Authorized", 
          static: true, 
          icon: <ShieldCheck size={14} /> 
        }
      ]
    },
    {
      title: "General Intelligence",
      icon: <MapPin size={20} />,
      fields: [
        { 
          label: "Registered Office Address", 
          value: editedUser.address || "Contact Administrator for Location Updates", 
          icon: <MapPin size={14} /> 
        }
      ]
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto min-h-screen font-sans antialiased text-gray-900 animate-in fade-in duration-700 pb-32">
      
      {/* Navigation & Header Portal */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
          <BadgeCheck size={12} />
          Terminal Verified
        </div>
      </div>

      {/* Compact Identity Hero */}
      <div className="flex flex-col items-center text-center mb-16 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-400/5 blur-[80px] rounded-full" />
         
         <div 
            onClick={() => isEditing && fileInputRef.current?.click()}
            className={`relative group/avatar w-32 h-32 rounded-[2.5rem] bg-white text-[#0A0A0B] flex items-center justify-center text-5xl font-black shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] mb-8 border-4 border-white overflow-hidden ${isEditing ? 'cursor-pointer hover:scale-105 ring-2 ring-gray-900/5' : ''} transition-all z-10`}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{editedUser.owner_name?.charAt(0).toUpperCase() || "A"}</span>
            )}
            
            {isEditing && (
              <div className="absolute inset-0 bg-[#0A0A0B]/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                <TrendingUp size={20} className="text-white mb-1" />
                <span className="text-[8px] font-black uppercase text-white tracking-widest">Update</span>
              </div>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight uppercase italic mb-2 text-gray-900">{editedUser.owner_name}</h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{editedUser.shop_name}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
          </div>
      </div>

      <div className="space-y-8">
        {profileSections.map((section, idx) => (
          <div key={idx} className="animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-center gap-3 mb-6 px-4">
               <div className="w-10 h-10 rounded-xl bg-[#0A0A0B] flex items-center justify-center text-white shadow-lg">
                 {section.icon}
               </div>
               <div>
                 <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">{section.title}</h3>
                 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Authorized Corridor</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field, fIdx) => (
                <div key={fIdx} className="group relative">
                   <div className={`relative z-10 bg-white rounded-3xl border p-6 transition-all duration-500 ${
                     isEditing && !field.static 
                     ? "border-gray-900 shadow-xl shadow-gray-100 -translate-y-1" 
                     : "border-gray-100 shadow-sm hover:shadow-md"
                   }`}>
                      <label className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 flex items-center justify-between">
                         {field.label}
                         {field.static && <span className="text-[7px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full lowerCase border border-gray-100">static storage</span>}
                      </label>
                      
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isEditing && !field.static ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-400'}`}>
                          {React.cloneElement(field.icon, { size: 18 })}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          {isEditing && !field.static ? (
                            <input
                              type="text"
                              value={field.value}
                              onChange={(e) => {
                                if (field.label.includes("Shop")) setEditedUser({...editedUser, shop_name: e.target.value});
                                if (field.label.includes("Owner") || field.label.includes("Administrator")) setEditedUser({...editedUser, owner_name: e.target.value});
                                if (field.label.includes("Email")) setEditedUser({...editedUser, email: e.target.value});
                                if (field.label.includes("Phone")) setEditedUser({...editedUser, phone: e.target.value});
                                if (field.label.includes("Office")) setEditedUser({...editedUser, address: e.target.value});
                              }}
                              className="w-full bg-transparent border-none outline-none text-base font-black text-gray-900 placeholder-gray-300"
                            />
                          ) : (
                            <p className="text-base font-black text-gray-900 truncate tracking-tight">
                              {field.value || "---"}
                            </p>
                          )}
                        </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Identity Command Hub (Action Bar) */}
      <div className="mt-16 flex flex-col items-center gap-6 animate-in slide-in-from-bottom-8 duration-700">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-4 px-12 py-6 bg-[#0A0A0B] text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-gray-300 hover:shadow-gray-400 hover:-translate-y-1 transition-all active:scale-95"
          >
            <ShieldCheck
              size={18}
              className="group-hover:rotate-12 transition-transform"
            />
            Modify Identity Protocol
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-6 bg-gray-50 text-gray-400 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] border border-gray-100 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
            >
              Cancel Authorization
            </button>
            <button
              onClick={handleUpdateProtocol}
              className="flex-1 py-6 bg-emerald-500 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <BadgeCheck size={18} />
              Authorize Changes
            </button>
          </div>
        )}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center max-w-xs leading-relaxed">
          {isEditing
            ? "Authorizing changes will immediately update your global identity registry."
            : "Review your administrative protocols above. Last synchronized: 2 minutes ago."}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
