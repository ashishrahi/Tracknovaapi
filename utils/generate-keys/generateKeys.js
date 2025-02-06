import crypto from "crypto";

// for 256 bit key we need 32 bits
const key1 = crypto.randomBytes(32).toString("hex")
const key2 = crypto.randomBytes(32).toString("hex")
// console.log(crypto.randomBytes(32))

console.table({key1, key2});