import { StatusCodeTypes } from "./customTypes";

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_CACHE_TTL = 300; // 5 min

export const HTTP_STATUS_CODES: Record<string, StatusCodeTypes> = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHENTICATED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    DUPLICATE_ENTRY: 409,
    VALIDATION_ERROR: 422,
    INTERNAL_SERVER_ERROR: 500,
}