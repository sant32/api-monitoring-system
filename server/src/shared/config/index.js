import dotenv from 'dotenv';

dotenv.config();

const config = {
    node_env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),

    //MongoDB configuration
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/api_monitoring',
        dbName: process.env.MONGO_DB_NAME || 'api_monitoring',
    },

    //Postgres configuration
    postgres: {
        uri: process.env.POSTGRES_URI || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        database: process.env.PG_DATABASE || 'api_monitoring',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || 223322,
    },

    //RabbitMQ configuration
    rabbitmq: {
        uri: process.env.RABBITMQ_URI || 'amqp://localhost:5672',
        queue: process.env.RABBITMQ_QUEUE || 'api_hits',
        PublisherConfirms: process.env.RABBITMQ_PUBLISHER_CONFIRMS === 'true' || false,
        retryAttempts: parseInt(process.env.RABBITMQ_RETRY_ATTEMPTS || '5', 10),
        retryDelay: parseInt(process.env.RABBITMQ_RETRY_DELAY || '1000', 10), // in milliseconds
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },

    ratelimit: {
        windowMs: parseInt(process.env.RATELIMIT_WINDOW_MS || '90000', 10), // 15 minute
        maxRequests: parseInt(process.env.RATELIMIT_MAX_REQUESTS || '1000', 10), // limit each IP to 1000 requests per windowMs
    }
}

export default config;