const dotenv = require('dotenv').config();
const PORT = process.env.PORT;
const CONNECTION_STRING = process.env.DB_CONNECTION;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

module.exports={
    PORT,
    CONNECTION_STRING,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET

}