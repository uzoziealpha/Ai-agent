import React from 'react';
import { Nav } from 'react-bootstrap';
import { BsFillEmojiSmileFill, BsGear, BsClock, BsQuestionCircle, BsFillFileImageFill, BsStar } from 'react-icons/bs';
import './Sidebar.css'; // Import Sidebar-specific styles if any

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Link href="/sentiment-analysis" className="nav-link">
          <BsFillEmojiSmileFill size={20} /> Sentiment Analysis
        </Nav.Link>
        <Nav.Link href="/settings" className="nav-link">
          <BsGear size={20} /> Settings
        </Nav.Link>
        <Nav.Link href="/user-history" className="nav-link">
          <BsClock size={20} /> User Interaction History
        </Nav.Link>
        <Nav.Link href="/faqs" className="nav-link">
          <BsQuestionCircle size={20} /> FAQs
        </Nav.Link>
        <Nav.Link href="/image-generation" className="nav-link">
          <BsFillFileImageFill size={20} /> Image Generation
        </Nav.Link>
        <Nav.Link href="/rating-system" className="nav-link">
          <BsStar size={20} /> Rating System
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;