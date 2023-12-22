import React, { useState } from 'react';
import axios from 'axios';

const TicketCard = ({key, ticket }) => {
  const [newRating, setNewRating] = useState(1);

  const handleRatingChange = () => {
    // Add logic to update the ticket rating via backend API
    axios.put(`/api/tickets/update-Rating?_id= ${key}`,{ rating: newRating },{ withCredentials: true })
      .then(response => {
        response.data
      })
      .catch(error => console.error('Error updating rating:', error));
  };

  return (
    <div className="ticket-card">
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
      <p>Rating: {ticket.rating}</p>

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

      <button onClick={handleRatingChange}>Change Rating</button>
    </div>
  );
};

export default TicketCard;
