import dotenv from 'dotenv';

dotenv.config();
 

console.log("ENV CHECK:", {
  mongo: process.env.MONGO_URI,
  rabbit: process.env.RABBITMQ_URL,
  pgHost: process.env.PG_HOST,
});


const config = {
    node_env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),

    //MongoDB configuration
    mongo: {
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME,
    },

    //Postgres configuration
    postgres: {
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT || '5432', 10),
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    },

    //RabbitMQ configuration
    rabbitmq: {
        uri: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
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
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '90000', 10), // 15 minute
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10), // limit each IP to 1000 requests per windowMs
    },

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expiresIn: 224 * 60 * 60 * 1000
    }
}

export default config;