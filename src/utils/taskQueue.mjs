import path from "node:path";
import URL from "node:url";
import {Worker} from "node:worker_threads";

export class TaskQueue {
    constructor(poolSize) {
        this.poolSize = poolSize;
        this.workerPool = this.initializeWorkerPool();
        // this.taskStatus =

    }

    initializeWorkerPool() {
        const workerPath = path.join(path.dirname(URL.fileURLToPath(import.meta.url)), 'cpuBound.mjs');
        return Array.apply(null, Array(this.poolSize)).map(() => new Worker(workerPath));
    }


}
