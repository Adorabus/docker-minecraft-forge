"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wrapper = void 0;
const child = require("child_process");
const events_1 = require("events");
const util_1 = require("./util");
class Wrapper extends events_1.EventEmitter {
    constructor(command, args = [], options = {}) {
        super();
        this._isAlive = false;
        this.command = command;
        this.args = args;
        this.options = options;
    }
    startProcess() {
        if (this._isAlive) {
            this.stopProcess(true);
        }
        this.startedAt = new Date();
        const spawned = child.spawn(this.command, this.args);
        spawned.stdin.setDefaultEncoding('utf-8');
        spawned.stdout.setEncoding('utf-8');
        spawned.stderr.setEncoding('utf-8');
        spawned.on('exit', (code, signal) => {
            this._isAlive = false;
            this.emit('exit', code, signal);
            if (this.options.keepalive && this.startedAt) {
                if (util_1.secondsAgo(this.startedAt.valueOf()) > 5) {
                    this.emit('message', 'Restarting wrapped process...');
                    this.startProcess();
                }
                else {
                    this.emit('message', 'Process exited too quickly. Keepalive ignored.');
                }
            }
        });
        this.wrapped = spawned;
        this._isAlive = true;
        this.emit('start', spawned);
    }
    stopProcess(force) {
        if (!this.wrapped)
            return;
        this.wrapped.kill(force ? 'SIGKILL' : 'SIGINT');
        this._isAlive = false;
        this.emit('stop');
    }
    send(command) {
        if (!this.wrapped)
            return false;
        if (this.wrapped.stdin && this.wrapped.stdin.writable) {
            this.wrapped.stdin.write(command);
            return true;
        }
        else {
            return false;
        }
    }
    isAlive() {
        return this._isAlive;
    }
}
exports.Wrapper = Wrapper;
