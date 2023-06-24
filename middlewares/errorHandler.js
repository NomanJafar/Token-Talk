const {ValidationError} = require("joi");

const errorHandler = (error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message || 'Internal Server Error';
    let auth = error.auth || true
    // if (res && res.status && typeof res.status === 'function') {
    //     return res.status(status).json({ message, status, auth: false });
    //   } else {
    //     // Fallback response in case res object is not as expected
    //     console.error('Invalid res object:', res);
    //     return next(error);
    //   }

    res.apiError(message, status, auth);
  };
  
  module.exports = errorHandler;
  