"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOptions = setOptions;
exports.getOptions = getOptions;
const defaultOptions = {
    keepalive: false,
};
let currentOptions = Object.assign({}, defaultOptions);
function setOptions(inputOptions) {
    const allowedKeys = Object.keys(defaultOptions);
    for (const key of allowedKeys) {
        if (key in inputOptions) {
            currentOptions[key] = inputOptions[key];
        }
    }
}
function getOptions() {
    return Object.assign({}, currentOptions);
}
