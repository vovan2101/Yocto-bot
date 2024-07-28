const kafka = require('kafka-node');
const { KafkaClient, Consumer } = kafka;
const fillForm = require('../puppeteer/fillForm');

const client = new KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new Consumer(
    client,
    [{ topic: 'form-submissions', partition: 0 }],
    { autoCommit: true }
);

consumer.on('message', async (message) => {
    console.log('Raw message received:', message); // Логирование сырых данных сообщения

    let formData;
    try {
        formData = JSON.parse(message.value.toString()); // Добавлена проверка toString()
        console.log('Parsed message:', formData); // Логирование парсенных данных
    } catch (error) {
        console.error('Error parsing message:', error);
    }

    if (formData) {
        await fillForm(formData);
    } else {
        console.error('No form data received');
    }
});

consumer.on('error', (error) => {
    console.error('Error in Kafka consumer', error);
});

module.exports = consumer;
