const kafka = require('kafka-node');
const { KafkaClient, Consumer } = kafka;
const precursorvcForm = require('../puppeteer/precursorvcForm');
const pathvcForm = require('../puppeteer/pathvcForm');
const boostVcForm = require('../puppeteer/boostVcForm');
const ventures2048 = require('../puppeteer/ventures2048');
const everywhereVcForm = require('../puppeteer/everywhereVcForm');

const client = new KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new Consumer(
    client,
    [
        { topic: 'precursorvc-form', partition: 0 },
        { topic: 'pathvc-form', partition: 0 },
        { topic: 'boost-vc-form', partition: 0 },
        { topic: 'ventures-2048', partition: 0 },
        { topic: 'everywhere-vc-form', partition: 0 },
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
        } else if (message.topic === 'ventures-2048') {
            await ventures2048(formData);
        } else if (message.topic === 'everywhere-vc-form') {
            await everywhereVcForm(formData);
        }
    } else {
        console.error('No form data received or unknown topic');
    }
});

consumer.on('error', (error) => {
    console.error('Error in Kafka consumer', error);
});

module.exports = consumer;
