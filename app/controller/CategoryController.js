const Category = require("../model/category");
const slugify= require("slugify");
const Joi = require('joi');

const categoryCheck = Joi.object({
  name: Joi.string().min(3).max(50).required(),  
});
class CategoryController {

  
  async listCategories(req, res) {
    try {
      const categories = await Category.find({ isDeleted: false });
      res.render("admin/category/list", { category: categories });
    } catch (err) {
      console.log(err);
            req.flash('error', 'Error loading categories');
            res.redirect('/admin/category/list');
    }
  }
  async showAddForm(req, res) {
    try {
      res.render("admin/category/add", { errors: null, old: {} });
    } catch (err) {
      console.log(err);
      req.flash('error', 'could not load add category form');
            res.redirect('/admin/category/list');
    }
  }

  async createCategory(req, res) {
    
    const { name } = req.body;
    const { error, value } = categoryCheck.validate({ name }, { abortEarly: false });
    if (error) {
      console.log(error.details);
      const errors = {};
      error.details.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      
      return res.render("admin/category/add", {
        errors,
        old: req.body,
      });
    }

    const slug = slugify(name, { lower: true, strict: true });
    console.log(slug,name);
    try {
    const category= new Category({
        name,slug
    })

   const data= await category.save();
   // res.status(200).json({message:'Category added successfully',category:data})
      req.flash("success", "Category added successfully");
      res.redirect("/admin/category/list");
    } catch (err) {
      req.flash("error", "Error adding category");
      res.redirect("/admin/category/list");
      // res.status(500).json({message:'Error adding category',error:err.message})
    }
  }

  async showEditForm(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      res.render("admin/category/edit", { category: category,errors: null, old: {} });
    } catch (err) {
      console.log(err);
      req.flash("error", "Error loading edit category");
      res.redirect("/admin/category/list");
    }
  }

  async updateCategory(req, res) {
    console.log('inside update category')
    const { name } = req.body;
    const id = req.params.id;
    const { error, value } = categoryCheck.validate({ name }, { abortEarly: false });
    if (error) {
      const errors = {};
      error.details.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
     
      const category = await Category.findById(id);
return res.render("admin/category/edit", {
  errors,
  old: req.body,
  category
});
    }
    
    const slug = slugify(name, { lower: true });

    try {
      await Category.findByIdAndUpdate(id, { name, slug });
      req.flash("success", "Category updated successfully");
      res.redirect("/admin/category/list");
    } catch (err) {
      req.flash("error", "Error updating category");
      res.redirect("/admin/category/list");
    }
  }

  async softdeleteCategory(req, res) {
    try {
      await Category.findByIdAndUpdate(req.params.id, { isDeleted: true });
      req.flash("success", "Category discarded successfully");
      res.redirect("/admin/category/list");
    } catch (err) {
      req.flash("error", "Error soft deleting category");
      res.redirect("/admin/category/list");
    }
  }
  async deleteCategory(req,res){
    try{
   
       const id=req.params.id;
       console.log(id)
       const category=await Category.findByIdAndDelete(id)
       console.log(category)
       if(category){
           req.flash("success", "Category deleted successfully");
           res.redirect("/admin/category/list");
       } else{
           console.log('not deleted');
           req.flash("error", "Error deleting category");
        ///',{title:'Delete Student',message:'Student could not be deleted',success:false})
       }
       }catch(err){
           console.log(err)
           req.flash("error", "Error deleting category");
        
       }
}
async softdeleteRevert(req,res){
  try{
      const id=req.params.id;
      const updated=await Category.findByIdAndUpdate(id,{isDeleted:false},{new:true})
     if(updated){
      res.redirect("/admin/category/list");//,{title:'updated Student',success:true})
      }else{
        req.flash("error", "Error soft deleting category not found");
        //console.log('not deleted')
        res.redirect("/admin/category/list");//,{title:'updated Category',message:'Category could not be updated',success:false})
      }
     }catch(err){
      req.flash("error", "Error soft deleting category");
        
      res.redirect("/admin/category/list");//,{title:'updated Student',message:err.message,success:false})
 
  }
}
async getAllDiscardedCategory(req,res){

  try{
    const categories = await Category.find({ isDeleted: true });
    res.render("admin/category/discarded", { category: categories });
 
  }catch(e){
    req.flash("error", "Could not load discrded categories");        
      res.redirect("/admin/category/list");
      //res.status(404).render('admin/category/discarded',{message:err.message,success:false})
 
  }
}
}


module.exports = new CategoryController();
