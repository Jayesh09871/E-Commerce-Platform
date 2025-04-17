const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['fan', 'air-conditioner'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be at least 0'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be at least 0'],
      max: [100, 'Discount cannot be more than 100%'],
    },
    images: [
      {
        type: String,
        required: [true, 'Please add at least one image'],
      },
    ],
    variants: [
      {
        color: {
          name: String,
          code: String,
        },
        size: String,
        price: Number,
        stock: Number,
        sku: String,
        images: [String],
      },
    ],
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
    },
    specifications: [
      {
        name: String,
        value: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Please add stock'],
      min: [0, 'Stock must be at least 0'],
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for discounted price
ProductSchema.virtual('discountedPrice').get(function () {
  return this.price - (this.price * this.discount) / 100;
});

module.exports = mongoose.model('Product', ProductSchema);
