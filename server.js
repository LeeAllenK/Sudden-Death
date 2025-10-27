import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
	useUnifiedTopology: true,
	ssl: true,
	tlsAllowInvalidCertificates: false,
})
	.then(() => console.log('✅ Connected to MongoDB'))
	.catch((err) => {
		console.error('❌ MongoDB connection error:', err);
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
	} catch(err) {
		res.status(500).json({ message: 'Time not found', error: err });
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
