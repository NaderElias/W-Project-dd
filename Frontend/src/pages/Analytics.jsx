import { PieChart, Pie, Cell, Legend } from "recharts";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import AppNavBar from "../components/navbar";
import axios from "axios";

const AnalyticsPage = () => {
	const [analyticsData, setAnalyticsData] = useState(null);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/api/reports/get-Analytics",
					{ withCredentials: true }
				);
				setAnalyticsData(response.data);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			}
		};

		fetchData();
	}, []); // Empty dependency array ensures that this effect runs once when the component mounts

	const data = [
		{ name: "Geeksforgeeks", students: 400 },
		{ name: "Technical scripter", students: 700 },
		{ name: "Geek-i-knack", students: 200 },
		{ name: "Geek-o-mania", students: 1000 },
	];
	const colors = ["#36A2EB", "#FFCE56", "#FF6384"]; // Customize colors as needed

	let issue;
	let statusPercent;
	let statusPercentFilter;
	let relation;

	for (const key in analyticsData) {
		if (analyticsData.hasOwnProperty(key)) {
			const value = analyticsData[key];

			// Output key and value to console

			// If the value is an array or object, you can further iterate through its elements
			if (Array.isArray(value) || typeof value === "object") {
				// Assign values to specific variables based on the key
				switch (key) {
					case "issue":
						issue = value;
						break;
					case "statusPercent":
						statusPercent = value;
						break;
					case "statusPercentfilter":
						statusPercentFilter = value;
						break;
					case "relation":
						relation = value;
						break;
					default:
						break;
				}

				// Log each element of the array
			}
		}
	}

	// Now you can use the variables: issue, statusPercent, statusPercentFilter, and relation

	return (
		<>
			<AppNavBar />
			<Container>
				<PieChart width={700} height={700} margin={50}>
					<Pie
						data={statusPercent}
						dataKey="percentage"
						nameKey="status"
						outerRadius={250}
						fill="#8884d8"
						label
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={colors[index % colors.length]}
							/>
						))}
					</Pie>
					<Legend />
				</PieChart>
			</Container>
		</>
	);
};

export default AnalyticsPage;
