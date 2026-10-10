const express =require("express");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const connectDB=require("./config/db");
const cors=require("cors");

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000").split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectDB();

const userRoutes=require("./routes/userRoutes");
app.use("/api/auth",userRoutes);
app.use("/api/products",require("./routes/productRoutes"));
app.use("/api/orders",require("./routes/orderRoutes"));
// app.use("/api/payments",require("./routes/paymentRoutes"));
app.use("/api/analytics",require("./routes/analyticsRoutes"));

const frontendBuildPath = path.join(__dirname, "../frontend/my-app/build");
app.use(express.static(frontendBuildPath));
app.get(/^(?!\/api(?:\/|$)).*/, (req, res, next) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"), (error) => {
        if (error) {
            next(error);
        }
    });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
});