const Model = require('../models/model');
const Brand = require('../models/brand');

exports.create = async (req, res) => {
    try {
        const { name, desc, logo } = req.body;
        const brand = await Brand.create({
            name,
            logo,
            desc,
        });

        res.status(201).json(brand);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        res.status(200).json(updatedBrand);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        await Brand.findByIdAndDelete(req.params.id);

        res.status(200).json('Brand has been deleted');
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAll = async (req, res) => {
    try {
        const qName = req.query.name;
        let brand;

        if (qName) {
            brand = await Brand.find({
                name: {
                    $regex: qName,
                    $options: 'i',
                },
            });
        } else {
            brand = await Brand.find();
        }

        res.status(200).json(brand);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        res.status(200).json(brand);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getModelById = async (req, res) => {
    try {
        const model = await Model.find({ brandId: req.params.id });
        console.log(model);

        res.status(200).json(model);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
