import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AIWebBuilder = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [recentUploads, setRecentUploads] = useState([]);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState(localStorage.getItem("activeProject") || null);
  const [viewMode, setViewMode] = useState("desktop");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return navigate("/");
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    const pid = location.state?.savedProject?._id || currentProjectId;
    if (pid) {
      fetch(`http://localhost:3000/project/${pid}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setGeneratedHTML(data.project.html);
            setMessages(data.project.chatHistory || []);
            setIsGenerated(true);
            setCurrentProjectId(pid);
            localStorage.setItem("activeProject", pid);
          }
        }).finally(() => setFetching(false));
    } else { setFetching(false); }

    fetch(`http://localhost:3000/user-uploads/${parsedUser.email}`)
      .then(res => res.json())
      .then(data => setRecentUploads(data.uploads?.reverse() || []));
  }, []);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const saveToDB = async (html, chatHistory) => {
    const res = await fetch("http://localhost:3000/save-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, html, projectId: currentProjectId, chatHistory })
    });
    const data = await res.json();
    if (data.projectId) {
      setCurrentProjectId(data.projectId);
      localStorage.setItem("activeProject", data.projectId);
    }
  };

  const handleAction = async (e, mode) => {
    if (e) e.preventDefault();
    setLoading(true);
    const userMsg = prompt;
    const newMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(newMessages);
    setPrompt("");

    try {
      const res = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg, existingHTML: generatedHTML, history: messages })
      });
      const data = await res.json();
      const cleanHTML = data.html.replace(/```html|```/g, "").trim();
      setGeneratedHTML(cleanHTML);
      setIsGenerated(true);
      const finalChat = [...newMessages, { role: "ai", text: "🪄 Updated!", versionHTML: cleanHTML }];
      setMessages(finalChat);
      saveToDB(cleanHTML, finalChat);
    } catch (err) { alert("AI Error"); }
    finally { setLoading(false); }
  };

  const handleLiveDemo = () => {
    const win = window.open('', '_blank');
    win.document.write(`<html><head><script src="https://cdn.tailwindcss.com"></script></head><body>${generatedHTML}</body></html>`);
    win.document.close();
  };

  if (fetching) return <div className="h-screen flex items-center justify-center bg-[#0b0f1a] text-blue-500">Loading Session...</div>;

  return (
    <div className="h-screen w-full bg-[#0b0f1a] flex overflow-hidden font-sans text-slate-200">
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

      {/* CHAT SIDEBAR */}
      <div className={`flex flex-col bg-[#0f172a] border-r border-white/5 transition-all duration-500 ${!isGenerated ? 'w-full max-w-4xl mx-auto' : 'w-[400px]'}`}>
        <header className="p-8 border-b border-white/5 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">GenSite AI</h1>
          <button onClick={() => { localStorage.removeItem("activeProject"); navigate("/workspace"); }} className="text-[10px] uppercase font-black opacity-50 hover:opacity-100">Exit</button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-white/10'}`}>
                {msg.text}
                {msg.versionHTML && (
                  <button onClick={() => setGeneratedHTML(msg.versionHTML)} className="mt-3 w-full py-2 bg-black/20 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/5 hover:bg-blue-500 transition-all">Restore This Version</button>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleAction} className="p-6">
          <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-2 flex items-end gap-2">
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Make it professional..." className="flex-1 bg-transparent p-3 outline-none text-sm resize-none h-12 scrollbar-hide" />
            <button disabled={loading} className="bg-blue-600 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase">{loading ? "..." : "Go"}</button>
          </div>
        </form>
      </div>

      {/* PREVIEW PANEL */}
      {isGenerated && (
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0f172a]">
            <div className="flex gap-2 bg-black/20 p-1 rounded-xl">
              {['mobile', 'desktop'].map(m => <button key={m} onClick={() => setViewMode(m)} className={`px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold ${viewMode === m ? 'bg-blue-600' : 'text-slate-500'}`}>{m}</button>)}
            </div>
            <div className="flex gap-3">
               <button onClick={handleLiveDemo} className="px-5 py-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-xl text-[10px] font-bold uppercase">Live Demo</button>
               <button className="px-5 py-2 bg-white text-black rounded-xl text-[10px] font-bold uppercase">Export</button>
            </div>
          </header>
          <div className="flex-1 p-8 flex justify-center items-center">
            <div style={{ width: viewMode === 'mobile' ? '375px' : '100%', height: '100%' }} className="rounded-[2.5rem] border-[10px] border-slate-800 overflow-hidden shadow-2xl transition-all duration-500">
              <iframe srcDoc={`<html><head><script src="https://cdn.tailwindcss.com"></script></head><body>${generatedHTML}</body></html>`} className="w-full h-full border-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWebBuilder;