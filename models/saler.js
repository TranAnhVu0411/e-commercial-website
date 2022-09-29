const mongoose = require('mongoose'),
{Schema} = mongoose,
User = require('./user'),
salerSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    shopAddress: {
        type: String,
        required: true
    },
    bankAccount: {
        accountName: {
            type: String,
            required: true,
            uppercase: true
        },
        identityNumber: {
            type: Number,
            required: true,
            min: [100000000, 'Identity number is too short'],
            max: 999999999
        },
        accountNumber: {
            type: Number,
            required: true,
            min: [100000000, 'Account number is too short'],
            max: 999999999
        },
        bank: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: true
        }
    },
    saleItems: [{
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }],
    userInfo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

salerSchema.pre('save', function(next){
    let saler = this;
    if (saler.userInfo===undefined){
        User.findOne({email: saler.email}).then(
            user => {
                saler.userInfo = user;
                next();
            }
        ).catch(
            error => {
                console.log(`Error in connection User: ${error.message}`);
                next(error);
            }
        )
    }else{
        next();
    }
});

module.exports = mongoose.model('Saler', salerSchema);