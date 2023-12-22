// src/components/TicketCard.js
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../styles/TicketCard.css';

const TicketCard = ({ ticketKey, ticket }) => {
  const [newRating, setNewRating] = useState(1);

  const handleRatingChange = () => {
    axios.put(`http://localhost:3000/api/tickets/update-Rating?_id=${ticketKey}`, { rating: newRating }, { withCredentials: true })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => console.error('Error updating rating:', error));
  };

  return (
    <div className="ticket-card">
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
      <p className="rating">Rating: {ticket.rating}</p>
      <div className="rating-section">
        <label htmlFor={`ratingDropdown-${ticket._id}`}>Select Rating:</label>
        <select
          id={`ratingDropdown-${ticket._id}`}
          value={newRating}
          onChange={(e) => setNewRating(e.target.value)}
        >
          {[1, 2, 3, 4, 5].map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <button onClick={handleRatingChange} className="change-rating-button">
          Change Rating
        </button>
      </div>
    </div>
  );
};

TicketCard.propTypes = {
  ticketKey: PropTypes.string.isRequired,
  ticket: PropTypes.object.isRequired,
};

export default TicketCard;
