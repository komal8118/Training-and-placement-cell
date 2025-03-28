const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS for frontend requests

const applications = [
  {
    jobId: "12345",
    company: {
      name: "Tech Corp",
      location: "New York, USA",
      industry: "Software Development",
      website: "https://techcorp.com"
    },
    applications: [
      { _id: "1", name: "Alice Johnson", email: "alice@example.com" },
      { _id: "2", name: "Bob Smith", email: "bob@example.com" }
    ]
  }
];

// ✅ POST route to add an application
app.post("/applications", (req, res) => {
  const { jobId, name, email } = req.body;

  if (!jobId || !name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const job = applications.find((job) => job.jobId === jobId);
  if (!job) {
    return res.status(404).json({ error: "Job ID not found" });
  }

  const newApplication = { _id: Date.now().toString(), name, email };
  job.applications.push(newApplication);

  res.status(201).json({
    message: "Application submitted successfully",
    application: newApplication
  });
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
