const jwt = require('jsonwebtoken');

const JWTValidation = (req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization) {
        return res.sendStatus(401); // Unauthorized jika tidak ada header Authorization
    }
    
    const jwtToken = authorization.split(' ')[1]; // Ambil token setelah "Bearer"
    const SECRET_KEYS = process.env.SECRET_KEYS;

    jwt.verify(jwtToken, SECRET_KEYS, (err, decode) => {
        if (err) {
            return res.sendStatus(403); // Forbidden jika token tidak valid
        }
        req.payload = {
            id: decode.id,
            email: decode.email,
        };
        next(); // Lanjut ke middleware berikutnya
    });
};

module.exports = JWTValidation;
