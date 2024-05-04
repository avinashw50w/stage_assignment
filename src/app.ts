import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes";

import errorHandler from "./middleware/errorHandler";
import { seedDB } from "./scripts/seed";
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URL as string);
        mongoose.set("debug", process.env.NODE_ENV === "dev" ? true : false);
        // seed db
        if (String(process.env.SEED_DB) === "true") {
            await seedDB();
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();

export default app;
