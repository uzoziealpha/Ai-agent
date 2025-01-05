import React from 'react';
import { BsClock } from 'react-icons/bs';
import { Table } from 'react-bootstrap';

const userInteractionHistory = [
  { user: 'John Doe', message: 'Hello AI', date: '2025-01-01', response: 'Hello, how can I help you?' },
];

const UserInteractionHistory = () => {
  return (
    <div>
      <h3><BsClock /> User Interaction History</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User</th>
            <th>Message</th>
            <th>Date</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          {userInteractionHistory.map((interaction, index) => (
            <tr key={index}>
              <td>{interaction.user}</td>
              <td>{interaction.message}</td>
              <td>{interaction.date}</td>
              <td>{interaction.response}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserInteractionHistory;