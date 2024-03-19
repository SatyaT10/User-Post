const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: { 
        type: String 
    },
    email: {
        type: String
    },
    password:{
        type:String
    },
    image:{
        type:String
    },
    mobile:{
        type:Number
    }
});


module.exports= mongoose.model('User',userSchema);