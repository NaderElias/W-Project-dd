import { PieChart, Pie, Cell,Legend,Tooltip,Layer,LineChart, Line, XAxis, YAxis, CartesianGrid,Bar,BarChart,ResponsiveContainer, ScatterChart,
	Scatter, } from "recharts";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import AppNavBar from "../components/navbar";
import axios from "axios";
import "../styles/Brands.css";

const AnalyticsPage = () => {
	const navigate = useNavigate();
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
				if (error.response.status == 403) {
					removeCookies("token");
					navigate("/");
				}
			}
		};
		if(localStorage.getItem("role") === "user" || localStorage.getItem("role") === "agent"){
			navigate("/")
		}

		fetchData();
	}, []); // Empty dependency array ensures that this effect runs once when the component mounts

	const data = [
		{ name: "Geeksforgeeks", students: 400 },
		{ name: "Technical scripter", students: 700 },
		{ name: "Geek-i-knack", students: 200 },
		{ name: "Geek-o-mania", students: 1000 },
	];
	const colors = ['#FF5733', '#33FF57', '#5733FF', '#FFD700', '#00CED1', '#FF6347', '#8A2BE2'];; // Customize colors as needed

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

	const oioi = [
		{ name: 'oioi 1', students: 50 },
		{ name: 'oioi 2', students: 30 },
		{ name: 'oioi 3', students: 20 },
	  ];

	  const blat=[{
		"status": "open",
		"category": "hardware",
		"percentage": 40
	  }];

	


	  const hol = [
		{
		  "status": "open",
		  "category": "hardware",
		  "priority": "low",
		  "percentage": 5
		},
		{
		  "status": "open",
		  "category": "hardware",
		  "priority": "medium",
		  "percentage": 35
		},
		{
		  "status": "in progress",
		  "category": "network",
		  "priority": "low",
		  "percentage": 20
		},
		{
		  "status": "in progress",
		  "category": "network",
		  "priority": "medium",
		  "percentage": 15
		},
		{
		  "status": "closed",
		  "category": "software",
		  "priority": "high",
		  "percentage": 5
		},
		{
		  "status": "closed",
		  "category": "software",
		  "priority": "low",
		  "percentage": 15
		},
		{
		  "status": "closed",
		  "category": "software",
		  "priority": "medium",
		  "percentage": 5
		}
	  ];
	  const relationR= [
		{ "count": 6, "createdAt": "12-25", "percentage": 100 },
		{ "count": 8, "createdAt": "12-26", "percentage": 0 },
		{ "count": 12, "createdAt": "12-27", "percentage": 0 },
		{ "count": 5, "createdAt": "12-28", "percentage": 0 },
		{ "count": 10, "createdAt": "12-29", "percentage": 0 },
		{ "count": 15, "createdAt": "12-30", "percentage": 0 },
		{ "count": 7, "createdAt": "12-31", "percentage": 0 },
		{ "count": 9, "createdAt": "01-01", "percentage": 0 },
		{ "count": 11, "createdAt": "01-02", "percentage": 0 },
		{ "count": 14, "createdAt": "01-03", "percentage": 0 }
		// Add more entries as needed
	  ]

	  
	  console.log(relation);

	return (
		<div className={`test ${localStorage.getItem("theme-color")}`}>
			<AppNavBar />
			<div className="page-background">
				<Container style={{ marginTop: 0, marginLeft: 0 }}>
					<PieChart width={500} height={500} margin={50}>
						<Pie
							data={statusPercent}
							dataKey="percentage"
							nameKey="status"
							outerRadius={175}
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

				<Container  style={{ marginTop:0, marginLeft: 0}}>
					<PieChart width={500} height={500} margin={50}>
						<Pie
							data={issue}
							dataKey="count"
							nameKey="_id"
							outerRadius={175}
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


				{/*                      */ }

				<div
            style={{
                textAlign: "center",
                margin: "auto 10%",
            }}
        >
            {/*<h1 style={{ color: "green" }}>
                GeeksforGeeks
            </h1>
            <h3>
                React JS example for donut chart using
                Recharts
            </h3>*/ }
             
			 <div>
     

			 <ResponsiveContainer style={{ marginTop:-800, marginLeft: 350}}width="100%" aspect={3}>
    <LineChart data={relation} margin={{ right: 300 }}>
        <CartesianGrid />
        <XAxis dataKey="createdAt" interval={"preserveStartEnd"} />
        <YAxis dataKey="count" />
        <Legend />
        <Tooltip />
        <Line
            dataKey="count" 
            stroke="red"
            activeDot={{ r: 8 }}
        />
        
    </LineChart>
</ResponsiveContainer>

      
      
    </div>


			 
        </div>

				</div>
		</div>
	);
};

export default AnalyticsPage;
