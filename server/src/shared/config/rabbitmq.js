import amqp from 'amqplib';
import config from './index.js';
import logger from './logger.js';

class RabbitMQConnection {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.isConnecting = false;
    }

    async connect() {
        if (this.isConnected) {
            return this.channel;
        }

        if (this.isConnecting) {
            await new Promise((resolve) => {
                const checkConnection = setInterval(() => {
                    if (this.isConnected) {
                        clearInterval(checkConnection);
                        resolve();
                    }
                }, 100);
            })
            return this.channel;
        }

        try {
            this.isConnecting = true;

            logger.info('Connecting to RabbitMQ...', config.rabbitmq.uri);
            this.connection = await amqp.connect(config.rabbitmq.uri);
            this.channel = await this.connection.createChannel();

            //creating key
            const dlqName = `${config.rabbitmq.queue}_dlq`;
            
            //dl queue
            await this.channel.assertQueue(dlqName, { 
                durable: true 
            });

            //normal queue
            await this.channel.assertQueue(config.rabbitmq.queue, { 
                durable: true,
                arguments: {
                    'x-dead-letter-exchange': '',
                    'x-dead-letter-routing-key': dlqName,
                }
            });
            logger.info('Connected to RabbitMQ', config.rabbitmq.queue);

            this.connection.on("close", () => {
                logger.warn('RabbitMQ connection closed');
                this.connection = null;
                this.channel = null;
            }) 

            this.connection.on("error", (err) => {
                logger.error('RabbitMQ connection error', err);
                this.connection = null;
                this.channel = null;
            }) 

            this.isConnecting = false;
            return this.channel;
        } catch (error) {
            this.isConnecting = false;
            logger.error('Error connecting to RabbitMQ', error);
            throw error;
        }
    }

    getChannel() {
        return this.channel;
    }

    getStatus() {
        if (!this.connect || !this.channel) return 'connected';
        if (this.connect.closing) return 'closing';
        return 'connected';
    }

    async close() {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }

            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }
            logger.info('RabbitMQ channel closed');

        } catch (error) {
            logger.error('Error closing RabbitMQ connection', error);
        }
    }
}

export default new RabbitMQConnection();