const mongoose = require('mongoose');
const {CONNECTION_STRING} = require('../config/index');

const connectToDB =  async ()=>{
    const connection = await mongoose.connect(CONNECTION_STRING);
    console.log(`connected to database successfully ${connection.connection.host}`)
    
}

module.exports = connectToDB;