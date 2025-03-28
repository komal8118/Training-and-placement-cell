import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        trim:true,
    },
});


export default mongoose.model("Company", CompanySchema); 