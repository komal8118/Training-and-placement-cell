import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null); // For the logged-in student

  // Fetch all students (for AdminPage.js)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get("/api/students");
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Register new student
  const registerStudent = async (studentData) => {
    try {
      const { data } = await axios.post("/api/students/register", studentData);
      setCurrentStudent(data); // Set the logged-in student
      setStudents((prev) => [...prev, data]); // Update the list for admin
    } catch (error) {
      console.error("Error registering student:", error);
    }
  };

  // Update student profile
  const updateStudent = async (id, updatedData) => {
    try {
      const { data } = await axios.put(`/api/students/update/${id}`, updatedData);
      // Update the local state
      setStudents((prev) =>
        prev.map((student) => (student._id === id ? data : student))
      );
      if (currentStudent && currentStudent._id === id) {
        setCurrentStudent(data); // Update logged-in student's profile
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <StudentContext.Provider value={{ students, currentStudent, registerStudent, updateStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => React.useContext(StudentContext);
