import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { AuthRequest } from '../customTypes';
import responseHandler from '../responseHandler';

const secretKey = process.env.ACCESS_TOKEN_SECRET as string;

function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return responseHandler.errorResponse(req, res, "", 401); // Unauthorized

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return responseHandler.errorResponse(req, res, "", 403); // Forbidden
        req.user = user;
        next();
    });
}

export default authenticate;