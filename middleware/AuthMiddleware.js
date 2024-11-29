import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    // console.log("req.cookies", req.cookies);
    
    const token = req.cookies.access_token;

    // console.log("token", token);
    if (!token) {
        return res.status(401).send({ error: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).send({ error: "Token is not valid" });
    }
};