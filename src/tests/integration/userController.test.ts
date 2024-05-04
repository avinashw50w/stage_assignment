import bcrypt from "bcrypt";
import mongoose, { Types } from "mongoose";
import request from "supertest";
const ObjectId = Types.ObjectId;
import app from "../../app";
import server from "../../../src";
import { Users, UserList, Movies, TVShows } from "../../models";
import { seedDB } from "../../scripts/seed";
import { DEFAULT_PAGE_SIZE, HTTP_STATUS_CODES } from "../../constants";
import { IUserDocument } from "../../models/user";
import { ITEM_MOVIE, ITEM_TVSHOW } from "../../customTypes";
import cacheService from "../../services/cache/cacheService";

let token: string = "";
let user: IUserDocument | null;

const testUser = {
    username: "test",
    password: bcrypt.hashSync("test", 2),
    preferences: {
        favoriteGenres: ["Action"],
        dislikedGenres: ["Romance"],
    },
    watchHistory: [
        {
            contentId: new ObjectId(),
            watchedOn: new Date(),
            rating: 5,
        },
    ],
};

beforeAll(async () => {
    await seedDB();
    user = await Users.findOne({ username: "test" }).exec();

    const response = await request(app).post("/api/v1/auth/login").set("Accept", "application/json").send({
        username: "test",
        password: "test",
    });
    token = response.body.token;
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    cacheService.disconnect();
    server.close();
});

describe("User Controller", () => {
    describe("add movie to user list", () => {
        it("should return status code 201 for adding valid movie to list", async () => {
            // create a new movie
            const movie = await new Movies({
                title: "title",
                description: "description",
                genres: ["Action", "SciFi"],
                releaseDate: new Date(),
                director: "Steven Spielberg",
                actors: ["A", "B", "C"],
            }).save();

            const response = await request(app)
                .post("/api/v1/user/add-item")
                .set("content-type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    itemId: movie.id,
                    itemType: ITEM_MOVIE,
                });
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("id");
        });

        it("should return 404 with message for adding invalid movie to list", async () => {
            const response = await request(app)
                .post("/api/v1/user/add-item")
                .set("content-type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    itemId: new ObjectId(),
                    itemType: ITEM_MOVIE,
                });
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
            expect(response.body).toHaveProperty("message");
        });

        it("should return 409 with message for adding duplicate movie to list", async () => {
            if (!user) {
                throw "No user found";
            }
            const userListMovie = await UserList.findOne({ userId: user.id, itemType: ITEM_MOVIE }).exec();
            if (!userListMovie) {
                throw "No movie in user's list";
            }
            const response = await request(app)
                .post("/api/v1/user/add-item")
                .set("content-type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    itemId: userListMovie.itemId,
                    itemType: ITEM_MOVIE,
                });
            expect(response.status).toBe(HTTP_STATUS_CODES.DUPLICATE_ENTRY);
            expect(response.body).toHaveProperty("message");
        });
    });

    describe("add TV show to user list", () => {
        it("should return status code 201 for adding valid TV show to list", async () => {
            // create a new TV show
            const tvShow = await new TVShows({
                title: "title",
                description: "description",
                genres: ["Action", "SciFi"],
                episodes: [
                    {
                        episodeNumber: 1,
                        seasonNumber: 1,
                        releaseDate: new Date(),
                        director: "Steven Spielberg",
                        actors: ["A", "B", "C"],
                    },
                ],
            }).save();

            const response = await request(app)
                .post("/api/v1/user/add-item")
                .set("content-type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    itemId: tvShow.id,
                    itemType: ITEM_TVSHOW,
                });
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("id");
        });

        it("should return 404 with message for adding invalid TV show to list", async () => {
            const response = await request(app)
                .post("/api/v1/user/add-item")
                .set("content-type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    itemId: new ObjectId(),
                    itemType: ITEM_TVSHOW,
                });
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
            expect(response.body).toHaveProperty("message");
        });

        it("should return 409 with message for adding duplicate movie to list", async () => {
            if (!user) {
                throw "No user found";
            }
            const userListItem = await UserList.findOne({ userId: user.id, itemType: ITEM_TVSHOW }).exec();

            if (!userListItem) {
                throw "No TV show in user's list";
            }
            const response = await request(app)
                .post("/api/v1/user/add-item")
                .set("content-type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    itemId: userListItem.itemId,
                    itemType: ITEM_TVSHOW,
                });
            expect(response.status).toBe(HTTP_STATUS_CODES.DUPLICATE_ENTRY);
            expect(response.body).toHaveProperty("message");
        });
    });

    describe("remove item from user's list", () => {
        it("should return 200", async () => {
            const movie = await new Movies({
                title: "title 2",
                description: "description 2",
                genres: ["Action", "SciFi"],
                releaseDate: new Date(),
                director: "Steven Spielberg",
                actors: ["A", "B", "C"],
            }).save();

            const response = await request(app)
                .post("/api/v1/user/remove-item")
                .set("content-type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    id: movie.id,
                });
            expect(response.status).toBe(HTTP_STATUS_CODES.SUCCESS);
        });
    });

    describe("get paginated user list", () => {
        it("should return 200 with the list", async () => {
            const response = await request(app)
                .get("/api/v1/user/list")
                .query({
                    page: 1,
                    pageSize: DEFAULT_PAGE_SIZE,
                })
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HTTP_STATUS_CODES.SUCCESS);
            expect(response.body).toHaveProperty("data");
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
});
