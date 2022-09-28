const mongoose = require('mongoose'),
{Schema} = mongoose,
itemSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Tag: [],
    Images: [],
    Price: {
        type: Number,
        min: [1, 'price must be larger than 0']
    },
    Saler: {
        type: Schema.Types.ObjectId,
        ref: 'Saler'
    },
    Reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);