# CLIWW
Provides a remote web interface to a wrapped child process.

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
