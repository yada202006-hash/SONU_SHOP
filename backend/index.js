const express =require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB=require("./config/db");
const cors=require("cors");

const app = express();
app.use(cors({
    origin:["http://localhost:3000","http://127.0.0.1:3000"],
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectDB();

app.get("/",(req,res)=>{
    res.send("Hello World");
})

const userRoutes=require("./routes/userRoutes");
app.use("/api/auth",userRoutes);
app.use("/api/products",require("./routes/productRoutes"));
app.use("/api/orders",require("./routes/orderRoutes"));
// app.use("/api/payments",require("./routes/paymentRoutes"));
app.use("/api/analytics",require("./routes/analyticsRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})