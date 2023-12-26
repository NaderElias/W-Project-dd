import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import AppNavBar from "../components/navbar";
import axios from "axios";
let backend_url = "http://localhost:3000/api";
import "../styles/Brands.css";

export default function FAQPage() {
	const [faqs, setFaqs] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredFaqs, setFilteredFaqs] = useState([]);

	useEffect(() => {
		// Fetch FAQs from your API
		const fetchFAQs = async () => {
			try {
				const response = await axios.get(
					`${backend_url}/knowledgeBase/get-knowledgeBase`,
					{ withCredentials: true }
				);
				const data = response.data.FAQs;
				setFaqs(data);
				setFilteredFaqs(data);
			} catch (error) {
				console.error("Error fetching FAQs:", error);
			}
		};

		fetchFAQs();
	}, []); // The empty dependency array ensures the effect runs only once

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	const handleSearchClick = () => {
		const query = searchQuery.toLowerCase();

		const filtered = faqs.filter(
			(faq) =>
				faq.title.toLowerCase().includes(query) ||
				faq.content.toLowerCase().includes(query)
		);
		setFilteredFaqs(filtered);
	};

	return (
		<div className={`test ${localStorage.getItem("theme-color")}`}>
			<AppNavBar />
			<div class="page-background">
				<Container className="mt-5">
					<h2 className="text-center mb-4 txt">Frequently Asked Questions</h2>

					{/* Search input and button */}
					<Form className="mb-4 d-flex">
						<Form.Control
							type="text"
							placeholder="Search FAQs"
							value={searchQuery}
							onChange={handleSearchChange}
							className="me-2"
						/>
						<Button variant="primary" onClick={handleSearchClick}>
							Search
						</Button>
					</Form>

					{/* FAQs list */}
					{filteredFaqs.map((faq, index) => (
						<div key={index} className="mb-4">
							<h4>{faq.title}</h4>
							<p>{faq.content}</p>
						</div>
					))}

					{/* Add a back-to-top button */}
					<Button
						variant="secondary"
						onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						className="position-fixed bottom-0 end-0 mb-3 me-3"
					>
						Back to Top
					</Button>
				</Container>
			</div>
		</div>
	);
}
