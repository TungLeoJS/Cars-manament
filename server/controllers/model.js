const Brand = require('../models/brand');
const Model = require('../models/model');

exports.create = async (req, res) => {
    try {
        const { brand, name, color, image } = req.body;
        const model = await Model.create({
            brand,
            name,
            color,
            image,
        });
        model.save();

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
        updatedModel.update();

        res.status(200).json(updatedModel);
    } catch (err) {
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
        const qBrandName = req.query.brandName;
        const searchText = req.query.searchText;
        let model;

        if (qBrandName) {
            model = await Model.find()
                .select('name brand')
                .populate({
                    path: 'brand',
                    model: 'Brand',
                    match: {
                        name: {
                            $regex: new RegExp(qBrandName, 'i'),
                        },
                    },
                });

            model = model.filter((item) => item.brand !== null);
        } else if (searchText) {
            const brandIds = await Brand.find({
                name: { $regex: `/.*${searchText}.*/`, $options: 'i' },
            })
                .select('_id')
                .lean();

            model = await Model.find({
                $or: [
                    {
                        name: {
                            $regex: searchText,
                        },
                    },
                    {
                        color: {
                            $regex: searchText,
                        },
                    },
                    {
                        desc: {
                            $regex: searchText,
                        },
                    },
                    {
                        brand: {
                            $in: brandIds,
                        },
                    },
                ],
            })
                .populate('brand')
                .lean();
        } else {
            model = await Model.find();
        }

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
