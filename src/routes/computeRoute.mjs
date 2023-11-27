import {Router} from "express";
import cpuBoundTask from "../utils/cpuBound.mjs";
import {taskQueue} from "../index.mjs";

export const computeRoute = Router()
computeRoute.get('/compute', async (req, res) => {
    const data = JSON.parse(req.body)
    console.log(data);
    // await taskQueue.execute(req.body)
    // res.write(JSON.stringify({value: result}));
    res.status(200);
    res.end();
});
