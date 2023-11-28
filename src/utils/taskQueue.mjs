import path from "node:path";
import URL from "node:url";
import {WorkerWrapper} from "./workerWrapper.mjs";

export class TaskQueue {
    constructor(poolSize, maxQueueSize) {
        this.poolSize = poolSize;
        this.workerPool = this.initializeWorkerPool();
        this.taskQueue = [];
        this.maxQueueSize = maxQueueSize;
    }

    initializeWorkerPool() {
        const workerPath = path.join(path.dirname(URL.fileURLToPath(import.meta.url)), 'cpuBound.mjs');
        const workers = Array.apply(null, Array(this.poolSize)).map(() => new WorkerWrapper(workerPath));
        for (let i = 0; i < this.poolSize; i++) {
            const worker = workers[i];
            worker.on('taskdone', (msg) => {
                this.workerPool.push(worker);
                this.triggerWorker();
            });
            worker.on('error', (err) => {
                this.workerPool.push(worker);
                this.triggerWorker();
            })
        }
        return workers;
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
            worker.assignTask(task);
        }
    }

    async execute(count) {
        return new Promise((resolve, reject) => {
            const task = {count, resolve, reject};
            if (this.taskQueue.length > this.maxQueueSize) {
                reject(new Error('Queue overflow'));
                return;
            }
            this.taskQueue.push(task);
            this.triggerWorker();
        })
    }
}
