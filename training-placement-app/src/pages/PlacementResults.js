import { useEffect, useState } from "react";
import axios from "axios";
import Result from "./Result";
import AddResult from "./AddResult";

const PlacementResults = () => {
  const [results, setResults] = useState([]); // Ensure results is never undefined

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/results");
      setResults(response.data || []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching results:", error);
      setResults([]); // Fallback to empty array on error
    }
  };

  const addNewResult = (newResult) => {
    setResults((prevResults) => [...prevResults, newResult]);
  };

  return (
    <div>
      <AddResult onResultAdded={addNewResult} />
      <Result results={results} />
    </div>
  );
};

export default PlacementResults;
