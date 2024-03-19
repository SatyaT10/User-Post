const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
    Title: {
        type: String
    },
    Body: {
        type: String
    },
    Created_By: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    is_active: {
        type: String,
        default: 'yes'
    },
    location: {
        type: {
            type: String
        },
        coordinates: []
    }

});

postSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Post', postSchema);