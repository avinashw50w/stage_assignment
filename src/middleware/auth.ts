import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { AuthRequest } from '../customTypes';
import responseHandler from '../responseHandler';
import { HTTP_STATUS_CODES } from '../constants';

const secretKey = process.env.ACCESS_TOKEN_SECRET as string;

function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return responseHandler.errorResponse(req, res, "", HTTP_STATUS_CODES.UNAUTHENTICATED); // Unauthorized

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return responseHandler.errorResponse(req, res, "", HTTP_STATUS_CODES.FORBIDDEN); // Forbidden
        req.user = user;
        next();
    });
}

export default authenticate;