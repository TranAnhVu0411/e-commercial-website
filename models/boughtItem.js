const mongoose = require('mongoose'), 
{Schema} = mongoose,
boughtItemSchema = new Schema({
    Item: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    },
    Number: {
        type: Number,
        min: [1, 'Number of Bought Item must be larger than 0']
    }
});

module.exports = mongoose.model('boughtItem', boughtItemSchema);