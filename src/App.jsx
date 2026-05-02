import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VideoSplitter from './pages/VideoSplitter'
import VideoConverter from './pages/VideoConverter'
import './style.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/splitter" element={<VideoSplitter />} />
        <Route path="/converter" element={<VideoConverter />} />
      </Routes>
    </Router>
  )
}

export default App
