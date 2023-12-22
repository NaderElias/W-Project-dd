import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Table, Button, Form, Modal } from "react-bootstrap";

const backend_url = "http://localhost:3000/api";

const Reports = () => {
  const [cookies] = useCookies(["token"]);
  const [reports, setReports] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ticketId: "",
    ticketStatus: "",
    resolutionTime: "",
    agentPerformance: "",
  });
  const [isCreating, setIsCreating] = useState(true);

  useEffect(() => {
    // Fetch reports when the component mounts
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${backend_url}/reports/get-All-Reports`, {
          withCredentials: true,
        });
        const { status, data } = response;
        if (status === 200) {
          setReports(data.reportsAnalytics);
        } else {
          setErrorMessage("Failed to fetch reports");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Server error");
      }
    };

    fetchReports();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateReport = async () => {
    try {
      const response = await axios.post(
        `${backend_url}/reports/create-Report`,
        formData,
        { withCredentials: true }
      );
      const { status, data } = response;
      if (status === 201) {
        setReports([...reports, data.report]);
        handleCloseModal();
      } else {
        setErrorMessage("Failed to create report");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Server error");
    }
  };

  const handleUpdateReport = async (reportId) => {
    try {
      const response = await axios.put(
        `${backend_url}/reports/update-Reports`,
        { ...formData, ticketId: reportId },
        { withCredentials: true }
      );
      const { status, data } = response;
      if (status === 200) {
        const updatedReports = reports.map((report) =>
          report.ticketId === reportId ? data.report : report
        );
        setReports(updatedReports);
        handleCloseModal();
      } else {
        setErrorMessage("Failed to update report");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Server error");
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      const response = await axios.delete(`${backend_url}/reports/delete-Report`, {
        withCredentials: true,
        data: { ticketId: reportId },
      });
      const { status } = response;
      if (status === 200) {
        const updatedReports = reports.filter((report) => report.ticketId !== reportId);
        setReports(updatedReports);
      } else {
        setErrorMessage("Failed to delete report");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Server error");
    }
  };

  const handleShowCreateModal = () => {
    setFormData({
      ticketId: "",
      ticketStatus: "",
      resolutionTime: "",
      agentPerformance: "",
    });
    setIsCreating(true);
    handleShowModal();
  };

  const handleShowUpdateModal = (report) => {
    setFormData(report);
    setIsCreating(false);
    handleShowModal();
  };

  return (
    <div className="reports-container">
      <h2>Reports</h2>
      <Button variant="primary" onClick={handleShowCreateModal}>
        Create Report
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create/Update Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTicketId">
              <Form.Label>Ticket ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Ticket ID"
                name="ticketId"
                value={formData.ticketId}
                onChange={handleOnChange}
              />
            </Form.Group>
            <Form.Group controlId="formTicketStatus">
              <Form.Label>Ticket Status</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Ticket Status"
                name="ticketStatus"
                value={formData.ticketStatus}
                onChange={handleOnChange}
              />
            </Form.Group>
            <Form.Group controlId="formResolutionTime">
              <Form.Label>Resolution Time</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Resolution Time"
                name="resolutionTime"
                value={formData.resolutionTime}
                onChange={handleOnChange}
              />
            </Form.Group>
            <Form.Group controlId="formAgentPerformance">
              <Form.Label>Agent Performance</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Agent Performance"
                name="agentPerformance"
                value={formData.agentPerformance}
                onChange={handleOnChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {isCreating ? (
            <Button variant="primary" onClick={handleCreateReport}>
              Create Report
            </Button>
          ) : (
            <Button variant="primary" onClick={() => handleUpdateReport(formData.ticketId)}>
              Update Report
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Ticket Status</th>
            <th>Resolution Time</th>
            <th>Agent Performance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td>{report.ticketId}</td>
              <td>{report.ticketStatus}</td>
              <td>{report.resolutionTime}</td>
              <td>{report.agentPerformance}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowUpdateModal(report)}
                >
                  Edit
                  </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteReport(report.ticketId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Reports;
