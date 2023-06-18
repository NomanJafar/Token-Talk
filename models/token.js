const mongoose = require('mongoose');
const {Schema} = mongoose;
const RefreshTokenSchema = new Schema({
    token: {type:String, required:true},
    userId:{type:mongoose.SchemaTypes.ObjectId, ref:'users'}
},
{timestamps:true})

module.exports=mongoose.model('RefreshToken',RefreshTokenSchema, "refreshtokens");