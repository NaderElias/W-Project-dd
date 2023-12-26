import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Table, Button, Form, Modal } from "react-bootstrap";
import AppNavBar from "../components/navbar";

const backend_url = "http://localhost:3000/api";

const Reports = () => {
	const [cookies] = useCookies(["token"]);
	const [reports, setReports] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		agentPerformance: "",
	});
	const [isCreating, setIsCreating] = useState(true);

	useEffect(() => {
		// Fetch reports when the component mounts
		const fetchReports = async () => {
			try {
				const response = await axios.get(
					`${backend_url}/reports/get-All-Reports`,
					{
						withCredentials: true,
					}
				);
				const { status, data } = response;
        console.log(data);
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

	const handleUpdateReport = async (reportId) => {
		try {
			const response = await axios.put(
				`${backend_url}/reports/update-Reports?_id=${reportId}`,
				{ ...formData },
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
			const response = await axios.delete(
				`${backend_url}/reports/delete-Report`,
				{
					withCredentials: true,
					data: { ticketId: reportId },
				}
			);
			const { status } = response;
			if (status === 200) {
				const updatedReports = reports.filter(
					(report) => report.ticketId !== reportId
				);
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
		<>
			<AppNavBar />
			<div className="reports-container">
				<h2>Reports</h2>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title>Update Report</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
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
						<Button
							variant="primary"
							onClick={() => handleUpdateReport(formData.ticketId)}
						>
							Update Report
						</Button>
					</Modal.Footer>
				</Modal>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Ticket Title</th>
							<th>Ticket Status</th>
							<th>Resolution Time</th>
							<th>Agent Performance</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{reports.map((report) => (
							<tr key={report._id}>
								<td>{report.ticketTitle}</td>
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
		</>
	);
};

export default Reports;
