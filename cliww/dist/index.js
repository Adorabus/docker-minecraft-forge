"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const socket_io_1 = require("socket.io");
const express = require("express");
const wrapper_1 = require("./wrapper");
const messenger_1 = require("./messenger");
const minimist = require("minimist");
const path = require("path");
const fs = require("fs");
const server_options_1 = require("./server-options");
const argv = minimist(process.argv.slice(2), { 'stopEarly': true });
const app = express();
let server;
const { key, cert } = process.env;
if (key && cert) {
    try {
        server = require('https').createServer({
            key: fs.readFileSync(key),
            cert: fs.readFileSync(cert)
        }, app);
        console.log('Starting using https...');
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
else {
    console.log('Starting using http...');
    server = require('http').createServer(app);
}
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
    }
});
const command = argv._.shift();
if (!command) {
    console.log('Usage: cliww [OPTIONS] command...');
    console.log(`Options
  --password PASSWORD
  --limit MAXIMUM
  --port PORT
  --keepalive`);
    process.exit(1);
}
// set defaults
(0, server_options_1.setOptions)(argv);
const wrapper = new wrapper_1.Wrapper(command, argv._);
const messenger = new messenger_1.Messenger(io, wrapper, argv);
wrapper.startProcess();
server.listen(argv.port || 8999, () => {
    const addrInfo = server.address();
    console.log(`Listening on port ${addrInfo.port}.`);
});
