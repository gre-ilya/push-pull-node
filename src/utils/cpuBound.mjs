export default function cpuBoundTask(num) {
    let count = 0;
    for (let i = 0; i < num; i++) {
        count += 1;
    }
    return count;
}

