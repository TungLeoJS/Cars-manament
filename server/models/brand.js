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
        isActive: {
            type: Boolean,
        }
    },
    {
        timestamps: true,
    },
    schemaOptions
);

BrandSchema.virtual('model', {
    ref: 'Model',
    localField: '_id',
    foreignField: 'brand',
})

module.exports = mongoose.model('Brand', BrandSchema);
