const kafka = require('kafka-node');
const { KafkaClient, Admin } = kafka;

const client = new KafkaClient({ kafkaHost: 'kafka:9092' });
const admin = new Admin(client);

const topics = [
    { topic: 'precursorvc-form', partitions: 1, replicationFactor: 1 },
    { topic: 'pathvc-form', partitions: 1, replicationFactor: 1 },
    { topic: 'boost-vc-form', partitions: 1, replicationFactor: 1 },
    { topic: 'ventures-2048', partitions: 1, replicationFactor: 1 },
    { topic: 'everywhere-vc-form', partitions: 1, replicationFactor: 1 },
    { topic: 'wischoff-form', partitions: 1, replicationFactor: 1 },
    { topic: 'incisive-ventures-form', partitions: 1, replicationFactor: 1 },
    { topic: 'hustle-fund-form', partitions: 1, replicationFactor: 1 },
    { topic: 'liberty-ventures-form', partitions: 1, replicationFactor: 1 },
    { topic: 'spatial-capital-form', partitions: 1, replicationFactor: 1 }
];

admin.createTopics(topics, (err, res) => {
    if (err) {
        console.error('Failed to create topics:', err);
    } else {
        console.log('Topics created successfully:', res);
        setTimeout(() => {
            client.close();
            console.log('Kafka client closed.');
        }, 5000);  // Задержка в 5 секунд
    }
});
