import React, { useState, useEffect } from 'react';
import { FaBuilding, FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import './InstituteScreen.css';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/institutes');
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
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
          } else {
            setEntries([...entries, savedEntry]);
          }
          setSelectedInstitute('');
          setSelectedAddress('');
          setSelectedContact('');
        } else {
          console.error('Failed to save the entry');
        }
      } catch (error) {
        console.error('Error:', error);
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
      } else {
        console.error('Failed to delete the entry');
      }
    } catch (error) {
      console.error('Error:', error);
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

  return (
    <div className="container">
      <div className="card">
        <h2>{isEditing ? 'Edit' : 'Enter'} Institute Details</h2>

        <div className="form-group">
          <div style={{ display: 'flex', gap: '5px' }}>
            <FaBuilding style={{ position: 'relative', top: '2px' }} />
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
          <div style={{ display: 'flex', gap: '5px' }}>
            <FaLocationDot style={{ position: 'relative', top: '2px' }} />
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
          <div style={{ display: 'flex', gap: '5px' }}>
            <FaPhoneAlt style={{ position: 'relative', top: '2px' }} />
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

        <button className='add-btn' onClick={handleAddEntry}>
          {isEditing ? 'Update' : 'Add'}
        </button>
      </div>

      {entries.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaBuilding /> <span>Institute Name</span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaLocationDot /><span> Address </span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaPhoneAlt /> <span>Contact No.</span>
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.institute}</td>
                  <td>{entry.address}</td>
                  <td>{entry.contact}</td>
                  <td>
                    <button onClick={() => handleEdit(entry)}>Edit</button>
                    <button onClick={() => handleDelete(entry._id)}>Delete</button>
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
    </div>
  );
};

export default InstituteScreen;
