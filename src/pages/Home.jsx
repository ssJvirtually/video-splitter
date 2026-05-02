import { Link } from 'react-router-dom';

function Home() {
  const tools = [
    {
      id: 'splitter',
      name: 'Video Splitter',
      description: 'Split videos into segments directly in your browser.',
      path: '/splitter',
      icon: '🎬'
    }
    // Future tools can be added here
  ];

  return (
    <div className="container">
      <h1>🛠️ Utils Media</h1>
      <p className="description">A collection of handy media tools.</p>
      
      <div className="tools-grid">
        {tools.map(tool => (
          <Link to={tool.path} key={tool.id} className="tool-card">
            <div className="tool-icon">{tool.icon}</div>
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
