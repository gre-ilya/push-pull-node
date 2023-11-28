import {Worker} from "node:worker_threads";
import {EventEmitter} from "events";

export class WorkerWrapper extends EventEmitter {
    constructor(workerPath) {
        super();
        this.worker = new Worker(workerPath);
        this.worker.on('message', (msg) => {
            this.task.resolve(msg);
            this.task = null;
            this.emit('taskdone');
        });
        this.worker.on('error', (err) => {
            this.task.reject();
            this.task = null;
            this.emit('error', err);
        });
        this.task = null;
    }

    assignTask(task) {
        if (this.task !== null) {
            throw new Error('Task already assigned.');
        }
        this.task = task;
        this.worker.postMessage(task.count);
    }
}