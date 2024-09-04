const { Schema, createModel } = require("..");

const personSchema = new Schema({
    firstname:{
        type:String,
        required:true
    }
    ,
    lastname:{
        type:String,
        required:true
    },
})
personSchema.setTimestamps(true)
const Person = createModel('person',personSchema);

module.exports={Person}