import BaseRepository from "./BaseRepository.js";
import User from "../../../shared/models/User.js"
import logger from "../../../shared/config/logger.js"


class MongoUserRepository extends BaseRepository {
    constructor() {
        super(User)
    }


    async create(userData) {
        try {
            let data = { ...userData }
            console.log("create - before permissions check");
            if (data.role === "super_admin" && !data.permissions) {
                data.permissions = {
                    canCreateApiKeys: true,
                    canManageUsers: true,
                    canViewAnalytics: true,
                    canExportData: true,
                }
            }

            console.log("create - before new model");


            const user = new this.model(data);
             console.log("create - before save");
            await user.save();
             console.log("create - after save");
            logger.info("User created", { username: user.username });
            return user
        } catch (error) {
            console.log("create - caught error:", error.message);
        console.log("create - error name:", error.name);
            logger.error("Error creating user", error)
            throw error;
        }
    }

 
    async findById(userId) {
        try {
            const user = await this.model.findById(userId)
            return user
        } catch (error) {
            logger.error("Error finding user by id", error)
            throw error;
        }
    }

  
    async findByUsername(username) {
        try {
            const user = await this.model.findOne({ username })
            return user
        } catch (error) {
            logger.error("Error finding user by username", error)
            throw error;
        }
    }


    async findByEmail(email) {
        try {
            const user = await this.model.findOne({ email })
            return user
        } catch (error) {
            logger.error("Error finding user by email", error)
            throw error;
        }
    }

    async findAll() {
        try {
            const user = await this.model.find({ isActive: true }).select("-password")
            return user
        } catch (error) {
            logger.error("Error finding user by email", error)
            throw error;
        }
    }
}

export default new MongoUserRepository()