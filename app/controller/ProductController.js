const Product = require('../model/product');
const Category = require('../model/category');
const slugify = require("slugify");
const fs = require('fs');
const path = require('path');

const Joi = require('joi');

const productValidation = (isEdit = false) => Joi.object({
    name: Joi.string().min(3).max(100).required(),
    image: isEdit ? Joi.string().optional() : Joi.string().required(),
    description: Joi.string().min(5).max(500).required(),
  });
class ProductController {
    async showAddForm(req, res) {
        try {
            const categories = await Category.find({ isDeleted: false });
            res.render('admin/products/add', { categories, errors: null, old: {} });
        } catch (err) {
            console.log(err);
            req.flash('error', 'Error loading categories');
            res.redirect('/admin/products/list');
        }
    }

    async createProduct(req, res) {
        try {
            const { name, category, description } = req.body;
            console.log('inside createProduct', req.body);
            const { error } = productValidation.validate({ name,image: req.file?.filename, description }, { abortEarly: false });
   
    if (error) {
        console.log(error.details);
        const categories = await Category.find({ isDeleted: false });
        const errors = {};
        error.details.forEach(err => {
            errors[err.context.key] = err.message;
        });
        console.log(errors);

        return res.render('admin/products/add', {
            errors,
            old: req.body,
            categories
        });
    }
    //proceed
            const slug = slugify(name, { lower: true });
            const image = req.file ? req.file.filename : null;

            await Product.create({
                name,
                slug,
                category,
                description,
                image
            });

            req.flash('success', 'Product added successfully');
            res.redirect('/admin/products/list');
        } catch (err) {
            console.log(err);
            req.flash('error', 'Error creating product');
            res.redirect('/admin/products/add');
        }
    }

    async showEditForm(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            const categories = await Category.find({ isDeleted: false });
            
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/admin/products/list');
            }

            res.render('admin/products/edit', { product, categories, errors: null, old: {} });
        } catch (err) {
            console.log(err);
            req.flash('error', 'Error loading product');
            res.redirect('/admin/products/list');
        }
    }

    async updateProduct(req, res) {
        try {
            const { name, category, description } = req.body;
            const schema = productValidation(true); // true = edit mode
const { error } = schema.validate({ name, description }, { abortEarly: false });
    if (error) {
        console.log(error.details);
        const categories = await Category.find({ isDeleted: false });
        const errors = {};
        error.details.forEach(err => {
            errors[err.context.key] = err.message;
        });

        const product = await Product.findById(req.params.id);

        return res.render('admin/products/edit', {
            errors,
            old: req.body,
            categories,
            product
        });
    }
            const product = await Product.findById(req.params.id);            
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/admin/products/list');
            }

            if (req.file) {                
                if (product.image) {
                    const oldImagePath = path.join(__dirname, '../../uploads/', product.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                product.image = req.file.filename;
            }

            product.name = name;
            product.slug = slugify(name, { lower: true });
            product.category = category;
            product.description = description;

            await product.save();
            req.flash('success', 'Product updated successfully');
            res.redirect('/admin/products/list');
        } catch (err) {
            console.log(err);
            req.flash('error', 'Error updating product');
            res.redirect('/admin/products/list');
        }
    }

    async listProducts(req, res) {
        try {
            const products = await Product.find({ isDeleted: false }).populate('category');
            res.render('admin/products/list', { products });
        } catch (err) {
            console.log(err);
            req.flash('error', 'Error loading products');
            res.redirect('/admin/dashboard');
        }
    }

    async getAllDiscardedProducts(req, res) {
        try {
            const products = await Product.find({ isDeleted: true }).populate('category');
            res.render('admin/products/discarded', { products });
        } catch (err) {
            console.log(err);
            req.flash('error', 'Error loading discarded products');
            res.redirect('/admin/products/list');
        }
    }

    async softdeleteProducts(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/admin/products/list');
            }

            product.isDeleted = true;
            await product.save();
            
            req.flash('success', 'Product moved to trash successfully');
            res.redirect('/admin/products/list');
        } catch (err) {
            console.log(err);
            req.flash('error', 'Error moving product to trash');
            res.redirect('/admin/products/list');
        }
    }

    async softdeleteRevert(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/admin/products/discarded');
            }

            product.isDeleted = false;
            await product.save();
            
            req.flash('success', 'Product restored successfully');
            res.redirect('/admin/products/list');
        } catch (err) {
            console.log(err);
            req.flash('error', 'Error restoring product');
            res.redirect('/admin/products/discarded');
        }
    }

    async deleteProduct(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/admin/products/list');
            }

            if (product.image) {
                const imagePath = path.join(__dirname, '../uploads/', product.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await Product.deleteOne({ _id: req.params.id });
            req.flash('success', 'Product permanently deleted successfully');
            res.redirect('/admin/products/list');
        } catch (err) {
            console.log(err);
            req.flash('error', 'Error deleting product');
            res.redirect('/admin/products/list');
        }
    }
}

module.exports = new ProductController();