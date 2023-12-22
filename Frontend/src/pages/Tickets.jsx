import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "../styles/Tickets.css";
import TicketCard from "../components/TicketCard";

Modal.setAppElement("#root"); // Set the root element for the modal

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: "", description: "",category:"",subCategory:"",priority:""});

  useEffect(() => {
    // Fetch tickets from backend API
    if (localStorage.getItem("role") === "agent") {
      axios
        .get(
          `http://localhost:3000/api/tickets/get-All-Tickets?userId=${localStorage.getItem(
            "userId"
          )}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => setTickets(response.data.tickets))
        .catch((error) => console.error("Error fetching tickets:", error));
    } else if (localStorage.getItem("role") === "user") {

      axios
        .get(
          `http://localhost:3000/api/tickets/get-All-Tickets?userId=${localStorage.getItem( "userId")}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => setTickets(response.data.tickets))
        .catch((error) => console.error("Error fetching tickets:", error));}
     else {
      axios
        .get("http://localhost:3000/api/tickets/get-All-Tickets", { withCredentials: true })
        .then((response) => setTickets(response.data.tickets))
        .catch((error) => console.error("Error fetching tickets:", error));
    }
    
  }, []); // Empty dependency array ensures the effect runs once on mount

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewTicket({ title: "", description: "",category:"",subCategory:"",priority:"" }); // Reset form fields
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prevTicket) => ({ ...prevTicket, [name]: value }));
  };

  const createNewTicket  = async () => {
   console.log(newTicket);
   const tick= await axios
    .post(`http://localhost:3000/api/tickets/create-Ticket?userId=${localStorage.getItem("userId")}`, newTicket, { withCredentials: true })
    .catch((error) => console.error("Error creating ticket:", error));
    closeModal();

    // Close the modal after creating the ticket
    
  };

  return (
    <div className="Tickets">
     <h1>Your Tickets</h1>
<div className="ticketContainer">
  
  {tickets.length > 0 ? (
    tickets.map((ticket) => (
      <TicketCard ticketKey={ticket._id} ticket={ticket} />
    ))
  ) : (
    <p>No tickets available.</p>
  )}


      </div>
      <button className="newTicketButton" onClick={openModal}>
        Create New Ticket
      </button>

      {/* Modal for creating a new ticket */}
      
      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  className="modal"
  overlayClassName="overlay"
>
  <div className="modal-content">
    <h2>Create New Ticket</h2>

    <div className="form-group">
      <label htmlFor="category">Category:</label>
      <select
        name="category"
        value={newTicket.category}
        onChange={handleInputChange}
        className="select-dropdown"
      >
        <option value="software">Software</option>
        <option value="hardware">Hardware</option>
        <option value="network">Network</option>
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="subCategory">Sub category:</label>
      <select
        name="subCategory"
        value={newTicket.subCategory}
        onChange={handleInputChange}
        className="select-dropdown"
      >
        <option value="Desktops">Desktops</option>
        <option value="Laptops">Laptops</option>
        <option value="Printers">Printers</option>
        <option value="Servers">Servers</option>
        <option value="Networking equipment">Networking equipment</option>
        <option value="Operating system">Operating system</option>
        <option value="Application software">Application software</option>
        <option value="Custom software">Custom software</option>
        <option value="Integration issues">Integration issues</option>
        <option value="Email issues">Email issues</option>
        <option value="Internet connection problems">Internet connection problems</option>
        <option value="Website errors">Website errors</option>
      </select>
    </div>

    <form>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={newTicket.title}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={newTicket.description}
          onChange={handleInputChange}
          className="textarea-field"
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority:</label>
        <select
          name="priority"
          value={newTicket.priority}
          onChange={handleInputChange}
          className="select-dropdown"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="button-group">
        <button type="button" onClick={createNewTicket} className="create-button">
          Create Ticket
        </button>
        <button type="button" onClick={closeModal} className="cancel-button">
          Cancel
        </button>
      </div>
    </form>
  </div>
</Modal>


    </div>
  );
}

export default Tickets;
