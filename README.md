# 🎬 Utils Media

A powerful, privacy-focused collection of media tools that run entirely in your browser using **FFmpeg WASM**. No files are ever uploaded to a server—all processing happens locally on your machine.

🚀 **Live Demo:** [https://ssjvirtually.github.io/video-splitter/](https://ssjvirtually.github.io/video-splitter/)

---

## ✨ Features

### 1. 🎬 Video Splitter
- **Custom Durations:** Split your videos into segments of any length (e.g., 15s for Stories, 30s for WhatsApp, 60s for Reels).
- **Batch Processing:** Splits the entire video and prepares all chunks for review.
- **Instant Download:** Download individual clips or grab everything at once in a **ZIP archive**.

### 2. 🔄 Universal Video Converter
- **Multi-Format Support:** Convert videos between popular formats including **MP4, MOV, MKV, AVI, and WEBM**.
- **High Speed:** Uses FFmpeg's stream copy logic for near-instant conversion without quality loss.
- **Format Auto-Detection:** Automatically handles input types and lets you choose your target output.

---

## 🛠️ Technical Stack

- **Frontend:** React (Vite) + JavaScript
- **Core Engine:** [@ffmpeg/ffmpeg](https://github.com/ffmpegwasm/ffmpeg.wasm) (FFmpeg via WebAssembly)
- **Archiving:** [JSZip](https://stuk.github.io/jszip/)
- **Routing:** React Router (HashRouter for GH Pages compatibility)
- **Styling:** Custom Vanilla CSS (Modern, Dark-mode ready)

---

## 📦 Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ssJvirtually/video-splitter.git
   cd video-splitter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deployment

### GitHub Pages
This project is configured to deploy seamlessly to GitHub Pages.
```bash
npm run deploy
```

### Important Note on Security Headers
FFmpeg WASM requires `SharedArrayBuffer` to work, which necessitates specific security headers:
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

The project includes a `coi-serviceworker.js` to enable these features on platforms like GitHub Pages where you cannot control server headers directly.

---

## 🔒 Privacy
Your privacy is our priority. **Utils Media** does not have a backend. Your videos never leave your browser, making it the perfect tool for processing sensitive or personal media safely.

---

## 📜 License
MIT License. Feel free to use and modify for your own projects!
