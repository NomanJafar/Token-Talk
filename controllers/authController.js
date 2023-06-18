const Joi = require("joi");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserDTO = require("../dto/user");
const JWTService = require("../services/JWTService");
const RefreshToken = require("../models/token");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
  //register
  async signup(req, res, next) {
    try {
      // check body format
      const userRegisterSchema = Joi.object({
        username: Joi.string().min(5).max(30).required(),
        name: Joi.string().min(1).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(passwordPattern).required(),
      });
      const { error } = userRegisterSchema.validate(req.body);
      if (error) {
        next(error);
      }
      const { username, name, email, password } = req.body;
      // user already exist
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        next({ message: "a user with this email already exist", status: 409 });
      } else {
        // write user to db
        const hashedPassword = await bcrypt.hash(password, 10);
        const new_user = await User.create({
          username,
          name,
          email,
          password: hashedPassword,
        });

        if (new_user) {
          // generate Tokens
          const accessToken = JWTService.signAccessToken(
            { _id: new_user._id },
            "60m"
          );

          const refreshToken = JWTService.signRefreshToken(
            { _id: new_user._id },
            "60m"
          );

          const storeToken = await JWTService.storeRefreshToken(
            refreshToken,
            new_user._id
          );

          if (!storeToken) {
            next(error);
          } else {
            //set cookie
            res.cookie("accesstoken", accessToken, {
              maxAge: 1000 * 60 * 60 * 24,
              httpOnly: true,
            });
            res.cookie("refreshtoken", refreshToken, {
              maxAge: 1000 * 60 * 60 * 24,
              httpOnly: true,
            });

            const user = new UserDTO(new_user);
            res.apiSuccess({ user }, "user created successfully", 200, true);
          }
        }
      }
    } catch (error) {
      next(error);
    }
  },
  //login
  async login(req, res, next) {
    try {
      const userLoginSchema = Joi.object({
        username: Joi.string().min(5).max(30).required(),
        password: Joi.string().pattern(passwordPattern).required(),
      });

      const { error } = userLoginSchema.validate(req.body);
      const { username, password } = req.body;

      if (error) {
        return next(error);
      }

      try {
        const user = await User.findOne({ username });
        if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return next({
              message: "username or password is incorrect",
              status: 401,
            });
          } else if (user && match) {
            // generate Tokens
            const accessToken = JWTService.signAccessToken(
              { _id: user._id },
              "60m"
            );

            const refreshToken = JWTService.signRefreshToken(
              { _id: user._id },
              "60m"
            );
            // store token
            const storeToken = await RefreshToken.updateOne(
              { _id: user._id },
              { token: refreshToken }
            );

            if (!storeToken) {
              return next(error);
            } else {
              //set cookie
              res.cookie("accesstoken", accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
              });
              res.cookie("refreshtoken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
              });
              const send_user = new UserDTO(user);
              res.apiSuccess(send_user, "LoggedIn successfully", 200, true);
            }
          }
        } else {
          return next({
            message: "username or password is incorrect",
            status: 401,
          });
        }
      } catch (error) {
        return next(error);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  //logout
  async logout(req, res, next) {
    try {
      const { refreshtoken } = req.cookies;
      // delete refresh token
      await RefreshToken.deleteOne({ token: refreshtoken });
      // clear cookies
      res.clearCookie("refreshtoken");
      res.clearCookie("accesstoken");

      res.apiSuccess({}, "loggedOut successfully", 200);
    } catch (error) {
      next(error);
    }
  },

  // refresh token
  async refresh(req, res, next) {
    //1. refresh token

    try {
      const OldRefreshToken = req.cookies.refreshtoken;

      try {
        //2. verify refresh token
        const id = JWTService.verifyRefreshToken(OldRefreshToken)._id;
            
        // check if there is a user in database against this id
            const match = await User.findById(id);
            console.log(match, id);
            if(!match){
                return next({status:401, message:'UnAuthorized'});
            }


        //3. generate new tokens
        const newAccessToken = JWTService.signAccessToken({ id }, "60m");
        const newRefreshToken = JWTService.signRefreshToken({ id }, "60m");



    

        //4. store refresh token to db
        const IsTokenSaved =  await RefreshToken.updateOne(
            {
              _id: id,
            },
            { token: newRefreshToken },
            { upsert: true }
          );
        console.log(IsTokenSaved);
        if (IsTokenSaved) {
          //5. set cookies
          res.cookie("accesstoken", newAccessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
          });

          res.cookie("refreshtoken", newRefreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
          });

          res.apiSuccess({}, "Tokens updated successfully", 200);
        } else {
          return next({ status: 500, error: "Internal server error" });
        }
      } catch (error) {
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = authController;
