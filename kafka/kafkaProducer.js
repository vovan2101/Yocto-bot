const kafka = require('kafka-node');
const { KafkaClient, Producer } = kafka;

const client = new KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(client);

// producer.on('ready', () => {
//     console.log('Kafka producer is connected and ready.');
// });

// producer.on('error', (error) => {
//     console.error('Error in Kafka producer', error);
// });

const sendMessage = (message) => {
    const topics = ['precursorvc-form', 'pathvc-form', 'boost-vc-form', 'ventures-2048', 'everywhere-vc-form'];

    topics.forEach((topic) => {
        const payloads = [
            { topic: topic, messages: JSON.stringify(message) }
        ];

        producer.send(payloads, (error, result) => {
            if (error) {
                console.error('Failed to send message', error);
            } else {
                console.log('Message sent successfully to topic', topic, result);
            }
        });
    });
};

module.exports = sendMessage;
