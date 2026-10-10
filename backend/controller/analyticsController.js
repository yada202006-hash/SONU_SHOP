const Order = require('../model/Order');
const Product = require('../model/Product');
const User = require('../model/User');

const getAnalytics=async (req, res) => {
    try{
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        const totalUsers = await User.countDocuments({role: 'user'});

        const order=await Order.find({});
        const totalRevenue = order.reduce((acc, curr) => acc + curr.totalAmount, 0);

        res.json({
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAnalytics };