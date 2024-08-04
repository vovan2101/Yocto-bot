const kafka = require('kafka-node');
const { KafkaClient, Consumer } = kafka;
const precursorvcForm = require('../puppeteer/precursorvcForm');
const pathvcForm = require('../puppeteer/pathvcForm');
const boostVcForm = require('../puppeteer/boostVcForm');

const client = new KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new Consumer(
    client,
    [
        { topic: 'precursorvc-form', partition: 0 },
        { topic: 'pathvc-form', partition: 0 },
        { topic: 'boost-vc-form', partition: 0 }
    ],
    { autoCommit: true }
);

consumer.on('message', async (message) => {
    console.log('Raw message received:', message);

    let formData;
    try {
        formData = JSON.parse(message.value.toString());
        console.log('Parsed message:', formData);
    } catch (error) {
        console.error('Error parsing message:', error);
    }

    if (formData) {
        if (message.topic === 'precursorvc-form') {
            await precursorvcForm(formData);
        } else if (message.topic === 'pathvc-form') {
            await pathvcForm(formData);
        } else if (message.topic === 'boost-vc-form') {
            await boostVcForm(formData);
        }
    } else {
        console.error('No form data received or unknown topic');
    }
});

consumer.on('error', (error) => {
    console.error('Error in Kafka consumer', error);
});

module.exports = consumer;
