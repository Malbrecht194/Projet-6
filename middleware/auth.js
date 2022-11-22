import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'MON_SUPER_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}