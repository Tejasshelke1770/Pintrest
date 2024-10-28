const mongoose = require("mongoose");
const plm = require('passport-local-mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/pintrest");

const userSchema = mongoose.Schema({
  username: {
    type: "string",
    required: true,
  },
  email:{
    type:'string',
    required:true
  },
  password:{
    type:'string',
  },
  contact:{
    type:"number",
    required:true
  },
  profilePic: {
    type:"string",
  },
  boards:{
    type:Array,
    default:[]
  },
  posts :[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now // Set default to current date
},
});
userSchema.plugin(plm)

User = mongoose.model("User", userSchema);

module.exports = User;