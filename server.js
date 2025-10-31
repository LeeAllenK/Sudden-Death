import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve(); // Needed for ES modules
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors({origin: 'https://sudden-death-frontend.onrender.com'}));

mongoose.connect(process.env.MONGODB_URI)
	.then(() => console.log('✅ Connected to MongoDB'))
	.catch((err) => {
		console.error(' MongoDB connection error:', err);
		process.exit(1);
	});

const timeSchema = new mongoose.Schema({
	text: { type: String, required: true},
	time: { type: String, required: true},
});
const Time = mongoose.model('Time', timeSchema);

app.get('/api/stats', async (req, res) => {
	try {
		const times = await Time.find();
		res.json(times);
		console.log('STATS')
	} catch(err) {
		res.status(500).json({ message: 'Time not found', error: err });
	}
});
//Possible add for route to handle root request *Remember call route after so doesn't catch everything*
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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
