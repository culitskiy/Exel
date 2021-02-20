import './module.js';
import './scss/index.scss'

console.log("Shalom");

async function test() {
    return await Promise.resolve('async');
}

test().then(console.log);