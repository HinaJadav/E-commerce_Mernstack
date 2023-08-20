const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs"); // import for make user password sefa
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // use in generate password --> it is build in model in NodeJS

//----------------------------------------------------------------

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter Your Name"],
        maxLength:[30, "Name cannot exceed 30 characters"],
        minLength:[4, "Name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true, "Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail, "Please enter a valid email"],
    },
    password:{
        type:String,
        required:[true, "Please Enter Your Password"],
        minLength:[8, "Password must be greater than 8 characters"],
        select:false, // using this when admin call get details about user than MongoDB return all things except password
    },
    avatar:{
        public_id: { 
            type:String,
            required:true
        },
        url: {
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

//one type of Event --> it occure before userSchema save 
userSchema.pre("save", async function(next) {
    // why we not use "ARROW" function here --> bcz, in arror function we can't use "this" 
    // --> and here we need to use "this"


    //* here we use if_else loop for update user password
    // why? because when use updates it's profile password is already in HEX form and using below HEX-converter line it convert HEX password again into HEX
    // solution: if_else loop for update user password

    if(!this.isModified("password")) {  // logic: if password is not change than we do nothing , Otherwise we convert it into HEX
        next();
    }
    this.password = await bcrypt.hash(this.password, 10); // --> here, 10 is power and it makesence about howmuch ossword is strong

});


// Topic: After register we direclly move into website --> no need to do login process after "register"
// JWT token
userSchema.methods.getJWTToken = function() {
    return jwt.sign({
        id:this._id,
    },
    process.env.JWT_SECRET, 
    {
        expiresIn:process.env.JWT_EXPIRE,
    });
};



// Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
     return await bcrypt.compare(enteredPassword, this.password);
};



// Generate Password reset token
userSchema.methods.getResetPasswordToken = function() {

    //Generate Password
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);