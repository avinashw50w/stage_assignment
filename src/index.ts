import app from "./app";
import { PORT } from "./config/config";

const port = PORT;

const server = app.listen(port, () => console.log(`App listening on port ${port}: http://localhost:${port}`));

export const Shutdown = (callback: any) => server && server.close(callback);

export default server;
