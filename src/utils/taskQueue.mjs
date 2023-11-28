import path from "node:path";
import URL from "node:url";
import {Worker} from "node:worker_threads";
import {taskQueue} from "../index.mjs";

export class TaskQueue {
    constructor(poolSize) {
        this.poolSize = poolSize;
        this.workerPool = this.initializeWorkerPool();
        this.taskQueue = [];
    }

    initializeWorkerPool() {
        const workerPath = path.join(path.dirname(URL.fileURLToPath(import.meta.url)), 'cpuBound.mjs');
        return Array.apply(null, Array(this.poolSize)).map(() => new Worker(workerPath));
    }

    pushTaskToQueue(count) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({count, resolve, reject})
        })
    }

    tryExecuteTask(task) {
        const worker = a.pop();
        if (worker) {
            return new Promise((resolve, reject) => {
                worker.postMessage(task);
                worker.on('message', (msg) => {
                    this.workerPool.push(worker);
                    resolve(msg);
                });
                worker.on('error', (err) => {
                    this.workerPool.push(worker);
                    reject(err);
                });
            });
        }
        return null;
    }

    async triggerWorker() {
        const worker = this.workerPool.pop();
        if (worker) {
            const task = this.taskQueue.shift();
            if (!task) {
                this.workerPool.push(worker);
                return;
            }
            worker.postMessage(task.count);
            worker.on('message', (msg) => {
                this.workerPool.push(worker);
                task.resolve();
            });
            worker.on('error', (err) => {
                this.workerPool.push(worker);
                task.reject();
            });
        }
    }

    async execute(uniqueId, count) {
        const task = count;
        const taskAssigned = this.tryExecuteTask();
        if (taskAssigned) {
            const result = await taskAssigned;
            if (this.taskQueue.length) {
                this.triggerWorker();
            }
            return result;
        }
        return this.pushTaskToQueue(task);
    }
}
