# Minecraft Forge
Minecraft Forge server.

## Environment Variables
`forge_version` Which version of forge server to use. Possible values are `latest`, `recommended`, or a version number. (ex. 1.16.5-36.1.18)

`Xms` Initial JVM memory allocation. (default: 6G)

`Xmx` Maximum Java memory allocation. (default: 6G)

You can also mount .env file into /mc to set environment variables.

## Bind Mounts
Mount your minecraft server folder (containing: world, mods, etc.) to `/mc`.

## docker-compose
Example docker-compose.yml
```yml
version: "3.8"

services:
  mc:
    image: adorabus/minecraft-forge
    ports:
      - 25565:25565
      # - 25575:25575 # RCON
    volumes:
      - /home/fox/mc-forge:/mc
    environment:
      forge_version: latest
      Xms: 6G
      Xmx: 6G
```

# Image Variants

## `adorabus/minecraft-forge:cliww`
Wraps the server in cliww (basic web console).

When using cliww, make sure to expose port `8999`.

### Environment Variables

`cliww_password` Password to access cliww. **THIS IS REQUIRED**

`cliww_limit` Maximum number lines to keep in cliww buffer. (default: 200)
