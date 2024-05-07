import {NextFunction, Request, Response} from "express";
import cacheService from "../services/cache/cacheService";
import crypto from "crypto"
import { DEFAULT_CACHE_TTL } from "../constants";
function getCacheKey(req: Request) {
    const endpoint = req.baseUrl || '';
    const reqBody = req.body || '';
    const reqParams = req.params || '';
    const query = req.query || '';
    const key = crypto.createHash('md5').update(JSON.stringify({
        endpoint,
        reqBody,
        reqParams,
        query
    })).digest('hex');
    return key;
}

export default function cacheDecorator(ttl: number = DEFAULT_CACHE_TTL) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
  
      descriptor.value = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        const cacheKey = getCacheKey(req);
        const cachedData = cacheService.get(cacheKey);
  
        if (cachedData) {
          return cachedData;
        }
  
        const result = await originalMethod.apply(this, [req, res, next]);
        cacheService.set(cacheKey, result);
        return result;
      };
  
      return descriptor;
    };
  }