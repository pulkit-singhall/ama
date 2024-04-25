import jwt from "jsonwebtoken";

const generateAccessToken = (id: any, email: string): string => {
    const key = process.env.ACCESS_TOKEN_KEY
    const token = jwt.sign({
        _id: id,
        email,
    }, key!, {
        expiresIn: '1d',
    })
    return token
}

const generateRefreshToken = (email: string): string => {
    const key = process.env.REFRESH_TOKEN_KEY
    const token = jwt.sign({
        email: email
    }, key!, {
        expiresIn: '5d',
    })
    return token
}

export {
    generateAccessToken,
    generateRefreshToken,
}