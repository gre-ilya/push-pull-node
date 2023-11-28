import express from 'express';
import {computeRoute} from "./routes/computeRoute.mjs";
import {TaskQueue} from "./utils/taskQueue.mjs";

const app = express();

app.use(express.json());
app.use(computeRoute);

export const taskQueue = new TaskQueue(4);

app.listen(3000, '0.0.0.0', () => {
    console.log(`Listening on port 3000.`);
})
