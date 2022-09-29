const mongoose = require('mongoose'), 
{Schema} = mongoose,
boughtItemSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    },
    number: {
        type: Number,
        min: [1, 'Number of Bought Item must be larger than 0']
    }
});

module.exports = mongoose.model('boughtItem', boughtItemSchema);