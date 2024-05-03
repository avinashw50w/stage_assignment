import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { Genre, GenreArray } from "../customTypes";

interface IMovie {
    title: string;
    description: string;
    genres: Genre[];
    releaseDate: Date;
    director: string;
    actors: string[];
}

export interface IMovieDocument extends Document, Omit<IMovie, "id"> {}

export interface IMovieModel extends Model<IMovieDocument> {}

const movieSchema = new mongoose.Schema<IMovieDocument, IMovieModel>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        genres: { type: [String], required: true },
        releaseDate: { type: Date, required: true },
        director: { type: String, required: true },
        actors: { type: [String], required: true },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

movieSchema.set("toJSON", {
    transform: function (doc: IMovieDocument) {
        return {
            id: doc._id,
            title: doc.title,
            description: doc.description,
            genres: doc.genres,
            releaseDate: doc.releaseDate,
            director: doc.director,
            actors: doc.actors,
        };
    },
});

export const MovieModel: IMovieModel = mongoose.model<IMovieDocument, IMovieModel>("movies", movieSchema);
