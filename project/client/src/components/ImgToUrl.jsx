import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ImageToUrl = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // Store previous uploads
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      fetchHistory(savedUser.email);
    } else {
      navigate("/"); // Login pannala-na veliya anuppu
    }
  }, []);

  const fetchHistory = async (email) => {
    try {
      const res = await fetch(`http://localhost:3000/user-uploads/${email}`);
      const data = await res.json();
      setHistory(data.uploads || []);
    } catch (err) { console.error("History fetch error"); }
  };

  const uploadAndConvert = async () => {
    if (!file || !user) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("email", user.email); // User identity anuppuroam

    try {
      const response = await fetch("http://localhost:3000/upload-img", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.url) {
        setGeneratedUrl(data.url);
        setHistory([data.url, ...history]); // UI-la உடனே update panna
      }
    } catch (err) { alert("Upload failed!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 font-sans">
      <button onClick={() => navigate("/workspace")} className="mb-6 text-cyan-500 hover:underline flex items-center gap-2">
        ← Back to Workspace
      </button>

      <div className="flex flex-col items-center">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">GenSite</span> AI
          </h1>
          <p className="text-slate-500 uppercase tracking-widest text-xs">Welcome, {user?.name}</p>
        </header>

        {/* Upload Box (Same as your previous code) */}
        <div className="glass p-8 rounded-3xl w-full max-w-xl shadow-2xl mb-12">
            {/* ... keep your existing upload UI logic here ... */}
            {!preview ? (
               <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-slate-700 p-12 text-center cursor-pointer">
                  <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                      if(e.target.files[0]) {
                          setFile(e.target.files[0]);
                          setPreview(URL.createObjectURL(e.target.files[0]));
                      }
                  }} />
                  <p>Click to Upload Image</p>
               </div>
            ) : (
                <div className="text-center">
                    <img src={preview} className="w-40 h-40 mx-auto rounded-lg mb-4 object-cover" />
                    {!generatedUrl ? (
                        <button onClick={uploadAndConvert} className="bg-cyan-600 px-6 py-2 rounded">{loading ? "Uploading..." : "Convert"}</button>
                    ) : (
                        <input readOnly value={generatedUrl} className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-cyan-400" />
                    )}
                </div>
            )}
        </div>

        {/* --- USER UPLOAD HISTORY --- */}
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-6 text-cyan-400 border-b border-cyan-500/20 pb-2">Your Recent Uploads</h2>
          {history.length === 0 ? (
            <p className="text-slate-500 text-center">No uploads yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {history.map((url, index) => (
                <div key={index} className="group relative glass p-2 rounded-xl border border-white/5 hover:border-cyan-500/50 transition-all">
                  <img src={url} alt="upload" className="w-full h-32 object-cover rounded-lg" />
                  <button 
                    onClick={() => {navigator.clipboard.writeText(url); alert("URL Copied!")}}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-xs font-bold"
                  >
                    COPY URL
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageToUrl;