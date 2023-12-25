// src/components/TicketCard.js
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../styles/TicketCard.css';
import Modal from "react-modal";
Modal.setAppElement("#root"); // Set the root element for the modal

const TicketCard = ({ ticketKey, ticket }) => {
  const [newRating, setNewRating] = useState(1);
  const [lec, setLec] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [reporto, setReporto] = useState(false);
  const [newTicket, setNewTicket] = useState({
    _id:ticket._id,
    resolutionDetails: "",
    workflow: "",
    
  });

  const [newReport, setNewReport] = useState({
    ticketId:ticket._id,
    ticketStatus:"closed",
    resolutionTime: ticket.closedAt,
    agentPerformance: "",
    
  });
const mec = {_id:ticket._id,status:'closed'}


  const handleRatingChange = () => {
    axios.put(`http://localhost:3000/api/tickets/update-Rating?_id=${ticket._id}`, { rating: newRating }, { withCredentials: true })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => console.error('Error updating rating:', error));
      console.log('trasj');
      setLec(lec+1);
      ticket.rating=newRating;
  };

  const handleClose = () => {
    axios.put(`http://localhost:3000/api/tickets/update-Ticket`,mec,  {withCredentials: true })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => console.error('Error updating rating:', error));
      setLec(lec+1);
  };

  const handleUpdateForm= () => {
   setModalOpen(true);
  };
  const reportTrue= () => {
    setReporto(true);
   };

  const handleUpdate= async () => {
    //here update sol

    const ticko = await axios
      .put(
        `http://localhost:3000/api/tickets/update-Ticket?`,
        newTicket,
        { 
          
          withCredentials: true }
      )
      .catch((error) => console.error("Error updating solution:", error));
    setModalOpen(false);
    ticket=newTicket;
    setLec(lec+1);
   //update ticket
   };


   const handleReport= async () => {
    //here update sol
    setNewReport({ticketId:ticket._id,ticketStatus:'closed',resolutionTime: ticket.closedAt});
    console.log(newReport);
    const tickom = await axios
      .post(
        `http://localhost:3000/api/reports/create-Report`,
        newReport,
        { 
          
          withCredentials: true }
      )
      .catch((error) => console.error("Error createing Report:", error));
    setReporto(false);
    setLec(lec+1);
    
   //update ticket
   };



   const closeModal = () => {
    setModalOpen(false);
    setNewTicket({
      ticketId:ticket._id,
    ticketStatus:"closed",
     resolutionDetails:"",
     workflow:"",
    }); // Reset form fields
  };

  const closeModalR = () => {
    setReporto(false);
    
    setNewReport({
      ticketId:ticket._id,
    ticketStatus:"closed",
     resolutionTime:"",
     agentPerformance:"",
    });
    console.log(newReport.ticketId,newReport.ticketStatus);
    
    // Reset form fields
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setNewTicket((prevTicket) => ({ ...prevTicket, [name]: value }));}

    const handleInputChangeR = (e) => {
      /*
      if(e.target.id=="resolutionTime"){
        console.log(e.target.id);
        console.log('time');
        setNewReport({resolutionTime:e.target.value});
      }  */
      
   
      const { name, value } = e.target;
    
      setNewReport((prevReport) => ({
        ...prevReport,
        [name]: value
      }));
     
  
    };


    

  return (
    <div className="ticket-card">
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
      <p>status:{ticket.status}</p>
      {ticket.resolutionDetails && ticket.workflow && ticket.status=='closed'&& (
  <div>
    <p>Resolution Details: {ticket.resolutionDetails}</p>
    <p>Workflow: {ticket.workflow}</p>
  </div>
)}
     
      <p className="rating">Rating: {ticket.rating}</p>
      {localStorage.getItem("role") === "user" ?  <div className="rating-section">
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
      </div>: null}
      {localStorage.getItem("role") === "agent"? 
      
      <button onClick={handleUpdateForm} className="change-rating-button" disabled={ticket.status=='closed'}>
      update ticket
    </button>
      
      :null}
      {localStorage.getItem("role") === "agent" &&ticket.status!='closed' ? 
      <button onClick={handleClose} className="change-rating-button">
          close ticket
        </button>
      
      : null}


{localStorage.getItem("role") === "manager" &&ticket.status=='closed' ? 
      <button onClick={reportTrue} className="change-rating-button">
          Create Report
        </button>
      
      : null}


<Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-content">
          <h2>update solution</h2>
            <form>
            <div className="form-group">
              <label htmlFor="resolutionDetails">Resolution Details:</label>
              <input
                type="resolutionDetails"
                id="resolutionDetails"
                name="resolutionDetails"
                value={newTicket.resolutionDetails}
                onChange={handleInputChange}
                className="textarea-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="workflow">Work Flow:</label>
              <textarea
                id="workflow"
                name="workflow"
                value={newTicket.workflow}
                onChange={handleInputChange}
                className="textarea-field"
              />
            </div>

            <button
                type="button"
                onClick={handleUpdate}
                className={`create-button ${
                  !(newTicket.resolutionDetails && newTicket.workflow)
                    ? "disabled"
                    : ""
                }`}
                disabled={!newTicket.resolutionDetails || !newTicket.workflow}
              >
                Update Solution
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="cancel-button"
              >
                Cancel
              </button>

              </form>
         </div>
      </Modal>


      <Modal
        isOpen={reporto}
        onRequestClose={closeModalR}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-content">
          <h2>Create Report</h2>
            <form>

            <div className="form-group">
              <label htmlFor="agentPerformance">Agent Performance:</label>
              <textarea
                id="agentPerformance"
                name="agentPerformance"
                value={newReport.agentPerformance}
                onChange={handleInputChangeR}
                
              />
            </div>

            <button
                type="button"
                onClick={handleReport}
                className={`create-button ${
                  !(newReport.resolutionTime && newReport.agentPerformance)
                    ? "disabled"
                    : ""
                }`}
                disabled={!newReport.resolutionTime || !newReport.agentPerformance}
              >
                Create Report
              </button>
              <button
                type="button"
                onClick={closeModalR}
                className="cancel-button"
              >
                Cancel
              </button>

              </form>
         </div>
      </Modal>



    </div>
  );
};

TicketCard.propTypes = {
  ticketKey: PropTypes.string.isRequired,
  ticket: PropTypes.object.isRequired,
};

export default TicketCard;
