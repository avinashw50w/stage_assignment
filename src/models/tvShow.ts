import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { Genre } from "../customTypes";

interface ITVShow {
    title: string;
    description: string;
    genres: Genre[];
    episodes: Array<{
        episodeNumber: number;
        seasonNumber: number;
        releaseDate: Date;
        director: string;
        actors: string[];
    }>;
}

export interface ITVShowDocument extends Document, Omit<ITVShow, "id"> {}

export interface ITVShowModel extends Model<ITVShowDocument> {}

const tvShowEpisodesSchema = new mongoose.Schema({
    episodeNumber: { type: Number, required: true },
    seasonNumber: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    actors: { type: [String], required: true },
}, {_id: false});

const tvShowSchema = new mongoose.Schema<ITVShowDocument, ITVShowModel>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        genres: { type: [String], required: true },
        episodes: [tvShowEpisodesSchema],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tvShowSchema.set("toJSON", {
    transform: function (doc: ITVShowDocument) {
        return {
            id: doc._id,
            title: doc.title,
            description: doc.description,
            genres: doc.genres,
            episodes: doc.episodes,
        };
    },
});

export const TVShowModel: ITVShowModel = mongoose.model<ITVShowDocument, ITVShowModel>("tvShows", tvShowSchema);
