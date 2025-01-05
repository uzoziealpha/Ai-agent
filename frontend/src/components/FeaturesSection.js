import React from 'react';
import { BsSpeedometer2, BsFillEmojiSmileFill, BsClock, BsGear, BsQuestionCircle, BsFillFileImageFill, BsFillChatDotsFill, BsFillDatabaseFill, BsStar } from 'react-icons/bs'; // Bootstrap icons
import { Container, Row, Col, Card } from 'react-bootstrap';
import { ResponsiveBar } from '@nivo/bar'; // Nivo Bar chart for animated metrics

// Mock data for the features
const mockData = [
  {
    icon: <BsSpeedometer2 size={30} />,
    title: 'Performance Metrics',
    description: 'Track response times and system performance.',
    value: 350, // Response time in ms
    insight: 'System performance has consistently improved by 15% over the last month.',
    data: [
      { country: 'Jan', performance: 300 },
      { country: 'Feb', performance: 320 },
      { country: 'Mar', performance: 350 },
      { country: 'Apr', performance: 370 },
    ],
  },
  {
    icon: <BsFillEmojiSmileFill size={30} />,
    title: 'Sentiment Analysis',
    description: 'Analyze customer messages for sentiment (positive/negative).',
    value: '89%',
    insight: 'Sentiment analysis shows a positive trend, with 89% of interactions rated as positive.',
    data: [
      { country: 'Jan', sentiment: 80 },
      { country: 'Feb', sentiment: 85 },
      { country: 'Mar', sentiment: 89 },
      { country: 'Apr', sentiment: 92 },
    ],
  },
  {
    icon: <BsClock size={30} />,
    title: 'User Interaction History',
    description: 'View historical interactions with the AI.',
    value: 10,
    insight: 'User engagement is increasing with higher interaction frequency.',
    data: [
      { country: 'Jan', interactions: 5 },
      { country: 'Feb', interactions: 7 },
      { country: 'Mar', interactions: 10 },
      { country: 'Apr', interactions: 12 },
    ],
  },
  {
    icon: <BsGear size={30} />,
    title: 'Customizable Dashboards',
    description: 'Personalize the AI dashboard for your needs.',
    value: '3 active',
    insight: 'Customization options improve productivity and user satisfaction.',
    data: [
      { country: 'Jan', dashboards: 1 },
      { country: 'Feb', dashboards: 2 },
      { country: 'Mar', dashboards: 3 },
      { country: 'Apr', dashboards: 4 },
    ],
  },
  {
    icon: <BsQuestionCircle size={30} />,
    title: 'Unanswered Questions Section',
    description: 'List unanswered questions for human intervention.',
    value: 2,
    insight: 'The AI has improved in handling queries, reducing human intervention.',
    data: [
      { country: 'Jan', unanswered: 5 },
      { country: 'Feb', unanswered: 4 },
      { country: 'Mar', unanswered: 3 },
      { country: 'Apr', unanswered: 2 },
    ],
  },
  {
    icon: <BsFillFileImageFill size={30} />,
    title: 'AI Interaction with Image Upload',
    description: 'Upload images for AI analysis and response.',
    value: 45,
    insight: 'The AI-powered image analysis is growing in popularity.',
    data: [
      { country: 'Jan', images: 10 },
      { country: 'Feb', images: 20 },
      { country: 'Mar', images: 35 },
      { country: 'Apr', images: 45 },
    ],
  },
  {
    icon: <BsFillChatDotsFill size={30} />,
    title: 'Real-time Chat',
    description: 'Engage with the AI in real-time.',
    value: 10,
    insight: 'Real-time chat is the most popular feature, with AI handling multiple conversations simultaneously.',
    data: [
      { country: 'Jan', chats: 5 },
      { country: 'Feb', chats: 8 },
      { country: 'Mar', chats: 10 },
      { country: 'Apr', chats: 15 },
    ],
  },
  {
    icon: <BsFillDatabaseFill size={30} />,
    title: 'AI Training Data Section',
    description: 'Logs interactions for training the AI.',
    value: 1200,
    insight: 'The dataset is rapidly growing, enabling more accurate AI responses.',
    data: [
      { country: 'Jan', logs: 500 },
      { country: 'Feb', logs: 800 },
      { country: 'Mar', logs: 1000 },
      { country: 'Apr', logs: 1200 },
    ],
  },
  {
    icon: <BsStar size={30} />,
    title: 'Customer Satisfaction',
    description: 'Submit ratings after AI interaction.',
    value: '98%',
    insight: '98% satisfaction rate, indicating strong user approval.',
    data: [
      { country: 'Jan', satisfaction: 95 },
      { country: 'Feb', satisfaction: 96 },
      { country: 'Mar', satisfaction: 98 },
      { country: 'Apr', satisfaction: 99 },
    ],
  }
];

const FeaturesSection = () => {
  return (
    <div className="features-section">
      <h2>AI Dashboard Features</h2>
      <Container>
        <Row xs={1} sm={2} md={3} lg={3} xl={3}>
          {mockData.map((feature, index) => (
            <Col key={index}>
              <Card className="mb-3">
                <Card.Body>
                  {feature.icon}
                  <h5>{feature.title}</h5>
                  <p>{feature.description}</p>
                  <strong>{feature.value}</strong>
                  <p className="insight">{feature.insight}</p> {/* Added Insight */}

                  {/* Nivo Bar Chart for each feature */}
                  <div style={{ height: 250 }}>
                    <ResponsiveBar
                      data={feature.data}
                      keys={['performance', 'sentiment', 'interactions', 'dashboards', 'unanswered', 'images', 'chats', 'logs', 'satisfaction']}
                      indexBy="country"
                      margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                      padding={0.3}
                      groupMode="grouped"
                      layout="horizontal"
                      colors={{ scheme: 'nivo' }}
                      animate={true}
                      motionStiffness={90}
                      motionDamping={15}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default FeaturesSection;