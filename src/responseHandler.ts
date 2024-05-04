import {Request, Response} from "express";
import { HTTP_STATUS_CODES } from "./constants";
const _ = require('lodash');
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
		data: data
	};
	return res.status(statusCode).json(response);
}

export default {
	successResponse,
};
