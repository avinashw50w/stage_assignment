import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import mongoose, { Types } from "mongoose";
import { Movies, TVShows, UserList, Users } from "../models";
import { GenreArray } from "../customTypes";
const ObjectId = Types.ObjectId;

const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const TOTAL_MOVIES = 100;
const TOTAL_TVSHOWS = 100;

export async function seedDB() {
    console.log("Seeding Started.");
    await mongoose.connection.dropDatabase();
    const userId = new ObjectId();
    const pass = bcrypt.hashSync("test", 2);
    await new Users({
        _id: userId,
        username: "test",
        password: pass,
        preferences: {
            favoriteGenres: [""],
            dislikedGenres: [""],
        },
        watchHistory: [
            {
                contentId: new ObjectId(),
                watchedOn: new Date(),
                rating: 4,
            },
        ],
    }).save();

    // movies
    const movies = [];
    for (let i = 0; i < TOTAL_MOVIES; ++i) {
        movies.push({
            _id: new ObjectId(),
            title: faker.lorem.sentence({ min: 1, max: 5 }),
            description: faker.lorem.sentences({ min: 2, max: 5 }),
            genres: GenreArray[Math.floor(Math.random() * GenreArray.length)],
            releaseDate: faker.date.anytime(),
            director: faker.person.fullName(),
            actors: Array(4)
                .fill("")
                .map(() => faker.person.fullName()),
        });
    }
    await Movies.insertMany(movies);

    // TV shows
    const tvShows = [];
    for (let i = 0; i < TOTAL_TVSHOWS; ++i) {
        const tvShow = {
            _id: new ObjectId(),
            title: faker.lorem.sentence({ min: 1, max: 5 }),
            description: faker.lorem.sentences({ min: 2, max: 5 }),
            genres: GenreArray[Math.floor(Math.random() * GenreArray.length)],
            episodes: [] as any,
        };
        const episodeCnt = Math.floor(Math.random() * 10) + 3;
        for (let j = 0; j < episodeCnt; ++j) {
            tvShow.episodes.push({
                episodeNumber: j + 1,
                seasonNumber: 1,
                releaseDate: faker.date.anytime(),
                director: faker.person.fullName(),
                actors: Array(4)
                    .fill("")
                    .map(() => faker.person.fullName()),
            });
        }
        tvShows.push(tvShow);
    }
    await TVShows.insertMany(tvShows);

    // user list
    let userList = [];
    for (let i = 0; i < Math.floor(TOTAL_MOVIES / 2); ++i) {
        userList.push({
            userId,
            itemId: movies[i]._id,
            itemType: "movie",
        });
    }
    for (let i = 0; i < Math.floor(TOTAL_TVSHOWS / 2); ++i) {
        userList.push({
            userId,
            itemId: tvShows[i]._id,
            itemType: "tvShow",
        });
    }

    userList = shuffle(userList);

    await UserList.insertMany(userList);

    console.log("Seeding complete.");
}
