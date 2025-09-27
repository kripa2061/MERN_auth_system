const userModel = require("../model/userModel");
const getuserData=async(req,res)=>{
    try{
            const userId = req.userId;
  const user=await userModel.findById(userId);
  if(!user){
     return res.json({success:false,message:"user not available"})
  }
  return res.json({
    success:true,
    userData:{
name:user.name,
isAccountVerify:user.isAccountVerify
    }
  })
    }catch(err){
        return res.json({success:false,message:err.message})
    }
}
module.exports={
    getuserData,
}