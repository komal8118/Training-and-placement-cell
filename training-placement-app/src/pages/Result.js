import React, { useEffect, useState } from "react";
import styles from "./Result.module.css"; // Import CSS Module

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/results") // Adjust API endpoint if needed
      .then((response) => response.json())
      .then((data) => setResults(data))
      .catch((error) => console.error("Error fetching results:", error));
  }, []);

  // Function to format CTC value (e.g., 300000 → ₹3,00,000)
  const formatCTC = (ctc) => {
    return ctc ? `₹${ctc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : "N/A";
  };

  // Function to capitalize the first letter of the role
  const capitalize = (text) => {
    return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "N/A";
  };

  return (
    <div className={styles.resultContainer}>
    <div className={styles.container}>
      <h2 className={styles.heading}>Results</h2>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.th}>STUDENT NAME</th>
            <th className={styles.th}>COMPANY</th>
            <th className={styles.th}>ROLE</th>
            <th className={styles.th}>CTC</th>
            <th className={styles.th}>REMARK</th>
            <th className={styles.th}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {results.length > 0 ? (
            results.map((result, index) => (
              <tr key={index} className={styles.dataRow}>
                <td>{result.studentId ? result.studentId.name : "N/A"}</td>
      <td>{result.jobId ? result.jobId.company : "N/A"}</td>
      {/* <td>{result.jobId ? result.jobId.role : "N/A"}</td> */}
      <td>{result.jobId ? result.jobId.title : "N/A"}</td> 

      <td>₹{result.ctc}</td>
      <td>{result.remarks || "N/A"}</td>
      <td>{result.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.noData}>
                No results available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default Results;










{/* // import React, { useEffect, useState } from "react";

// const Results = () => { */}
//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:4000/api/results")
//       .then((res) => res.json())
//       .then((data) => setResults(data))
//       .catch((err) => console.error(err));
//   }, []);

//   const deleteResult = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:4000/api/results/${id}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         setResults(results.filter((result) => result._id !== id)); // Remove deleted row from UI
//       } else {
//         console.error("Failed to delete");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <table border="1">
//       <thead>
//         <tr>
//           <th>STUDENT NAME</th>
//           <th>COMPANY</th>
//           <th>ROLE</th>
//           <th>CTC</th>
//           <th>REMARK</th>
//           <th>STATUS</th>
//           <th>ACTION</th>
//         </tr>
//       </thead>
//       <tbody>
//         {results.map((result) => (
//           <tr key={result._id}>
//             <td>{result.studentId?.name || "N/A"}</td>
//             <td>{result.jobId?.company || "N/A"}</td>
//             <td>{result.jobId?.role || "N/A"}</td>
//             <td>{result.ctc || "N/A"}</td>
//             <td>{result.remarks || "N/A"}</td>
//             <td>{result.status}</td>
//             <td>
//               <button onClick={() => deleteResult(result._id)}>Delete</button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default Results;
