const Model = require('../models/model');

exports.create = async (req, res) => {
    try {
        const { brandId, name, color, image } = req.body;
        const model = await Model.create({
            brandId,
            name,
            color,
            image,
        });

        res.status(201).json(model);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        const updatedModel = await Model.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        res.status(200).json(updatedModel);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        await Model.findByIdAndDelete(req.params.id);

        res.status(200).json('Model has been deleted');
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAll = async (req, res) => {
    try {
        const model = await Model.find({});

        res.status(200).json(model);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getById = async (req, res) => {
    try {
        const brand = await Model.findById(req.params.id);

        res.status(200).json(brand);
    } catch (err) {
        res.status(500).json(err);
    }
};
