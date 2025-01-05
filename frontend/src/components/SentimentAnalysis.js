const FeaturesSection = () => {
    const [sentiments, setSentiments] = useState({ positive: 0, negative: 0, neutral: 0 });
  
    const handleSentimentAnalysis = () => {
      const newSentiments = { ...sentiments };
      const randomSentiment = Math.random();
  
      if (randomSentiment < 0.4) {
        newSentiments.positive += 1; // 40% chance for positive
      } else if (randomSentiment < 0.8) {
        newSentiments.negative += 1; // 40% chance for negative
      } else {
        newSentiments.neutral += 1; // 20% chance for neutral
      }
  
      setSentiments(newSentiments);
    };
  
    const getSentimentEmoji = () => {
      const { positive, negative } = sentiments;
      if (positive + negative === 0) return '😐'; // Neutral face if no sentiment data yet
  
      const ratio = positive / (positive + negative);
      if (ratio > 0.7) return '😁'; // Very positive
      if (ratio > 0.4) return '🙂'; // Slightly positive
      if (ratio > 0.2) return '😟'; // Slightly negative
      return '😡'; // Very negative
    };
  
    return (
      <div className="features-section">
        <h2>AI Dashboard Features</h2>
        <Container>
          <Row xs={1} sm={2} md={3} lg={3} xl={3}>
            <Col>
              <Card className="feature-card">
                <Card.Body>
                  <BsSpeedometer2 size={30} />
                  <h5>Performance Metrics</h5>
                  <p>Track response times and system performance.</p>
                  <Line data={performanceData} options={options} />
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="feature-card">
                <Card.Body>
                  <BsFillEmojiSmileFill size={30} />
                  <h5>Sentiment Analysis</h5>
                  <p>Analyze customer messages for sentiment (positive/negative).</p>
                  <Button onClick={handleSentimentAnalysis}>Analyze Sentiment</Button>
                  <div style={{ fontSize: '2rem', marginTop: '10px' }}>
                    {getSentimentEmoji()} {/* Dynamic emoji based on sentiment */}
                  </div>
                  <p>Positive: {sentiments.positive}, Negative: {sentiments.negative}, Neutral: {sentiments.neutral}</p>
                </Card.Body>
              </Card>
            </Col>
            {/* Other feature cards remain unchanged */}
          </Row>
        </Container>
      </div>
    );
  };