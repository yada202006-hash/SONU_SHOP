const Order=require("../model/Order");
const sendEmail=require("../utils/sendMail");

const createOrder=async(req,res)=>{
    try{
        const{items,totalAmount,address,paymentId}=req.body;
        if(!items || items.length==0||!totalAmount||!address){
            return res.status(400).json({message:"Invalid order data"});
        }else{
            const order=new Order.create({
                user:req.user._id,
                items,
                totalAmount,
                address,
                paymentId
        });
        const message=`Your order with ID ${order._id} has been placed successfully. Total amount: ${totalAmount}.`;
        await sendEmail(req.user.email,"Order Confirmation",message);
        res.status(201).json({message:"Order placed successfully",order});
    }
}catch(error){
    res.status(500).json({message:"server error"});
}
}

const myOrders=async(req,res)=>{
    try{
        const orders=await Order.find({user:req.user._id}).populate("items.productId","name price");
        res.status(200).json(orders);
    }catch(error){
        res.status(500).json({message:"server error"});
    }
}

const getAllOrders=async(req,res)=>{
    try{
        const orders=await Order.find({}).populate("userId","id name");
        res.status(200).json(orders);
    }catch(error){
        res.status(500).json({message:"server error"});
    }
}

const updateOrderStatus=async(req,res)=>{
    try{
        const {status}=req.body;
        const order=await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        order.status=status;
        await order.save();
        res.status(200).json({message:"Order status updated successfully",order});
    }catch(error){
        res.status(500).json({message:"server error"});
    }
}

module.exports={createOrder,myOrders,getAllOrders,updateOrderStatus};