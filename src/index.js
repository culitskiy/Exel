import './module.js';
import './index.scss'

console.log("Shalom");

async function test() {
    return await Promise.resolve('async');
}

test().then(console.log);