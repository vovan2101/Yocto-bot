const express = require('express');
const bodyParser = require('body-parser');
const { producer, consumer } = require('./kafka');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());

app.post('/send-forms', upload.fields([
    { name: 'founder_video_file', maxCount: 1 },
    { name: 'pitch_deck_file', maxCount: 1 }
]), (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);

    if (req.files['founder_video_file']) {
        formData.founder_video_file = req.files['founder_video_file'][0].path;
    }

    if (req.files['pitch_deck_file']) {
        formData.pitch_deck_file = req.files['pitch_deck_file'][0].path;
    }
    producer(formData, 'form-submissions');
    res.send('Forms submitted successfully');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    consumer;
});
