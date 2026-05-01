import { useState, useEffect } from 'react'
import JSZip from 'jszip'
import { splitVideo } from './ffmpegService'
import './style.css'

function App() {
  const [chunks, setChunks] = useState([])
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Idle")
  const [isZipping, setIsZipping] = useState(false)

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      chunks.forEach(chunk => URL.revokeObjectURL(chunk.url))
    }
  }, [chunks])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setProgress(0)
    setChunks([]) // Clear previous chunks
    try {
      const result = await splitVideo(file, setProgress, setStatus)
    
      // Create URLs once and store them
      const chunksWithUrls = result.map(chunk => ({
        ...chunk,
        url: URL.createObjectURL(new Blob([chunk.data], { type: 'video/mp4' }))
      }))
    
      setChunks(chunksWithUrls)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDownloadAll = async () => {
    if (chunks.length === 0) return
    setIsZipping(true)
    setStatus("Creating ZIP archive...")

    try {
      const zip = new JSZip()
      chunks.forEach((chunk) => {
        zip.file(chunk.name, chunk.data)
      })

      const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
        setProgress(Math.round(metadata.percent))
      })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = "video_chunks.zip"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setStatus("Done")
    } catch (error) {
      console.error(error)
      setStatus("Error creating ZIP")
    } finally {
      setIsZipping(false)
    }
  }

  return (
    <div className="container">
      <h1>🎬 Video Splitter</h1>
      <p className="description">Splits your video into 30-second segments directly in your browser.</p>

      <div className="action-row">
        <div className="upload-section">
          <input 
            type="file" 
            id="video-upload"
            accept="video/*" 
            onChange={handleUpload} 
            hidden 
          />
          <label htmlFor="video-upload" className="button">
            {status === "Processing video..." ? "Processing..." : "Select Video"}
          </label>
        </div>

        {chunks.length > 0 && (
          <button 
            className="button secondary" 
            onClick={handleDownloadAll}
            disabled={isZipping}
          >
            {isZipping ? "Zipping..." : "Download All (ZIP)"}
          </button>
        )}
      </div>

      {status !== "Idle" && (
        <div className="status-container">
          <p>Status: <strong>{status}</strong></p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p>{progress}%</p>
        </div>
      )}

      {chunks.length > 0 && (
        <div className="chunks-grid">
          {chunks.map((chunk, i) => (
            <div key={i} className="chunk-card">
              <video width="100%" controls src={chunk.url}></video>
              <div className="chunk-info">
                <span>{chunk.name}</span>
                <a href={chunk.url} download={chunk.name} className="download-link">
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
