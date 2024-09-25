"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondsAgo = secondsAgo;
exports.minutesAgo = minutesAgo;
function secondsAgo(timestamp) {
    return (Date.now() - timestamp) / 1000;
}
function minutesAgo(timestamp) {
    return (Date.now() - timestamp) / 1000 / 60;
}
