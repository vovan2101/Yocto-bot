const express = require('express');
const bodyParser = require('body-parser');
const { producer, consumer } = require('./kafka');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());

app.use(bodyParser.json());

app.post('/send-form', (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    producer(formData);
    res.send('Form submitted successfully');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    consumer;
})