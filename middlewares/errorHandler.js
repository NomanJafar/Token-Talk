const {ValidationError} = require("joi");
const errorHandler = (error,req, res, next)=>{
let status = error.status??500;
let message = error.message??'Internal Server Error';
let data ={}


if(error instanceof ValidationError){
    status=401;
    res.apiError( message, status);
}
else res.apiError( message, status);


}

module.exports = errorHandler