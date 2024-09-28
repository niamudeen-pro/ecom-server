const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  thumbnail: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  rating: {
    type: Number,
    require: true,
  },
});

// define the model and collection name
const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
