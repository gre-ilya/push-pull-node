import {Router} from "express";
// import cpuBoundTask from "../utils/cpuBound.mjs";
import {taskQueue} from "../index.mjs";

export const computeRoute = Router()
computeRoute.get('/compute', async (req, res) => {
    const data = req.body;
    const result = await taskQueue.execute(req.body.count)
    res.write(JSON.stringify({value: result}));
    res.status(200);
    res.end();
});
