// import React, { useState, useEffect } from 'react';
// import './StudentScreen.css';

// const StudentScreen = () => {
//     const [studentData, setStudentData] = useState({
//         name: '',
//         batch: '',
//         course: '',
//         semester: '',
//         contact: '',
//         institute: ''
//     });
//     const [institutes, setInstitutes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [students, setStudents] = useState([]);
//     const [showTable, setShowTable] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [editingStudent, setEditingStudent] = useState(null);


//     useEffect(() => {
//         const fetchInstitutes = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/api/institutes');
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 setInstitutes(data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Failed to fetch institutes:', error);
//                 setLoading(false);
//             }
//         };

//         fetchInstitutes();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setStudentData({ ...studentData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch('http://localhost:5000/api/students', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(studentData),
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log(result.message); // For debugging
//             alert('Student data saved successfully');
//             setStudentData({
//                 name: '',
//                 batch: '',
//                 course: '',
//                 semester: '',
//                 contact: '',
//                 institute: ''
//             });

//         } catch (error) {
//             console.error('Failed to submit student data:', error);
//             alert('Failed to save student data');
//         }
//     };

//     const handleDownloadExcel = () => {
//         fetch('http://localhost:5000/api/download-students')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//                 return response.blob();
//             })
//             .then(blob => {
//                 const url = window.URL.createObjectURL(blob);
//                 const link = document.createElement('a');
//                 link.href = url;
//                 link.setAttribute('download', 'students.xlsx');
//                 document.body.appendChild(link);
//                 link.click();
//                 link.remove();
//             })
//             .catch(error => {
//                 console.error('Failed to download file:', error);
//                 alert('Failed to download file');
//             });
//     };

//     const handleViewStudents = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/api/students');
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             const data = await response.json();
//             setStudents(data);
//             setShowTable(true);
//         } catch (error) {
//             console.error('Failed to fetch students:', error);
//             alert('Failed to fetch students');
//         }
//     };





//     const handleEdit = (student) => {
//         setEditingStudent(student);
//     };

//     const handleDelete = async (id) => {
//         try {
//             const response = await fetch(`http://localhost:5000/api/students/${id}`, {
//                 method: 'DELETE',
//             });
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             setStudents(students.filter(student => student._id !== id));
//             alert('Student deleted successfully');
//         } catch (error) {
//             console.error('Failed to delete student:', error);
//             alert('Failed to delete student');
//         }
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(`http://localhost:5000/api/students/${editingStudent._id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(editingStudent),
//             });
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             const result = await response.json();
//             setStudents(students.map(student => student._id === result._id ? result : student));
//             setEditingStudent(null);
//             alert('Student updated successfully');
//         } catch (error) {
//             console.error('Failed to update student:', error);
//             alert('Failed to update student');
//         }
//     };








//     // Handle search query change
//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value.toLowerCase());
//     };

//     // Filter students based on search query
//     const filteredStudents = students.filter(student =>
//         student.name.toLowerCase().includes(searchQuery)
//     );

//     return (
//         <div className="student-screen">
//             <h2>Student Details</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label htmlFor="institute">Choose Institute:</label>
//                     <select
//                         id="institute"
//                         name="institute"
//                         value={studentData.institute}
//                         onChange={handleChange}
//                         required
//                         disabled={loading}
//                     >
//                         <option value="">{loading ? 'Loading...' : 'Select Institute'}</option>
//                         {institutes.map((institute) => (
//                             <option key={institute._id} value={institute._id}>
//                                 {institute.institute}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="name">Name:</label>
//                     <input
//                         type="text"
//                         id="name"
//                         name="name"
//                         value={studentData.name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="batch">Batch:</label>
//                     <input
//                         type="text"
//                         id="batch"
//                         name="batch"
//                         value={studentData.batch}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="course">Course:</label>
//                     <input
//                         type="text"
//                         id="course"
//                         name="course"
//                         value={studentData.course}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="semester">Semester:</label>
//                     <input
//                         type="text"
//                         id="semester"
//                         name="semester"
//                         value={studentData.semester}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="contact">Contact:</label>
//                     <input
//                         type="text"
//                         id="contact"
//                         name="contact"
//                         value={studentData.contact}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <button type="submit">Submit</button>
//                 <button className='excel-btn' type="button" onClick={handleDownloadExcel}>Download in Excel</button>
//             </form>

//             <button className='view-btn' type="button" onClick={handleViewStudents}>View Students</button>

//             {showTable && (
//                 <div>
//                     <div className="search-container">
//                         <input
//                             type="text"
//                             placeholder="Search by name"
//                             value={searchQuery}
//                             onChange={handleSearchChange}
//                         />
//                     </div>

//                     <table className="student-table">
//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Batch</th>
//                                 <th>Course</th>
//                                 <th>Semester</th>
//                                 <th>Contact</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredStudents.map((student) => (
//                                 <tr key={student._id}>
//                                     <td>{student.name}</td>
//                                     <td>{student.batch}</td>
//                                     <td>{student.course}</td>
//                                     <td>{student.semester}</td>
//                                     <td>{student.contact}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(student)}>Edit</button>
//                                         <button onClick={() => handleDelete(student._id)}>Delete</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//             {editingStudent && (
//                 <div className="edit-form">
//                     <h3>Edit Student</h3>
//                     <form onSubmit={handleUpdate}>
//                         <div className="form-group">
//                             <label htmlFor="edit-name">Name:</label>
//                             <input
//                                 type="text"
//                                 id="edit-name"
//                                 value={editingStudent.name}
//                                 onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="edit-batch">Batch:</label>
//                             <input
//                                 type="text"
//                                 id="edit-batch"
//                                 value={editingStudent.batch}
//                                 onChange={(e) => setEditingStudent({ ...editingStudent, batch: e.target.value })}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="edit-course">Course:</label>
//                             <input
//                                 type="text"
//                                 id="edit-course"
//                                 value={editingStudent.course}
//                                 onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="edit-semester">Semester:</label>
//                             <input
//                                 type="text"
//                                 id="edit-semester"
//                                 value={editingStudent.semester}
//                                 onChange={(e) => setEditingStudent({ ...editingStudent, semester: e.target.value })}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="edit-contact">Contact:</label>
//                             <input
//                                 type="text"
//                                 id="edit-contact"
//                                 value={editingStudent.contact}
//                                 onChange={(e) => setEditingStudent({ ...editingStudent, contact: e.target.value })}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="edit-institute">Institute:</label>
//                             <select
//                                 id="edit-institute"
//                                 value={editingStudent.institute}
//                                 onChange={(e) => setEditingStudent({ ...editingStudent, institute: e.target.value })}
//                                 required
//                             >
//                                 <option value="">Select Institute</option>
//                                 {institutes.map((institute) => (
//                                     <option key={institute._id} value={institute._id}>
//                                         {institute.institute}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <button type="submit">Update</button>
//                         <button type="button" onClick={() => setEditingStudent(null)}>Cancel</button>
//                     </form>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default StudentScreen;



import React, { useState, useEffect } from 'react';
import './StudentScreen.css';

const StudentScreen = () => {
    const [studentData, setStudentData] = useState({
        name: '',
        batch: '',
        course: '',
        semester: '',
        contact: '',
        institute: ''
    });
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingStudent, setEditingStudent] = useState(null);

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            console.log(result.message); // For debugging
            alert('Student data saved successfully');
            setStudentData({
                name: '',
                batch: '',
                course: '',
                semester: '',
                contact: '',
                institute: ''
            });

        } catch (error) {
            console.error('Failed to submit student data:', error);
            alert('Failed to save student data');
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
                alert('Failed to download file');
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
            alert('Failed to fetch students');
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
            alert('Student deleted successfully');
        } catch (error) {
            console.error('Failed to delete student:', error);
            alert('Failed to delete student');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
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
            alert('Student updated successfully');
        } catch (error) {
            console.error('Failed to update student:', error);
            alert('Failed to update student');
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
            <h2>Student Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="institute">Choose Institute:</label>
                    <select
                        id="institute"
                        name="institute"
                        value={studentData.institute}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">{loading ? 'Loading...' : 'Select Institute'}</option>
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
                    <label htmlFor="contact">Contact:</label>
                    <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={studentData.contact}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Submit</button>
                <button className='excel-btn' type="button" onClick={handleDownloadExcel}>Download in Excel</button>
            </form>

            <button className='view-btn' type="button" onClick={handleViewStudents}>View Students</button>

            {showTable && (
                <div>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by name"
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
                                <th>Contact</th>
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
                                    <td>{student.contact}</td>
                                    <td>
                                        <button onClick={() => handleEdit(student)}>Edit</button>
                                        <button onClick={() => handleDelete(student._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editingStudent && (
                <div className="edit-form">
                    <h3>Edit Student</h3>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label htmlFor="edit-name">Name:</label>
                            <input
                                type="text"
                                id="edit-name"
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
                                value={editingStudent.semester}
                                onChange={(e) => setEditingStudent({ ...editingStudent, semester: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-contact">Contact:</label>
                            <input
                                type="text"
                                id="edit-contact"
                                value={editingStudent.contact}
                                onChange={(e) => setEditingStudent({ ...editingStudent, contact: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit">Update</button>
                        <button className='cancel' type="button" onClick={() => setEditingStudent(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StudentScreen;
