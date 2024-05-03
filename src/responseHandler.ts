import {Request, Response} from "express";
import { Errors } from "./utils/cerror";
import CError = Errors.CError;
import { HTTP_STATUS_CODES } from "./constants";
// const {serializeError} = require('serialize-error');
const _ = require('lodash');

const ERROR_MESSAGE_TEMPLATE: Record<number, string> = {
	500: 'Internal Server Error',
	401: 'Authorization Error',
	403: 'Authentication Error',
	404: 'Not Found'
}
function isValidJsonMessageObject(message: any) {
    try {
		var obj = JSON.parse(message);
        if (obj && typeof obj === "object" && "message" in obj) {
            return true
        }
    }
    catch(e) {
		return false
	}
};

/**
 * Description: Returns an API as handled error response
 * @param req: Object, request object
 * @param res: Object, response object
 * @param message: String, error message
 * @param statusCode: Number, HTTP status code
 * @access public instance method
 * @return API Response Object
 */
function errorResponse(req: Request, res: Response, message: string | CError | Error, statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
	let errorMessage = ERROR_MESSAGE_TEMPLATE[statusCode] || message;
	if(message instanceof CError) {
		errorMessage = message.message;
		statusCode = message.code || statusCode;
	} else if(message instanceof Error) {
		errorMessage = message.message;
	} else if(isValidJsonMessageObject(message)) {
		errorMessage = JSON.parse(message).message;
	} else {
        errorMessage = typeof message === 'string' ? message : JSON.stringify(message);
    }

	let response = {
		success: false,
        statusCode: statusCode,
		data: {
			'message': errorMessage
		}
	};

	return res.status(statusCode).json(response);
}

/**
 * Description: Returns an API as handled error response
 * @param req: Object, request object
 * @param res: Object, response object
 * @param data: Object, API data
 * @param statusCode: Number, HTTP status code
 * @access public instance method
 * @return Response Object
 */
function successResponse(req: Request, res: Response, data: any, statusCode = HTTP_STATUS_CODES.SUCCESS) {
	let response = {
		success: true,
        status: statusCode,
		data: data
	};
	return res.status(statusCode).json(response);
}

export default {
	errorResponse,
	successResponse,
};
