const mongoose = require('mongoose');
const schemaOptions = require('./schemaOptions');

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
    },
    schemaOptions
);

module.exports = mongoose.model('Brand', BrandSchema);
