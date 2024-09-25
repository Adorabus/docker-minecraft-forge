# CLIWW
Provides a remote web interface to a wrapped child process.

![cliww-2](https://user-images.githubusercontent.com/27739941/118569610-20688a00-b72f-11eb-848e-07778d623fa4.png)
---

![cliww-1](https://user-images.githubusercontent.com/27739941/118569605-1e063000-b72f-11eb-8683-236c45028f17.png)

## Installation

Unzip, enter directory, run `npm install` and `npm link`.


## Usage

`cliww [OPTIONS] command...`

### Options

`--password PASSWORD`
Require a password to access the console. (Recommended)

`--limit MAXIMUM`
Maximum number of messages to keep in the console. There is no limit by default. Setting a limit is recommended.

`--port PORT`
Port to listen on. (Default: 8999)

`--keepalive`
Restart the wrapped process if it exits.


## HTTPS

HTTPS can be enabled by setting the `cert` and `key` environment variables to the paths of their respective files.

(.env file is supported)
