import express, { Request, Response } from "express";
import mongoose from "mongoose";
import routes from "./routes";
import { MONGODB_CONNECT_URL, NODE_ENV, SEED_DB } from "./config/config";
import errorHandler from "./middleware/errorHandler";
import { seedDB } from "./scripts/seed";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect(MONGODB_CONNECT_URL as string);
        mongoose.set("debug", NODE_ENV === "dev" ? true : false);
        // seed db
        if (String(SEED_DB) === "true") {
            await seedDB();
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();

export default app;
