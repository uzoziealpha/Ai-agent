import React from 'react';
import { BsQuestionCircle } from 'react-icons/bs';
import { ListGroup } from 'react-bootstrap';

const unansweredQuestions = [
  'How can I improve my AI response time?',
  'What are the latest features?',
];

const UnansweredQuestions = () => {
  return (
    <div>
      <h3><BsQuestionCircle /> Unanswered Questions Section</h3>
      <ListGroup>
        {unansweredQuestions.map((question, index) => (
          <ListGroup.Item key={index}>{question}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default UnansweredQuestions;