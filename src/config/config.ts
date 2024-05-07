import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'dev';
export const PORT = process.env.PORT || 3000;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';
export const MONGODB_CONNECT_URL = process.env.MONGODB_CONNECT_URL || '';
export const REDIS_URL = process.env.REDIS_URL || '';
export const SEED_DB = process.env.SEED_DB || false;