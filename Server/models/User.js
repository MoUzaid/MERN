const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
type:String,
required:true,
unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:Number,
        required:true,
        default:0,
    },
    cart:{
        type:Array,
        default:[],
    },
    address:{
type:Object,
    }
},{
timestamps:true,
})

module.exports = mongoose.model('User', userSchema);