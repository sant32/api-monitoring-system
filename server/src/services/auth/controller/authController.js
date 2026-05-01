import config from "../../../shared/config/index.js";
import { APPLICATION_ROLES } from "../../../shared/constants/roles.js";
import ResponseFormatter from "../../../shared/utils/responseFormatter.js"


export class AuthController {
    constructor(authService) {
        if (!authService) {
            throw new Error("authService is Required");
        }

        this.authService = authService
    };

    async onboardSuperAdmin(req, res, next) {
        
    console.log("next type:", typeof next);
        try {
            const { username, email, password } = req.body;
            console.log("before service call");

            const superAdminData = {
                username, email, password, role: APPLICATION_ROLES.SUPER_ADMIN
            };

            const { token, user } = await this.authService.onboardSuperAdmin(superAdminData);
        

            res.cookie("authToken", token, {
                httpOnly: config.cookie.httpOnly,
                secure: config.cookie.secure,
                maxAge: config.cookie.expiresIn
            });

            res.status(201).json(ResponseFormatter.success(user, "Super admin created successfully", 201))
        } catch (error) {
            console.log("caught error:", error.message);
        console.log("next type in catch:", typeof next)
            next(error)
        }
    };

    async regsiter(req, res, next) {
        try {
            const { username, email, password, role  } = req.body
            const userData = {
                username, email, password, role: role || APPLICATION_ROLES.CLIENT_VIEWER
            };

            const { token, user } = await this.authService.register(userData)

            res.cookie("authToken", token, {
                httpOnly: config.cookie.httpOnly,
                secure: config.cookie.secure,
                maxAge: config.cookie.expiresIn
            });

            res.status(201).json(ResponseFormatter.success(user, "User created successfully", 201))
        } catch (error) {
            next(error)
        }
    }
}