const API_BASE_URL = "http://localhost:4000";  // Backend URL

export const studentLogin = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/student/studentLogin`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    return response.json();
};

export const studentRegister = async (studentData) => {
    const response = await fetch(`${API_BASE_URL}/student/student-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
        credentials: "include"
    });
    return response.json();
};
