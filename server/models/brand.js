const mongoose = require('mongoose');

const BrandSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
        },
        logo: {
            type: String,
        },
    },
    {
        timestamp: true,
    }
);

module.exports = mongoose.model('Brand', BrandSchema);
