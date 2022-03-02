import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    //Bearer 'token'
    const accessToken = authHeader && authHeader.split(' ')[1];
    if(accessToken == null) return res.status(401).json({error: 'Missing token'})

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({error: "Invalid token"})
    }
}