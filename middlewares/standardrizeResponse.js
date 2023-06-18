// Custom middleware to standardize the response object
const standardizeResponse = (req, res, next) => {
    res.apiSuccess = (data, message = 'Success',statusCode=200, auth = false) => {
      res.status(statusCode).json({
        success: true,
        message,
        data,
        statusCode,
        auth:auth
      });
    };
  
    res.apiError = (message = 'Error', statusCode = 500,auth = false) => {
      res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        auth:auth
      });
    };
  
    next();
  };

  module.exports = standardizeResponse;