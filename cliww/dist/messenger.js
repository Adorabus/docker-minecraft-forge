"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messenger = exports.MessageType = void 0;
const util_1 = require("./util");
const server_options_1 = require("./server-options");
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Plain"] = 0] = "Plain";
    MessageType[MessageType["Error"] = 1] = "Error";
    MessageType[MessageType["Command"] = 2] = "Command";
    MessageType[MessageType["Info"] = 3] = "Info";
    MessageType[MessageType["StdErr"] = 4] = "StdErr";
})(MessageType || (exports.MessageType = MessageType = {}));
function validNickname(nickname) {
    if (!nickname)
        return false;
    return !(nickname.length < 1 || nickname.length > 16);
}
class Messenger {
    constructor(io, wrapper, options = {}) {
        this.nextId = 0;
        this.failedAuths = {};
        this.bans = {};
        this.messages = [];
        this.io = io;
        this.wrapper = wrapper;
        this.options = options;
        io.on('connection', (client) => {
            const ipAddr = client.client.conn.remoteAddress;
            this.log(`Connection from [${ipAddr}].`);
            client.on('auth', (password) => {
                if (this.auth(client, password)) {
                    client.join('authorized');
                    client.emit('authsuccess');
                    client.emit('serverstate', {
                        isAlive: this.wrapper.isAlive(),
                        messageLimit: options.limit || 0,
                    });
                    client.emit('serveroptions', (0, server_options_1.getOptions)());
                    client.emit('messagehistory', {
                        messages: this.messages
                    });
                    this.log(`[${ipAddr}] authenticated.`);
                }
                else {
                    client.emit('authfail');
                }
            });
            client.on('nickname', (nickname) => {
                if (!validNickname(nickname)) {
                    delete client.nickname;
                    return;
                }
                client.nickname = nickname;
            });
            client.on('setoptions', (data) => {
                if (!client.rooms.has('authorized')) {
                    client.emit('authrequest');
                    return;
                }
                (0, server_options_1.setOptions)(data);
                this.broadcast('serveroptions', (0, server_options_1.getOptions)());
            });
            client.on('command', (command) => {
                if (!client.rooms.has('authorized')) {
                    client.emit('authrequest');
                    return;
                }
                this.broadcastMessage({
                    content: `[${client.nickname || ipAddr}]> ${command}`,
                    type: MessageType.Command
                });
                // manual restart command if crashed
                if (command === 'rs' && !this.wrapper.isAlive()) {
                    this.broadcastMessage({
                        content: 'Server manually restarted...',
                        type: MessageType.Info
                    });
                    this.wrapper.startProcess();
                    return;
                }
                if (!this.wrapper.send(`${command}\n`)) {
                    this.broadcastMessage({
                        content: 'Server is not running!',
                        type: MessageType.Error
                    });
                }
            });
            client.on('disconnect', () => {
                this.log(`${ipAddr} disconnected.`);
            });
        });
        wrapper.on('start', (wrapped) => {
            if (!wrapped.stdout || !wrapped.stderr) {
                throw new Error('Failed to wrap child process...');
            }
            wrapped.stdout
                .on('data', (data) => {
                this.broadcastMessage({
                    content: data,
                    type: MessageType.Plain
                });
            });
            wrapped.stderr
                .on('data', (data) => {
                this.broadcastMessage({
                    content: data,
                    type: MessageType.StdErr
                });
            });
            this.broadcastMessage({
                content: 'Process started.',
                type: MessageType.Info
            }, true);
            this.broadcast('serverstate', {
                isAlive: true
            });
        });
        wrapper
            .on('exit', (code) => {
            this.broadcast('serverstate', {
                isAlive: false
            });
            if (code === 0) {
                this.broadcastMessage({
                    content: 'The server has exited.\nType rs to restart it.',
                    type: MessageType.Info
                }, true);
            }
            else {
                this.broadcastMessage({
                    content: `The server has crashed. [Code ${code}]\nType rs to restart it.`,
                    type: MessageType.Error
                }, true);
            }
        });
        wrapper
            .on('message', (content) => {
            this.broadcastMessage({
                content,
                type: MessageType.Info
            }, true);
        });
    }
    auth(client, password) {
        if (!this.options.password)
            return true;
        const ip = client.client.conn.remoteAddress;
        // are they banned?
        if (this.bans[ip] && (0, util_1.minutesAgo)(this.bans[ip]) < 10) {
            return false;
        }
        // check password
        if (password === this.options.password) {
            return true;
        }
        // make space to store failed attempts
        if (!this.failedAuths[ip])
            this.failedAuths[ip] = [];
        this.failedAuths[ip].push(Date.now());
        // keep only failed auths from the last minute
        this.failedAuths[ip] = this.failedAuths[ip].filter(failTime => (0, util_1.minutesAgo)(failTime) < 1);
        if (this.failedAuths[ip].length > 5) {
            this.bans[ip] = Date.now();
            this.broadcastMessage({
                content: `Client [${ip}] has been banned for 10 minutes.`,
                type: MessageType.Info
            }, true);
        }
    }
    broadcastMessage(message, log) {
        const id = this.nextId++;
        const sentMessage = Object.assign(Object.assign({}, message), { id });
        if (this.options.limit && this.options.limit > 0) {
            if (this.messages.length === this.options.limit) {
                this.messages.shift();
            }
        }
        this.messages.push(sentMessage);
        this.io.sockets.in('authorized').emit('message', sentMessage);
        if (log) {
            this.log(message.content);
        }
    }
    broadcast(event, data) {
        this.io.sockets.in('authorized').emit(event, data);
    }
    log(...args) {
        console.log(...args);
    }
}
exports.Messenger = Messenger;
