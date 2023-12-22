import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import AppNavBar from "../components/navbar";
import axios from "axios";
let backend_url = "http://localhost:3000/api";

export default function FAQPage() {
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
				console.log(data);
				setFilteredFaqs(data);
			} catch (error) {
				console.error("Error fetching FAQs:", error);
			}
		};

		fetchFAQs();
	}, []); // The empty dependency array ensures the effect runs only once

	const handleSearchChange = (e) => {
		const query = e.target.value.toLowerCase();
		setSearchQuery(query);

		// Filter FAQs based on the search query
		const filtered = faqs.filter(
			(faq) =>
				faq.question.toLowerCase().includes(query) ||
				faq.answer.toLowerCase().includes(query)
		);
		setFilteredFaqs(filtered);
	};

	return (
		<>
			<AppNavBar />
			<Container className="mt-5">
				<h2 className="text-center mb-4">Frequently Asked Questions</h2>

				{/* Search input */}
				<Form.Control
					type="text"
					placeholder="Search FAQs"
					value={searchQuery}
					onChange={handleSearchChange}
					className="mb-4"
				/>

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
		</>
	);
}
