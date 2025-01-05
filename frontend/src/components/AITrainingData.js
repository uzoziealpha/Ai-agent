import React from 'react';
import { BsFillDatabaseFill } from 'react-icons/bs';
import { Table } from 'react-bootstrap';

const trainingLogs = [
  { date: '2025-01-01', accuracy: '95%' },
];

const AITrainingData = () => {
  return (
    <div>
      <h3><BsFillDatabaseFill /> AI Training Data</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {trainingLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.date}</td>
              <td>{log.accuracy}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AITrainingData;