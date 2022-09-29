const mongoose = require('mongoose'),
{Schema} = mongoose,
itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: [],
    images: [],
    price: {
        type: Number,
        min: [1, 'price must be larger than 0']
    },
    saler: {
        type: Schema.Types.ObjectId,
        ref: 'Saler'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);