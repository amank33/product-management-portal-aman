const mongoose = require('mongoose');
const  slugify = require("slugify");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },  
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
   isDeleted: { 
    type: Boolean, 
    default: false 
},
}, { timestamps: true });

categorySchema.pre('save', function (next) {
 if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});

// categorySchema.methods.toJSON = function() {
//   const obj = this.toObject();
//   delete obj.isDeleted;
//   return obj;
// };

module.exports = mongoose.model('Category', categorySchema);
