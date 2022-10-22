const mongoose = require('mongoose');
const schemaOptions = require('./schemaOptions');
const Schema = mongoose.Schema;

const ModelSchema = mongoose.Schema(
    {
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'Brand',
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
        timestamps: true,
    },
    schemaOptions
);

module.exports = mongoose.model('Model', ModelSchema);
