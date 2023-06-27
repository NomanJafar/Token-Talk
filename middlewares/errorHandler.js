const {ValidationError} = require("joi");

const errorHandler = (error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message || 'Internal Server Error';
    let auth = error.auth || true

    res.apiError(message, status, auth);
  };
  
  module.exports = errorHandler;
  