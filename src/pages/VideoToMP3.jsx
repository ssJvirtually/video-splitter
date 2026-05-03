import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { convertToAudio } from '../ffmpegService'

function VideoToMP3() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [convertedAudio, setConvertedAudio] = useState(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Idle")

  useEffect(() => {
    return () => {
      if (convertedAudio) URL.revokeObjectURL(convertedAudio.url)
    }
  }, [convertedAudio])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setSelectedFile(file)
    setConvertedAudio(null)
    setStatus("File Selected")
  }

  const handleConvert = async () => {
    if (!selectedFile) return

    setProgress(0)
    setConvertedAudio(null)
    
    try {
      const result = await convertToAudio(selectedFile, setProgress, setStatus)
      
      const url = URL.createObjectURL(new Blob([result.data], { type: 'audio/mp3' }))
      setConvertedAudio({ ...result, url })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h1>🎵 Video to MP3 Converter</h1>
      <p className="description">Extract high-quality MP3 audio from any video file.</p>

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
            {selectedFile ? `Change Video (${selectedFile.name})` : "Select Video File"}
          </label>
        </div>

        {selectedFile && (
          <div className="converter-options" style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              className="button secondary" 
              onClick={handleConvert}
              disabled={status === "Extracting MP3..."}
            >
              {status.startsWith("Extracting") ? "Converting..." : "Convert to MP3"}
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

      {convertedAudio && (
        <div className="chunks-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '500px', margin: '3rem auto' }}>
          <div className="chunk-card">
            <audio controls src={convertedAudio.url} style={{ width: '100%', marginTop: '1rem' }}></audio>
            <div className="chunk-info">
              <span>{convertedAudio.name}</span>
              <a href={convertedAudio.url} download={convertedAudio.name} className="download-link">
                Download MP3
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoToMP3;
