const nodemailer=require("nodemailer");

const sendEmail=async(email,subject,message)=>{
    try{
        console.log("EMAIL DATA:", {
            email,
            subject,
            message
        });
        const transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            }
    })
    const mailOptions={
        from:process.env.EMAIL_USER,
        to:email,
        subject:subject,
        text:message,
    }
    await transporter.sendMail(mailOptions);
    }catch(error){
        console.log(error);
    }
}

module.exports=sendEmail;