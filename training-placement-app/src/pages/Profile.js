

import React, { useState,useEffect } from 'react';
import axios from "axios";

import styles from './Profile.module.css';
import { FaEdit, FaFileUpload, FaDownload,FaPencilAlt,FaTrash   } from 'react-icons/fa';

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null); // User uploads manually
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);
  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({
    
    aboutMe: 'Write about yourself...',
    phone: '1234567890',
    email: 'example@example.com',
    location: 'City, State',
    college: 'ABC College',
    universityRollNo: '123456789',
    collegeId: 'COLL1234',
    highestDegree: 'B.Tech',
    stream: 'Computer Science',
    educationGap: 'No',
    backlog: 'No',
    secondary: { board: '', marks: '', from: '', to: '' },
    seniorSecondary: { board: '', marks: '', from: '', to: '' },
    graduation: { university: '', marks: '', from: '', to: '', degree: '', specialization: '', degreeType: '' },
    softSkills: [],
    experience: [],
    technicalSkills: []
  });

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://4000/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // If auth is required
          },
        });

        // Update state with fetched user data
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const [tempData, setTempData] = useState({});
  const [newSkill, setNewSkill] = useState('');

  const handleEdit = (section) => {
    setEditSection(section);
    setTempData(formData);
  };

  const handleCancel = () => {
    setEditSection(null);
  };

  const handleUpdate = () => {
    setFormData(tempData);
    setEditSection(null);
  };
  
const [technicalSkills, setTechnicalSkills] = useState([]);

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setTechnicalSkills([...technicalSkills, newSkill]);
      setNewSkill(''); // Clear input after adding
    }
  };
  

  
  const handleChange = (e, index, field) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedExperience = [...tempData.experience];
      updatedExperience[index][field] = value;
      setTempData({ ...tempData, experience: updatedExperience });
    } else {
      setTempData({ ...tempData, [name]: value });
    }
  };
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };
  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResume(file);
    }
  };
  const handleResumeDelete = () => {
    setResume(null);
  };
  const addExperience = () => {
    setTempData({
      ...tempData,
      experience: [
        ...tempData.experience,
        {
          from: '',
          to: '',
          typeOfExperience: '',
          typeOfIndustry: '',
          location: '',
          site: '',
          skills: '',
          description: ''
        }
      ]
    });
  };


  return (
    
    <div className={styles.profileContainer}>
      <div className={styles.header}></div>
      <div className={styles.profileImageContainer}>
          <img src={profileImage} alt="Profile" className={styles.profileImage} />
          <label htmlFor="profile-upload" className={styles.profileEditIcon}>Edit
            <FaEdit />
          </label>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleProfileImageChange}
          />
        </div>
        
      {/* Upload Resume Section
      
      <div className={styles.resumeSection}>
        <h3>Upload Resume</h3>
        <div className={styles.resumeUpload}>
          <label htmlFor="resume-upload" className={styles.uploadButton}>
            <FaFileUpload /> Upload Resume
          </label>
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleResumeUpload}
          />
        </div>
        {resume && (
          <div className={styles.resumePreview}>
            <p>Uploaded: {resume.name}</p>
            <a href={URL.createObjectURL(resume)} download className={styles.downloadButton}>
              <FaDownload /> Download
            </a>
          </div>
        )}
      </div> */}
      <div className={styles.sidebar}>
        <ul>
          <li>Profile Summary</li>
          <li>Basic Details</li>
          <li>Education</li>
          <li>Experience</li>
          <li>Technical Skills</li>
        </ul>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.content}>
        {/* Upload Resume Section */}
        <div className={styles.section}>
      <div className={styles.resumeSection}>
        <h3>Upload Resume</h3>
        <div className={styles.resumeUpload}>
          <label htmlFor="resume-upload" className={styles.uploadButton}>
            <FaFileUpload /> Upload Resume
          </label>
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleResumeUpload}
          />
        </div>
        {resume && (
          <div className={styles.resumePreview}>
            <p>Uploaded: {resume.name}</p>

            <a href={URL.createObjectURL(resume)} download className={styles.downloadButton}>
              <FaDownload /> Download
            </a>
            <button onClick={handleResumeDelete} className={styles.deleteButton}>
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>
      </div>
          {/* PROFILE SUMMARY SECTION */}
          <div className={styles.section}>
            <h3>PROFILE SUMMARY</h3>
            {/* <button onClick={() => handleEdit('profileSummary')}>Edit</button> */}
            <button onClick={() => handleEdit('profileSUmmary')}>Edit<FaPencilAlt /></button>
            {editSection === 'profileSummary' ? (
              <div>
                
                <div className={styles.section}>
                <label>About Me:</label>
                <textarea name="aboutMe" value={tempData.aboutMe} onChange={handleChange}></textarea>
                </div>
                <label>Phone:</label>
                <input type="text" name="phone" value={tempData.phone} onChange={handleChange} />
                <label>Email:</label>
                <input type="text" name="email" value={tempData.email} onChange={handleChange} />
                 
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleUpdate}>Update</button>
              </div>
            ) : (
              <div>
                
          <div className={styles.section}>
                <p>{formData.aboutMe}</p>
                </div>
                <p>{formData.phone}</p>
                <p>{formData.email}</p>
              </div>
            )}
          </div>
          
          {/* BASIC DETAILS SECTION */}
          <div className={styles.section}>
          <h3>BASIC DETAILS</h3>
            {/* <h3>BASIC DETAILS</h3>
            <button onClick={() => handleEdit('basicDetails')}>Edit</button> */}
            <button onClick={() => handleEdit('basicDetails')}>Edit<FaPencilAlt /></button>
            {editSection === 'basicDetails' ? (
              <div>
                <label>Current Location:</label>
                <input type="text" name="location" value={tempData.location} onChange={handleChange} />

                <label>College Name:</label>
                <input type="text" name="college" value={tempData.college} onChange={handleChange} />

                <label>University Roll No:</label>
                <input type="text" name="universityRollNo" value={tempData.universityRollNo} onChange={handleChange} />

                <label>College ID:</label>
                <input type="text" name="collegeId" value={tempData.collegeId} onChange={handleChange} />

                <label>Highest Degree:</label>
                <input type="text" name="highestDegree" value={tempData.highestDegree} onChange={handleChange} />

                <label>Stream:</label>
                <input type="text" name="stream" value={tempData.stream} onChange={handleChange} />

                <label>Education Gap:</label>
                <input type="text" name="educationGap" value={tempData.educationGap} onChange={handleChange} />

                <label>Backlog:</label>
                <input type="text" name="backlog" value={tempData.backlog} onChange={handleChange} />

                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleUpdate}>Update</button>
              </div>
            ) : (
              <div>
                <p>Location: {formData.location}</p>
                <p>College: {formData.college}</p>
                <p>University Roll No: {formData.universityRollNo}</p>
                <p>College ID: {formData.collegeId}</p>
                <p>Highest Degree: {formData.highestDegree}</p>
                <p>Stream: {formData.stream}</p>
                <p>Education Gap: {formData.educationGap}</p>
                <p>Backlog: {formData.backlog}</p>
              </div>
            )}
          </div>
          
          {/* EDUCATION SECTION */}
          <div className={styles.section}>
            <h3>EDUCATION</h3>
            <button onClick={() => handleEdit('education')}>Edit<FaPencilAlt /></button>
            {editSection === 'education' ? (
              <div>
                <div className={styles.section}>
                <label>Secondary Education:</label>
                <input type="text" name="secondary.board" placeholder="Board" value={tempData.secondary.board} onChange={handleChange} />
                <input type="text" name="secondary.marks" placeholder="Marks in % / CGPA" value={tempData.secondary.marks} onChange={handleChange} />
                <input type="text" name="secondary.from" placeholder="From" value={tempData.secondary.from} onChange={handleChange} />
                <input type="text" name="secondary.to" placeholder="To" value={tempData.secondary.to} onChange={handleChange} />
</div>
<div className={styles.section}>
                <label>Senior Secondary Education:</label>
                <input type="text" name="seniorSecondary.board" placeholder="Board" value={tempData.seniorSecondary.board} onChange={handleChange} />
                <input type="text" name="seniorSecondary.marks" placeholder="Marks in % / CGPA" value={tempData.seniorSecondary.marks} onChange={handleChange} />
                <input type="text" name="seniorSecondary.from" placeholder="From" value={tempData.seniorSecondary.from} onChange={handleChange} />
                <input type="text" name="seniorSecondary.to" placeholder="To" value={tempData.seniorSecondary.to} onChange={handleChange} />
</div>
<div className={styles.section}>
                <label>Graduation:</label>
                <input type="text" name="graduation.university" placeholder="University" value={tempData.graduation.university} onChange={handleChange} />
                <input type="text" name="graduation.marks" placeholder="Marks in % / CGPA" value={tempData.graduation.marks} onChange={handleChange} />
                <input type="text" name="graduation.from" placeholder="From" value={tempData.graduation.from} onChange={handleChange} />
                <input type="text" name="graduation.to" placeholder="To" value={tempData.graduation.to} onChange={handleChange} />
                <input type="text" name="graduation.degree" placeholder="Degree Name" value={tempData.graduation.degree} onChange={handleChange} />
                <input type="text" name="graduation.specialization" placeholder="Stream/Specialization" value={tempData.graduation.specialization} onChange={handleChange} />
                <input type="text" name="graduation.degreeType" placeholder="Degree Type" value={tempData.graduation.degreeType} onChange={handleChange} />
</div>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleUpdate}>Update</button>
              </div>
            ) : (
              <div>
                
          <div className={styles.section}>
                <p>Secondary Education: {formData.secondary.board}, {formData.secondary.marks}%, {formData.secondary.from} - {formData.secondary.to}</p></div>
                
          <div className={styles.section}>
                <p>Senior Secondary Education: {formData.seniorSecondary.board}, {formData.seniorSecondary.marks}%, {formData.seniorSecondary.from} - {formData.seniorSecondary.to}</p> </div>
                
          <div className={styles.section}>
                <p>Graduation: {formData.graduation.university}, {formData.graduation.marks}%, {formData.graduation.from} - {formData.graduation.to}, {formData.graduation.degree} in {formData.graduation.specialization} ({formData.graduation.degreeType})</p></div>
              </div>
            )}
            </div>

          
          {/* EXPERIENCE SECTION */}
          <div className={styles.section}>
            <h3>EXPERIENCE</h3>
            {/* <button onClick={() => handleEdit('experience')}>Edit</button> */}
            <button onClick={() => handleEdit('experience')}>Edit<FaPencilAlt /></button>
            {editSection === 'experience' ? (
              <div>
                {tempData.experience.map((exp, index) => (
                  <div key={index}>
                    <label>From:</label>
                    <input type="text" value={exp.from} onChange={(e) => handleChange(e, index, 'from')} />

                    <label>To:</label>
                    <input type="text" value={exp.to} onChange={(e) => handleChange(e, index, 'to')} />

                    <label>Type of Experience:</label>
                    <input type="text" value={exp.typeOfExperience} onChange={(e) => handleChange(e, index, 'typeOfExperience')} />

                    <label>Type of Industry:</label>
                    <input type="text" value={exp.typeOfIndustry} onChange={(e) => handleChange(e, index, 'typeOfIndustry')} />

                    <label>Location:</label>
                    <input type="text" value={exp.location} onChange={(e) => handleChange(e, index, 'location')} />

                    <label>Site:</label>
                    <input type="text" value={exp.site} onChange={(e) => handleChange(e, index, 'site')} />

                    <label>Skills:</label>
                    <input type="text" value={exp.skills} onChange={(e) => handleChange(e, index, 'skills')} />

                    <label>Description:</label>
                    <textarea value={exp.description} onChange={(e) => handleChange(e, index, 'description')}></textarea>
                  </div>
                ))}
                <button onClick={addExperience}>+ Add Experience</button>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleUpdate}>Update</button>
              </div>
            ) : (
              <div>
                {formData.experience.length > 0 ? (
                  formData.experience.map((exp, index) => (
                    <div key={index}>
                      <p><strong>From:</strong> {exp.from}</p>
                      <p><strong>To:</strong> {exp.to}</p>
                      <p><strong>Type of Experience:</strong> {exp.typeOfExperience}</p>
                      <p><strong>Type of Industry:</strong> {exp.typeOfIndustry}</p>
                      <p><strong>Location:</strong> {exp.location}</p>
                      <p><strong>Site:</strong> {exp.site}</p>
                      <p><strong>Skills:</strong> {exp.skills}</p>
                      <p><strong>Description:</strong> {exp.description}</p>
                      <hr />
                    </div>
                  ))
                ) : (
                  <p>No experience added yet.</p>
                )}
              </div>
            )}
            </div>
             <div className={styles.section}>
            {/* Technical Skills Section */}
<div className="skills-section">
  <h3>Technical Skills</h3>

  {/* Display existing skills */}
  <ul>
    {technicalSkills.map((skill, index) => (
      <li key={index}>{skill}</li>
    ))}
  </ul>

  {/* Input field for adding new skills */}
  <input 
    type="text" 
    value={newSkill} 
    onChange={(e) => setNewSkill(e.target.value)} 
    placeholder="Add a skill"
  />

  {/* Button to add new skill */}
  <button onClick={handleAddSkill}>Add Skill</button>
</div>
</div>
          </div>
        </div>
      </div>
    
  );
};
export default Profile;
