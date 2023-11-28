import path from "node:path";
import URL from "node:url";
import {Worker} from "node:worker_threads";
import {taskQueue} from "../index.mjs";

export class TaskQueue {
    constructor(poolSize, maxQueueSize) {
        this.poolSize = poolSize;
        this.workerPool = this.initializeWorkerPool();
        this.taskQueue = [];
        this.maxQueueSize = maxQueueSize;
    }

    initializeWorkerPool() {
        const workerPath = path.join(path.dirname(URL.fileURLToPath(import.meta.url)), 'cpuBound.mjs');
        return Array.apply(null, Array(this.poolSize)).map(() => new Worker(workerPath));
    }

    // This method executes when any worker has completed his work
    async triggerWorker() {
        const worker = this.workerPool.pop();
        if (worker) {
            const task = this.taskQueue.shift();
            if (!task) {
                this.workerPool.push(worker);
                return;
            }
            worker.postMessage(task.count);
            worker.once('message', (msg) => {
                this.workerPool.push(worker);
                task.resolve(msg);
                this.triggerWorker();
            });
            worker.once('error', (err) => {
                this.workerPool.push(worker);
                task.reject(err);
                this.triggerWorker();
            });
        }
    }

    async execute(count) {
        return new Promise((resolve, reject) => {
            const task = {count, resolve, reject};
            if (this.taskQueue.length > this.maxQueueSize) {
                reject();
                return;
            }
            this.taskQueue.push(task);
            this.triggerWorker();
        })
    }
}
