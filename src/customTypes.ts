import {Request} from "express";

export interface AuthRequest extends Request {
    user?: any;
}

export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Romance' | 'SciFi';
export const GenreArray = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'];

export const ITEM_MOVIE = "movie";
export const ITEM_TVSHOW = "tvShow";
export type ItemType = "movie" | "tvShow";
export const ItemTypeArray = ["movie", "tvShow"];

export type StatusCodeTypes = 200 | 201 | 301 | 302 | 400 | 401 | 422 | 403 | 404 | 409 | 500;