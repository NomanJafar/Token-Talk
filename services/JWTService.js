const jwt = require("jsonwebtoken");
const  RefreshToken  = require("../models/token");
const {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET } = require('../config/index');

class JWTService {
  // sign access token
  static signAccessToken(payload, expiryTime) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: expiryTime });
  }
  // verify access token
  static verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  }

  // sign refresh token
  static signRefreshToken(payload, expiryTime) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: expiryTime });
  }
  // verify Refresh token
  static verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }

  // store refresh token to db
  static async storeRefreshToken(token, userId) {
    try {
      const refreshToken = await RefreshToken.create({ token, userId });
      return refreshToken;

    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports= JWTService;