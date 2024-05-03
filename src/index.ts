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

const port = process.env.PORT;

app.use("/api/v1", routes);

app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URL as string);
        mongoose.set("debug", process.env.NODE_ENV === 'dev' ? true : false);
        // seed db
        if (process.env.SEED_DB) {
            await seedDB();
        }
        app.listen(port, () => console.log(`App listening on port ${port}: http://localhost:${port}`));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();

export default app;
