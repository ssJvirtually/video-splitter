import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VideoSplitter from './pages/VideoSplitter'
import './style.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/splitter" element={<VideoSplitter />} />
      </Routes>
    </Router>
  )
}

export default App
