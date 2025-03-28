import bcrypt from "bcrypt";
import Company from "../models/company.js";
import Student from "../models/student.js";
import nodemailer from "nodemailer";
import JobApplication from "../models/JobApplication.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//--------------------------------------------------------------------------------------------------------------------------
// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the details carefully',
            });
        }

        let company = await Company.findOne({ email });
        if (!company) {
            return res.status(401).json({
                success: false,
                message: 'Company is not registered',
            });
        }

        const payload = {
            email: company.email,
            id: company._id,
            role: company.role,
        };

        if (await bcrypt.compare(password, company.password)) {
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
            company = company.toObject();
            company.token = token;
            company.password = undefined;

            res.cookie("token", token, {
                expires: new Date(Date.now() + 3000),
                httpOnly: true,
            }).status(200).json({
                success: true,
                token,
                company,
                message: 'Company login successful',
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "Password Incorrect",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Company login failure',
        });
    }
};

//--------------------------------------------------------------------------------------------------------------------------
// Controller for creating a job application
export const createJobApplication = async (req, res) => {
  try {
    const { companyId, title, description } = req.body;
    const jobApplication = new JobApplication({ companyId, title, description });
    await jobApplication.save();

    res.status(201).json({ message: 'Job application created successfully', jobApplication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//--------------------------------------------------------------------------------------------------------------------------
// Controller for getting all job applications
export const getAllJobApplications = async (req, res) => {
  try {
    const jobApplications = await JobApplication.find().populate('companyId', 'name');
    res.status(200).json(jobApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//--------------------------------------------------------------------------------------------------------------------------
// Controller for getting job applications by company ID
export const getJobApplicationsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    const jobApplications = await JobApplication.find({ companyId }).populate('applicants');
    res.status(200).json(jobApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//--------------------------------------------------------------------------------------------------------------------------
// Controller for updating a job application by ID
export const updateJobApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { title, description } = req.body;
    const updatedJobApplication = await JobApplication.findByIdAndUpdate(jobId, { title, description }, { new: true });

    if (!updatedJobApplication) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.status(200).json({ message: 'Job application updated successfully', jobApplication: updatedJobApplication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//--------------------------------------------------------------------------------------------------------------------------
// Controller for deleting a job application by ID
export const deleteJobApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const deletedJobApplication = await JobApplication.findByIdAndDelete(jobId);

    if (!deletedJobApplication) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.status(200).json({ message: 'Job application deleted successfully', jobApplication: deletedJobApplication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//--------------------------------------------------------------------------------------------------------------------------
// Controller to get the list of applicants for a job application
export const getApplicantsForJobApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobApplication = await JobApplication.findById(jobId).populate('applicants');

    if (!jobApplication) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.status(200).json(jobApplication.applicants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//--------------------------------------------------------------------------------------------------------------------------
// Controller to approve or reject a student's application for a job
export const processApplication = async (req, res) => {
  try {
    const { jobId, studentId } = req.params;
    const { status } = req.body;
    const jobApplication = await JobApplication.findById(jobId).populate('companyId');

    if (!jobApplication) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    const studentIndex = jobApplication.applicants.indexOf(studentId);
    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student did not apply for this job' });
    }

    jobApplication.applicants[studentIndex].status = status;
    await jobApplication.save();

    if (status === 'approved') {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'sendmail8767@gmail.com',
          pass: 'zrxr huad spmv lmvt'
        }
      });

      const mailOptions = {
        from: 'sendmail8767@gmail.com',
        to: student.email,
        subject: 'Job Application Approved',
        text: 'Your job application has been approved. Congratulations!'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }

    res.status(200).json({ message: 'Application processed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
