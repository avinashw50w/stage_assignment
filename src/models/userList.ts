import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ITVShowDocument } from "./tvShow";
import { IMovieDocument } from "./movie";
import { IUserDocument } from "./user";
import { ItemType, ItemTypeArray } from "../customTypes";

export interface IUserList {
    userId: Types.ObjectId;
    itemId: Types.ObjectId;
    itemType: ItemType;
    createdAt: Date;
}

export interface IUserListDocument extends Document, IUserList {
    user?: IUserDocument;
    movie?: IMovieDocument;
    tvShow?: ITVShowDocument;
}

export interface IUserListModel extends Model<IUserListDocument> {}

const userListSchema = new mongoose.Schema<IUserListDocument, IUserListModel>(
    {
        userId: { type: Schema.Types.ObjectId, required: true },
        itemId: { type: Schema.Types.ObjectId, required: true },
        itemType: { type: String, enum: ItemTypeArray, required: true },
        createdAt: { type: Date },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userListSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

userListSchema.virtual("user", {
    ref: "users",
    localField: "userId",
    foreignField: "_id",
    justOne: true,
    options: { select: { username: 1, preferences: 1, watchHistory: 1 } },
});
userListSchema.virtual("movie", {
    ref: "movies",
    localField: "itemId",
    foreignField: "_id",
    justOne: true,
});

userListSchema.virtual("tvShow", {
    ref: "tvShows",
    localField: "itemId",
    foreignField: "_id",
    justOne: true,
});

userListSchema.set("toJSON", {
    transform: function (doc: IUserListDocument) {
        return {
            id: doc._id,
            itemType: doc.itemType,
            movie: doc.movie,
            tvShow: doc.tvShow,
        };
    },
});

export const UserListModel: IUserListModel = mongoose.model<IUserListDocument, IUserListModel>(
    "userList",
    userListSchema
);
