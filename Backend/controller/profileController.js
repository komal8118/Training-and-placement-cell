import Profile from "../models/Profile.js";

// Fetch Profile
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne(); // Fetch first profile for now
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
