import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });

  const isLogin = activeTab === "login";

  // Input change handle panna
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Logic
 const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";
    
    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
const data = await res.json();
      if (res.ok) {
        if (isLogin) {
          // 1. User data-va save pannunga
          localStorage.setItem("user", JSON.stringify(data.user));
          // 2. Workspace-ku navigate pannunga
          navigate("/workspace");
        } else {
          alert("Account created! Please login.");
          setActiveTab("login");
        }
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Connection Error!");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative bg-[#020617] text-slate-200">
      {/* (Background accents same as before) */}

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">GenSite</span> AI
          </h1>
        </div>

        <div className={`rounded-2xl p-8 shadow-2xl backdrop-blur border transition-all duration-300 bg-slate-900/80 
          ${isLogin ? "border-cyan-500/50" : "border-fuchsia-500/50"}`}>
          
          {/* Tabs */}
          <div className="flex mb-8 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
            <button onClick={() => setActiveTab("login")} className={`w-1/2 py-2 text-sm font-semibold rounded-md ${isLogin ? "text-cyan-400 bg-slate-800" : "text-slate-400"}`}>LOGIN</button>
            <button onClick={() => setActiveTab("register")} className={`w-1/2 py-2 text-sm font-semibold rounded-md ${!isLogin ? "text-fuchsia-400 bg-slate-800" : "text-slate-400"}`}>REGISTER</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" onChange={handleChange} placeholder="First Name" className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:border-fuchsia-500" required />
                <input name="lastName" onChange={handleChange} placeholder="Last Name" className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:border-fuchsia-500" required />
              </div>
            )}

            <input name="email" type="email" onChange={handleChange} placeholder="user@nexus.io" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:border-cyan-500" required />
            <input name="password" type="password" onChange={handleChange} placeholder="Your Password" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:border-cyan-500" required />

            <button type="submit" className={`w-full py-3 rounded-lg font-bold uppercase tracking-widest transition-all ${isLogin ? "bg-cyan-600 hover:bg-cyan-500" : "bg-fuchsia-600 hover:bg-fuchsia-500"}`}>
              {isLogin ? "Login" : "Create Identity"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;