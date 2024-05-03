import app from "./app";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;

const server = app.listen(port, () => console.log(`App listening on port ${port}: http://localhost:${port}`));

export default server;