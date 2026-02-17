import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/gensite") 
    .then(() => console.log("🍃 MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- 2. SCHEMAS ---
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uploads: [String], // History of image URLs
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

const projectSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    prompt: { type: String, required: true },
    html: { type: String, required: true },
    chatHistory: { type: Array, default: [] }, // Chat messages store panna
    createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model("Project", projectSchema);

// --- 3. STATIC FILES & MULTER ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- 4. GEMINI SETUP ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateWithRetry(payload, retries = 3) { 
    try {
        const result = await ai.models.generateContent(payload);
        return result.response ? result.response.text() : result.text;
    } catch (err) {
        if (err.status === 503 && retries > 0) {
            console.log("⚠️ Gemini overloaded. Retrying...");
            await new Promise(res => setTimeout(res, 2000));
            return generateWithRetry(payload, retries - 1);
        }
        throw err;
    }
}

// --- 5. AUTH ENDPOINTS ---
app.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, uploads: [] });
        await newUser.save();
        res.status(201).json({ message: "Identity Created!" });
    } catch (err) { res.status(500).json({ error: "Registration failed" }); }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.json({ message: "Login Successful", user: { name: user.firstName, email: user.email } });
    } catch (err) { res.status(500).json({ error: "Login error" }); }
});

// --- 6. IMAGE HANDLING (FIXED) ---
app.get("/user-uploads/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ uploads: user.uploads || [] });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

app.post("/upload-img", upload.single("image"), async (req, res) => {
    try {
        const { email } = req.body; 
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        // Full URL-ah create panrom (e.g., http://localhost:3000/uploads/123.jpg)
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        // Save URL to user's history in MongoDB
        if (email) {
            await User.findOneAndUpdate(
                { email }, 
                { $push: { uploads: imageUrl } }
            );
        }

        res.json({ url: imageUrl });
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Upload failed" });
    }
});
// --- 7. AI GENERATION ENDPOINT ---
app.post("/generate", async (req, res) => {
    const { prompt, existingHTML, history } = req.body;

    try {
        const previousContext = history && history.length > 0 
            ? history.map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`).join("\n")
            : "No previous context.";

        let systemInstruction = "";

        if (existingHTML && existingHTML.trim() !== "") {
            systemInstruction = `
                CONVERSATION HISTORY: ${previousContext}
                EXISTING CODE: ${existingHTML}
                CURRENT USER REQUEST: ${prompt}

                TASK:
                1. Modify the EXISTING CODE based on request and history.
                2. Use Tailwind CSS. Return ONLY raw HTML (body content).
                3. No markdown, no explanations.
                4. Maintain responsiveness and animations.
            `;
        } else {
            systemInstruction = `
                Prompt: ${prompt}. Build a single page website.
                RULES:
                1. Use Tailwind CSS. fully responsive.
                2. Return ONLY raw HTML (for body).
                3. No markdown (\`\`\`), no explanations.
                4. create with smooth elements animation and beautiful and impresive button hover animation
                5. use internal javascript is needed for UI elements, otherwise ignore it.
            `;
        }

        const payload = {
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: systemInstruction }] }]
        };

        const htmlContent = await generateWithRetry(payload);
        const cleanHTML = htmlContent.replace(/```html|```/g, "").trim();
        res.json({ html: cleanHTML });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI Generation failed" });
    }
});

// --- 8. PROJECT MANAGEMENT (Update instead of Duplicate) ---
// ... (mela irukira imports ellam same)

// --- 8. PROJECT MANAGEMENT (Updated with chatHistory) ---
app.post("/save-project", async (req, res) => {
    try {
        // chatHistory-ah inga destruct pannunga
        const { email, prompt, html, projectId, chatHistory } = req.body; 
        let project;

        if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
            // Existing project-ah update pannum podhu chatHistory-ayum sethu update pannunga
            project = await Project.findByIdAndUpdate(
                projectId, 
                { 
                    prompt, 
                    html, 
                    chatHistory, // Save history here
                    createdAt: Date.now() 
                }, 
                { new: true }
            );
        } else {
            // New project create pannum podhu chatHistory-oda save pannunga
            project = new Project({ 
                userEmail: email, 
                prompt, 
                html, 
                chatHistory 
            });
            await project.save(); 
        }
        
        res.status(200).json({ message: "Project synced!", projectId: project._id });
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ error: "Sync failed" });
    }
});  


// --- Add this in your server.js (Section 8) ---
app.get("/project/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, error: "Project not found" });
        }
        res.json({ success: true, project });
    } catch (err) {
        console.error("Fetch Project Error:", err);
        res.status(500).json({ success: false, error: "Failed to load project" });
    }
});
app.get("/projects/:email", async (req, res) => {
    try {
        const projects = await Project.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
});

app.delete("/delete-project/:id", async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted!" });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});
app.get("/user-uploads/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // User uploads array-la irukura URLs-ah return pannuvom
        res.json({ uploads: user.uploads || [] });
    } catch (err) {
        console.error("Fetch History Error:", err);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});
app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));