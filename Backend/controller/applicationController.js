import Application from "../models/applications.js";

export const getApplicationById = async (req, res) => {
  try {
    const { appId } = req.params;
    const application = await Application.findById(appId).populate("studentId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Server error" });
  }
};
