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

  const institutes = ['Institute 1', 'Institute 2', 'Institute 3'];
  const addresses = ['Address 1', 'Address 2', 'Address 3'];
  const contacts = ['1234567890', '0987654321', '1122334455'];

  // Fetch the data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from backend...');
        const response = await fetch('http://localhost:5000/api/institutes');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data fetched:', data);
        setEntries(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };


    fetchData();
  }, []);

  const handleAddEntry = async () => {
    if (selectedInstitute && selectedAddress && selectedContact) {
      const newEntry = {
        institute: selectedInstitute,
        address: selectedAddress,
        contact: selectedContact,
      };

      try {
        const response = await fetch('http://localhost:5000/api/institutes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEntry),
        });

        if (response.ok) {
          const savedEntry = await response.json();
          console.log('Entry saved:', savedEntry);
          setEntries([...entries, savedEntry]);

          // Clear the selections
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

  return (
    <div className="container">
      <div className="card">
        <h2>Select Institute Details</h2>

        <div className="form-group">
          <div style={{ display: 'flex', gap: '5px' }}>
            <FaBuilding style={{ position: 'relative', top: '2px' }} />
            <label>Institute Name:</label>
          </div>
          <select
            value={selectedInstitute}
            onChange={(e) => setSelectedInstitute(e.target.value)}
          >
            <option value="">Select Institute</option>
            {institutes.map((institute, index) => (
              <option key={index} value={institute}>
                {institute}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', gap: '5px' }}>
            <FaLocationDot style={{ position: 'relative', top: '2px' }} />
            <label>Address:</label>
          </div>
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
          >
            <option value="">Select Address</option>
            {addresses.map((address, index) => (
              <option key={index} value={address}>
                {address}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', gap: '5px' }}>
            <FaPhoneAlt style={{ position: 'relative', top: '2px' }} />
            <label>Contact No.:</label>
          </div>
          <select
            value={selectedContact}
            onChange={(e) => setSelectedContact(e.target.value)}
          >
            <option value="">Select Contact No.</option>
            {contacts.map((contact, index) => (
              <option key={index} value={contact}>
                {contact}
              </option>
            ))}
          </select>
        </div>

        <button className='add-btn' onClick={handleAddEntry}>
          Add
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
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.institute}</td>
                  <td>{entry.address}</td>
                  <td>{entry.contact}</td>
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
