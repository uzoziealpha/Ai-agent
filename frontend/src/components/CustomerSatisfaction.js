import React from 'react';
import { BsStar } from 'react-icons/bs';
import ReactStars from 'react-stars';

const CustomerSatisfaction = () => {
  return (
    <div>
      <h3><BsStar /> Customer Satisfaction</h3>
      <ReactStars count={5} size={24} color2={'#ffd700'} />
    </div>
  );
};

export default CustomerSatisfaction;