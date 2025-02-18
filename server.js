import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)

const timeSchema = new mongoose.Schema({
	text: { type: String, required: false},
	time: { type: String, required: false},
});
const Time = mongoose.model('Time', timeSchema);

app.get('/api/times', async (req, res) => {
	try {
		const times = await Time.find();
		res.json(times);
	} catch(err) {
		res.status(500).json({ message: 'Time not found', error: err });
	}
});
app.put('/api/times/:id', async (req, res) => {
	try {
		const updatedTime = await Time.findByIdAndUpdate(req.params.id, req.body);
		if(!updatedTime) {
			return res.status(404).json({ message: 'Time not found' });
		}
		res.status(200).json(updatedTime);
	} catch(err) {
		res.status(500).json({ message: 'Could not update time', error: err });
	}
});

app.post('/api/username', async (req, res) => {
	try {
		const newTime = new Time(req.body);
		const saveTime = await newTime.save();
		res.status(201).json(saveTime);
	} catch(err) {
		res.status(500).json({ message: 'Could not post time', error: err });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
