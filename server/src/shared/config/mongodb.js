import mongoose from "mongoose";
import config from "./index.js";
import logger from "./logger.js";


class MongoConnection {
    constructor() {
        this.connection = null;
    }
    
    /**
     * Connects to MongoDB using Mongoose. If already connected, it returns the existing connection.
     * @returns {Promise<mongoose.Connection>} The MongoDB connection instance.
     */
    async connect() {
        try {
            if (this.connection) {
                logger.info("Already connected to MongoDB");
                return this.connection;
            }

            await mongoose.connect(config.mongodb_uri, {
                dbName: config.mongo.dbName
            });
            logger.info("Connected to MongoDB");

            this.connection.on("error", (err) => {
                logger.error("MongoDB connection error:", err);
            })

            this.connection.on("disconnected", () => {
                logger.error("MongoDB Disconnected");
            })

            return this.connection;
          
        } catch (error) {
            logger.error("Error connecting to MongoDB:", error);
            throw error;
        }
    }


    async disconnect() {
        try {
            if(this.connection) {
                await mongoose.disconnect();
                this.connection = null;
                logger.info("Disconnected from MongoDB");
            }
        } catch (error) {
            logger.error("Error disconnecting from MongoDB:", error);
            throw error;
        }
    }


    getConnection() {
        return this.connection;
    }
}


export default new MongoConnection();