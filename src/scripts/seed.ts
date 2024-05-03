import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import mongoose, { Types } from "mongoose";
import { Movies, TVShows, UserList, Users } from "../models";
import { GenreArray } from "../customTypes";
import { IUserList } from "../models/userList";
const ObjectId = Types.ObjectId;

const shuffle = (array: any[]) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 

export async function seedDB() {
    console.log('Seeding Started.');
    await Users.collection.drop();
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
    await Movies.collection.drop();
    const movies = [];
    for (let i = 0; i < 5000; ++i) {
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
    await TVShows.collection.drop();
    const tvShows = [];
    for (let i = 0; i < 5000; ++i) {
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
    await UserList.collection.drop();
    let userList = [];
    for (let i = 0; i < 3000; ++i) {
        userList.push({
            userId,
            itemId: movies[i]._id,
            itemType: "movie",
        })
    }
    for (let i = 0; i < 3000; ++i) {
        userList.push({
            userId,
            itemId: tvShows[i]._id,
            itemType: "tvShow",
        })
    }

    userList = shuffle(userList);

    await UserList.insertMany(userList);

    console.log('Seeding complete.')
}
