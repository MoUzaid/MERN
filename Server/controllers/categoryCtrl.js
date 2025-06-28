const Category = require('../models/CategoryModel');
const categoryCtrl = {
    getCategory: async (req, res) => {
        try {
            const category = await Category.find();
            res.json(category);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    createCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const newCategory = await Category.create({ name });
            await newCategory.save();
            res.json({msg:"Category is created"});
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id);
            res.json({ msg: "Category is deleted" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { name } = req.body;
            await Category.findByIdAndUpdate({ _id: req.params.id }, { name })
            res.json({ msg: "Category is updated" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}
module.exports=categoryCtrl;