const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema(
    {
        brandId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        color: {
            type: String,
        },
        desc: {
            type: String,
        },
        img: {
            type: String,
        },
    },
    {
        timestamp: true,
    }
);

module.exports = mongoose.model('Model', ModelSchema);
