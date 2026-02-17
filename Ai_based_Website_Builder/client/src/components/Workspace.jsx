import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Workspace = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchUserProjects(userData.email); 
    } else {
      navigate("/"); 
    }
  }, [navigate]);

  const fetchUserProjects = async (email) => {
    try {
      const res = await fetch(`http://localhost:3000/projects/${email}`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // --- DELETE LOGIC ---
  const deleteProject = async (e, id) => {
    e.stopPropagation(); // Card click aagi builder-ku poga koodathu
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await fetch(`http://localhost:3000/delete-project/${id}`, { method: "DELETE" });
      setProjects(projects.filter(p => p._id !== id)); // UI-la irundhu remove panna
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="dark text-slate-200 overflow-hidden h-screen flex bg-[#020617] font-inter">
      <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/80 backdrop-blur z-50">
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">GenSite</span> AI
          </h1>
        </div>
        <div className="flex-1"></div>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 group">
            <div className="flex items-center gap-3">
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=334155&color=fff`} alt="User" className="w-8 h-8 rounded-full border border-cyan-500/30" />
              <p className="text-xs font-semibold text-white truncate w-24 capitalize">{user.name}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/80 backdrop-blur">
          <input type="text" placeholder="Search projects..." className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-full py-1.5 px-4 text-sm focus:outline-none focus:border-cyan-500/50" />
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/imagetourl")} className="flex items-center gap-2 border border-slate-700 hover:bg-slate-800 text-slate-300 px-4 py-1.5 rounded-md text-sm font-medium transition-all">Add Images</button>
            <button onClick={() => navigate("/Aibuilder")} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-1.5 rounded-md text-sm font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">New Project</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            <div onClick={() => navigate("/Aibuilder")} className="bg-slate-900 border border-slate-800 rounded-xl h-60 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500/30 hover:text-cyan-400 transition-all cursor-pointer group">
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">+</span>
              <p className="text-sm font-medium">Create Project</p>
            </div>

          {projects.map((project) => (
  <div 
    key={project._id} 
    onClick={() => navigate("/Aibuilder", { state: { savedProject: project } })} 
    className="bg-slate-900 border border-slate-800 rounded-xl h-64 flex flex-col group overflow-hidden hover:border-blue-500/50 transition-all cursor-pointer relative"
  >
    {/* DELETE BUTTON */}
    <button 
      onClick={(e) => deleteProject(e, project._id)}
      className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-20"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>

    {/* MINI PREVIEW AREA (The Website Preview) */}
    <div className="flex-1 bg-white relative overflow-hidden">
       {/* Scaling the iframe down to fit the card */}
       <div className="absolute inset-0 origin-top-left pointer-events-none" style={{ width: '1200px', height: '800px', transform: 'scale(0.25)' }}>
          <iframe 
            srcDoc={`<html><head><script src="https://cdn.tailwindcss.com"></script></head><body style="zoom: 0.8;">${project.html}</body></html>`} 
            className="w-full h-full border-none"
            title="preview"
          />
       </div>
       {/* Overlay to prevent interaction and look clean */}
       <div className="absolute inset-0 bg-transparent group-hover:bg-blue-500/5 transition-colors"></div>
    </div>

    {/* PROJECT INFO */}
    <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-sm">
       <div className="flex justify-between items-center mb-1">
         <p className="text-[10px] text-slate-500 font-mono">{new Date(project.createdAt).toLocaleDateString()}</p>
         <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">v1.0</span>
       </div>
       <p className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
         {project.prompt.length > 25 ? project.prompt.substring(0, 25) + '...' : project.prompt}
       </p>
    </div>
  </div>
))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workspace;