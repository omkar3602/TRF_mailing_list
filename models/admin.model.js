const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type:String, required:true
    }, 
    email:{
        type:String, required:true
    }, 
    pass:{
        type:String, required:true
    },
    tokens:[
        {
            token: {
                type:String, required:true
            }
        }
    ]
},{ timestamps: true })

userSchema.pre('save', async function(next) {
    if(this.isModified('pass')){
        this.pass = await bcrypt.hash(this.pass, 12);
    }
    next();
});

userSchema.methods.generateAuthToken = async function() {
    try{
        let token = jwt.sign({_id:this._id}, process.env.KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token; 
    }catch (err) {
        console.log(err);
    }
}

const User = mongoose.model('USER', userSchema);

module.exports = User;