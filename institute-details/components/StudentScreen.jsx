import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StudentScreen.css';
import Typewriter from 'typewriter-effect';


const StudentScreen = () => {
    const [studentData, setStudentData] = useState({
        name: '',
        batch: '',
        course: '',
        semester: '',
        email: '',
        institute: ''
    });
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingStudent, setEditingStudent] = useState(null);
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        const fetchInstitutes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/institutes');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setInstitutes(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch institutes:', error);
                setLoading(false);
            }
        };

        fetchInstitutes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData({ ...studentData, [name]: value });
        if (name === 'email') {
            validateEmail(value);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError) {
            toast.error('Please fix the errors before submitting');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            toast.success('Student data saved successfully');
            setStudentData({
                name: '',
                batch: '',
                course: '',
                semester: '',
                email: '',
                institute: ''
            });

        } catch (error) {
            console.error('Failed to submit student data:', error);
            toast.error('Failed to save student data');
        }
    };

    const handleDownloadExcel = () => {
        fetch('http://localhost:5000/api/download-students')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'students.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(error => {
                console.error('Failed to download file:', error);
                toast.error('Failed to download file');
            });
    };

    const handleViewStudents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/students');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setStudents(data);
            setShowTable(true);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            toast.error('Failed to fetch students');
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/students/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setStudents(students.filter(student => student._id !== id));
            toast.success('Student deleted successfully');
        } catch (error) {
            console.error('Failed to delete student:', error);
            toast.error('Failed to delete student');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (emailError) {
            toast.error('Please fix the errors before submitting');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/students/${editingStudent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingStudent),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            setStudents(students.map(student => student._id === result._id ? result : student));
            setEditingStudent(null);
            toast.success('Student updated successfully');
        } catch (error) {
            console.error('Failed to update student:', error);
            toast.error('Failed to update student');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="student-screen">
            <div style={{
                textAlign: 'center', fontSize: '50px',
                background: 'linear-gradient(to left, #5f0f40, #9a031e)', // Gradient for text
                WebkitBackgroundClip: 'text', // Clip the background to text
                WebkitTextFillColor: 'transparent', // Make the text color transparent
                color: 'white', fontFamily: 'monospace'
            }}>
                <Typewriter
                    options={{
                        strings: ['Students Screen'],
                        autoStart: true,
                        loop: true,
                        delay: 75, // Optional: Adjust typing speed
                    }}
                />
            </div>
            <form onSubmit={handleSubmit}>
                {/* <div className="form-group">
                    <label htmlFor="institute">Choose Institute:</label>
                    <select
                        id="institute"
                        name="institute"
                        value={studentData.institute}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option className='opt' value="">{loading ? 'Loading...' : 'Select Institute'}</option>
                        {institutes.map((institute) => (
                            <option key={institute._id} value={institute._id}>
                                {institute.institute}
                            </option>
                        ))}
                    </select>
                </div> */}

                <div className="dropdown-container">
                    <label htmlFor="institute" className="dropdown-label">Choose Institute:</label>
                    <select
                        id="institute"
                        name="institute"
                        value={studentData.institute}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="styled-select"
                    >
                        <option className='opt' value="">{loading ? 'Loading...' : 'Select Institute'}</option>
                        {institutes.map((institute) => (
                            <option key={institute._id} value={institute._id}>
                                {institute.institute}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={studentData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="batch">Batch:</label>
                    <input
                        type="text"
                        id="batch"
                        name="batch"
                        value={studentData.batch}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="course">Course:</label>
                    <input
                        type="text"
                        id="course"
                        name="course"
                        value={studentData.course}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="semester">Semester:</label>
                    <input
                        type="text"
                        id="semester"
                        name="semester"
                        value={studentData.semester}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input style={{ padding: "10px" }}
                        type="email"
                        id="email"
                        name="email"
                        value={studentData.email}
                        onChange={handleChange}
                        required
                    />
                    {emailError && <span className="error">{emailError}</span>}
                </div>

                <button className='subbtn' type="submit">Submit</button>
                <button className='excel-btn' type="button" onClick={handleDownloadExcel}>Download in Excel</button>
            </form>

            <button className='view-btn' type="button" onClick={handleViewStudents}>View Students</button>

            {showTable && (
                <div>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Batch</th>
                                <th>Course</th>
                                <th>Semester</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.batch}</td>
                                    <td>{student.course}</td>
                                    <td>{student.semester}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <button className='btn edit' onClick={() => handleEdit(student)}>Edit</button>
                                            <button className='btn delete' onClick={() => handleDelete(student._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editingStudent && (
                <form style={{ marginTop: "10px" }} onSubmit={handleUpdate}>
                    <h3>Edit Student</h3>
                    <div className="form-group">
                        <label htmlFor="edit-name">Name:</label>
                        <input
                            type="text"
                            id="edit-name"
                            name="name"
                            value={editingStudent.name}
                            onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-batch">Batch:</label>
                        <input
                            type="text"
                            id="edit-batch"
                            name="batch"
                            value={editingStudent.batch}
                            onChange={(e) => setEditingStudent({ ...editingStudent, batch: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-course">Course:</label>
                        <input
                            type="text"
                            id="edit-course"
                            name="course"
                            value={editingStudent.course}
                            onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-semester">Semester:</label>
                        <input
                            type="text"
                            id="edit-semester"
                            name="semester"
                            value={editingStudent.semester}
                            onChange={(e) => setEditingStudent({ ...editingStudent, semester: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-email">Email:</label>
                        <input
                            type="email"
                            id="edit-email"
                            name="email"
                            value={editingStudent.email}
                            onChange={(e) => {
                                setEditingStudent({ ...editingStudent, email: e.target.value });
                                validateEmail(e.target.value);
                            }}
                            required
                        />
                        {emailError && <span className="error">{emailError}</span>}
                    </div>
                    <button className='update-btn' type="submit">Update</button>
                </form>
            )}

            {/* Toast Container for Toastify */}
            <ToastContainer />
        </div>
    );
};

export default StudentScreen;
