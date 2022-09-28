const mongoose = require('mongoose'),
{Schema} = mongoose,
userSchema = new Schema({
    userName:{
        type: String
    },
    Email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    Money: {
        type: Number,
        required: true,
        min: [0, "Money can't be negative"]
    },
    boughtHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    }],
    Reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
},{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);