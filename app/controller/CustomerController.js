const Product = require("../model/product");
const Category = require("../model/category");
const mongoose = require("mongoose");
class CustomerController {
  async homepage(req, res) {
    try {
      console.log("Homepage loaded");
      console.log(req.query);
      const categories = await Category.find({ isDeleted: false });
      const filter = {};

      // Category filter
      if (req.query.category) {
        filter.category = req.query.category;
      }

      // Search filter
      if (req.query.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
        ];
      }

      // Add isDeleted filter
      filter.isDeleted = false;

      const products = await Product.find(filter).populate("category");
      res.render("customer/customerhome", {
        products,
        categories,
        query: req.query,
      });
    } catch (err) {
      console.log(err);
      req.flash("error", "Error loading products");
      res.render('customer/customerhome', {
          products: [],
          categories: [],
          query: {},
          error: 'Error loading products'
      });

    }
  }

  async homepageFilter(req, res) {
    try {
      const { category, search } = req.query;
      const filter = {};

      // Category filter
      if (req.query.category) {
        filter.category = req.query.category;
      }

      // Search filter
      if (req.query.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
        ];
      }

      // Add isDeleted filter
      filter.isDeleted = false;

      
      try {
        const products = await Product.find(filter).populate("category");
        res.json(products);
      } catch (err) {
        console.error(err);
        req.flash("error", "Error loading filtered products");
        res.status(500).json({ error: "Server error" });
      }
    } catch (err) {
      console.log(err);
      req.flash("error", "Error loading filtered products");
    }
  }

  async productDetail(req, res) {
    try {
        console.log(req.params, "params");
    const slugOrId = req.params.slug;
    let product;

    // Check if slugOrId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      product = await Product.findOne({
        $or: [
          { _id: slugOrId },
          { slug: slugOrId }
        ]
      }).populate("category");
    } else {
      product = await Product.findOne({ slug: slugOrId }).populate("category");
    }
    


      if (!product) {
        req.flash("error", "Error loading product detail");
        //return res.redirect("/");
      }else{
        res.render("customer/productdetail", { product });

      }

      
    } catch (err) {
      console.log(err);
      req.flash("error", "Error loading product detail");
    //   res.redirect("/customer");
    }
  }
}

module.exports = new CustomerController();
