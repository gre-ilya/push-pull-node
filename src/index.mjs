import express from 'express';
import {computeRoute} from "./routes/computeRoute.mjs";
import {TaskQueue} from "./utils/taskQueue.mjs";

const app = express()
app.use(computeRoute)

export const taskQueue = new TaskQueue(3);

app.listen(3000, 'localhost', () => {
    console.log(`Listening in port 3000.`);
})
