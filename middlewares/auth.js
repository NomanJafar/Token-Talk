const UserDTO = require("../dto/user");
const User = require("../models/users");
const JWTService = require("../services/JWTService");

const auth = async (req, res, next) => {
    try {
        // 1. verify access and refresh tokens
        const {refreshtoken, accesstoken} = req.cookies;

        if (!accesstoken || !refreshtoken) {
            const error = {
                status: 401,
                message: "UnAuthorized",
            };

            return next(error);
        }
        let _id;
        try {
            _id = JWTService.verifyAccessToken(accesstoken)._id;
        } catch (error) {
            return next({ status: 401, message: "Error verifying token" });
        }

        // 2. add user DTO to request
        try {
            const user = await User.findById(_id);
            const userDto = new UserDTO(user);
            req.user = userDto;
            return next();
        } catch (error) {
            return next({ status: 401, message: "user not found" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = auth