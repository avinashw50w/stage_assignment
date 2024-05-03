import { StatusCodeTypes } from "../customTypes";

export module Errors {

    export class CError extends Error {
        code?: StatusCodeTypes;
    
        constructor(message?: string, code?: StatusCodeTypes) {
            super(message);
            this.code = code;
        }
    }
}