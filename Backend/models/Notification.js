

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    message: String,
    date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
});

export default mongoose.model("Notification", notificationSchema);
