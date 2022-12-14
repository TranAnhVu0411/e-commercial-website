const mongoose = require('mongoose'),
{Schema} = mongoose,
reviewSchema = new Schema({
    comment: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    reviewUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewItem: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);