const Product = require('../models/ProductModel');

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  // ✅ GET ALL PRODUCTS
  getProduct: async (req, res) => {
    try {
      const features = new APIfeatures(Product.find(), req.query)
        .filtering()
        .sorting()
        .pagination();
      const products = await features.query;

      res.json({
        status: 'success',
        result: products.length,
        products
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ CREATE PRODUCT
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
        checked
      } = req.body;

      if (!images || !images.url || !images.public_id) {
        return res.status(400).json({ msg: 'No image uploaded' });
      }

      const product = await Product.findOne({ product_id });
      if (product) {
        return res.status(400).json({ msg: 'This product already exists.' });
      }

      const newProduct = await Product.create({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
        checked
      });

      res.json(newProduct);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ DELETE PRODUCT
  deleteProduct: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ UPDATE PRODUCT
  updateProduct: async (req, res) => {
    try {
      const {
        title,
        price,
        description,
        content,
        images,
        category,
        checked
      } = req.body;

      if (!images || !images.url || !images.public_id) {
        return res.status(400).json({ msg: 'No image uploaded' });
      }

      await Product.findByIdAndUpdate(
        req.params.id,
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
          checked
        },
        { new: true }
      );

      res.json({ msg: 'Product updated successfully' });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ SEARCH PRODUCTS
 searchProduct: async (req, res) => {
  try {
    let keyword = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const filters = {};

    // ✅ Extract "under [price]"
    const match = keyword.match(/under\s*(\d+)/i);
    if (match) {
      const maxPrice = parseInt(match[1]);
      filters.price = { $lte: maxPrice };

      // ✅ Clean keyword by removing "under 5000"
      keyword = keyword.replace(match[0], '').trim(); // removes "under 5000"
    }

    // ✅ Build RegEx from cleaned keyword
    const regex = new RegExp(keyword, 'i');
    filters.$or = [
      { title: { $regex: regex } },
      { category: { $regex: regex } }
    ];

    const products = await Product.find(filters)
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    res.json({
      status: 'success',
      result: products.length,
      products
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}


};

module.exports = productCtrl;
