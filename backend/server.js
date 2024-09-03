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

// PUT endpoint to update an institute by ID
app.put('/api/institutes/:id', async (req, res) => {
  try {
    const updatedInstitute = await Institute.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedInstitute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE endpoint with ID validation
app.delete('/api/institutes/:id', async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const deletedInstitute = await Institute.findByIdAndDelete(id);

    if (!deletedInstitute) {
      return res.status(404).json({ message: 'Institute not found' });
    }

    res.status(200).json({ message: 'Institute deleted successfully' });
  } catch (error) {
    console.error('Error deleting:', error);
    res.status(500).json({ message: error.message });
  }
});

// Institute Schema
const instituteSchema = new mongoose.Schema({
  institute: String,
  address: String,
  contact: String,
});

const Institute = mongoose.model('Institute', instituteSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  batch: String,
  course: String,
  semester: String,
  contact: String,
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' }
});

const Student = mongoose.model('Student', studentSchema);

// Get institutes
app.get('/api/institutes', async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.status(200).json(institutes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post new institute
app.post('/api/institutes', async (req, res) => {
  try {
    const newInstitute = new Institute(req.body);
    const savedInstitute = await newInstitute.save();
    res.status(201).json(savedInstitute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post student data
app.post('/api/students', async (req, res) => {
  try {
    const { name, batch, course, semester, contact, institute } = req.body;

    if (!name || !batch || !course || !semester || !contact || !institute) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newStudent = new Student({
      name,
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

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().populate('institute');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});








// PUT endpoint to update student by ID
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE endpoint to delete student by ID
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
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
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Batch', key: 'batch', width: 20 },
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Semester', key: 'semester', width: 20 },
      { header: 'Contact', key: 'contact', width: 20 },
      { header: 'Institute', key: 'institute', width: 20 }
    ];

    students.forEach(student => {
      worksheet.addRow({
        name: student.name,
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
