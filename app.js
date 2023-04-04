const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
mongoose
  .connect("mongodb://localhost:27017/sale", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected with MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const Product = mongoose.model("Product", productSchema);

//Create Product
app.post("/api/v1/product/new", async (req, res) => {
  console.log(req.body);
  const p = await Product.create(req.body);
  //console.log(p);
  res.status(201).json({
    success: true,
    p,
  });
});

//Get Products
app.get("/api/v1/products/new", async (req, res) => {
  const ps = await Product.find();
  res.status(200).json({
    success: true,
    ps,
  });
});

//Update products
app.put("/api/v1/product/:id", async (req, res) => {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(500).json({
      success: false,
      message: "id not found",
    });
  }

  let product = await Product.findById(req.params.id); //We did this to find the product
  //Because jab pehle product find kr lenge tbhi to use in future update krenge

  if (!product) {
    //Taki jab koi galat id de de to app crash na kre
    res.status(500).json({
      success: false,
      message: "Product Not Found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product
app.delete("/api/v1/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    //Taki jab koi galat id de de to app crash na kre
    res.status(500).json({
      success: false,
      message: "Product Not Found",
    });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "product is deleted",
  });
});

app.listen(4500, () => {
  console.log("Server is Working fine");
});
