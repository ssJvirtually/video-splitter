import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { convertVideo } from '../ffmpegService'

function VideoConverter() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [targetFormat, setTargetFormat] = useState('mp4')
  const [convertedVideo, setConvertedVideo] = useState(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Idle")

  const formats = ['mp4', 'mov', 'mkv', 'avi', 'webm']

  useEffect(() => {
    return () => {
      if (convertedVideo) URL.revokeObjectURL(convertedVideo.url)
    }
  }, [convertedVideo])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setSelectedFile(file)
    setConvertedVideo(null)
    setStatus("File Selected")
    
    // Auto-detect format from extension
    const ext = file.name.split('.').pop().toLowerCase()
    // If input is already target format, maybe suggest another? 
    // Or just let user decide.
  }

  const handleConvert = async () => {
    if (!selectedFile) return

    setProgress(0)
    setConvertedVideo(null)
    
    try {
      const result = await convertVideo(selectedFile, targetFormat, setProgress, setStatus)
      
      const mimeType = `video/${targetFormat === 'mov' ? 'quicktime' : targetFormat}`
      const url = URL.createObjectURL(new Blob([result.data], { type: mimeType }))
      setConvertedVideo({ ...result, url })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h1>🔄 Universal Video Converter</h1>
      <p className="description">Convert videos between formats instantly in your browser.</p>

      <div className="settings-row" style={{ flexDirection: 'column', gap: '1.5rem' }}>
        <div className="upload-section">
          <input 
            type="file" 
            id="video-upload"
            accept="video/*" 
            onChange={handleFileChange} 
            hidden 
          />
          <label htmlFor="video-upload" className="button">
            {selectedFile ? `Change Video (${selectedFile.name})` : "Select Video"}
          </label>
        </div>

        {selectedFile && (
          <div className="converter-options" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label htmlFor="targetFormat">Convert to:</label>
            <select 
              id="targetFormat" 
              value={targetFormat} 
              onChange={(e) => setTargetFormat(e.target.value)}
              className="duration-input"
              style={{ width: '120px' }}
            >
              {formats.map(fmt => (
                <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
              ))}
            </select>
            
            <button 
              className="button secondary" 
              onClick={handleConvert}
              disabled={status === "Converting..."}
            >
              {status.startsWith("Converting") ? "Converting..." : "Convert Now"}
            </button>
          </div>
        )}
      </div>

      {status !== "Idle" && status !== "File Selected" && (
        <div className="status-container">
          <p>Status: <strong>{status}</strong></p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p>{progress}%</p>
        </div>
      )}

      {convertedVideo && (
        <div className="chunks-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '500px', margin: '3rem auto' }}>
          <div className="chunk-card">
            <video width="100%" controls src={convertedVideo.url}></video>
            <div className="chunk-info">
              <span>{convertedVideo.name}</span>
              <a href={convertedVideo.url} download={convertedVideo.name} className="download-link">
                Download {convertedVideo.format.toUpperCase()}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoConverter;
