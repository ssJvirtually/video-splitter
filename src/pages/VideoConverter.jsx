import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { convertToMp4 } from '../ffmpegService'

function VideoConverter() {
  const [convertedVideo, setConvertedVideo] = useState(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Idle")

  useEffect(() => {
    return () => {
      if (convertedVideo) URL.revokeObjectURL(convertedVideo.url)
    }
  }, [convertedVideo])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setProgress(0)
    setConvertedVideo(null)
    
    try {
      const result = await convertToMp4(file, setProgress, setStatus)
      
      const url = URL.createObjectURL(new Blob([result.data], { type: 'video/mp4' }))
      setConvertedVideo({ ...result, url })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h1>🔄 MOV to MP4 Converter</h1>
      <p className="description">Convert your MOV files to MP4 format instantly in your browser.</p>

      <div className="action-row">
        <div className="upload-section">
          <input 
            type="file" 
            id="video-upload"
            accept=".mov,video/quicktime" 
            onChange={handleUpload} 
            hidden 
          />
          <label htmlFor="video-upload" className="button">
            {status === "Converting video..." ? "Converting..." : "Select MOV File"}
          </label>
        </div>
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

      {convertedVideo && (
        <div className="chunks-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '500px', margin: '3rem auto' }}>
          <div className="chunk-card">
            <video width="100%" controls src={convertedVideo.url}></video>
            <div className="chunk-info">
              <span>{convertedVideo.name}</span>
              <a href={convertedVideo.url} download="converted.mp4" className="download-link">
                Download MP4
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoConverter;
