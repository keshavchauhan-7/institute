import React, { useState, useEffect } from 'react';
import { FaBuilding, FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InstituteScreen.css';
import Typewriter from 'typewriter-effect';


const InstituteScreen = () => {
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedContact, setSelectedContact] = useState('');
  const [entries, setEntries] = useState([]);
  const [contactError, setContactError] = useState('');
  const [formErrors, setFormErrors] = useState({
    institute: '',
    address: '',
    contact: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/institutes');
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        toast.error('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

  const handleAddEntry = async () => {
    const errors = {
      institute: '',
      address: '',
      contact: '',
    };

    if (!selectedInstitute) {
      errors.institute = 'Institute Name is required.';
    }
    if (!selectedAddress) {
      errors.address = 'Address is required.';
    }
    if (!selectedContact) {
      errors.contact = 'Contact No. is required.';
    }
    if (contactError) {
      errors.contact = contactError;
    }

    setFormErrors(errors);

    if (Object.values(errors).every(error => error === '')) {
      const newEntry = {
        institute: selectedInstitute,
        address: selectedAddress,
        contact: selectedContact,
      };

      try {
        let response;
        if (isEditing) {
          response = await fetch(`http://localhost:5000/api/institutes/${currentEditId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEntry),
          });
        } else {
          response = await fetch('http://localhost:5000/api/institutes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEntry),
          });
        }

        if (response.ok) {
          const savedEntry = await response.json();
          if (isEditing) {
            setEntries(entries.map(entry => entry._id === currentEditId ? savedEntry : entry));
            setIsEditing(false);
            setCurrentEditId(null);
            toast.success('Entry updated successfully.');
          } else {
            setEntries([...entries, savedEntry]);
            toast.success('Entry added successfully.');
          }
          setSelectedInstitute('');
          setSelectedAddress('');
          setSelectedContact('');
        } else {
          toast.error('Failed to save the entry.');
        }
      } catch (error) {
        toast.error('Error occurred.');
      }
    }
  };

  const handleEdit = (entry) => {
    setSelectedInstitute(entry.institute);
    setSelectedAddress(entry.address);
    setSelectedContact(entry.contact);
    setIsEditing(true);
    setCurrentEditId(entry._id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/institutes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setEntries(entries.filter(entry => entry._id !== id));
        setShowDeleteModal(false);
        setDeleteId(null);
        toast.success('Entry deleted successfully.');
      } else {
        toast.error('Failed to delete the entry.');
      }
    } catch (error) {
      toast.error('Error occurred.');
    }
  };

  const validateContact = (contact) => {
    if (/^\d{10}$/.test(contact)) {
      setContactError('');
    } else {
      setContactError('Please enter a valid 10-digit contact number.');
    }
    setSelectedContact(contact);
  };

  const handleKeyPress = (e) => {
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const openDeleteModal = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };


  return (
    <div className="institute-container">
      <div
        style={{
          textAlign: 'center',
          fontSize: '50px',
          fontFamily: 'monospace',
          background: 'linear-gradient(to left, #5f0f40, #9a031e)', // Gradient for text
          WebkitBackgroundClip: 'text', // Clip the background to text
          WebkitTextFillColor: 'transparent' // Make the text color transparent
        }}
      >
        <Typewriter
          options={{
            strings: ['Institutes Screen'],
            autoStart: true,
            loop: true,
            delay: 75, // Optional: Adjust typing speed
          }}
        />
      </div>

      <div className="institute-card">
        <h2 style={{ fontFamily: 'cursive', padding: 10, fontWeight: 800 }}>{isEditing ? 'Edit' : 'Enter'} Institute Details</h2>
        <div className="form-group">
          <div className="form-label">
            <FaBuilding className="form-icon" />
            <label>Institute Name:</label>
          </div>
          <input
            type="text"
            value={selectedInstitute}
            onChange={(e) => setSelectedInstitute(e.target.value)}
            placeholder="Enter Institute Name"
          />
          {formErrors.institute && <p className="error">{formErrors.institute}</p>}
        </div>

        <div className="form-group">
          <div className="form-label">
            <FaLocationDot className="form-icon" />
            <label>Address:</label>
          </div>
          <input
            type="text"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            placeholder="Enter Address"
          />
          {formErrors.address && <p className="error">{formErrors.address}</p>}
        </div>

        <div className="form-group">
          <div className="form-label">
            <FaPhoneAlt className="form-icon" />
            <label>Contact No.:</label>
          </div>
          <input
            type="text"
            value={selectedContact}
            onChange={(e) => validateContact(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Contact No."
          />
          {formErrors.contact && <p className="error">{formErrors.contact}</p>}
        </div>

        <button className='submit-btn' onClick={handleAddEntry}>
          {isEditing ? 'Update' : 'Add'}
        </button>
      </div>

      {entries.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>
                  <div className="table-header">
                    <FaBuilding /> <span>Institute Name</span>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <FaLocationDot /><span> Address </span>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <FaPhoneAlt /> <span>Contact No.</span>
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index} className="table-row">
                  <td>{entry.institute}</td>
                  <td>{entry.address}</td>
                  <td>{entry.contact}</td>
                  <td>
                    <div className="actions">
                      <FaEdit className='icon editicon' onClick={() => handleEdit(entry)} />
                      <MdDelete className='icon deleteicon' onClick={() => openDeleteModal(entry._id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No entries found.</p>
      )}

      <Link to="/student" className="link-button">
        Go to Student Screen
      </Link>

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this entry?</p>
            <button className="modal-btn" onClick={() => handleDelete(deleteId)}>Yes</button>
            <button className="modal-btn" onClick={closeDeleteModal}>No</button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default InstituteScreen;
