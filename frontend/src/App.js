import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';
import Sidebar from './components/Sidebar';  // Correct import of Sidebar
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Example data for performance metrics
const performanceData = {
  labels: ['0s', '1s', '2s', '3s', '4s', '5s'],
  datasets: [
    {
      label: 'Response Time (ms)',
      data: [120, 150, 180, 210, 170, 140],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Performance Metrics (Response Time)' },
  },
  scales: {
    x: { title: { display: true, text: 'Time (seconds)' } },
    y: {
      title: { display: true, text: 'Response Time (ms)' },
      min: 0,
      max: 250,
    },
  },
};

// Metrics Dashboard Component
const MetricsDashboard = () => {
  return (
    <div className="metrics-section">
      <h2>AI Performance Metrics</h2>
      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
        <Col>
          <Card className="metric-card">
            <Card.Body>
              <h5>Emails Sent</h5>
              <p>12,361</p>
              <p className="metric-change positive">+2%</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="metric-card">
            <Card.Body>
              <h5>Sales Obtained</h5>
              <p>431,225</p>
              <p className="metric-change positive">+21%</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="metric-card">
            <Card.Body>
              <h5>New Subscribers</h5>
              <p>3,452</p>
              <p className="metric-change negative">-5%</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="metric-card">
            <Card.Body>
              <h5>Website Traffic</h5>
              <p>1,236,876</p>
              <p className="metric-change positive">+15%</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="metric-card">
            <Card.Body>
              <h5>Orders Processed</h5>
              <p>57,890</p>
              <p className="metric-change positive">+8%</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Main App Component
function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);  // State for sidebar toggle

  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionInstance = recognition ? new recognition() : null;

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const startListening = () => {
    if (recognitionInstance) {
      recognitionInstance.start();
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsTyping(true);
    try {
      const res = await fetch('http://127.0.0.1:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        const data = await res.json();
        setResponse(data.choices[0].message.content);
      } else {
        setResponse('Error: Could not fetch response from the API.');
      }
    } catch (error) {
      setResponse('Error: Could not connect to the backend.');
    } finally {
      setIsTyping(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="App">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <Sidebar /> {/* Sidebar for additional features */}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <Button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <BsList size={30} />
        </Button>

        {/* Metrics Dashboard */}
        <MetricsDashboard />

        <header className="App-header">
          <h1>Real-Time Chat with AI</h1>

          {/* Chat Input */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your message"
              value={message}
              onChange={handleInputChange}
            />
            <button type="submit" disabled={!message.trim()}>Send</button>
          </form>

          {/* Speech Recognition Button */}
          <button onClick={startListening}>
            {isTyping ? 'Listening...' : 'Speak to AI'}
          </button>

          {/* Chat Responses */}
          <div className="chat-container">
            <div><strong>You:</strong> {message}</div>
            {isTyping && <div><strong>AI is typing...</strong></div>}
            <div><strong>AI:</strong> {response}</div>
          </div>
        </header>
      </div>
    </div>
  );
}

export default App;