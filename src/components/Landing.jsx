import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import translations from "./translations.json";

const socialChannels = [
  {
    name: "TikTok",
    icon: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
    url: "https://tiktok.com/@teamwork6312",
    imageUrl: "https://teamworksc.com/assets/partner2.png",
    actionText: { en: "Follow", am: "ተከተል" },
  },
  {
    name: "YouTube",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    url: "https://youtube.com/@teamworksc",
    imageUrl: "http://api.teamworksc.com/uploads/images/1765809946811-IMG_0086.JPG",
    actionText: { en: "Subscribe", am: "ይመዝገቡ" },
  },
  {
    name: "Facebook",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    url: "https://facebook.com/groups/540668018528410",
    imageUrl: "https://teamworksc.com/assets/teamwork2.jpg",
    actionText: { en: "Follow", am: "ተከተል" },
  },
  {
    name: "Telegram",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
    url: "https://t.me/teamwork_12",
    imageUrl: "https://teamworksc.com/assets/agent.png",
    actionText: { en: "Join", am: "ተቀላቀል" },
  },
  {
    name: "Main site",
    icon: "TW.jpg",
    url: "https://teamworksc.com",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
    actionText: { en: "Visit", am: "ይጎብኙ" },
  },
];

const EmailFlowPopup = ({ onClose, onNavigate }) => {
  const [step, setStep] = useState("login"); // steps: login, select_system, forgot_password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const LOGIN_API = "https://api.teamworksc.com/api/v1/users/exist";
  const FORGOT_PW_API = "https://api.teamworksc.com/api/v1/users/forgot-password";

  const systems = [
    { name: "City development System", url: "https://city.development.teamworksc.com/" },
    { name: "FMS", url: "https://tsc.teamworksw.com" },
    { name: "SCFMS", url: "https://tis.teamworksw.com" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(LOGIN_API, { email, password });
      if (res.data.success) setStep("select_system");
      else setMessage("Invalid email or password.");
    } catch (error) {
      setMessage("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(FORGOT_PW_API, { email });
      setResetSuccess(true);
      setMessage(`Reset OTP sent to ${email}. Check your email!`);
      // ከጥቂት ሰከንድ በኋላ ወደ login እንዲመለስ ማድረግ ይቻላል
    } catch (error) {
      setMessage(error.response?.data?.message || "User with this email does not exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050229]/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-400 text-2xl hover:text-slate-600 transition-colors"
        >
          &times;
        </button>
        
        {/* --- LOGIN STEP --- */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-5 pt-4">
            <h3 className="text-2xl font-extrabold text-center text-slate-900 tracking-tight">Welcome Back</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  placeholder="example@gmail.com"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Password</label>
                <input 
                  type="password"
                  placeholder="your password"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <button 
                type="button" 
                onClick={() => { setStep("forgot_password"); setMessage(""); }}
                className="text-blue-600 text-xs font-bold hover:text-blue-700 underline underline-offset-4 ml-1"
              >
                Forgot password?
              </button>
            </div>
            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all">
              {loading ? "Authenticating..." : "Sign In"}
            </button>
            {message && <p className="text-red-500 text-xs text-center font-bold bg-red-50 py-3 rounded-xl border border-red-100">{message}</p>}
          </form>
        )}

        {/* --- FORGOT PASSWORD STEP --- */}
        {step === "forgot_password" && (
          <form onSubmit={handleForgotPassword} className="space-y-5 pt-4">
            <h3 className="text-2xl font-extrabold text-center text-slate-900 tracking-tight">Reset Password</h3>
            <p className="text-slate-500 text-sm text-center">Enter your email to receive a reset link.</p>
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <button 
              disabled={loading || resetSuccess}
              className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all ${resetSuccess ? "bg-green-500" : "bg-orange-500 hover:bg-orange-600"}`}
            >
              {loading ? "Sending..." : resetSuccess ? "Email Sent!" : "Send Reset Link"}
            </button>
            {message && (
              <p className={`text-xs text-center font-bold py-3 rounded-xl border ${resetSuccess ? "text-green-600 bg-green-50 border-green-100" : "text-red-500 bg-red-50 border-red-100"}`}>
                {message}
              </p>
            )}
            <button 
              type="button"
              onClick={() => { setStep("login"); setMessage(""); setResetSuccess(false); }}
              className="w-full text-slate-500 text-sm font-bold hover:text-slate-700 transition-colors"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* --- SYSTEM SELECTION STEP --- */}
        {step === "select_system" && (
          <div className="space-y-4 pt-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Access Portal</h3>
              <p className="text-slate-500 text-sm font-medium">Select a system to continue</p>
            </div>
            <div className="space-y-3">
              {systems.map((sys) => (
                <button 
                  key={sys.name} 
                  onClick={() => onNavigate(sys.url)} 
                  className="w-full p-4 text-left bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl text-slate-700 font-bold transition-all group flex justify-between items-center"
                >
                  {sys.name} <span className="text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SocialCard = ({ channel, language }) => (
  <div className="group bg-white/10 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 shadow-xl">
    <div className="relative h-24 w-full bg-[#0d064d]">
      <img src={channel.imageUrl} alt={channel.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-[#0d064d]/60 backdrop-blur-md p-3 rounded-full border border-white/10 shadow-lg">
          <img src={channel.icon} alt={channel.name} className="w-6 h-6 object-contain" />
        </div>
      </div>
    </div>
    <div className="p-3 flex items-center justify-between gap-2 bg-[#110c4d]/50">
      <span className="text-[10px] sm:text-[11px] font-bold text-white/80 truncate">{channel.name}</span>
      <a
        href={channel.url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-lg transition-colors whitespace-nowrap"
      >
        {channel.actionText[language]}
      </a>
    </div>
  </div>
);

const LandingPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [language, setLanguage] = useState("am");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openLoginPopup) {
      setShowPopup(true);
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen bg-[#0d064d] text-white font-sans flex flex-col ">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0d064d]/80 backdrop-blur-xl border-b border-white/80">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
             <img src="TW.jpg" alt="Logo" className="h-10 w-10 rounded-xl ring-2 ring-white/10 group-hover:ring-blue-500 transition-all" />
             <span className="hidden sm:inline font-black tracking-tighter text-xl">TEAMWORK</span>
          </div>
          <select
            className="bg-white/5 text-xs font-black py-2.5 px-4 rounded-xl outline-none border border-white/10 text-[#ffff00] focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-white/10 transition-all uppercase"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en" className="bg-[#0d064d]">English</option>
            <option value="am" className="bg-[#0d064d]">አማርኛ</option>
          </select>
        </div>
      </nav>

      <main className="relative flex-grow max-w-6xl mx-auto px-6 py-10 w-full text-center">
        <header className="mb-16">
          <h1 className="text-2xl sm:text-2xl font-black text-[#ffff00] mb-6 drop-shadow-[0_2px_10px_rgba(255,255,0,0.2)]">
            {translations[language].companyName}
          </h1>
          <p className="text-blue-100/70 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            {translations[language].join}
          </p>
        </header>

        {/* Small & Professional Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-20">
          {socialChannels.map((channel) => (
            <SocialCard key={channel.name} channel={channel} language={language} />
          ))}
        </div>

        {/* Action Buttons: Clear distinction between Primary and Secondary */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-24">
          <button onClick={() => navigate("/signup")} className="w-full sm:w-60 py-4 px-8 bg-[#ffff00] border border-[white/10] text-[#0d064d] font-bold rounded-2xl  transition-all backdrop-blur-md active:scale-95 shadow-lg">
            {translations[language].signup}
          </button>
          <button onClick={() => setShowPopup(true)} className="w-full sm:w-60 py-4 px-8 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-[0_10px_25px_rgba(37,99,235,0.3)] active:scale-95">
            {translations[language].signin}
          </button>
        </div>

        {/* Branding Footer Section */}
        <div className="space-y-6 pt-16 border-t border-white/5">
          <span className="inline-block px-5 py-2 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-blue-500/20">
            {translations[language].motivation}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {translations[language].slogan}
          </h2>
        </div>
      </main>

      {/* Professional Dark Footer */}
      <footer className="bg-black/40 border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-5">
            <h4 className="text-white font-black text-xl tracking-tight">Teamwork IT Solution</h4>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed font-medium">
              Leading the digital transformation in Ethiopia with innovative software, high-end infrastructure, and digital excellence.
            </p>
          </div>
          <div className="md:text-right space-y-4">
            <h4 className="text-white font-black text-xl tracking-tight">Contact Us</h4>
            <div className="text-white/50 text-sm space-y-2 font-medium">
              <p>Addis Ababa, Ethiopia</p>
              <p className="text-blue-500 font-bold text-base hover:text-blue-400 transition-colors">0923227081</p>
              <p className="text-blue-500 font-bold text-base hover:text-blue-400 transition-colors">teamworkitsolution3126@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
            © 2026 Teamwork IT Solution. All rights reserved.
          </p>
        </div>
      </footer>

      {showPopup && (
        <EmailFlowPopup
          onClose={() => setShowPopup(false)}
          onNavigate={(url) => (window.location.href = url)}
        />
      )}
    </div>
  );
};

export default LandingPage;