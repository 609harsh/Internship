const mongoose = require('mongoose')
const studentSchema = mongoose.Schema({
        name : {type : String, required : true},
        email : {type: String, required : true,match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
        mobile : {type: String, required: true},
        dob:{type:String,required:true},
        workExp:{type:String,required:true},
        resume:{type:String,required:true},
        currentLocation:{type:String,required:true},
        address:{type:String,required:true},
        currentEmployer:{type:String},
        currentDesignation:{type:String}
})

module.exports = mongoose.model('Student', studentSchema)