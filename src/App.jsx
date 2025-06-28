import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  // State to manage form inputs
  const [formData, setFormData] = useState({
    donor: '',
    type: '',
    quantity: '',
    date: ''
  });

  // State to store all donations fetched from the backend
  const [donations, setDonations] = useState([]);

  // Holds the ID of the donation being edited (null if adding new)
  const [editId, setEditId] = useState(null);

  // Fetch all donations when component mounts or donations.length changes
  useEffect(() => {
    axios.get("http://localhost:5001/api/donations")
      .then(res => setDonations(res.data))
      .catch(err => console.error(err));
  }, [donations.length]);

  // Updates form data as user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for both add and edit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Choose POST or PUT based on whether we're editing
    const apiCall = editId
      ? axios.put(`http://localhost:5001/api/donations/${editId}`, formData)
      : axios.post('http://localhost:5001/api/donations', formData);

    apiCall
      .then(() => {
        // Refresh the donations list after submission
        return axios.get('http://localhost:5001/api/donations');
      })
      .then((res) => {
        setDonations(res.data); // Update UI immediately
        setFormData({ donor: '', type: '', quantity: '', date: '' }); // Clear form
        setEditId(null); // Reset edit mode
      })
      .catch((err) => console.error(err));
  };

  // Fills the form with selected donation details for editing
  const handleEdit = (donation) => {
    setEditId(donation.id);
    setFormData(donation);
  };

  // Deletes donation and updates UI immediately
  // handleDelete to refetch after deleting
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/api/donations/${id}`)
      .then(() => {
        return axios.get('http://localhost:5001/api/donations');
      })
      .then(res => setDonations(res.data))
      .catch(err => console.error(err));
  };
  
  return (
    <div className="container">
      <h2>Donation Form</h2>
      <form onSubmit={handleSubmit}>
        <input name="donor" placeholder="Donor's Name" value={formData.donor} onChange={handleChange} required />
        <input name="type" placeholder="Type (money, food, etc.)" value={formData.type} onChange={handleChange} required />
        <input name="quantity" placeholder="Quantity/Amount" value={formData.quantity} onChange={handleChange} required />
        <input name="date" type="date" value={formData.date} onChange={handleChange} required />
        <button type="submit">{editId ? 'Update' : 'Add'} Donation</button>
      </form>

      <h2>Donation List</h2>
      <ul>
        {donations.map((d) => (
          <li key={d.id}>
            {d.donor} - {d.type} - {d.quantity} - {d.date}
            <button onClick={() => handleEdit(d)}>Edit</button>
            <button onClick={() => handleDelete(d.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;