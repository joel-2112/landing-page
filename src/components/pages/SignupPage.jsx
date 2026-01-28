import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// 1. Reusable Sign-In Popup Component
const EmailFlowPopup = ({ onClose }) => {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const LOGIN_API = "https://api.teamworksc.com/api/v1/users/exist";
  const systems = [
    { name: "City development System", url: "https://city.development.teamworksc.com/" },
    { name: "FMS", url: "https://tsc.teamworksw.com" },
    { name: "SCFMS", url: "https://tis.teamworksw.com" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        
        {step === "login" ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800">Welcome Back</h3>
              <p className="text-slate-500 text-sm">Sign in to your account</p>
            </div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-200" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </button>
            {message && <p className="text-red-500 text-center text-sm">{message}</p>}
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800">Access Systems</h3>
              <p className="text-slate-500 text-sm">Choose the platform you wish to enter</p>
            </div>
            <div className="grid gap-3">
              {systems.map((sys) => (
                <button key={sys.name} onClick={() => (window.location.href = sys.url)} className="w-full p-4 text-left font-medium border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 rounded-2xl transition-all group flex justify-between items-center">
                  {sys.name}
                  <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Main Signup Page
const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [showSignIn, setShowSignIn] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const SEND_OTP_API = "https://api.teamworksc.com/api/v1/auth/send-otp";
  const VERIFY_OTP_API = "https://api.teamworksc.com/api/v1/auth/verify-otp";

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) { setCanResend(true); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const formatTime = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phoneNumber: formData.phone.replace(/^\+/, ""),
      password: formData.password,
    };
    try {
      const res = await axios.post(SEND_OTP_API, payload);
      if (res.data.success) setStep("otp");
      else setMessage(res.data.message || "Error occurred");
    } catch (err) { setMessage("Network error"); }
    finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(VERIFY_OTP_API, { email: formData.email, otp: otp.trim() });
      if (res.data.success) navigate("/", { state: { openLoginPopup: true }, replace: true });
      else setMessage("Invalid OTP");
    } catch (err) { setMessage("Verification failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0d064d] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className=" mb-4 flex  items-center justify-center gap-6">
          <div>
          <img src="TW.jpg" alt="Logo" className="w-16 h-16 mx-auto rounded-2xl mb-4 cursor-pointer shadow-md" onClick={() => navigate("/")} />
          </div>
          <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-[#ffff00]">Create Account</h1>
          <p className="text-slate-500 mt-2">Join Teamwork IT Solutions today</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 md:p-10 border border-slate-100 transition-all">
          {step === "form" ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">First Name</label>
                  <input type="text" name="firstName" placeholder="John" onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Last Name</label>
                  <input type="text" name="lastName" placeholder="Doe" onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
                <input type="email" name="email" placeholder="example@mail.com" onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Phone Number</label>
                <PhoneInput 
                  country="et" 
                  value={formData.phone} 
                  onChange={(val) => setFormData({...formData, phone: val})} 
                  containerClass="!w-full"
                  inputClass="!w-full !h-12 !bg-slate-50 !border-slate-200 !rounded-xl"
                  buttonClass="!bg-slate-50 !border-slate-200 !rounded-l-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
                  <input type={showPassword ? "text" : "password"} name="password" onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-lg opacity-50"></button>
                </div>
                <div className="relative space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Confirm</label>
                  <input type={showConfirm ? "text" : "password"} name="confirmPassword" onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-9 text-lg opacity-50"></button>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-70 mt-4">
                {loading ? "Sending OTP..." : "Create Account"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold text-slate-800">Verify Email</h3>
              <p className="text-slate-500 text-sm">We've sent a code to <span className="font-semibold text-slate-800">{formData.email}</span></p>
              <div className="text-4xl font-black text-blue-600 tracking-widest py-4">{formatTime()}</div>
              <input 
                type="text" 
                placeholder="000000" 
                className="w-full text-center text-3xl font-bold tracking-[1rem] p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none transition-all"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
              <button onClick={handleVerify} className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all">
                {loading ? "Verifying..." : "Verify & Complete"}
              </button>
              <button onClick={() => setCanResend(false)} disabled={!canResend} className={`text-sm font-semibold ${canResend ? 'text-blue-600' : 'text-slate-300'}`}>
                Resend OTP
              </button>
            </div>
          )}

          {message && <div className={`mt-6 p-4 rounded-xl text-sm text-center font-medium ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>{message}</div>}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <button onClick={() => setShowSignIn(true)} className="text-blue-600 font-bold hover:underline">Sign In</button>
            </p>
          </div>
        </div>

        <button onClick={() => navigate("/")} className="mt-8 text-[#ffff00] hover:text-[#fff200] font-semibold flex items-center justify-center w-full transition-all">
          ←Home
        </button>
      </div>

      {showSignIn && <EmailFlowPopup onClose={() => setShowSignIn(false)} />}
    </div>
  );
};

export default SignupPage;