// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const port = 5000;

// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/institutesDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Institute Schema
// const instituteSchema = new mongoose.Schema({
//   institute: String,
//   address: String,
//   contact: String,
// });

// const Institute = mongoose.model('Institute', instituteSchema);

// // Student Schema
// const studentSchema = new mongoose.Schema({
//   batch: String,
//   course: String,
//   semester: String,
//   contact: String,
//   institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' }
// });

// const Student = mongoose.model('Student', studentSchema);

// // Get institutes
// app.get('/api/institutes', async (req, res) => {
//   try {
//     const institutes = await Institute.find();
//     res.status(200).json(institutes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Post new institute
// app.post('/api/institutes', async (req, res) => {
//   try {
//     const newInstitute = new Institute(req.body);
//     const savedInstitute = await newInstitute.save();
//     res.status(201).json(savedInstitute);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Post student data
// app.post('/api/students', async (req, res) => {
//   try {
//     const { batch, course, semester, contact, institute } = req.body;

//     // Validate required fields
//     if (!batch || !course || !semester || !contact || !institute) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Create and save new student
//     const newStudent = new Student({
//       batch,
//       course,
//       semester,
//       contact,
//       institute
//     });

//     await newStudent.save();
//     res.status(201).json({ message: 'Student data saved successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const ExcelJS = require('exceljs');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/institutesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const instituteSchema = new mongoose.Schema({
  institute: String,
  address: String,
  contact: String,
});

const Institute = mongoose.model('Institute', instituteSchema);

const studentSchema = new mongoose.Schema({
  batch: String,
  course: String,
  semester: String,
  contact: String,
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' }
});

const Student = mongoose.model('Student', studentSchema);

app.post('/api/students', async (req, res) => {
  try {
    const { batch, course, semester, contact, institute } = req.body;

    if (!batch || !course || !semester || !contact || !institute) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newStudent = new Student({
      batch,
      course,
      semester,
      contact,
      institute
    });

    await newStudent.save();

    res.status(201).json({ message: 'Student data saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to generate and download the Excel file
app.get('/api/download-students', async (req, res) => {
  try {
    const students = await Student.find().populate('institute');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    worksheet.columns = [
      { header: 'Batch', key: 'batch', width: 20 },
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Semester', key: 'semester', width: 20 },
      { header: 'Contact', key: 'contact', width: 20 },
      { header: 'Institute', key: 'institute', width: 20 }
    ];

    students.forEach(student => {
      worksheet.addRow({
        batch: student.batch,
        course: student.course,
        semester: student.semester,
        contact: student.contact,
        institute: student.institute.institute
      });
    });

    const filePath = path.join(__dirname, 'students.xlsx');
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, 'students.xlsx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
