import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config(); 

let channel: amqp.Channel;

// Function to connect to RabbitMQ
export const connectRabbitMQ = async () => {
    const rabbitMQUrl = process.env.RABBITMQ_URL;

    // Check if rabbitMQUrl is defined
    if (!rabbitMQUrl) {
        throw new Error('RABBITMQ_URL is not defined in the .env file');
    }

    const connection = await amqp.connect(rabbitMQUrl); 
    channel = await connection.createChannel();
    await channel.assertQueue('score_updates'); 
};

// Function to get the RabbitMQ channel
export const getRabbitMQChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ first.');
    }
    return channel;
};
