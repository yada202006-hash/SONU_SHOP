require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const connectDB = require("./config/db");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Product = require("./model/Product");
const User = require("./model/User");

const products = [
    {
        name: "Wireless Headphones",
        description: "Comfortable over-ear headphones with clear sound and wireless connectivity.",
        price: 79.99,
        category: "Electronics",
        stock: 25,
        imageUrl: "https://tse3.mm.bing.net/th/id/OIP.GShjnzRvTYIzWGwTlEbhJQHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        rating: 4.5,
        numReviews: 12
    },
    {
        name: "Classic Wristwatch",
        description: "A versatile everyday watch with a clean, timeless design.",
        price: 119.99,
        category: "Accessories",
        stock: 18,
        imageUrl: "https://tse3.mm.bing.net/th/id/OIP.S0WnMxvIPUPTAXxgIjMfEgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        rating: 4.2,
        numReviews: 8
    },
    {
        name: "Running Shoes",
        description: "Lightweight running shoes designed for comfortable daily training.",
        price: 89.99,
        category: "Footwear",
        stock: 30,
        imageUrl: "https://images.footballfanatics.com/duke-blue-devils/unisex-nike-royal-duke-blue-devils-zoom-pegasus-39-running-shoe_pi4644000_ff_4644533-9094df424d4307086adb_full.jpg?_hv=2",
        rating: 4.7,
        numReviews: 20
    },
    {
        name: "Everyday Backpack",
        description: "A durable backpack with room for daily essentials and a laptop.",
        price: 54.99,
        category: "Accessories",
        stock: 22,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        rating: 4.4,
        numReviews: 10
    },
    {
        name: "Ceramic Coffee Mug",
        description: "A reusable ceramic mug for coffee, tea, and other hot drinks.",
        price: 16.99,
        category: "Home",
        stock: 40,
        imageUrl: "https://m.media-amazon.com/images/I/61O5eUqNZML._AC_.jpg",
        rating: 4.3,
        numReviews: 6
    }
];

function getSeedUsers() {
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;
    const userPassword = process.env.SEED_USER_PASSWORD;

    if (!adminPassword || !userPassword) {
        throw new Error("Set SEED_ADMIN_PASSWORD and SEED_USER_PASSWORD before running the seeder");
    }

    if (adminPassword.length < 8 || userPassword.length < 8) {
        throw new Error("Seed account passwords must be at least 8 characters long");
    }

    return [
        {
            name: "Store Admin",
            email: (process.env.SEED_ADMIN_EMAIL || "admin@example.com").trim().toLowerCase(),
            password: adminPassword,
            role: "admin",
            verified: true
        },
        {
            name: "Sample Customer",
            email: (process.env.SEED_USER_EMAIL || "customer@example.com").trim().toLowerCase(),
            password: userPassword,
            role: "user",
            verified: true
        }
    ];
}

async function seedData() {
    try {
        const seedUsers = getSeedUsers();
        await connectDB();

        const productResults = await Promise.all(
            products.map((product) =>
                Product.updateOne(
                    { name: product.name, category: product.category },
                    { $setOnInsert: product },
                    { upsert: true, runValidators: true }
                )
            )
        );

        const userResults = await Promise.all(
            seedUsers.map(async ({ password, ...user }) => {
                const hashedPassword = await bcrypt.hash(password, 10);
                return User.updateOne(
                    { email: user.email },
                    { $setOnInsert: { ...user, password: hashedPassword } },
                    { upsert: true, runValidators: true }
                );
            })
        );

        const productsInserted = productResults.filter((result) => result.upsertedCount > 0).length;
        const usersInserted = userResults.filter((result) => result.upsertedCount > 0).length;
        console.log(`Seed complete: inserted ${productsInserted} product(s) and ${usersInserted} user(s).`);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedData();
