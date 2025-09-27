const jwt = require("jsonwebtoken");
const userAuth = async (req, res,next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json({ success: false, message: "Not authorized" })
    }
    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        if (token_decode) {
            req.userId = token_decode.id;

        } else {
            return res.json({ success: false, message: "NOT AUTHORIZED" })
        }
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
    next();
}
module.exports=userAuth;