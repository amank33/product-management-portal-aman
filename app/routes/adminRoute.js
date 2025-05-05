const express=require('express');

const router=express.Router();
const upload = require('../helper/imageUpload');
const CategoryController=require('../controller/CategoryController')
const ProductController=require('../controller/ProductController')
// const Category = require("../model/category");

// Dashboard (basic)
router.get('/admin/dashboard', async (req, res) => {
    const Category = require('../model/category');
    const Product = require('../model/product'); // we'll create this later
    const categoryCount = await Category.countDocuments({ isDeleted: false });
    const productCount = await Product.countDocuments({ isDeleted: false });
  
    res.render('admin/adminhome', { categoryCount, productCount });
  });

// Category routes
router.get('/admin/category/list',CategoryController.listCategories)
router.get('/admin/category/add',CategoryController.showAddForm)
router.post('/admin/category/addNew',CategoryController.createCategory)
router.get('/admin/category/edit/:id', CategoryController.showEditForm)
router.post('/admin/category/update/:id', CategoryController.updateCategory)
//router.post('/admin/category/delete/:id', CategoryController.deleteCategory)
router.get('/admin/category/delete/:id',CategoryController.deleteCategory)

router.get('/admin/category/discarded',CategoryController.getAllDiscardedCategory)
router.get('/admin/category/softdelete/:id',CategoryController.softdeleteCategory)
router.get('/admin/category/softdeleteRevert/:id',CategoryController.softdeleteRevert)


// Product routes
router.get('/admin/products/list', ProductController.listProducts);
router.get('/admin/products/add', ProductController.showAddForm);
router.post('/admin/products/add', upload.single('image'), ProductController.createProduct);
router.get('/admin/products/edit/:id', ProductController.showEditForm);
router.post('/admin/products/edit/:id', upload.single('image'), ProductController.updateProduct);
router.get('/admin/products/delete/:id', ProductController.deleteProduct);
router.get('/admin/products/discarded', ProductController.getAllDiscardedProducts);
router.get('/admin/products/softdelete/:id', ProductController.softdeleteProducts);
router.get('/admin/products/softdeleteRevert/:id', ProductController.softdeleteRevert);

module.exports=router;