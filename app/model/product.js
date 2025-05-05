const mongoose = require('mongoose');
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, required: true },
  image: { type: String },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.pre('save', function (next) {
 if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});
module.exports = mongoose.model('Product', productSchema);
