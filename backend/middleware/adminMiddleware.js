const admin=(req,res,next)=>{
    if(req.user && req.user.role==="admin"){
        next();
    }else{
        return res.status(401).json({message:"Not authorized, you are not an admin"});
    }
};

module.exports={admin};