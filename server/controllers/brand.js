const Model = require('../models/model');
const Brand = require('../models/brand');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
    try {
        const { name, desc, logo, isActive } = req.body;
        const brand = await Brand.create({
            name,
            logo,
            desc,
            isActive,
        });
        brand.save();

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
        updatedBrand.update();

        res.status(200).json(updatedBrand);
    } catch (err) {
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
        const { name: qName, lastIndexId, limit: qLimit } = req.query;
        let brand;

        const id =
            Number(lastIndexId) !== -1
                ? new mongoose.Types.ObjectId(lastIndexId)
                : Number(lastIndexId);

        if (Number(lastIndexId) === -1) {
            if (qName) {
                brand = await Brand.find({
                    name: { $regex: qName, $options: 'i' },
                }).limit(qLimit || 0);
            } else {
                brand = await Brand.find().limit(qLimit || 0);
            }
        } else {
            if (qName) {
                brand = await Brand.find({
                    name: { $regex: qName, $options: 'i' },
                    _id: { $gt: id },
                }).limit(qLimit || 0);
            } else {
                brand = await Brand.find({
                    _id: { $gt: id },
                })
                    .limit(qLimit || 0)
                    .populate('model')
                    .lean();
            }
        }

        const lastItem = await Brand.findOne(
            {},
            {},
            { sort: { createdAt: -1 } }
        );
        lastId =
            brand.length > 0
                ? brand[brand.length - 1]._id.toString()
                : lastIndexId;
        const isNextPageExist = lastItem
            ? lastId !== lastItem?._id.toString()
            : false;

        res.status(200).json({
            list: brand,
            isNextPageExist,
            lastIndexId: lastId,
        });
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

        res.status(200).json(model);
    } catch (err) {
        res.status(500).json(err);
    }
};
