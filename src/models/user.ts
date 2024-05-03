import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { Genre, GenreArray } from "../customTypes";

interface IUser {
    // id: Types.ObjectId;
    username: string;
    password: string;
    preferences: {
        favoriteGenres: Genre[];
        dislikedGenres: Genre[];
    };
    watchHistory: Array<{
        contentId: Types.ObjectId;
        watchedOn: Date;
        rating?: number;
    }>;
}

export interface IUserDocument extends Document, IUser {}

export interface IUserModel extends Model<IUserDocument> {}

const userWatchHistorySchema = new mongoose.Schema({
    contentId: { type: Schema.Types.ObjectId, required: true },
    watchedOn: { type: Date },
    rating: { type: Number },
}, {_id: false});

const userSchema = new mongoose.Schema<IUserDocument, IUserModel>(
    {
        // id: { type: Schema.Types.ObjectId, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        preferences: {
            favoriteGenres: { type: [String] },
            dislikedGenres: { type: [String] },
        },
        watchHistory: [userWatchHistorySchema],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.index({ username: 1 }, { unique: true });

userSchema.set("toJSON", {
    transform: function (doc: IUserDocument) {
        return {
            id: doc._id,
            username: doc.username,
            preferences: doc.preferences,
            watchHistory: doc.watchHistory,
        };
    },
});

export const UserModel: IUserModel = mongoose.model<IUserDocument, IUserModel>("users", userSchema);
