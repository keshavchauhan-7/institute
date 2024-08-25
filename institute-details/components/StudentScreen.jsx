// import React, { useState, useEffect } from 'react';
// import './StudentScreen.css';

// const StudentScreen = () => {
//     const [studentData, setStudentData] = useState({
//         batch: '',
//         course: '',
//         semester: '',
//         contact: '',
//         institute: ''
//     });

//     const [institutes, setInstitutes] = useState([]);
//     const [loading, setLoading] = useState(true);

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
//                 batch: '',
//                 course: '',
//                 semester: '',
//                 contact: '',
//                 institute: ''
//             }); // Clear form after submission

//         } catch (error) {
//             console.error('Failed to submit student data:', error);
//             alert('Failed to save student data');
//         }
//     };

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
//             </form>
//         </div>
//     );
// };

// export default StudentScreen;



import React, { useState, useEffect } from 'react';
import './StudentScreen.css';

const StudentScreen = () => {
    const [studentData, setStudentData] = useState({
        batch: '',
        course: '',
        semester: '',
        contact: '',
        institute: ''
    });

    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);

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
                batch: '',
                course: '',
                semester: '',
                contact: '',
                institute: ''
            }); // Clear form after submission

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
                <button type="button" onClick={handleDownloadExcel}>Download in Excel</button>
            </form>
        </div>
    );
};

export default StudentScreen;
