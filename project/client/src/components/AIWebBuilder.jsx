import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AIWebBuilder = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem("chatHistory")) || []);
  const [isGenerated, setIsGenerated] = useState(() => !!localStorage.getItem("lastGeneratedHTML"));
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [generatedHTML, setGeneratedHTML] = useState(() => localStorage.getItem("lastGeneratedHTML") || "");
  const [currentProjectId, setCurrentProjectId] = useState(localStorage.getItem("activeProject") || null);
  const [viewMode, setViewMode] = useState("desktop");
  const [user, setUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState("Idle");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPromptGallery, setShowPromptGallery] = useState(false);
const fileInputRef = useRef(null);

// Image-ah prompt text-kulla add panna
const insertImageUrl = (url) => {
  const currentCount = (prompt.match(/image/g) || []).length + 1;
  const imagePlaceholder = `(image${currentCount}: ${url}) `;
  setPrompt(prev => prev + imagePlaceholder);
  setShowPromptGallery(false);
};

// New Image Upload for Prompt
const handlePromptImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("email", user.email);

  try {
    setSaveStatus("Uploading...");
    const res = await fetch("http://localhost:3000/upload-img", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data.url) {
      insertImageUrl(data.url);
      setSaveStatus("Uploaded");
    }
  } catch (err) {
    setSaveStatus("Upload Failed");
  }
};

  // --- IMAGE EDIT STATES ---
  const [showImageModal, setShowImageModal] = useState(false);
  const [availableImages, setAvailableImages] = useState([]); 
  const [selectedImgElementId, setSelectedImgElementId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const iframeRef = useRef(null);
  const chatEndRef = useRef(null);
  
  // Project ID Ref for instant tracking (Fixes duplicate project issue)
  const projectIdRef = useRef(localStorage.getItem("activeProject") || null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Fetch Available Images
  useEffect(() => {
    const fetchImages = async () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return;
      const email = JSON.parse(savedUser).email;
      try {
        const res = await fetch(`http://localhost:3000/user-uploads/${email}`); 
        const data = await res.json();
        if (data.uploads) setAvailableImages(data.uploads); 
      } catch (err) { console.error("Image fetch error:", err); }
    };
    if (isGenerated || showImageModal) fetchImages();
  }, [isGenerated, showImageModal]);

  // --- FIXED AUTO SAVE LOGIC (PREVENTS DUPLICATES) ---
// --- Unga autoSave function-la intha chinna logic correct-ah irukanu parunga ---
const autoSave = async (html, chatHistory) => {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) return;
  const email = JSON.parse(savedUser).email;
  
  const pid = projectIdRef.current; // Ref-la irunthu ID edukkum
  
  setSaveStatus("Saving...");
  try {
    const res = await fetch("http://localhost:3000/save-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email, 
        html, 
        projectId: pid, // PID null-ah illama irundha backend-la update thaan aagum
        chatHistory 
      })
    });
    
    const data = await res.json();
    
    if (data.success && data.projectId) {
      // First time save aagumpodhu mattum ID set pannum
      if (!projectIdRef.current) {
        projectIdRef.current = data.projectId;
        setCurrentProjectId(data.projectId);
        localStorage.setItem("activeProject", data.projectId);
      }
      setSaveStatus("Saved");
    }
  } catch (err) { 
    setSaveStatus("Error"); 
  }
};
  // --- LIVE DEMO & EXPORT ---
  const handleLiveDemo = () => {
    const newWindow = window.open('', '_blank');
    const fullHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><style>html, body { margin: 0; padding: 0; min-height: 100vh; background-color: #0b0f1a; }</style></head><body>${generatedHTML}</body></html>`;
    newWindow.document.write(fullHTML);
    newWindow.document.close();
  };

  const handleExportHTML = () => {
    const fullHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><style>html,body{margin:0;padding:0;min-height:100vh;background-color:#0b0f1a;}</style></head><body>${generatedHTML}</body></html>`;
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "index.html";
    a.click();
  };

 // --- AIWebBuilder.js kulla intha useEffect-ah replace pannunga ---
// --- Intha useEffect-ah replace pannunga ---
useEffect(() => {
  const handleMsg = (e) => {
    if (e.data.type === 'OPEN_IMAGE_PICKER') {
      setSelectedImgElementId(e.data.elementId);
      setShowImageModal(true);
    }

    if (e.data.type === 'UPDATE_HTML') {
      const newHtml = e.data.html;
      setGeneratedHTML(newHtml);
      localStorage.setItem("lastGeneratedHTML", newHtml);
      
      // FIX: LocalStorage-la irundhu current project ID-ah force-ah edukirom
      const currentId = projectIdRef.current || localStorage.getItem("activeProject");
      
      setMessages(prevMessages => {
        // ID irundha mattum dhaan autoSave call aaganum to avoid accidental new projects
        if (currentId) {
          autoSave(newHtml, prevMessages);
        }
        return prevMessages;
      });
    }
  };
  window.addEventListener('message', handleMsg);
  return () => window.removeEventListener('message', handleMsg);
}, []);
  const handleSelectNewImage = (newUrl) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'APPLY_IMAGE',
        elementId: selectedImgElementId,
        newUrl: newUrl
      }, '*');
    }
    setShowImageModal(false);
  };

  const handleRestore = (versionHtml) => {
    if (!versionHtml) return;
    setGeneratedHTML(versionHtml);
    localStorage.setItem("lastGeneratedHTML", versionHtml);
    autoSave(versionHtml, messages);
    alert("Version Restored!");
  };

  // Initial Project Load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return navigate("/");
    setUser(JSON.parse(savedUser));
    
    const pidToLoad = location.state?.savedProject?._id || localStorage.getItem("activeProject");
    
    if (pidToLoad) {
      fetch(`http://localhost:3000/project/${pidToLoad}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.project) {
            setGeneratedHTML(data.project.html || "");
            setMessages(data.project.chatHistory || []);
            setIsGenerated(!!data.project.html);
            projectIdRef.current = data.project._id;
            setCurrentProjectId(data.project._id);
            localStorage.setItem("activeProject", data.project._id);
          }
        }).finally(() => setTimeout(() => setFetching(false), 1000));
    } else { setFetching(false); }
  }, [navigate]);

  useEffect(() => {
    if (iframeRef.current && generatedHTML) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      if (doc.body && doc.body.innerHTML !== generatedHTML) {
        doc.body.innerHTML = generatedHTML;
      }
    }
  }, [generatedHTML]);

  const iframeSource = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            html, body { margin: 0; padding: 0; min-height: 100vh; background-color: transparent !important; }
            [contenteditable="true"]:focus { outline: 2px dashed #3b82f6 !important; background: rgba(59,130,246,0.05); }
            img:hover { outline: 3px solid #3b82f6; cursor: pointer; }
          </style>
          <script>
            const assignIds = () => {
              document.querySelectorAll('img').forEach((img, i) => {
                if(!img.id) img.id = 'editable-img-' + i;
              });
            };
            window.onload = assignIds;

            window.addEventListener('message', e => {
              if (e.data.type === 'APPLY_IMAGE') {
                const img = document.getElementById(e.data.elementId);
                if (img) {
                  img.src = e.data.newUrl;
                  window.parent.postMessage({ type: 'UPDATE_HTML', html: document.body.innerHTML }, '*');
                }
              }
            });

            document.addEventListener('click', e => {
              const t = e.target;
              if (t.tagName === 'IMG') {
                window.parent.postMessage({ type: 'OPEN_IMAGE_PICKER', elementId: t.id }, '*');
                return;
              }
              if (t.tagName === 'A' || t.tagName === 'BUTTON') e.preventDefault();
              t.contentEditable = true; t.focus();
              t.onblur = () => window.parent.postMessage({ type: 'UPDATE_HTML', html: document.body.innerHTML }, '*');
            }, true);
          </script>
        </head>
        <body>${generatedHTML}</body>
      </html>
    `;
  }, [isGenerated]);

 // ... (Unga existing imports and state ellame apdiye vachukko)

 // --- HandleAction-la intha sequence-ah replace pannunga ---
const handleAction = async (e) => {
  e.preventDefault();
  if (!prompt.trim() || loading) return;
  setLoading(true);

  const newMessages = [...messages, { role: "user", text: prompt }];
  setMessages(newMessages);
  setPrompt("");

  try {
    const res = await fetch("http://localhost:3000/generate", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, existingHTML: generatedHTML, history: messages })
    });
    const data = await res.json();
    const cleanHTML = data.html.replace(/```html|```/g, "").trim();
    
    setGeneratedHTML(cleanHTML);
    setIsGenerated(true);

    const finalChat = [...newMessages, { role: "ai", text: "Design updated successfully!", snapshot: cleanHTML }];
    setMessages(finalChat);
    
    // Safety: Ingaiyum current projectIdRef vachi thaan autoSave call aagum
    autoSave(cleanHTML, finalChat); 
    
  } catch (err) { 
    setSaveStatus("Error"); 
  } finally { 
    setLoading(false); 
  }
};
// ... (Intha function-ku mela ulla handleAction-ah mattum replace panniko, matha UI code ellame apdiye vachukko)
  if (fetching) return <div className="h-screen w-full flex items-center justify-center bg-[#0b0f1a]"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="h-screen w-full bg-[#0b0f1a] flex overflow-hidden text-slate-200">
      
      {/* IMAGE SELECTION MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div><h2 className="text-xl font-bold text-white">Select from Uploads</h2></div>
              <button onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-white p-2 text-xl">✕</button>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[450px] overflow-y-auto">
              {availableImages.map((imgUrl, idx) => (
                <div key={idx} onClick={() => handleSelectNewImage(imgUrl)} className="aspect-square bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:ring-4 ring-blue-500 transition-all">
                  <img src={imgUrl} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      {!isFullScreen && (
        <div className={`flex flex-col bg-[#0f172a] border-r border-white/5 transition-all duration-500 ${!isGenerated ? 'w-full max-w-4xl mx-auto' : 'w-[360px]'}`}>
          <header className="p-6 border-b border-white/5 flex justify-between items-center">
            <div>  <h1 className="text-4xl font-bold mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">GenSite</span> AI
          </h1><p className="text-[9px] text-slate-500 font-bold uppercase">{saveStatus}</p></div>
            {!loading?<button onClick={() => navigate('/workspace')} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>:''}
          </header>

          {/* SIDEBAR - Message Rendering Section */}
<div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
  {messages.map((msg, i) => (
    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
      <div 
        className={`p-4 rounded-2xl text-sm max-w-[90%] shadow-lg 
          ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1e293b] border border-white/10 text-slate-200'}
          /* 👇 INTHA MOONU CLASSES DHAN MUKKIYAM */
          break-words overflow-hidden whitespace-pre-wrap
        `}
      >
        {msg.text}
        
        {msg.role === 'ai' && msg.snapshot && (
          <div className="mt-3 pt-2 border-t border-white/5 flex flex-col gap-2">
            <button 
              onClick={() => handleRestore(msg.snapshot)} 
              className="w-full py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 text-[11px] font-bold transition-all flex items-center justify-center gap-2"
            >
              RESTORE THIS VERSION
            </button>
          </div>
        )}
      </div>
    </div>
  ))}
  {loading && (
    <div className="flex flex-col items-start animate-chat">
      <div className="bg-[#1e293b] border border-white/10 p-4 rounded-2xl flex gap-1.5 items-center">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      </div>
    </div>
  )}
  <div ref={chatEndRef} />
</div>
          <form onSubmit={handleAction} className="p-4 border-t border-white/5 relative">
  
  {/* IMAGE SELECTION FOR PROMPT (Floating Gallery) */}
  {showPromptGallery && (
    <div className="absolute bottom-full left-4 right-4 bg-[#1e293b] border border-white/10 rounded-2xl p-4 mb-2 shadow-2xl max-h-48 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs font-bold text-slate-400 uppercase">Your Library</p>
        <button onClick={() => setShowPromptGallery(false)} className="text-slate-500 hover:text-white text-xs">Close</button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {availableImages.map((url, i) => (
          <img 
            key={i} src={url} 
            onClick={() => insertImageUrl(url)}
            className="w-full h-12 object-cover rounded-lg cursor-pointer hover:ring-2 ring-blue-500 transition-all"
          />
        ))}
      </div>
    </div>
  )}

  <div className="bg-slate-900 border border-white/10 rounded-2xl p-2 flex items-center gap-2 pr-4">
    
    {/* Upload New Icon */}
    <input type="file" ref={fileInputRef} onChange={handlePromptImageUpload} className="hidden" accept="image/*" />
    <button type="button" onClick={() => fileInputRef.current.click()} className="p-2 text-slate-400 hover:text-blue-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
    </button>

    {/* Gallery Icon */}
    <button type="button" onClick={() => setShowPromptGallery(!showPromptGallery)} className="p-2 text-slate-400 hover:text-blue-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    </button>

    <textarea 
  value={prompt} 
  onChange={(e) => {
    setPrompt(e.target.value);
    // Auto height adjust logic
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  }}
  onKeyDown={(e) => {
    // Enter press panna submit aaganum, Shift+Enter panna next line pogaum
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAction(e);
    }
  }}
  placeholder="Build Your Dream Site..." 
  rows="1"
  className="flex-1 bg-transparent p-2 outline-none text-sm resize-none max-h-40 custom-scrollbar"
  style={{ minHeight: '40px' }}
/>

    <button disabled={loading} type="submit" className="bg-blue-600 p-2.5 rounded-xl hover:bg-blue-500 disabled:opacity-50">
      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>}
    </button>
  </div>
</form>
        </div>
      )}

      {/* PREVIEW AREA */}
      {isGenerated && (
        <div className="flex-1 flex flex-col bg-black">
          <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0f172a]">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 hover:bg-white/5 rounded-lg border border-white/10 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
              </button>
              <button onClick={handleLiveDemo} className="bg-slate-800 text-slate-300 px-4 py-1.5 rounded text-[10px] font-bold border border-white/10 hover:bg-blue-600 hover:text-white uppercase">Live Demo</button>
            </div>

            <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10">
              <button onClick={() => setViewMode('mobile')} className={`px-4 py-1 text-[10px] font-bold rounded-lg ${viewMode === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>MOBILE</button>
              <button onClick={() => setViewMode('desktop')} className={`px-4 py-1 text-[10px] font-bold rounded-lg ${viewMode === 'desktop' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>DESKTOP</button>
            </div>

            <button onClick={handleExportHTML} className="bg-blue-600 hover:bg-blue-500 px-5 py-1.5 rounded-lg text-[10px] font-bold shadow-lg shadow-blue-600/20">EXPORT HTML</button>
          </header>

          <div className="flex-1 bg-[#0b0f1a] p-8 flex justify-center overflow-hidden">
            <div className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-500" style={{ width: viewMode === 'mobile' ? '375px' : '100%', height: '100%' }}>
              <iframe ref={iframeRef} srcDoc={iframeSource} className="w-full h-full border-none " />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWebBuilder;