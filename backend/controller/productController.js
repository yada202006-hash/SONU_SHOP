const Product = require("../model/Product");
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!name || !description || price === undefined || !category) {
            return res.status(400).json({
                message: "Name, description, price and category are required"
            });
        }

        const priceValue = Number(price);
        if (Number.isNaN(priceValue) || priceValue < 0) {
            return res.status(400).json({ message: "Price must be a valid non-negative number" });
        }

        const stockValue = stock === undefined ? 0 : Number(stock);
        if (Number.isNaN(stockValue) || stockValue < 0) {
            return res.status(400).json({ message: "Stock must be a valid non-negative number" });
        }

        let imageUrl = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products"
            });
            imageUrl = result.secure_url;
        }

        if (!imageUrl) {
            return res.status(400).json({ message: "Product image is required" });
        }

        const product = await Product.create({
            name: String(name).trim(),
            description: String(description).trim(),
            price: priceValue,
            category: String(category).trim(),
            stock: stockValue,
            imageUrl
        });

        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price !== undefined ? Number(price) : product.price;
        product.category = category ?? product.category;
        product.stock = stock !== undefined ? Number(stock) : product.stock;

        if (product.price < 0 || product.stock < 0) {
            return res.status(400).json({ message: "Price and stock must be non-negative values" });
        }

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products"
            });
            product.imageUrl = result.secure_url;
        }

        const updatedProduct = await product.save();
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.status(200).json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };