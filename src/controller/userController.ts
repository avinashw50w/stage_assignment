import { DEFAULT_PAGE_SIZE } from "../constants";
import { ITEM_MOVIE, ITEM_TVSHOW, ItemType } from "../customTypes";
import { Movies, TVShows, UserList } from "../models";
import cacheService from "../services/cache/cacheService";
import NotFoundError from "../utils/errors/notFoundError";
import DatabaseError from "../utils/errors/databaseError";
import DuplicateEntryError from "../utils/errors/duplicateEntryError";

const getPaginatedItems = async (userId: string, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
    const skip = Number(page - 1) * Number(pageSize);
    const cacheKey = `user:${userId}:list:${page}:${pageSize}`;
    const cachedResponse = await cacheService.get(cacheKey);
    if (cachedResponse) {
        return cachedResponse;
    }
    const list = (
        await UserList.find({ userId })
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .populate(["movie", "tvShow"])
            .exec()
    ).map((e) =>
        Object.assign(
            {
                id: e._id,
                itemType: e.itemType,
                createdAt: e.createdAt,
            },
            e.movie ? { movie: e.movie } : null,
            e.tvShow ? { tvShow: e.tvShow } : null
        )
    );

    await cacheService.set(cacheKey, list);
    return list;
};

const checkItemExists = async (itemId: string, itemType: ItemType) => {
    const existenceCheck = {
        [ITEM_MOVIE]: async (itemId: string) => {
            const movie = await Movies.findById(itemId).exec();
            return !!movie;
        },
        [ITEM_TVSHOW]: async (itemId: string) => {
            const tvShow = await TVShows.findById(itemId).exec();
            return !!tvShow;
        },
    };
    if (itemType in existenceCheck) {
        return existenceCheck[itemType](itemId);
    }
    return false;
};

const addItem = async (userId: string, itemId: string, itemType: ItemType) => {
    const itemExists = await checkItemExists(itemId, itemType);
    if (!itemExists) {
        throw new NotFoundError();
    }
    return new UserList({ userId, itemId, itemType })
        .save()
        .then((res) => res)
        .catch((err) => {
            if (err?.code === 11000) {
                throw new DuplicateEntryError();
            }
            throw new DatabaseError();
        });
};

const removeItem = async (id: string) => {
    return UserList.deleteOne({ _id: id }).exec();
};

export default {
    getPaginatedItems,
    addItem,
    removeItem,
};
