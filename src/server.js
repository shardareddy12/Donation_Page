import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

let donations = [];

// GET donations
app.get('/api/donations', (req, res) => {
  res.json(donations);
});

// POST donation
app.post('/api/donations', (req, res) => {
  const newDonation = { id: uuidv4(), ...req.body };
  donations.push(newDonation);
  res.status(201).json(newDonation);
});

// PUT (edit) donation
app.put('/api/donations/:id', (req, res) => {
  const { id } = req.params;
  const index = donations.findIndex((d) => d.id === id);
  if (index !== -1) {
    donations[index] = { ...donations[index], ...req.body };
    res.json(donations[index]);
  } else {
    res.status(404).json({ message: 'Donation not found' });
  }
});

// DELETE donation
app.delete('/api/donations/:id', (req, res) => {
  donations = donations.filter((d) => d.id !== req.params.id);
  res.json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
