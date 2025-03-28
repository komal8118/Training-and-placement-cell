
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import styles from "./Reports.module.css"; // Import CSS Module

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/reports")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setReports(Array.isArray(data) ? data : [data]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Report & Analytics</h2>
      {loading ? (
        <p className={styles.reportText}>Loading reports...</p>
      ) : reports.length > 0 ? (
        reports.map((report, index) => (
          <div key={index} className={styles.reportBox}>
            <h3 className={styles.reportHeading}>Placement Report</h3>
            <p className={styles.reportText}>Total Students: {report.totalStudents}</p>
            <p className={styles.reportText}>Placed Students: {report.placedStudents}</p>
            <p className={styles.reportText}>Unplaced Students: {report.unplacedStudents}</p>
            <p className={styles.reportText}>Placement Percentage: {report.placementPercentage}%</p>
            <p className={styles.reportText}>Companies Visited: {report.companiesVisited}</p>

            {/* Bar Chart - Placements per Company */}
            <div className={styles.chartContainer}>
              <h3 className={styles.chartTitle}>Placement Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: "Placed", value: report.placedStudents },
                  { name: "Unplaced", value: report.unplacedStudents }
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Placement Percentage */}
            <div className={styles.chartContainer}>
              <h3 className={styles.chartTitle}>Placement Percentage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={[
                    { name: "Placed", value: report.placedStudents },
                    { name: "Unplaced", value: report.unplacedStudents }
                  ]} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                    <Cell fill="#82ca9d" />
                    <Cell fill="#ff6961" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))
      ) : (
        <p className={styles.reportText}>No reports available</p>
      )}
    </div>
  );
};

export default Reports;
