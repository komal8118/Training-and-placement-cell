
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true }
});


export default mongoose.model("Admin", AdminSchema); 
