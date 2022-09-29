const mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose'),
{Schema} = mongoose,
userSchema = new Schema({
    userName:{
        type: String
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    money: {
        type: Number,
        required: true,
        min: [0, "Money can't be negative"]
    },
    boughtHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
},{
    timestamps: true
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);