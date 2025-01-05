import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, ProgressBar, Form, Alert } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';
import Sidebar from './components/Sidebar';
import { Line } from 'react-chartjs-2';
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

// Example data for LLM performance metrics
const performanceMetrics = {
  labels: ['10:00', '10:05', '10:10', '10:15', '10:20'],
  datasets: [
    {
      label: 'Response Time (ms)',
      data: [120, 150, 110, 180, 140],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Token Usage (per request)',
      data: [300, 400, 350, 500, 450],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.4,
      fill: true,
    },
  ],
};

// Chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'LLM Performance Metrics' },
  },
  scales: {
    x: { title: { display: true, text: 'Time' } },
    y: { title: { display: true, text: 'Values' }, min: 0, max: 600 },
  },
};

// Main App Component
function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [interpretation, setInterpretation] = useState({ sentiment: '', keywords: [] });
  const [file, setFile] = useState(null);
  const [task, setTask] = useState('summarization'); // Default task
  const [uploadResponse, setUploadResponse] = useState('');
  const [extractedData, setExtractedData] = useState('');

  const handleInputChange = (e) => setMessage(e.target.value);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleTaskChange = (e) => setTask(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsTyping(true);
    try {
      const res = await fetch('http://127.0.0.1:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        const data = await res.json();
        setResponse(data.choices[0]?.message?.content || 'No response');
        interpretLLMResponse(data.choices[0]?.message?.content || '');
      } else {
        setResponse('Error: Could not fetch response from API.');
      }
    } catch (error) {
      setResponse('Error: Could not connect to the backend.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('task', task); // Add task type to formData

    try {
      const res = await fetch('http://127.0.0.1:5001/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadResponse({
          message: "File uploaded and processed successfully!",
          variant: "success",
        });
        setExtractedData(data.extractedText || "No extraction result available.");
      } else {
        setUploadResponse({
          message: 'Error: Could not process the file.',
          variant: "danger",
        });
      }
    } catch (error) {
      setUploadResponse({
        message: 'Error: Could not upload the file.',
        variant: "danger",
      });
    }
  };

  const interpretLLMResponse = (text) => {
    // Basic LLM output interpretation (example: sentiment & keyword extraction)
    const sentiment = text.includes('great') || text.includes('good') ? 'Positive' : 'Neutral';
    const keywords = text.split(' ').filter((word) => word.length > 5);
    setInterpretation({ sentiment, keywords });
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="App">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        <Button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <BsList size={30} />
        </Button>

        {/* Performance Metrics */}
        <Container fluid>
          <h2 className="text-center">LLM Dashboard</h2>
          <Row>
            <Col xs={12} lg={8}>
              <Card className="mb-3">
                <Card.Body>
                  <Line data={performanceMetrics} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={4}>
              <Card className="mb-3">
                <Card.Body>
                  <h5>Interpretation</h5>
                  <p><strong>Sentiment:</strong> {interpretation.sentiment}</p>
                  <p><strong>Keywords:</strong> {interpretation.keywords.join(', ') || 'None'}</p>
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <h5>Response Time</h5>
                  <ProgressBar now={140} max={250} label="140ms" />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Chat Section */}
          <Row>
            <Col>
              <Card className="mb-3">
                <Card.Body>
                  <h5>Real-Time Chat</h5>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Ask the AI"
                      value={message}
                      onChange={handleInputChange}
                    />
                    <Button type="submit" disabled={!message.trim()} variant="primary">
                      Send
                    </Button>
                  </form>
                  <div className="mt-3">
                    <p><strong>You:</strong> {message}</p>
                    {isTyping && <p>AI is typing...</p>}
                    <p><strong>AI:</strong> {response}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* File Upload Section */}
          <Row>
            <Col>
              <Card className="mb-3">
                <Card.Body>
                  <h5>File Upload</h5>
                  <Form onSubmit={handleFileUpload}>
                    <input type="file" className="form-control mb-2" onChange={handleFileChange} />
                    <Form.Control as="select" value={task} onChange={handleTaskChange} className="mb-2">
                      <option value="summarization">Summarization</option>
                      <option value="text-extraction">Text Extraction</option>
                      <option value="keyword-recognition">Keyword Recognition</option>
                      <option value="table-extraction">Table Extraction</option>
                    </Form.Control>
                    <Button type="submit" disabled={!file} variant="success">
                      Upload
                    </Button>
                  </Form>
                  <div className="mt-3">
                    {uploadResponse.message && (
                      <Alert variant={uploadResponse.variant}>
                        {uploadResponse.message}
                      </Alert>
                    )}
                    <h6>Extracted or Summarized Data:</h6>
                    <pre>{extractedData}</pre>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;