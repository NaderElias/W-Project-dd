import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "../styles/Tickets.css";
import TicketCard from "../components/TicketCard";

Modal.setAppElement("#root"); // Set the root element for the modal

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    priority: "",
  });
  const [workFlow,setWorkFlow] = useState([]);
  let worb = false;
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
          `http://localhost:3000/api/tickets/get-All-Tickets?userId=${localStorage.getItem(
            "userId"
          )}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => setTickets(response.data.tickets))
        .catch((error) => console.error("Error fetching tickets:", error));
    } else {
      axios
        .get("http://localhost:3000/api/tickets/get-All-Tickets", {
          withCredentials: true,
        })
        .then((response) => setTickets(response.data.tickets))
        .catch((error) => console.error("Error fetching tickets:", error));
    }
  }, []); // Empty dependency array ensures the effect runs once on mount

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewTicket({
      title: "",
      description: "",
      category: "",
      subCategory: "",
      priority: "",
    }); // Reset form fields
  };

  const getWorkflow = async () => {
	await axios
	.get(
	  `http://localhost:3000/api/automation/get-workflow?issueType=${newTicket.category}&subCategory=${newTicket.subCategory}`,
	  {
		withCredentials: true,
	  }
	)
	.then((response) => {console.log(response);setWorkFlow(response.data.workFlow.workflow);})
	.catch((error) => console.error("Error fetching workFlow:", error));
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setNewTicket((prevTicket) => ({ ...prevTicket, [name]: value }));
	console.log(newTicket);
	if(newTicket.category != "" && newTicket.subCategory != ""){
		getWorkflow();
	}
    
  };

  const createNewTicket = async () => {
    console.log(newTicket);

    const tick = await axios
      .post(
        `http://localhost:3000/api/tickets/create-Ticket?userId=${localStorage.getItem(
          "userId"
        )}`,
        newTicket,
        { withCredentials: true }
      )
      .catch((error) => console.error("Error creating ticket:", error));

    closeModal();

    // Close the modal after creating the ticket
  };

  const subCategoriesByCategory = {
    software: [
      "Operating system",
      "Application software",
      "Custom software",
      "Integration issues",
    ],
    hardware: ["Desktops", "Laptops", "Printers", "Servers"],
    network: [
      "Networking equipment",
      "Email issues",
      "Internet connection problems",
      "Website errors",
    ],
  };

  const subCategoriesOptions =
     subCategoriesByCategory[newTicket.category]||[];

  const flag = (e) => {
    const { name, value } = e.target;
    setNewTicket((prevTicket) => ({ ...prevTicket, [name]: value }));
    //get work flow
  };
  return (
    <div className="Tickets">
      <h1>Your Tickets</h1>
      <div className="ticketContainer">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
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
              <option value="">Select Category</option>
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
              <option value="">Select Subcategory</option>
              {subCategoriesOptions.map((subCategory) => (
                <option key={subCategory} value={subCategory}>
                  {subCategory}
                </option>
              ))}
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
              <button
                type="button"
                onClick={createNewTicket}
                className={`create-button ${
                  !(newTicket.category && newTicket.subCategory)
                    ? "disabled"
                    : ""
                }`}
                disabled={!newTicket.category || !newTicket.subCategory}
              >
                Create Ticket
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="workf"
        overlayClassName="overlayf"
      >
        <div className="modal-content right-position">
          <div>
            <p>{workFlow}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Tickets;
