import {parentPort} from "node:worker_threads";

function cpuBoundTask(num) {
    let count = 0;
    for (let i = 0; i < num; i++) {
        count += 1;
    }
    return count;
}

parentPort.on('message', (num) => {
    parentPort.postMessage(cpuBoundTask(num));
});
