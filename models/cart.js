const mongoose = require('mongoose'),
{Schema} = mongoose,
cartSchema = new Schema ({
    cartItems: [{
        type: Schema.Types.ObjectId,
        ref: 'boughtItem'
    }],
    Status: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);