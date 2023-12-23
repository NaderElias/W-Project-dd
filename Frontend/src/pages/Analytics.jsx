import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState({
    issue: [],
    statusPercent: [],
    statusPercentfilter: [],
    relation: [],
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch("/api/getAnalytics"); // Update the API endpoint
        const data = await response.json(); // Add await here
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalyticsData();
  }, []); // Empty dependency array ensures that this effect runs once when the component mounts

  const barChartData = {
    labels: analyticsData.issue.map((item) => item._id), // Use analyticsData here
    datasets: [
      {
        label: "Issue Count",
        data: analyticsData.issue.map((item) => item.count), // Use analyticsData here
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Rest of the code remains unchanged

  return (
    <div>
      <h1>Analytics Page</h1>

      {/* Bar Chart */}
      <div>
        <h2>Issue Count</h2>
        <Bar data={barChartData} />
      </div>

      {/* Doughnut Chart */}
      <div>
        <h2>Status Percentage</h2>
        <Doughnut data={doughnutChartData} />
      </div>

      {/* Stacked Bar Chart */}
      <div>
        <h2>Status Percentage Filter</h2>
        <Bar data={stackedBarChartData} />
      </div>

      {/* Grouped Bar Chart */}
      <div>
        <h2>Relation Percentage</h2>
        <Bar data={groupedBarChartData} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
